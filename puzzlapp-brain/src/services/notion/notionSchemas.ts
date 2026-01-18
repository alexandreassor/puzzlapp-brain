/**
 * Schémas des bases de données Notion pour les livrables KM
 *
 * Définit la structure des bases et le mapping des livrables vers Notion
 */

import type { NotionDatabaseSchema, NotionBlock, NotionColor } from '@/types/notion';
import type { Deliverable, DeliverableType } from '@/types';

// =============================================================================
// SCHÉMA DE LA BASE "LIVRABLES KM"
// =============================================================================

export const KM_DELIVERABLES_SCHEMA: NotionDatabaseSchema = {
  title: 'Mes Livrables KM - PuzzlApp',
  properties: {
    'Titre': { title: {} },
    'Type': {
      select: {
        options: [
          { name: 'Diagnostic', color: 'red' },
          { name: 'Persona', color: 'blue' },
          { name: 'Empathy Map', color: 'purple' },
          { name: 'SWOT', color: 'orange' },
          { name: 'Roadmap', color: 'green' },
          { name: 'Plan d\'action', color: 'yellow' },
        ],
      },
    },
    'Parcours': {
      select: {
        options: [
          { name: 'Avant-Vente', color: 'blue' },
          { name: 'Onboarding Client', color: 'green' },
          { name: 'Production', color: 'orange' },
          { name: 'Audit', color: 'purple' },
          { name: 'Social', color: 'pink' },
        ],
      },
    },
    'Score': { number: { format: 'number' } },
    'Statut': {
      status: {
        options: [
          { name: 'Brouillon', color: 'gray' },
          { name: 'Complété', color: 'green' },
          { name: 'À revoir', color: 'yellow' },
        ],
      },
    },
    'Date création': { date: {} },
    'Lien PuzzlApp': { url: {} },
  },
};

// =============================================================================
// MAPPING TYPE → NOTION SELECT
// =============================================================================

export const DELIVERABLE_TYPE_MAPPING: Record<DeliverableType, { label: string; color: NotionColor }> = {
  'diagnostic-report': { label: 'Diagnostic', color: 'red' },
  'persona-card': { label: 'Persona', color: 'blue' },
  'empathy-map': { label: 'Empathy Map', color: 'purple' },
  'swot-matrix': { label: 'SWOT', color: 'orange' },
  'roadmap': { label: 'Roadmap', color: 'green' },
  'action-plan': { label: 'Plan d\'action', color: 'yellow' },
};

// =============================================================================
// CONVERTISSEURS DE CONTENU → BLOCS NOTION
// =============================================================================

/**
 * Crée un bloc de texte Notion
 */
function createParagraphBlock(text: string): NotionBlock {
  return {
    type: 'paragraph',
    paragraph: {
      rich_text: [{ type: 'text', text: { content: text } }],
    },
  };
}

/**
 * Crée un bloc titre Notion
 */
function createHeadingBlock(text: string, level: 1 | 2 | 3 = 2): NotionBlock {
  const type = `heading_${level}` as const;
  return {
    type,
    [type]: {
      rich_text: [{ type: 'text', text: { content: text } }],
    },
  };
}

/**
 * Crée un bloc de liste à puces
 */
function createBulletBlock(text: string): NotionBlock {
  return {
    type: 'bulleted_list_item',
    bulleted_list_item: {
      rich_text: [{ type: 'text', text: { content: text } }],
    },
  };
}

/**
 * Crée un bloc de liste numérotée
 */
function createNumberedBlock(text: string): NotionBlock {
  return {
    type: 'numbered_list_item',
    numbered_list_item: {
      rich_text: [{ type: 'text', text: { content: text } }],
    },
  };
}

/**
 * Crée un bloc todo (checkbox)
 */
function createTodoBlock(text: string, checked = false): NotionBlock {
  return {
    type: 'to_do',
    to_do: {
      rich_text: [{ type: 'text', text: { content: text } }],
      checked,
    },
  };
}

/**
 * Crée un bloc callout (encadré coloré)
 */
function createCalloutBlock(text: string, emoji = '💡'): NotionBlock {
  return {
    type: 'callout',
    callout: {
      rich_text: [{ type: 'text', text: { content: text } }],
      icon: { type: 'emoji', emoji },
    },
  };
}

/**
 * Crée un diviseur
 */
function createDividerBlock(): NotionBlock {
  return { type: 'divider', divider: {} };
}

// =============================================================================
// CONVERTISSEURS PAR TYPE DE LIVRABLE
// =============================================================================

/**
 * Convertit un Diagnostic Report en blocs Notion
 */
