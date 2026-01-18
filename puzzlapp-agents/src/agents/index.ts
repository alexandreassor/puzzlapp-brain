/**
 * Export centralisé des agents PuzzlApp Brain
 */

// Victor - Agent de rédaction (Admin)
export { runVictor, runVictorStream, VICTOR_CONFIG } from './victor/index.js';
export { buildVictorPrompt, VICTOR_SKILL_PROMPTS } from './victor/prompts.js';

// Types
export * from './types.js';

// TODO: Ajouter les autres agents
// export { runLeo, LEO_CONFIG } from './leo/index.js';
// export { runSophie, SOPHIE_CONFIG } from './sophie/index.js';
// export { runMarc, MARC_CONFIG } from './marc/index.js';

/**
 * Liste des agents disponibles
 */
export const AVAILABLE_AGENTS = {
  victor: {
    name: 'Victor',
    description: 'Agent de rédaction académique (Admin)',
    skills: ['redaction', 'recherche', 'acquisition', 'plan', 'bibliographie', 'critique'],
  },
  leo: {
    name: 'Léo',
    description: 'Agent guide pour les parcours (Lecteur)',
    skills: ['guide', 'recommandation', 'coaching', 'diagnostic'],
    status: 'coming_soon',
  },
  sophie: {
    name: 'Sophie',
    description: 'Agent avant-vente (Parcours commercial)',
    skills: ['decouverte', 'proposition', 'negociation', 'closing'],
    status: 'coming_soon',
  },
  marc: {
    name: 'Marc',
    description: 'Agent onboarding (Parcours intégration)',
    skills: ['accueil', 'formation', 'suivi', 'validation'],
    status: 'coming_soon',
  },
};
