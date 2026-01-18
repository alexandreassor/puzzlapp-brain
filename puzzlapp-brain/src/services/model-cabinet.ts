/**
 * Service de chargement du Cabinet Modèle "TRAJECTOIRE CONSEIL"
 *
 * Ce service fournit des fonctions utilitaires pour accéder aux données
 * du cabinet fictif utilisé dans les parcours d'apprentissage KM.
 */

import {
  cabinet,
  employees,
  clients,
  processes,
  incidents,
} from '@/data/model-cabinet';

import type {
  ModelCabinet,
  ModelEmployee,
  ModelClient,
  ModelProcess,
  ModelIncident,
  ModelDocument,
  PersonaType,
  Department,
  ProcessStatus,
} from '@/types/model-cabinet';

// =============================================================================
// CABINET
// =============================================================================

/**
 * Récupère les informations générales du cabinet
 */
export function getCabinet(): ModelCabinet {
  return cabinet;
}

/**
 * Récupère le score KMMM actuel du cabinet
 */
export function getKmmmScore(): number {
  return cabinet.kmmm_score;
}

/**
 * Récupère les défis KM identifiés
 */
export function getChallenges(): string[] {
  return cabinet.challenges;
}

// =============================================================================
// EMPLOYEES
// =============================================================================

/**
 * Récupère tous les collaborateurs
 */
export function getEmployees(): ModelEmployee[] {
  return employees;
}

/**
 * Récupère un collaborateur par son ID
 */
export function getEmployeeById(id: string): ModelEmployee | undefined {
  return employees.find(e => e.id === id);
}

/**
 * Récupère les collaborateurs "clés" (is_key_person = true)
 * Ce sont les personas principaux pour les exercices
 */
export function getKeyPersonas(): ModelEmployee[] {
  return employees.filter(e => e.is_key_person);
}

/**
 * Récupère les collaborateurs par type de persona
 */
export function getEmployeesByPersonaType(type: PersonaType): ModelEmployee[] {
  return employees.filter(e => e.persona_type === type);
}

/**
 * Récupère les collaborateurs par département
 */
export function getEmployeesByDepartment(department: Department): ModelEmployee[] {
  return employees.filter(e => e.department === department);
}

/**
 * Récupère les collaborateurs qui vont partir (leaving_date défini)
 */
export function getLeavingEmployees(): ModelEmployee[] {
  return employees.filter(e => e.leaving_date);
}

/**
 * Récupère les managers (is_manager = true)
 */
export function getManagers(): ModelEmployee[] {
  return employees.filter(e => e.is_manager);
}

/**
 * Récupère les statistiques par département
 */
export function getEmployeeStats(): Record<Department, number> {
  const stats: Record<string, number> = {};
  for (const emp of employees) {
    stats[emp.department] = (stats[emp.department] || 0) + 1;
  }
  return stats as Record<Department, number>;
}

// =============================================================================
// CLIENTS
// =============================================================================

/**
 * Récupère tous les clients
 */
export function getClients(): ModelClient[] {
  return clients;
}

/**
 * Récupère un client par son ID
 */
export function getClientById(id: string): ModelClient | undefined {
  return clients.find(c => c.id === id);
}

/**
 * Récupère les clients par secteur
 */
export function getClientsBySector(sector: string): ModelClient[] {
  return clients.filter(c => c.sector === sector);
}

/**
 * Récupère les clients "à risque" (km_relevance contient le mot risque ou critique)
 */
export function getAtRiskClients(): ModelClient[] {
  return clients.filter(c =>
    c.km_relevance?.toLowerCase().includes('risque') ||
    c.km_relevance?.toLowerCase().includes('critique')
  );
}

// =============================================================================
// PROCESSES
// =============================================================================

/**
 * Récupère tous les processus
 */
export function getProcesses(): ModelProcess[] {
  return processes;
}

/**
 * Récupère un processus par son ID
 */
export function getProcessById(id: string): ModelProcess | undefined {
  return processes.find(p => p.id === id);
}

/**
 * Récupère les processus par statut de documentation
 */
export function getProcessesByStatus(status: ProcessStatus): ModelProcess[] {
  return processes.filter(p => p.status === status);
}

/**
 * Récupère les processus critiques (criticality = 'critical')
 */
export function getCriticalProcesses(): ModelProcess[] {
  return processes.filter(p => p.criticality === 'critical');
}

/**
 * Récupère les processus non documentés (quick win KM)
 */
export function getUndocumentedProcesses(): ModelProcess[] {
  return processes.filter(p => p.status === 'undocumented');
}

/**
 * Récupère les processus par département
 */
export function getProcessesByDepartment(department: Department): ModelProcess[] {
  return processes.filter(p => p.department === department);
}

// =============================================================================
// INCIDENTS
// =============================================================================

/**
 * Récupère tous les incidents
 */
export function getIncidents(): ModelIncident[] {
  return incidents;
}

/**
 * Récupère un incident par son ID
 */
export function getIncidentById(id: string): ModelIncident | undefined {
  return incidents.find(i => i.id === id);
}

/**
 * Récupère les incidents par catégorie
 */
export function getIncidentsByCategory(category: string): ModelIncident[] {
  return incidents.filter(i => i.category === category);
}

/**
 * Récupère les incidents qui auraient pu être évités
 */
export function getPreventableIncidents(): ModelIncident[] {
  return incidents.filter(i => i.could_have_been_prevented);
}