export function diagnosticToBlocks(content: Record<string, unknown>): NotionBlock[] {
  const blocks: NotionBlock[] = [];

  // Score global
  const globalScore = content.global_score as number || 0;
  const level = globalScore >= 4 ? 'Solide' : globalScore >= 2.5 ? 'En progrès' : 'Fragile';
  const emoji = globalScore >= 4 ? '🟢' : globalScore >= 2.5 ? '🟡' : '🔴';

  blocks.push(createCalloutBlock(`Score global : ${globalScore.toFixed(1)}/5 - Niveau ${level} ${emoji}`, '🎯'));
  blocks.push(createDividerBlock());

  // Dimensions
  const dimensions = content.dimensions as Array<{ name: string; score: number; comment?: string }> || [];
  if (dimensions.length > 0) {
    blocks.push(createHeadingBlock('Dimensions évaluées', 2));
    dimensions.forEach(dim => {
      blocks.push(createBulletBlock(`${dim.name}: ${dim.score}/5${dim.comment ? ` - ${dim.comment}` : ''}`));
    });
    blocks.push(createDividerBlock());
  }

  // Priorités
  const priorities = content.top_3_priorities as string[] || [];
  if (priorities.length > 0) {
    blocks.push(createHeadingBlock('Top 3 Priorités', 2));
    priorities.forEach((priority) => {
      blocks.push(createNumberedBlock(priority));
    });
    blocks.push(createDividerBlock());
  }

  // Prochaines étapes
  const actions = content.actions as string[] || [];
  if (actions.length > 0) {
    blocks.push(createHeadingBlock('Prochaines étapes', 2));
    actions.forEach(action => {
      blocks.push(createTodoBlock(action));
    });
  }

  return blocks;
}

/**
 * Convertit une Persona Card en blocs Notion
 */
export function personaToBlocks(content: Record<string, unknown>): NotionBlock[] {
  const blocks: NotionBlock[] = [];

  const name = content.name as string || 'Persona';
  const role = content.role as string || '';
  const avatar = content.avatar as string || '👤';

  blocks.push(createCalloutBlock(`${avatar} ${name}${role ? ` - ${role}` : ''}`, avatar));

  // Caractéristiques
  const characteristics = content.characteristics as string[] || [];
  if (characteristics.length > 0) {
    blocks.push(createHeadingBlock('Caractéristiques', 2));
    characteristics.forEach(c => blocks.push(createBulletBlock(c)));
  }

  // Besoins
  const needs = content.needs as string[] || [];
  if (needs.length > 0) {
    blocks.push(createHeadingBlock('Besoins', 2));
    needs.forEach(n => blocks.push(createBulletBlock(n)));
  }

  // Frustrations
  const frustrations = content.frustrations as string[] || [];
  if (frustrations.length > 0) {
    blocks.push(createHeadingBlock('Frustrations', 2));
    frustrations.forEach(f => blocks.push(createBulletBlock(f)));
  }

  // Citation
  const quote = content.quote as string;
  if (quote) {
    blocks.push(createDividerBlock());
    blocks.push(createCalloutBlock(`"${quote}"`, '💬'));
  }

  return blocks;
}

/**
 * Convertit une Empathy Map en blocs Notion
 */
export function empathyMapToBlocks(content: Record<string, unknown>): NotionBlock[] {
  const blocks: NotionBlock[] = [];

  const sections = [
    { key: 'says', title: '💬 Dit', emoji: '💬' },
    { key: 'thinks', title: '🧠 Pense', emoji: '🧠' },
    { key: 'does', title: '🏃 Fait', emoji: '🏃' },
    { key: 'feels', title: '❤️ Ressent', emoji: '❤️' },
  ];

  sections.forEach(({ key, title }) => {
    const items = content[key] as string[] || [];
    if (items.length > 0) {
      blocks.push(createHeadingBlock(title, 2));
      items.forEach(item => blocks.push(createBulletBlock(item)));
      blocks.push(createDividerBlock());
    }
  });

  // Pains & Gains
  const pains = content.pains as string[] || [];
  const gains = content.gains as string[] || [];

  if (pains.length > 0) {
    blocks.push(createHeadingBlock('😰 Douleurs (Pains)', 2));
    pains.forEach(p => blocks.push(createBulletBlock(p)));
  }

  if (gains.length > 0) {
    blocks.push(createHeadingBlock('🎉 Gains', 2));
    gains.forEach(g => blocks.push(createBulletBlock(g)));
  }

  return blocks;
}

/**
 * Convertit une matrice SWOT en blocs Notion
 */
