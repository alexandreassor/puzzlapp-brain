/**
 * Cabinet Modèle "TRAJECTOIRE CONSEIL"
 * Export centralisé des données statiques
 */

// Import des données JSON
import cabinetData from './cabinet.json';
import employeesData from './employees.json';
import clientsData from './clients.json';
import processesData from './processes.json';
import incidentsData from './incidents.json';

// Import des types
import type {
  ModelCabinet,
  ModelEmployee,
  ModelClient,
  ModelProcess,
  ModelIncident,
} from '@/types/model-cabinet';

// Export des données typées
export const cabinet = cabinetData as ModelCabinet;
export const employees = employeesData as ModelEmployee[];
export const clients = clientsData as ModelClient[];
export const processes = processesData as ModelProcess[];
export const incidents = incidentsData as ModelIncident[];

// Export pour import groupé
export const modelCabinet = {
  cabinet,
  employees,
  clients,
  processes,
  incidents,
};

export default modelCabinet;
