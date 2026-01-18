import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { VictorMessage } from './VictorMessage';
import type { VictorMessage as VictorMessageType, VictorSkill } from '@/types/victor';
import { getSkillConfig } from '@/types/victor';

interface VictorChatProps {
  messages: VictorMessageType[];
  activeSkill: VictorSkill;
  isLoading: boolean;
  sectionContext?: {
    title: string;
    chapterTitle?: string;
  };
  onSendMessage: (content: string) => void;
  onInsertToEditor?: (content: string) => void;
}

export function VictorChat({
  messages,
  activeSkill,
  isLoading,
  sectionContext,
  onSendMessage,
  onInsertToEditor,
}: VictorChatProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const skillConfig = getSkillConfig(activeSkill);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input on skill change
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeSkill]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Filter messages by current skill (optional - could show all)
  const filteredMessages = messages;

  return (
    <div className="flex flex-col h-full">
      {/* Context banner */}
      {sectionContext && (
        <div className="px-3 py-2 bg-muted/50 border-b text-xs">
          <span className="text-muted-foreground">Contexte : </span>
          <span className="font-medium">{sectionContext.title}</span>
          {sectionContext.chapterTitle && (
            <span className="text-muted-foreground"> ({sectionContext.chapterTitle})</span>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3" ref={scrollRef}>
        {filteredMessages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Aucun message pour l'instant.</p>
            <p className="text-xs mt-2">
              Utilisez la compétence <span className={skillConfig.color}>{skillConfig.label}</span> pour commencer.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMessages.map((message) => (
              <VictorMessage
                key={message.id}
                message={message}
                onInsertToEditor={onInsertToEditor}
              />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 p-3 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Victor réfléchit...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder(activeSkill)}
            className="flex-1 min-h-[60px] max-h-[150px] px-3 py-2 text-sm rounded-md border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="shrink-0 self-end"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Entrée pour envoyer, Shift+Entrée pour nouvelle ligne
        </p>
      </form>
    </div>
  );
}

function getPlaceholder(skill: VictorSkill): string {
  switch (skill) {
    case 'redaction':
      return 'Demandez à Victor de rédiger, reformuler ou compléter...';
    case 'recherche':
      return 'Demandez à Victor de rechercher des informations...';
    case 'acquisition':
      return 'Partagez un texte à analyser ou demandez d\'extraire des connaissances...';
    case 'plan':
      return 'Demandez à Victor de structurer ou réorganiser le contenu...';
    case 'bibliographie':
      return 'Ajoutez une source ou demandez une citation formatée...';
    case 'critique':
      return 'Demandez à Victor d\'analyser et critiquer le contenu...';
    default:
      return 'Écrivez votre message à Victor...';
  }
}