export function swotToBlocks(content: Record<string, unknown>): NotionBlock[] {
  const blocks: NotionBlock[] = [];

  const sections = [
    { key: 'strengths', title: '💪 Forces (Strengths)', emoji: '💪' },
    { key: 'weaknesses', title: '⚠️ Faiblesses (Weaknesses)', emoji: '⚠️' },
    { key: 'opportunities', title: '🚀 Opportunités', emoji: '🚀' },
    { key: 'threats', title: '🔴 Menaces (Threats)', emoji: '🔴' },
  ];

  sections.forEach(({ key, title }) => {
    const items = content[key] as string[] || [];
    blocks.push(createHeadingBlock(title, 2));
    if (items.length > 0) {
      items.forEach(item => blocks.push(createBulletBlock(item)));
    } else {
      blocks.push(createParagraphBlock('(Aucun élément)'));
    }
    blocks.push(createDividerBlock());
  });

  return blocks;
}

/**
 * Convertit une Roadmap en blocs Notion
 */
export function roadmapToBlocks(content: Record<string, unknown>): NotionBlock[] {
  const blocks: NotionBlock[] = [];

  const milestones = content.milestones as Array<{
    title: string;
    date?: string;
    actions?: string[];
    status?: string;
  }> || [];

  if (milestones.length === 0) {
    blocks.push(createParagraphBlock('Aucune étape définie.'));
    return blocks;
  }

  milestones.forEach((milestone, index) => {
    const statusEmoji = milestone.status === 'done' ? '✅' : milestone.status === 'in_progress' ? '🔄' : '⏳';
    blocks.push(createHeadingBlock(`${statusEmoji} ${milestone.title}${milestone.date ? ` (${milestone.date})` : ''}`, 2));

    const actions = milestone.actions || [];
    actions.forEach(action => {
      blocks.push(createTodoBlock(action, milestone.status === 'done'));
    });

    if (index < milestones.length - 1) {
      blocks.push(createDividerBlock());
    }
  });

  return blocks;
}

/**
 * Convertit un Plan d'action en blocs Notion
 */
export function actionPlanToBlocks(content: Record<string, unknown>): NotionBlock[] {
  const blocks: NotionBlock[] = [];

  // Objectif
  const objective = content.objective as string;
  if (objective) {
    blocks.push(createCalloutBlock(`Objectif : ${objective}`, '🎯'));
    blocks.push(createDividerBlock());
  }

  // Actions
  const actions = content.actions as Array<{
    title: string;
    owner?: string;
    deadline?: string;
    priority?: 'high' | 'medium' | 'low';
    done?: boolean;
  }> || [];

  if (actions.length > 0) {
    blocks.push(createHeadingBlock('Actions', 2));
    actions.forEach(action => {
      const priorityEmoji = action.priority === 'high' ? '🔴' : action.priority === 'medium' ? '🟡' : '🟢';
      const details = [
        action.owner ? `@${action.owner}` : null,
        action.deadline ? `📅 ${action.deadline}` : null,
      ].filter(Boolean).join(' | ');

      blocks.push(createTodoBlock(
        `${priorityEmoji} ${action.title}${details ? ` (${details})` : ''}`,
        action.done || false
      ));
    });
  }

  // KPIs
  const kpis = content.kpis as string[] || [];
  if (kpis.length > 0) {
    blocks.push(createDividerBlock());
    blocks.push(createHeadingBlock('KPIs de suivi', 2));
    kpis.forEach(kpi => blocks.push(createBulletBlock(kpi)));
  }

  return blocks;
}

// =============================================================================
// CONVERTISSEUR GÉNÉRIQUE
// =============================================================================

/**
 * Convertit un livrable en blocs Notion selon son type
 */
export function deliverableToBlocks(deliverable: Deliverable): NotionBlock[] {
  const converters: Record<DeliverableType, (content: Record<string, unknown>) => NotionBlock[]> = {
    'diagnostic-report': diagnosticToBlocks,
    'persona-card': personaToBlocks,
    'empathy-map': empathyMapToBlocks,
    'swot-matrix': swotToBlocks,
    'roadmap': roadmapToBlocks,
    'action-plan': actionPlanToBlocks,
  };

  const converter = converters[deliverable.type];
  if (!converter) {
    // Fallback: afficher le JSON brut
    return [
      createParagraphBlock(JSON.stringify(deliverable.content, null, 2)),
    ];
  }

  return converter(deliverable.content);
}

export default {
  KM_DELIVERABLES_SCHEMA,
  DELIVERABLE_TYPE_MAPPING,
  deliverableToBlocks,
  diagnosticToBlocks,
  personaToBlocks,
  empathyMapToBlocks,
  swotToBlocks,
  roadmapToBlocks,
  actionPlanToBlocks,
};
