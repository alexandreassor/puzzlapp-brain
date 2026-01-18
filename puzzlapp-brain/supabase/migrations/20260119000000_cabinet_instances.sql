-- Migration : Système d'instances de cabinet
-- Permet à chaque utilisateur de créer ses propres cabinets
-- L'instance MODÈLE (TRAJECTOIRE CONSEIL) reste en JSON statique

-- =============================================================================
-- TABLE : cabinet_instances
-- Une instance = un cabinet sur lequel le lecteur travaille
-- =============================================================================

CREATE TABLE IF NOT EXISTS cabinet_instances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Propriétaire (null = instance système/modèle accessible à tous)
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  -- Type d'instance
  instance_type TEXT NOT NULL DEFAULT 'user' CHECK (instance_type IN ('model', 'user')),

  -- Informations du cabinet
  name TEXT NOT NULL,
  slogan TEXT,

  -- Localisation
  locations JSONB DEFAULT '[]'::jsonb,

  -- Chiffres clés
  employees_count INTEGER DEFAULT 0,
  revenue TEXT,
  founded INTEGER,

  -- Histoire et valeurs
  history TEXT,
  values TEXT[] DEFAULT '{}',

  -- Scores KM
  kmmm_score NUMERIC(2,1) DEFAULT 0 CHECK (kmmm_score >= 0 AND kmmm_score <= 5),
  kmmm_target NUMERIC(2,1) DEFAULT 3 CHECK (kmmm_target >= 0 AND kmmm_target <= 5),
  crash_test_score INTEGER DEFAULT 0 CHECK (crash_test_score >= 0 AND crash_test_score <= 100),

  -- Défis identifiés
  challenges TEXT[] DEFAULT '{}',

  -- Outils actuels
  tools_current TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',

  -- Métadonnées
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour performance
CREATE INDEX idx_cabinet_instances_owner ON cabinet_instances(owner_id);
CREATE INDEX idx_cabinet_instances_type ON cabinet_instances(instance_type);

-- =============================================================================
-- TABLE : instance_employees
-- Collaborateurs d'une instance de cabinet
-- =============================================================================

CREATE TABLE IF NOT EXISTS instance_employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  instance_id UUID NOT NULL REFERENCES cabinet_instances(id) ON DELETE CASCADE,

  -- Identité
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL CHECK (department IN (
    'direction', 'expertise_comptable', 'audit',
    'social_paie', 'juridique', 'conseil_digital', 'support'
  )),
  location TEXT,

  -- Expérience
  seniority_years INTEGER DEFAULT 0,
  age INTEGER,

  -- Persona
  persona_type TEXT CHECK (persona_type IN (
    'expert_protector', 'skeptic', 'overworked',
    'enthusiast', 'neutral', 'founder', 'newcomer'
  )),
  bio TEXT,
  quote TEXT,

  -- Compétences et problèmes
  knowledge_areas TEXT[] DEFAULT '{}',
  pain_points TEXT[] DEFAULT '{}',

  -- Statut
  leaving_date DATE,
  is_key_person BOOLEAN DEFAULT false,
  is_manager BOOLEAN DEFAULT false,
  reports_to UUID REFERENCES instance_employees(id),
  team_size INTEGER DEFAULT 0,

  -- Métadonnées
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index
CREATE INDEX idx_instance_employees_instance ON instance_employees(instance_id);
CREATE INDEX idx_instance_employees_department ON instance_employees(department);
CREATE INDEX idx_instance_employees_persona ON instance_employees(persona_type);

-- =============================================================================
-- TABLE : instance_clients
-- Clients d'une instance de cabinet
-- =============================================================================

CREATE TABLE IF NOT EXISTS instance_clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  instance_id UUID NOT NULL REFERENCES cabinet_instances(id) ON DELETE CASCADE,

  -- Identité
  name TEXT NOT NULL,
  sector TEXT NOT NULL CHECK (sector IN (
    'btp', 'hcr', 'commerce', 'industrie', 'services',
    'sante', 'immobilier', 'tech', 'association', 'profession_liberale'
  )),
  size TEXT CHECK (size IN ('tpe', 'pme', 'eti', 'ge')),

  -- Chiffres
  employees_count INTEGER DEFAULT 0,
  revenue TEXT,

  -- Relation
  missions TEXT[] DEFAULT '{}',
  relationship_years INTEGER DEFAULT 0,
  key_contact TEXT,
  assigned_manager TEXT,

  -- Spécificités
  specifics TEXT[] DEFAULT '{}',
  satisfaction_level INTEGER CHECK (satisfaction_level BETWEEN 1 AND 5),
  km_relevance TEXT,

  -- Métadonnées
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index
CREATE INDEX idx_instance_clients_instance ON instance_clients(instance_id);
CREATE INDEX idx_instance_clients_sector ON instance_clients(sector);

-- =============================================================================
-- TABLE : instance_processes
-- Processus d'une instance de cabinet
-- =============================================================================

