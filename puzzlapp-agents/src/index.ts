/**
 * PuzzlApp Brain - Serveur d'Agents IA
 *
 * Ce serveur expose une API REST et WebSocket pour communiquer
 * avec les agents IA (Victor, Léo, Sophie, Marc).
 *
 * Basé sur le Claude Agent SDK.
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import apiRoutes from './api/routes.js';
import {
  runVictorStream,
  type AgentRequest,
  type VictorSkill,
} from './agents/index.js';

const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Créer l'app Express
const app = express();

// Middlewares
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());

// Routes API
app.use('/api', apiRoutes);

// Page d'accueil
app.get('/', (_req, res) => {
  res.json({
    name: 'PuzzlApp Brain - Agents Server',
    version: '1.0.0',
    description: 'Serveur d\'agents IA pour le mémoire DEC',
    endpoints: {
      health: 'GET /api/health',
      agents: 'GET /api/agents',
      query: 'POST /api/agents/query',
      stream: 'POST /api/agents/stream',
      websocket: 'ws://localhost:3001/ws',
    },
    agents: ['victor', 'leo (coming soon)', 'sophie (coming soon)', 'marc (coming soon)'],
  });
});

// Créer le serveur HTTP
const server = createServer(app);

// WebSocket Server pour le streaming en temps réel
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws: WebSocket) => {
  console.log('[WebSocket] Client connected');

  ws.on('message', async (data: Buffer) => {
    try {
      const request = JSON.parse(data.toString()) as AgentRequest;
      const { agentType, skill, message, context, conversationHistory } = request;

      if (agentType !== 'victor') {
        ws.send(JSON.stringify({
          type: 'error',
          error: `Agent "${agentType}" not implemented yet`,
        }));
        return;
      }

      const victorSkill = (skill || 'redaction') as VictorSkill;
      const history = conversationHistory?.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })) || [];

      // Stream la réponse
      for await (const event of runVictorStream(victorSkill, message, context, history)) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(event));
        }
      }

      // Signal de fin
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'done' }));
      }
    } catch (error) {
      console.error('[WebSocket] Error:', error);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    }
  });

  ws.on('close', () => {
    console.log('[WebSocket] Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('[WebSocket] Error:', error);
  });
});

// Démarrer le serveur
server.listen(PORT, () => {
  console.log('');
  console.log('🧠 ═══════════════════════════════════════════════════════');
  console.log('   PuzzlApp Brain - Agents Server');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log(`   🚀 Server running on http://localhost:${PORT}`);
  console.log(`   🔌 WebSocket on ws://localhost:${PORT}/ws`);
  console.log(`   🌐 CORS origin: ${CORS_ORIGIN}`);
  console.log('');
  console.log('   📚 Available agents:');
  console.log('      • Victor (rédaction) - ✅ Active');
  console.log('      • Léo (guide)        - 🔜 Coming soon');
  console.log('      • Sophie (avant-vente) - 🔜 Coming soon');
  console.log('      • Marc (onboarding)   - 🔜 Coming soon');
  console.log('');
  console.log('   📖 API Documentation:');
  console.log(`      GET  http://localhost:${PORT}/`);
  console.log(`      GET  http://localhost:${PORT}/api/health`);
  console.log(`      GET  http://localhost:${PORT}/api/agents`);
  console.log(`      POST http://localhost:${PORT}/api/agents/query`);
  console.log(`      POST http://localhost:${PORT}/api/agents/stream (SSE)`);
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
});

// Gestion des erreurs
process.on('uncaughtException', (error) => {
  console.error('[Server] Uncaught exception:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Server] Unhandled rejection:', reason);
});
