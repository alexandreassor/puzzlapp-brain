/**
 * Routes API pour les agents PuzzlApp Brain
 */

import { Router, Request, Response } from 'express';
import {
  runVictor,
  runVictorStream,
  AVAILABLE_AGENTS,
  type AgentRequest,
  type VictorSkill,
} from '../agents/index.js';
import {
  getAgentPrompts,
  clearPromptsCache,
  invalidatePrompt,
} from '../services/prompts.js';

const router = Router();

/**
 * GET /api/agents
 * Liste les agents disponibles
 */
router.get('/agents', (_req: Request, res: Response) => {
  res.json({
    success: true,
    agents: AVAILABLE_AGENTS,
  });
});

/**
 * POST /api/agents/query
 * Envoie une requête à un agent (mode non-streaming)
 */
router.post('/agents/query', async (req: Request, res: Response) => {
  try {
    const body = req.body as AgentRequest;
    const { agentType, skill, message, context, conversationHistory, options } = body;

    if (!agentType || !message || !context) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: agentType, message, context',
      });
      return;
    }

    // Pour l'instant, seul Victor est implémenté
    if (agentType !== 'victor') {
      res.status(400).json({
        success: false,
        error: `Agent "${agentType}" not implemented yet. Available: victor`,
      });
      return;
    }

    const victorSkill = (skill || 'redaction') as VictorSkill;
    const history = conversationHistory?.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })) || [];

    // Log des options activées
    if (options) {
      console.log('[API] Options:', {
        webSearch: options.webSearch,
        extendedThinking: options.extendedThinking,
        thinkingBudget: options.thinkingBudget,
        codeExecution: options.codeExecution,
        skills: options.skills?.map(s => s.skill_id),
      });
    }

    const result = await runVictor(victorSkill, message, context, history, options);

    res.json(result);
  } catch (error) {
    console.error('[API] Error in /agents/query:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

/**
 * POST /api/agents/stream
 * Envoie une requête à un agent (mode streaming via SSE)
 */
router.post('/agents/stream', async (req: Request, res: Response) => {
  try {
    const body = req.body as AgentRequest;
    const { agentType, skill, message, context, conversationHistory } = body;

    if (!agentType || !message || !context) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: agentType, message, context',
      });
      return;
    }

    if (agentType !== 'victor') {
      res.status(400).json({
        success: false,
        error: `Agent "${agentType}" not implemented yet. Available: victor`,
      });
      return;
    }

    // Configuration SSE (Server-Sent Events)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const victorSkill = (skill || 'redaction') as VictorSkill;
    const history = conversationHistory?.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })) || [];

    // Stream les événements
    for await (const event of runVictorStream(victorSkill, message, context, history)) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('[API] Error in /agents/stream:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', error: 'Internal server error' })}\n\n`);
    res.end();
  }
});

/**
 * GET /api/health
 * Health check
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    agents: Object.keys(AVAILABLE_AGENTS),
  });
});

// ============================================================
// ROUTES PROMPTS - Gestion des prompts depuis Supabase
// ============================================================

/**
 * GET /api/prompts/:agentType
 * Liste les prompts d'un agent
 */
router.get('/prompts/:agentType', async (req: Request, res: Response) => {
  try {
    const { agentType } = req.params;
    const prompts = await getAgentPrompts(agentType);

    res.json({
      success: true,
      agentType,
      prompts,
      count: prompts.length,
    });
  } catch (error) {
    console.error('[API] Error in /prompts/:agentType:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

/**
 * POST /api/prompts/cache/clear
 * Vide le cache des prompts (pour forcer le rechargement)
 */
router.post('/prompts/cache/clear', (_req: Request, res: Response) => {
  clearPromptsCache();
  res.json({
    success: true,
    message: 'Cache des prompts vidé',
  });
});

/**
 * POST /api/prompts/cache/invalidate
 * Invalide un prompt spécifique du cache
 */
router.post('/prompts/cache/invalidate', (req: Request, res: Response) => {
  const { agentType, skill } = req.body;

  if (!agentType || !skill) {
    res.status(400).json({
      success: false,
      error: 'Missing required fields: agentType, skill',
    });
    return;
  }

  invalidatePrompt(agentType, skill);
  res.json({
    success: true,
    message: `Cache invalidé pour ${agentType}/${skill}`,
  });
});

export default router;
