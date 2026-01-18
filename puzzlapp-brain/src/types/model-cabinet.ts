// Types pour le Cabinet Modèle "TRAJECTOIRE CONSEIL"
// Données statiques pour l'apprentissage des lecteurs

export interface Location {
  city: string;
  address: string;
  type: 'siege' | 'antenne';
  employees_count: number;
}

export interface ModelCabinet {
  id: string;
  name: string;
  slogan: string;
  locations: Location[];
  employees_count: number;
  revenue: string;
  founded: number;
  history: string;
  values: string[];
  kmmm_score: number;
  kmmm_target: number;
  challenges: string[];
  tools_current: string[];
  certifications: string[];
}

export type PersonaType =
  | 'expert_protector'  // Expert qui protège son savoir
  | 'skeptic'           // Manager sceptique
  | 'overworked'        // Collaborateur débordé
  | 'enthusiast'        // Junior enthousiaste
  | 'neutral'           // Collaborateur neutre
  | 'founder'           // Associé fondateur
  | 'newcomer';         // Nouveau (fusion/recrutement)

export type Department =
  | 'direction'
  | 'expertise_comptable'
  | 'audit'
  | 'social_paie'
  | 'juridique'
  | 'conseil_digital'
  | 'support';

export interface ModelEmployee {
  id: string;
  name: string;
  role: string;
  department: Department;
  location: string;
  seniority_years: number;
  age?: number;
  persona_type: PersonaType;
  bio: string;
  knowledge_areas: string[];
  pain_points: string[];
  quote?: string;
  leaving_date?: string;
  is_key_person: boolean;
  is_manager?: boolean;
  reports_to?: string;
  team_size?: number;
}

export type ClientSize = 'tpe' | 'pme' | 'eti' | 'ge';

export type ClientSector =
  | 'btp'
  | 'hcr'
  | 'commerce'
  | 'industrie'
  | 'services'
  | 'sante'
  | 'immobilier'
  | 'tech'
  | 'association'
  | 'profession_liberale';

export interface ModelClient {
  id: string;
  name: string;
  sector: ClientSector;
  size: ClientSize;
  employees_count: number;
  revenue: string;
  missions: string[];
  relationship_years: number;
  key_contact: string;
  assigned_manager: string;
  specifics: string[];
  satisfaction_level: 1 | 2 | 3 | 4 | 5;
  km_relevance: string;
}

export type ProcessStatus =
  | 'undocumented'  // Pas de documentation
  | 'partial'       // Documentation partielle/obsolète
  | 'documented'    // Documenté mais pas optimisé
  | 'optimized';    // Documenté et optimisé

export interface ModelProcess {
  id: string;
  name: string;
  department: Department;
  description: string;
  status: ProcessStatus;
  owner?: string;
  pain_points: string[];
  current_tools: string[];
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'on_demand';
  criticality: 'low' | 'medium' | 'high' | 'critical';
  km_opportunity: string;
}

export type IncidentCategory =
  | 'knowledge_loss'      // Perte de savoir
  | 'onboarding_failure'  // Échec d'intégration
  | 'client_issue'        // Problème client
  | 'process_failure'     // Échec de process
  | 'communication'       // Problème de communication
  | 'tool_issue';         // Problème d'outil

export interface ModelIncident {
  id: string;
  title: string;
  date: string;
  category: IncidentCategory;
  description: string;
  context: string;
  impact: string;
  cost_estimate?: string;
  root_cause: string;
  people_involved: string[];
  lesson_learned?: string;
  could_have_been_prevented: boolean;
  km_solution: string;
}

export interface ModelDocument {
  id: string;
  filename: string;
  title: string;
  type: 'procedure' | 'email' | 'note' | 'template' | 'other';
  description: string;
  path: string;
  department?: Department;
  content?: string;
  issues?: string[];
  context?: string;
}

// Type pour l'ensemble des données du cabinet modèle
export interface ModelCabinetData {
  cabinet: ModelCabinet;
  employees: ModelEmployee[];
  clients: ModelClient[];
  processes: ModelProcess[];
  incidents: ModelIncident[];
  documents: ModelDocument[];
}
