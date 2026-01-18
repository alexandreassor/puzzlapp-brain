/**
 * Types pour les instances de cabinet (dynamiques Supabase)
 *
 * Une instance = un cabinet sur lequel le lecteur travaille
 * - Instance MODÈLE (owner_id NULL) : TRAJECTOIRE CONSEIL (accessible à tous)
 * - Instance USER (owner_id = user) : Cabinet réel du lecteur
 */

import type {
  PersonaType,
  Department,
  ProcessStatus,
  ClientSector,
  ClientSize,
  IncidentCategory,
  Location,
} from './model-cabinet';

// =============================================================================
// TYPES D'INSTANCE
// =============================================================================

export type InstanceType = 'model' | 'user';

// =============================================================================
// CABINET INSTANCE
// =============================================================================

export interface CabinetInstance {
  id: string;
  owner_id: string | null; // null = instance modèle
  instance_type: InstanceType;

  // Informations cabinet
  name: string;
  slogan?: string;
  locations: Location[];
  employees_count: number;
  revenue?: string;
  founded?: number;
  history?: string;
  values: string[];

  // Scores KM
  kmmm_score: number;
  kmmm_target: number;
  crash_test_score: number;

  // Défis et outils
  challenges: string[];
  tools_current: string[];
  certifications: string[];

  // Métadonnées
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCabinetInstanceInput {
  name: string;
  slogan?: string;
  locations?: Location[];
  employees_count?: number;
  revenue?: string;
  founded?: number;
  history?: string;
  values?: string[];
  challenges?: string[];
  tools_current?: string[];
  certifications?: string[];
}

export interface UpdateCabinetInstanceInput extends Partial<CreateCabinetInstanceInput> {
  kmmm_score?: number;
  kmmm_target?: number;
  crash_test_score?: number;
  is_active?: boolean;
}

// =============================================================================
// INSTANCE EMPLOYEE
// =============================================================================

export interface InstanceEmployee {
  id: string;
  instance_id: string;

  // Identité
  name: string;
  role: string;
  department: Department;
  location?: string;

  // Expérience
  seniority_years: number;
  age?: number;

  // Persona
  persona_type?: PersonaType;
  bio?: string;
  quote?: string;

  // Compétences et problèmes
  knowledge_areas: string[];
  pain_points: string[];

  // Statut
  leaving_date?: string;
  is_key_person: boolean;
  is_manager: boolean;
  reports_to?: string;
  team_size: number;

  // Métadonnées
  created_at: string;
  updated_at: string;
}

export interface CreateInstanceEmployeeInput {
  name: string;
  role: string;
  department: Department;
  location?: string;
  seniority_years?: number;
  age?: number;
  persona_type?: PersonaType;
  bio?: string;
  quote?: string;
  knowledge_areas?: string[];
  pain_points?: string[];
  leaving_date?: string;
  is_key_person?: boolean;
  is_manager?: boolean;
  reports_to?: string;
  team_size?: number;
}

export type UpdateInstanceEmployeeInput = Partial<CreateInstanceEmployeeInput>;

// =============================================================================
// INSTANCE CLIENT
// =============================================================================

export interface InstanceClient {
  id: string;
  instance_id: string;

  // Identité
  name: string;
  sector: ClientSector;
  size?: ClientSize;

  // Chiffres
  employees_count: number;
  revenue?: string;

  // Relation
  missions: string[];
  relationship_years: number;
  key_contact?: string;
  assigned_manager?: string;

  // Spécificités
  specifics: string[];
  satisfaction_level?: 1 | 2 | 3 | 4 | 5;
  km_relevance?: string;

  // Métadonnées
  created_at: string;
  updated_at: string;
}

export interface CreateInstanceClientInput {
  name: string;
  sector: ClientSector;
  size?: ClientSize;
  employees_count?: number;
  revenue?: string;
  missions?: string[];
  relationship_years?: number;
  key_contact?: string;
  assigned_manager?: string;
  specifics?: string[];
  satisfaction_level?: 1 | 2 | 3 | 4 | 5;
  km_relevance?: string;
}

export type UpdateInstanceClientInput = Partial<CreateInstanceClientInput>;

// =============================================================================
// INSTANCE PROCESS
// =============================================================================

export interface InstanceProcess {
  id: string;
  instance_id: string;

  // Identité
  name: string;
  department: Department;
  description?: string;

  // Statut KM
  status: ProcessStatus;
  owner?: string;

  // Problèmes et outils
  pain_points: string[];
  current_tools: string[];

  // Caractéristiques
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'on_demand';
  criticality?: 'low' | 'medium' | 'high' | 'critical';

  // Opportunité KM
  km_opportunity?: string;

  // Métadonnées
  created_at: string;
  updated_at: string;
}

export interface CreateInstanceProcessInput {
  name: string;
  department: Department;
  description?: string;
  status?: ProcessStatus;
  owner?: string;
  pain_points?: string[];
  current_tools?: string[];
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'on_demand';
  criticality?: 'low' | 'medium' | 'high' | 'critical';
  km_opportunity?: string;
}

export type UpdateInstanceProcessInput = Partial<CreateInstanceProcessInput>;

// =============================================================================
// INSTANCE INCIDENT
// =============================================================================

export interface InstanceIncident {
  id: string;
  instance_id: string;

  // Identité
  title: string;
  date?: string;
  category?: IncidentCategory;

  // Description
  description?: string;
  context?: string;
  impact?: string;
  cost_estimate?: string;

  // Analyse
  root_cause?: string;
  people_involved: string[];
  lesson_learned?: string;
  could_have_been_prevented: boolean;

  // Solution KM
  km_solution?: string;

  // Métadonnées
  created_at: string;
  updated_at: string;
}

export interface CreateInstanceIncidentInput {
  title: string;
  date?: string;
  category?: IncidentCategory;
  description?: string;
  context?: string;
  impact?: string;
  cost_estimate?: string;
  root_cause?: string;
  people_involved?: string[];
  lesson_learned?: string;
  could_have_been_prevented?: boolean;
  km_solution?: string;
}

export type UpdateInstanceIncidentInput = Partial<CreateInstanceIncidentInput>;

// =============================================================================
// INSTANCE COMPLÈTE (avec toutes les données)
// =============================================================================

export interface CabinetInstanceFull extends CabinetInstance {
  employees: InstanceEmployee[];
  clients: InstanceClient[];
  processes: InstanceProcess[];
  incidents: InstanceIncident[];
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Vérifie si une instance est le modèle (accessible à tous)
 */
export function isModelInstance(instance: CabinetInstance): boolean {
  return instance.owner_id === null || instance.instance_type === 'model';
}

/**
 * Vérifie si l'utilisateur est propriétaire de l'instance
 */
export function isInstanceOwner(instance: CabinetInstance, userId: string): boolean {
  return instance.owner_id === userId;
}

/**
 * Vérifie si l'utilisateur peut modifier l'instance
 */
export function canEditInstance(
  instance: CabinetInstance,
  userId: string,
  isAdmin: boolean
): boolean {
  if (isAdmin) return true;
  if (isModelInstance(instance)) return false;
  return isInstanceOwner(instance, userId);
}