/**
 * Calcule le coût total estimé des incidents
 */
export function getTotalIncidentCost(): string {
  const costs = incidents
    .map(i => i.cost_estimate)
    .filter(Boolean);
  return costs.join(' + ');
}

// =============================================================================
// DOCUMENTS
// =============================================================================

/**
 * Récupère la liste des documents exemples disponibles
 */
export function getDocuments(): ModelDocument[] {
  return [
    {
      id: 'doc-001',
      filename: 'procedure-cloture-incomplete.md',
      title: 'Procédure de clôture annuelle (version Paul GIRARD)',
      type: 'procedure',
      description: 'Document trouvé sur le poste de Paul - jamais partagé. Illustre une procédure personnelle non formalisée.',
      path: 'src/data/model-cabinet/documents/procedure-cloture-incomplete.md',
    },
    {
      id: 'doc-002',
      filename: 'email-frustration-julie.md',
      title: 'Email de Julie MARTIN à Sophie MARTIN',
      type: 'email',
      description: 'Email illustrant la frustration quotidienne des juniors face au manque de documentation.',
      path: 'src/data/model-cabinet/documents/email-frustration-julie.md',
    },
    {
      id: 'doc-003',
      filename: 'note-passation-ratee.md',
      title: 'Note de passation - Dossier SCI LES TERRASSES',
      type: 'note',
      description: 'Document illustrant l\'échec d\'une passation bâclée et les conséquences pour le successeur.',
      path: 'src/data/model-cabinet/documents/note-passation-ratee.md',
    },
  ];
}

// =============================================================================
// HELPERS POUR LES JEUX
// =============================================================================

/**
 * Récupère les données pour le jeu Diagnostic KM
 */
export function getDiagnosticGameData() {
  return {
    cabinetName: cabinet.name,
    currentScore: cabinet.kmmm_score,
    targetScore: cabinet.kmmm_target,
    challenges: cabinet.challenges,
    criticalProcesses: getCriticalProcesses(),
    undocumentedProcesses: getUndocumentedProcesses(),
    leavingExperts: getLeavingEmployees(),
  };
}

/**
 * Récupère les données pour le jeu Persona
 */
export function getPersonaGameData() {
  return {
    keyPersonas: getKeyPersonas(),
    personaTypes: [
      { type: 'expert_protector', label: 'Expert protecteur', description: 'Détient un savoir critique mais ne partage pas' },
      { type: 'skeptic', label: 'Sceptique', description: 'Doute de la valeur du KM' },
      { type: 'overworked', label: 'Surchargé', description: 'N\'a pas le temps de documenter' },
      { type: 'enthusiast', label: 'Enthousiaste', description: 'Prêt à porter le changement' },
      { type: 'newcomer', label: 'Nouveau', description: 'Souffre du manque de documentation' },
      { type: 'founder', label: 'Fondateur', description: 'Vision stratégique mais peu opérationnel' },
      { type: 'neutral', label: 'Neutre', description: 'Fait son travail sans plus' },
    ] as const,
  };
}

/**
 * Récupère les données pour le jeu SWOT
 */
export function getSwotGameData() {
  const allPainPoints = processes.flatMap(p => p.pain_points);
  const allOpportunities = processes.map(p => p.km_opportunity).filter(Boolean);

  return {
    weaknesses: allPainPoints,
    opportunities: allOpportunities,
    strengths: [
      'Équipe stable avec experts seniors',
      'Clients fidèles depuis longtemps',
      'Bon chiffre d\'affaires (4.8M€)',
      'Pôle digital avec Thomas et Romain',
    ],
    threats: [
      'Départ de Françoise dans 18 mois',
      'Turnover des juniors (4 départs en 2025)',
      'Silos entre pôles audit et expertise',
      'Facture électronique mal maîtrisée',
    ],
  };
}

/**
 * Récupère les données pour le jeu Roadmap
 */
export function getRoadmapGameData() {
  return {
    incidents: incidents.map(i => ({
      title: i.title,
      kmSolution: i.km_solution,
      priority: i.could_have_been_prevented ? 'high' : 'medium',
    })),
    quickWins: getUndocumentedProcesses().map(p => ({
      process: p.name,
      opportunity: p.km_opportunity,
    })),
    urgentActions: [
      { action: 'Capitaliser le savoir de Françoise', deadline: '6 mois', owner: 'Sophie MARTIN' },
      { action: 'Créer FAQ période fiscale', deadline: '3 mois', owner: 'Thomas PETIT' },
      { action: 'Harmoniser méthodes audit', deadline: '6 mois', owner: 'Julien BERNARD' },
    ],
  };
}

// Export par défaut
export default {
  getCabinet,
  getKmmmScore,
  getChallenges,
  getEmployees,
  getEmployeeById,
  getKeyPersonas,
  getEmployeesByPersonaType,
  getEmployeesByDepartment,
  getLeavingEmployees,
  getManagers,
  getEmployeeStats,
  getClients,
  getClientById,
  getClientsBySector,
  getAtRiskClients,
  getProcesses,
  getProcessById,
  getProcessesByStatus,
  getCriticalProcesses,
  getUndocumentedProcesses,
  getProcessesByDepartment,
  getIncidents,
  getIncidentById,
  getIncidentsByCategory,
  getPreventableIncidents,
  getTotalIncidentCost,
  getDocuments,
  getDiagnosticGameData,
  getPersonaGameData,
  getSwotGameData,
  getRoadmapGameData,
};
