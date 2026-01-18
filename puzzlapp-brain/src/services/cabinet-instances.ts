/**
 * Service de gestion des instances de cabinet
 *
 * Gère les instances dynamiques (Supabase) et peut charger
 * l'instance modèle depuis les données statiques (JSON).
 */

import { supabase } from '@/lib/supabase';
import type {
  CabinetInstance,
  CabinetInstanceFull,
  CreateCabinetInstanceInput,
  UpdateCabinetInstanceInput,
  InstanceEmployee,
  CreateInstanceEmployeeInput,
  UpdateInstanceEmployeeInput,
  InstanceClient,
  CreateInstanceClientInput,
  UpdateInstanceClientInput,
  InstanceProcess,
  CreateInstanceProcessInput,
  UpdateInstanceProcessInput,
  InstanceIncident,
  CreateInstanceIncidentInput,
  UpdateInstanceIncidentInput,
} from '@/types/cabinet-instance';

// Import des données statiques du cabinet modèle
import {
  cabinet as modelCabinet,
  employees as modelEmployees,
  clients as modelClients,
  processes as modelProcesses,
  incidents as modelIncidents,
} from '@/data/model-cabinet';

// =============================================================================
// CONSTANTES
// =============================================================================

/** ID fixe pour l'instance modèle TRAJECTOIRE CONSEIL */
export const MODEL_INSTANCE_ID = '00000000-0000-0000-0000-000000000001';

// =============================================================================
// CABINET INSTANCES
// =============================================================================

/**
 * Récupère toutes les instances accessibles à l'utilisateur
 * (ses propres instances + instance modèle)
 */