CREATE TABLE IF NOT EXISTS instance_processes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  instance_id UUID NOT NULL REFERENCES cabinet_instances(id) ON DELETE CASCADE,

  -- Identité
  name TEXT NOT NULL,
  department TEXT NOT NULL CHECK (department IN (
    'direction', 'expertise_comptable', 'audit',
    'social_paie', 'juridique', 'conseil_digital', 'support'
  )),
  description TEXT,

  -- Statut KM
  status TEXT NOT NULL DEFAULT 'undocumented' CHECK (status IN (
    'undocumented', 'partial', 'documented', 'optimized'
  )),
  owner TEXT,

  -- Problèmes et outils
  pain_points TEXT[] DEFAULT '{}',
  current_tools TEXT[] DEFAULT '{}',

  -- Caractéristiques
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly', 'on_demand')),
  criticality TEXT CHECK (criticality IN ('low', 'medium', 'high', 'critical')),

  -- Opportunité KM
  km_opportunity TEXT,

  -- Métadonnées
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index
CREATE INDEX idx_instance_processes_instance ON instance_processes(instance_id);
CREATE INDEX idx_instance_processes_status ON instance_processes(status);
CREATE INDEX idx_instance_processes_criticality ON instance_processes(criticality);

-- =============================================================================
-- TABLE : instance_incidents
-- Incidents/cas d'étude d'une instance de cabinet
-- =============================================================================

CREATE TABLE IF NOT EXISTS instance_incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  instance_id UUID NOT NULL REFERENCES cabinet_instances(id) ON DELETE CASCADE,

  -- Identité
  title TEXT NOT NULL,
  date DATE,
  category TEXT CHECK (category IN (
    'knowledge_loss', 'onboarding_failure', 'client_issue',
    'process_failure', 'communication', 'tool_issue'
  )),

  -- Description
  description TEXT,
  context TEXT,
  impact TEXT,
  cost_estimate TEXT,

  -- Analyse
  root_cause TEXT,
  people_involved TEXT[] DEFAULT '{}',
  lesson_learned TEXT,
  could_have_been_prevented BOOLEAN DEFAULT true,

  -- Solution KM
  km_solution TEXT,

  -- Métadonnées
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index
CREATE INDEX idx_instance_incidents_instance ON instance_incidents(instance_id);
CREATE INDEX idx_instance_incidents_category ON instance_incidents(category);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Activer RLS
ALTER TABLE cabinet_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE instance_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE instance_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE instance_processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE instance_incidents ENABLE ROW LEVEL SECURITY;

-- Politique cabinet_instances
-- Lecture : ses propres instances + instances modèles (owner_id IS NULL)
CREATE POLICY "Users can view own and model instances"
  ON cabinet_instances FOR SELECT
  USING (
    owner_id = auth.uid()
    OR owner_id IS NULL
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Création : uniquement ses propres instances
CREATE POLICY "Users can create own instances"
  ON cabinet_instances FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- Modification : ses propres instances uniquement
CREATE POLICY "Users can update own instances"
  ON cabinet_instances FOR UPDATE
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Suppression : ses propres instances uniquement
CREATE POLICY "Users can delete own instances"
  ON cabinet_instances FOR DELETE
  USING (owner_id = auth.uid());

-- Admin : accès total
CREATE POLICY "Admins have full access to instances"
  ON cabinet_instances FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Politiques pour les tables liées (employees, clients, processes, incidents)
-- Basées sur l'accès à l'instance parente

CREATE POLICY "Access instance_employees through instance"
  ON instance_employees FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM cabinet_instances ci
      WHERE ci.id = instance_employees.instance_id
      AND (
        ci.owner_id = auth.uid()
        OR ci.owner_id IS NULL
        OR EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      )
    )
  );

CREATE POLICY "Access instance_clients through instance"
  ON instance_clients FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM cabinet_instances ci
      WHERE ci.id = instance_clients.instance_id
      AND (
        ci.owner_id = auth.uid()
        OR ci.owner_id IS NULL
        OR EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      )
    )
  );

CREATE POLICY "Access instance_processes through instance"
  ON instance_processes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM cabinet_instances ci
      WHERE ci.id = instance_processes.instance_id
      AND (
        ci.owner_id = auth.uid()
        OR ci.owner_id IS NULL
        OR EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      )
    )
  );

CREATE POLICY "Access instance_incidents through instance"
  ON instance_incidents FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM cabinet_instances ci
      WHERE ci.id = instance_incidents.instance_id
      AND (
        ci.owner_id = auth.uid()
        OR ci.owner_id IS NULL
        OR EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      )
    )
  );

-- =============================================================================
-- TRIGGERS pour updated_at
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cabinet_instances_updated_at
  BEFORE UPDATE ON cabinet_instances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instance_employees_updated_at
  BEFORE UPDATE ON instance_employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instance_clients_updated_at
  BEFORE UPDATE ON instance_clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instance_processes_updated_at
  BEFORE UPDATE ON instance_processes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instance_incidents_updated_at
  BEFORE UPDATE ON instance_incidents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- COMMENTAIRES
-- =============================================================================

COMMENT ON TABLE cabinet_instances IS 'Instances de cabinet pour les exercices KM. owner_id NULL = instance modèle accessible à tous.';
COMMENT ON TABLE instance_employees IS 'Collaborateurs d''une instance de cabinet';
COMMENT ON TABLE instance_clients IS 'Clients d''une instance de cabinet';
COMMENT ON TABLE instance_processes IS 'Processus d''une instance de cabinet';
COMMENT ON TABLE instance_incidents IS 'Incidents/cas d''étude d''une instance de cabinet';
