import { supabase } from '@/lib/supabase';
import type {
  VictorConversation,
  VictorMessage,
  VictorSkill,
} from '@/types/victor';

// =============================================================================
// CONVERSATIONS
// =============================================================================

export interface CreateConversationInput {
  user_id: string;
  agent_type: 'victor';
  initialMessage?: VictorMessage;
}

export const agentsService = {
  /**
   * Get all conversations for a user
   */
  async getConversations(userId: string): Promise<VictorConversation[]> {
    const { data, error } = await supabase
      .from('agent_conversations')
      .select('*')
      .eq('user_id', userId)
      .eq('agent_type', 'victor')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('[Agents] Error fetching conversations:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get the latest conversation for a user (or create one if none exists)
   */
  async getOrCreateConversation(userId: string): Promise<VictorConversation> {
    const { data, error } = await supabase
      .from('agent_conversations')
      .select('*')
      .eq('user_id', userId)
      .eq('agent_type', 'victor')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[Agents] Error fetching conversation:', error);
      throw error;
    }

    if (data) {
      return data;
    }

    // Create a new conversation
    return this.createConversation({ user_id: userId, agent_type: 'victor' });
  },

  /**
   * Get a single conversation by ID
   */
  async getConversationById(id: string): Promise<VictorConversation | null> {
    const { data, error } = await supabase
      .from('agent_conversations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('[Agents] Error fetching conversation:', error);
      throw error;
    }

    return data;
  },

  /**
   * Create a new conversation
   */
  async createConversation(input: CreateConversationInput): Promise<VictorConversation> {
    const messages = input.initialMessage ? [input.initialMessage] : [];

    const { data, error } = await supabase
      .from('agent_conversations')
      .insert({
        user_id: input.user_id,
        agent_type: input.agent_type,
        messages,
      })
      .select()
      .single();

    if (error) {
      console.error('[Agents] Error creating conversation:', error);
      throw error;
    }

    return data;
  },

  /**
   * Add a message to a conversation
   */
  async addMessage(
    conversationId: string,
    message: Omit<VictorMessage, 'id' | 'timestamp'>
  ): Promise<VictorConversation> {
    // First get the current conversation
    const conversation = await this.getConversationById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const newMessage: VictorMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...conversation.messages, newMessage];

    const { data, error } = await supabase
      .from('agent_conversations')
      .update({
        messages: updatedMessages,
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversationId)
      .select()
      .single();

    if (error) {
      console.error('[Agents] Error adding message:', error);
      throw error;
    }

    return data;
  },

  /**
   * Clear conversation messages (keep the conversation)
   */
  async clearMessages(conversationId: string): Promise<VictorConversation> {
    const { data, error } = await supabase
      .from('agent_conversations')
      .update({
        messages: [],
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversationId)
      .select()
      .single();

    if (error) {
      console.error('[Agents] Error clearing messages:', error);
      throw error;
    }

    return data;
  },

  /**
   * Delete a conversation
   */
  async deleteConversation(id: string): Promise<void> {
    const { error } = await supabase
      .from('agent_conversations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Agents] Error deleting conversation:', error);
      throw error;
    }
  },

  /**
   * Get messages filtered by skill
   */
  async getMessagesBySkill(
    conversationId: string,
    skill: VictorSkill
  ): Promise<VictorMessage[]> {
    const conversation = await this.getConversationById(conversationId);
    if (!conversation) {
      return [];
    }

    return conversation.messages.filter(m => m.skill === skill);
  },
};