export async function getInstances(): Promise<CabinetInstance[]> {
  const { data, error } = await supabase
    .from('cabinet_instances')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Récupère les instances de l'utilisateur connecté uniquement
 */
export async function getMyInstances(): Promise<CabinetInstance[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('cabinet_instances')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Récupère une instance par son ID
 */
export async function getInstanceById(id: string): Promise<CabinetInstance | null> {
  const { data, error } = await supabase
    .from('cabinet_instances')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

/**
 * Récupère une instance complète avec toutes ses données
 */
export async function getInstanceFull(id: string): Promise<CabinetInstanceFull | null> {
  const instance = await getInstanceById(id);
  if (!instance) return null;

  const [employees, clients, processes, incidents] = await Promise.all([
    getInstanceEmployees(id),
    getInstanceClients(id),
    getInstanceProcesses(id),
    getInstanceIncidents(id),
  ]);

  return {
    ...instance,
    employees,
    clients,
    processes,
    incidents,
  };
}

/**
 * Crée une nouvelle instance de cabinet
 */
export async function createInstance(
  input: CreateCabinetInstanceInput
): Promise<CabinetInstance> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non authentifié');

  const { data, error } = await supabase
    .from('cabinet_instances')
    .insert({
      ...input,
      owner_id: user.id,
      instance_type: 'user',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Met à jour une instance
 */
export async function updateInstance(
  id: string,
  input: UpdateCabinetInstanceInput
): Promise<CabinetInstance> {
  const { data, error } = await supabase
    .from('cabinet_instances')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Supprime une instance
 */
export async function deleteInstance(id: string): Promise<void> {
  const { error } = await supabase
    .from('cabinet_instances')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Duplique une instance (utile pour partir du modèle)
 */
export async function duplicateInstance(
  sourceId: string,
  newName: string
): Promise<CabinetInstance> {
  // Récupérer l'instance source complète
  const source = await getInstanceFull(sourceId);
  if (!source) throw new Error('Instance source non trouvée');

  // Créer la nouvelle instance
  const newInstance = await createInstance({
    name: newName,
    slogan: source.slogan,
    locations: source.locations,
    employees_count: source.employees_count,
    revenue: source.revenue,
    founded: source.founded,
    history: source.history,
    values: source.values,
    challenges: source.challenges,
    tools_current: source.tools_current,
    certifications: source.certifications,
  });

  // Dupliquer les employés
  for (const emp of source.employees) {
    await createInstanceEmployee(newInstance.id, {
      name: emp.name,
      role: emp.role,
      department: emp.department,
      location: emp.location,
      seniority_years: emp.seniority_years,
      age: emp.age,
      persona_type: emp.persona_type,
      bio: emp.bio,
      quote: emp.quote,
      knowledge_areas: emp.knowledge_areas,
      pain_points: emp.pain_points,
      leaving_date: emp.leaving_date,
      is_key_person: emp.is_key_person,
      is_manager: emp.is_manager,
      team_size: emp.team_size,
    });
  }

  // Dupliquer les clients
  for (const client of source.clients) {
    await createInstanceClient(newInstance.id, {
      name: client.name,
      sector: client.sector,
      size: client.size,
      employees_count: client.employees_count,
      revenue: client.revenue,
      missions: client.missions,
      relationship_years: client.relationship_years,
      key_contact: client.key_contact,
      assigned_manager: client.assigned_manager,
      specifics: client.specifics,
      satisfaction_level: client.satisfaction_level,
      km_relevance: client.km_relevance,
    });
  }

  // Dupliquer les processus
  for (const proc of source.processes) {
    await createInstanceProcess(newInstance.id, {
      name: proc.name,
      department: proc.department,
      description: proc.description,
      status: proc.status,
      owner: proc.owner,
      pain_points: proc.pain_points,
      current_tools: proc.current_tools,
      frequency: proc.frequency,
      criticality: proc.criticality,
      km_opportunity: proc.km_opportunity,
    });
  }

  // Dupliquer les incidents
  for (const inc of source.incidents) {
    await createInstanceIncident(newInstance.id, {
      title: inc.title,
      date: inc.date,
      category: inc.category,
      description: inc.description,
      context: inc.context,
      impact: inc.impact,
      cost_estimate: inc.cost_estimate,
      root_cause: inc.root_cause,
      people_involved: inc.people_involved,
      lesson_learned: inc.lesson_learned,
      could_have_been_prevented: inc.could_have_been_prevented,
      km_solution: inc.km_solution,
    });
  }

  return newInstance;
}

// =============================================================================
// INSTANCE EMPLOYEES
// =============================================================================

export async function getInstanceEmployees(instanceId: string): Promise<InstanceEmployee[]> {
  const { data, error } = await supabase
    .from('instance_employees')
    .select('*')
    .eq('instance_id', instanceId)
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function createInstanceEmployee(
  instanceId: string,
  input: CreateInstanceEmployeeInput
): Promise<InstanceEmployee> {
  const { data, error } = await supabase
    .from('instance_employees')
    .insert({ ...input, instance_id: instanceId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateInstanceEmployee(
  id: string,
  input: UpdateInstanceEmployeeInput
): Promise<InstanceEmployee> {
  const { data, error } = await supabase
    .from('instance_employees')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteInstanceEmployee(id: string): Promise<void> {
  const { error } = await supabase
    .from('instance_employees')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// =============================================================================
// INSTANCE CLIENTS
// =============================================================================

export async function getInstanceClients(instanceId: string): Promise<InstanceClient[]> {
  const { data, error } = await supabase
    .from('instance_clients')
    .select('*')
    .eq('instance_id', instanceId)
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function createInstanceClient(
  instanceId: string,
  input: CreateInstanceClientInput
): Promise<InstanceClient> {
  const { data, error } = await supabase
    .from('instance_clients')
    .insert({ ...input, instance_id: instanceId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateInstanceClient(
  id: string,
  input: UpdateInstanceClientInput
): Promise<InstanceClient> {
  const { data, error } = await supabase
    .from('instance_clients')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteInstanceClient(id: string): Promise<void> {
  const { error } = await supabase
    .from('instance_clients')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// =============================================================================
// INSTANCE PROCESSES
// =============================================================================

export async function getInstanceProcesses(instanceId: string): Promise<InstanceProcess[]> {
  const { data, error } = await supabase
    .from('instance_processes')
    .select('*')
    .eq('instance_id', instanceId)
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function createInstanceProcess(
  instanceId: string,
  input: CreateInstanceProcessInput
): Promise<InstanceProcess> {
  const { data, error } = await supabase
    .from('instance_processes')
    .insert({ ...input, instance_id: instanceId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateInstanceProcess(
  id: string,
  input: UpdateInstanceProcessInput
): Promise<InstanceProcess> {
  const { data, error } = await supabase
    .from('instance_processes')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteInstanceProcess(id: string): Promise<void> {
  const { error } = await supabase
    .from('instance_processes')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// =============================================================================
// INSTANCE INCIDENTS
// =============================================================================

export async function getInstanceIncidents(instanceId: string): Promise<InstanceIncident[]> {
  const { data, error } = await supabase
    .from('instance_incidents')
    .select('*')
    .eq('instance_id', instanceId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createInstanceIncident(
  instanceId: string,
  input: CreateInstanceIncidentInput
): Promise<InstanceIncident> {
  const { data, error } = await supabase
    .from('instance_incidents')
    .insert({ ...input, instance_id: instanceId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateInstanceIncident(
  id: string,
  input: UpdateInstanceIncidentInput
): Promise<InstanceIncident> {
  const { data, error } = await supabase
    .from('instance_incidents')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteInstanceIncident(id: string): Promise<void> {
  const { error } = await supabase
    .from('instance_incidents')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// =============================================================================
// INSTANCE MODÈLE (TRAJECTOIRE CONSEIL)
// Convertit les données JSON statiques en format instance
// =============================================================================

/**
 * Récupère l'instance modèle TRAJECTOIRE CONSEIL
 * (données statiques converties en format instance)
 */
export function getModelInstance(): CabinetInstanceFull {
  return {
    id: MODEL_INSTANCE_ID,
    owner_id: null,
    instance_type: 'model',
    name: modelCabinet.name,
    slogan: modelCabinet.slogan,
    locations: modelCabinet.locations,
    employees_count: modelCabinet.employees_count,
    revenue: modelCabinet.revenue,
    founded: modelCabinet.founded,
    history: modelCabinet.history,
    values: modelCabinet.values,
    kmmm_score: modelCabinet.kmmm_score,
    kmmm_target: modelCabinet.kmmm_target,
    crash_test_score: 25, // Score Crash Test initial bas
    challenges: modelCabinet.challenges,
    tools_current: modelCabinet.tools_current,
    certifications: modelCabinet.certifications,
    is_active: true,
    created_at: '2026-01-19T00:00:00Z',
    updated_at: '2026-01-19T00:00:00Z',

    // Conversion des employés
    employees: modelEmployees.map((emp) => ({
      id: emp.id,
      instance_id: MODEL_INSTANCE_ID,
      name: emp.name,
      role: emp.role,
      department: emp.department,
      location: emp.location,
      seniority_years: emp.seniority_years,
      age: emp.age,
      persona_type: emp.persona_type,
      bio: emp.bio,
      quote: emp.quote,
      knowledge_areas: emp.knowledge_areas,
      pain_points: emp.pain_points,
      leaving_date: emp.leaving_date,
      is_key_person: emp.is_key_person,
      is_manager: emp.is_manager || false,
      reports_to: emp.reports_to,
      team_size: emp.team_size || 0,
      created_at: '2026-01-19T00:00:00Z',
      updated_at: '2026-01-19T00:00:00Z',
    })),

    // Conversion des clients
    clients: modelClients.map((client) => ({
      id: client.id,
      instance_id: MODEL_INSTANCE_ID,
      name: client.name,
      sector: client.sector,
      size: client.size,
      employees_count: client.employees_count,
      revenue: client.revenue,
      missions: client.missions,
      relationship_years: client.relationship_years,
      key_contact: client.key_contact,
      assigned_manager: client.assigned_manager,
      specifics: client.specifics,
      satisfaction_level: client.satisfaction_level,
      km_relevance: client.km_relevance,
      created_at: '2026-01-19T00:00:00Z',
      updated_at: '2026-01-19T00:00:00Z',
    })),

    // Conversion des processus
    processes: modelProcesses.map((proc) => ({
      id: proc.id,
      instance_id: MODEL_INSTANCE_ID,
      name: proc.name,
      department: proc.department,
      description: proc.description,
      status: proc.status,
      owner: proc.owner,
      pain_points: proc.pain_points,
      current_tools: proc.current_tools,
      frequency: proc.frequency,
      criticality: proc.criticality,
      km_opportunity: proc.km_opportunity,
      created_at: '2026-01-19T00:00:00Z',
      updated_at: '2026-01-19T00:00:00Z',
    })),

    // Conversion des incidents
    incidents: modelIncidents.map((inc) => ({
      id: inc.id,
      instance_id: MODEL_INSTANCE_ID,
      title: inc.title,
      date: inc.date,
      category: inc.category,
      description: inc.description,
      context: inc.context,
      impact: inc.impact,
      cost_estimate: inc.cost_estimate,
      root_cause: inc.root_cause,
      people_involved: inc.people_involved,
      lesson_learned: inc.lesson_learned,
      could_have_been_prevented: inc.could_have_been_prevented,
      km_solution: inc.km_solution,
      created_at: '2026-01-19T00:00:00Z',
      updated_at: '2026-01-19T00:00:00Z',
    })),
  };
}

/**
 * Récupère une instance (modèle ou dynamique) par son ID
 */
export async function getInstance(id: string): Promise<CabinetInstanceFull | null> {
  // Si c'est l'instance modèle, retourner les données statiques
  if (id === MODEL_INSTANCE_ID) {
    return getModelInstance();
  }

  // Sinon, récupérer depuis Supabase
  return getInstanceFull(id);
}

// =============================================================================
// HELPERS POUR LES JEUX
// =============================================================================

/**
 * Prépare les données d'une instance pour le jeu Diagnostic
 */
export async function getInstanceForDiagnostic(instanceId: string) {
  const instance = await getInstance(instanceId);
  if (!instance) return null;

  return {
    name: instance.name,
    kmmm_score: instance.kmmm_score,
    kmmm_target: instance.kmmm_target,
    crash_test_score: instance.crash_test_score,
    challenges: instance.challenges,
    criticalProcesses: instance.processes.filter(p => p.criticality === 'critical'),
    undocumentedProcesses: instance.processes.filter(p => p.status === 'undocumented'),
    leavingEmployees: instance.employees.filter(e => e.leaving_date),
    keyPersons: instance.employees.filter(e => e.is_key_person),
  };
}

/**
 * Prépare les données d'une instance pour le jeu Persona
 */
export async function getInstanceForPersona(instanceId: string) {
  const instance = await getInstance(instanceId);
  if (!instance) return null;

  return {
    employees: instance.employees,
    keyPersonas: instance.employees.filter(e => e.is_key_person),
    departments: [...new Set(instance.employees.map(e => e.department))],
  };
}

/**
 * Prépare les données d'une instance pour le jeu SWOT
 */
export async function getInstanceForSwot(instanceId: string) {
  const instance = await getInstance(instanceId);
  if (!instance) return null;

  return {
    weaknesses: instance.processes.flatMap(p => p.pain_points),
    opportunities: instance.processes.map(p => p.km_opportunity).filter(Boolean),
    challenges: instance.challenges,
    incidents: instance.incidents,
  };
}

/**
 * Met à jour le score KMMM d'une instance après un diagnostic
 */
export async function updateInstanceKmmmScore(
  instanceId: string,
  newScore: number
): Promise<void> {
  if (instanceId === MODEL_INSTANCE_ID) {
    // On ne peut pas modifier l'instance modèle
    console.warn('Cannot update model instance');
    return;
  }

  await updateInstance(instanceId, { kmmm_score: newScore });
}

/**
 * Met à jour le score Crash Test d'une instance
 */
export async function updateInstanceCrashTestScore(
  instanceId: string,
  newScore: number
): Promise<void> {
  if (instanceId === MODEL_INSTANCE_ID) {
    console.warn('Cannot update model instance');
    return;
  }

  await updateInstance(instanceId, { crash_test_score: newScore });
}

// Export par défaut
export default {
  // Instances
  getInstances,
  getMyInstances,
  getInstanceById,
  getInstanceFull,
  createInstance,
  updateInstance,
  deleteInstance,
  duplicateInstance,

  // Employees
  getInstanceEmployees,
  createInstanceEmployee,
  updateInstanceEmployee,
  deleteInstanceEmployee,

  // Clients
  getInstanceClients,
  createInstanceClient,
  updateInstanceClient,
  deleteInstanceClient,

  // Processes
  getInstanceProcesses,
  createInstanceProcess,
  updateInstanceProcess,
  deleteInstanceProcess,

  // Incidents
  getInstanceIncidents,
  createInstanceIncident,
  updateInstanceIncident,
  deleteInstanceIncident,

  // Modèle
  getModelInstance,
  getInstance,
  MODEL_INSTANCE_ID,

  // Helpers jeux
  getInstanceForDiagnostic,
  getInstanceForPersona,
  getInstanceForSwot,
  updateInstanceKmmmScore,
  updateInstanceCrashTestScore,
};
