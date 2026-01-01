# 🏗️ ARCHITECTURE TECHNIQUE

## Supabase + React + MCP Notion

---

# 1. VUE D'ENSEMBLE

## 1.1 Stack Technique

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ARCHITECTURE GLOBALE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         FRONTEND (React)                            │   │
│  │                                                                     │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │Dashboard │ │ Config   │ │  Gaps    │ │Generator │ │  Suivi   │  │   │
│  │  │ Cabinet  │ │ Cabinet  │ │ Analysis │ │    IA    │ │Production│  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│  │                                                                     │   │
│  └─────────────────────────────────┬───────────────────────────────────┘   │
│                                    │                                       │
│                                    │ API REST / Realtime                   │
│                                    ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         SUPABASE                                    │   │
│  │                                                                     │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │  PostgreSQL  │  │     Auth     │  │   Storage    │              │   │
│  │  │              │  │              │  │              │              │   │
│  │  │ - Tables     │  │ - JWT        │  │ - Documents  │              │   │
│  │  │ - Views      │  │ - RLS        │  │ - Images     │              │   │
│  │  │ - Functions  │  │ - Providers  │  │              │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │                                                                     │   │
│  │  ┌──────────────────────────────────────────────────┐              │   │
│  │  │              Edge Functions                       │              │   │
│  │  │                                                  │              │   │
│  │  │  - generate-content (appel Claude API)           │              │   │
│  │  │  - analyze-gaps (comparaison référentiel)        │              │   │
│  │  │  - sync-notion (MCP Notion)                      │              │   │
│  │  │  - compute-matching (algorithme affectation)     │              │   │
│  │  └──────────────────────────────────────────────────┘              │   │
│  │                                                                     │   │
│  └─────────────────────────────────┬───────────────────────────────────┘   │
│                                    │                                       │
│                                    │ MCP / API                             │
│                                    ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    SERVICES EXTERNES                                │   │
│  │                                                                     │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   Claude     │  │    Notion    │  │    Slack     │              │   │
│  │  │    API       │  │   (via MCP)  │  │  (notifs)    │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 1.2 Choix Techniques

| Composant | Technologie | Justification |
|-----------|-------------|---------------|
| **Base de données** | Supabase (PostgreSQL) | Open source, temps réel, RLS, Edge Functions |
| **Auth** | Supabase Auth | JWT, multi-tenant natif, providers OAuth |
| **Frontend** | React + TypeScript | Écosystème riche, typage fort |
| **UI** | Tailwind + shadcn/ui | Rapidité, cohérence, accessibilité |
| **State** | TanStack Query | Cache, invalidation, optimistic updates |
| **IA** | Claude API | Qualité génération, contexte long |
| **CMS** | Notion (via MCP) | Familiarité utilisateurs, flexibilité |

---

# 2. SCHÉMA DE BASE DE DONNÉES

## 2.1 Diagramme ERD

```sql
-- ============================================
-- SCHÉMA SUPABASE - KM 360°
-- ============================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Pour recherche floue

-- ============================================
-- TABLES PRINCIPALES
-- ============================================

-- CABINET (Tenant principal)
CREATE TABLE cabinets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    size VARCHAR(20) CHECK (size IN ('micro', 'petit', 'moyen', 'grand', 'tres_grand')),
    structure VARCHAR(20) CHECK (structure IN ('generaliste', 'poles', 'multi_sites')),
    sectors TEXT[] DEFAULT '{}',
    tools JSONB DEFAULT '{}',
    config JSONB DEFAULT '{}',
    km_maturity VARCHAR(20) DEFAULT 'debutant',
    tone VARCHAR(20) DEFAULT 'professionnel',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- USERS (Collaborateurs)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    cabinet_id UUID REFERENCES cabinets(id) ON DELETE CASCADE,
    employee_id VARCHAR(50),
    email VARCHAR(255) NOT NULL,
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    avatar_url TEXT,
    job_title VARCHAR(100),
    job_category VARCHAR(20) CHECK (job_category IN ('production', 'support', 'direction')),
    department VARCHAR(50),
    office_location VARCHAR(100),
    manager_id UUID REFERENCES users(id),
    hire_date DATE,
    capacity_hours INTEGER DEFAULT 1500,
    allocated_hours INTEGER DEFAULT 0,
    turnover_risk VARCHAR(20) DEFAULT 'faible',
    is_referent_for TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- COMPÉTENCES (Référentiel global - partagé entre cabinets)
CREATE TABLE competences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    family VARCHAR(20) NOT NULL CHECK (family IN ('FISCAL', 'SOCIAL', 'COMPTABLE', 'JURIDIQUE', 'OUTILS', 'TRANSVERSE')),
    subfamily VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    complexity INTEGER CHECK (complexity BETWEEN 1 AND 5),
    certifiable BOOLEAN DEFAULT FALSE,
    training VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- COMPÉTENCES UTILISATEURS (Junction table avec niveau)
CREATE TABLE user_competences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    competence_id UUID REFERENCES competences(id) ON DELETE CASCADE,
    level INTEGER CHECK (level BETWEEN 1 AND 5) DEFAULT 1,
    acquired_at DATE,
    certified BOOLEAN DEFAULT FALSE,
    notes TEXT,
    UNIQUE(user_id, competence_id)
);

-- SECTEURS (Référentiel global)
CREATE TABLE sectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    naf_codes TEXT[] DEFAULT '{}',
    specifics_comptables TEXT,
    specifics_fiscales TEXT,
    specifics_sociales TEXT,
    risks TEXT[] DEFAULT '{}',
    expertise_required TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROFILS CLIENTS (Référentiel global)
CREATE TABLE client_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    typical_size VARCHAR(50),
    complexity INTEGER CHECK (complexity BETWEEN 1 AND 5),
    sector_id UUID REFERENCES sectors(id),
    required_competences UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CLIENTS
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cabinet_id UUID REFERENCES cabinets(id) ON DELETE CASCADE,
    file_number VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    legal_form VARCHAR(20),
    siren VARCHAR(9),
    vat_number VARCHAR(20),
    address TEXT,
    postal_code VARCHAR(10),
    city VARCHAR(100),
    sector_id UUID REFERENCES sectors(id),
    profile_id UUID REFERENCES client_profiles(id),
    employee_count VARCHAR(20),
    fiscal_year_end INTEGER CHECK (fiscal_year_end BETWEEN 1 AND 12),
    lifecycle_phase VARCHAR(20) DEFAULT 'active',
    specifics JSONB DEFAULT '{}',
    contacts JSONB DEFAULT '{}',
    tools JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cabinet_id, file_number)
);

-- AFFECTATIONS (Client <-> Collaborateur)
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) CHECK (role IN ('associe', 'manager', 'production', 'support')),
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    matching_score INTEGER CHECK (matching_score BETWEEN 0 AND 100),
    hours_budget INTEGER DEFAULT 0,
    hours_actual INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(client_id, user_id, role)
);

-- TYPES DE CONTENUS (Référentiel global)
CREATE TABLE content_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    output_format VARCHAR(50),
    target_length VARCHAR(50),
    structure TEXT,
    prompt_template TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTENUS (par cabinet)
CREATE TABLE contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cabinet_id UUID REFERENCES cabinets(id) ON DELETE CASCADE,
    element_type VARCHAR(20) NOT NULL CHECK (element_type IN ('competence', 'profile', 'event', 'sector')),
    element_id UUID NOT NULL,
    content_type_id UUID REFERENCES content_types(id),
    status VARCHAR(20) DEFAULT 'missing' CHECK (status IN ('missing', 'draft', 'review', 'validated', 'published')),
    title VARCHAR(255),
    body TEXT,
    notion_page_id VARCHAR(100),
    created_by UUID REFERENCES users(id),
    validated_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    validated_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    next_review DATE,
    feedback_score DECIMAL(3,2),
    metadata JSONB DEFAULT '{}'
);

-- ÉVÉNEMENTS CYCLE DE VIE (Référentiel global)
CREATE TABLE lifecycle_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    phase VARCHAR(20) CHECK (phase IN ('onboarding', 'vie_courante', 'evenement', 'offboarding')),
    name VARCHAR(100) NOT NULL,
    trigger_description TEXT,
    actions TEXT,
    competences_required UUID[] DEFAULT '{}',
    contents_required TEXT[] DEFAULT '{}',
    kpis TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROMPTS (Référentiel global + personnalisations cabinet)
CREATE TABLE prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cabinet_id UUID REFERENCES cabinets(id) ON DELETE CASCADE, -- NULL = global
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('system', 'content_type', 'custom')),
    template TEXT NOT NULL,
    variables TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cabinet_id, code)
);

-- HISTORIQUE DE PRODUCTION
CREATE TABLE production_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cabinet_id UUID REFERENCES cabinets(id) ON DELETE CASCADE,
    content_id UUID REFERENCES contents(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    actor_id UUID REFERENCES users(id),
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEX
-- ============================================

CREATE INDEX idx_users_cabinet ON users(cabinet_id);
CREATE INDEX idx_clients_cabinet ON clients(cabinet_id);
CREATE INDEX idx_clients_profile ON clients(profile_id);
CREATE INDEX idx_contents_cabinet ON contents(cabinet_id);
CREATE INDEX idx_contents_status ON contents(status);
CREATE INDEX idx_contents_element ON contents(element_type, element_id);
CREATE INDEX idx_assignments_client ON assignments(client_id);
CREATE INDEX idx_assignments_user ON assignments(user_id);
CREATE INDEX idx_competences_family ON competences(family);
CREATE INDEX idx_competences_code ON competences(code);

-- Index pour recherche full-text
CREATE INDEX idx_contents_body_search ON contents USING gin(to_tsvector('french', body));
CREATE INDEX idx_competences_name_search ON competences USING gin(to_tsvector('french', name));

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE cabinets ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_logs ENABLE ROW LEVEL SECURITY;

-- Policies pour isolation multi-tenant
CREATE POLICY "Users can view own cabinet" ON cabinets
    FOR SELECT USING (id IN (SELECT cabinet_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view same cabinet users" ON users
    FOR SELECT USING (cabinet_id IN (SELECT cabinet_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view own cabinet clients" ON clients
    FOR SELECT USING (cabinet_id IN (SELECT cabinet_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view own cabinet contents" ON contents
    FOR SELECT USING (cabinet_id IN (SELECT cabinet_id FROM users WHERE id = auth.uid()));

-- ============================================
-- VUES
-- ============================================

-- Vue des gaps de contenu par cabinet
CREATE VIEW v_content_gaps AS
SELECT 
    c.id AS cabinet_id,
    comp.id AS competence_id,
    comp.code,
    comp.name,
    comp.family,
    ct.code AS content_type,
    COALESCE(con.status, 'missing') AS status
FROM cabinets c
CROSS JOIN competences comp
CROSS JOIN content_types ct
LEFT JOIN contents con ON 
    con.cabinet_id = c.id 
    AND con.element_type = 'competence' 
    AND con.element_id = comp.id
    AND con.content_type_id = ct.id;

-- Vue du matching collaborateur-client
CREATE VIEW v_matching_scores AS
SELECT 
    cl.id AS client_id,
    cl.name AS client_name,
    u.id AS user_id,
    u.firstname || ' ' || u.lastname AS user_name,
    cp.code AS profile_code,
    COUNT(uc.id) FILTER (WHERE uc.level >= 3) AS competences_matched,
    CARDINALITY(cp.required_competences) AS competences_required,
    CASE 
        WHEN CARDINALITY(cp.required_competences) > 0 
        THEN ROUND(100.0 * COUNT(uc.id) FILTER (WHERE uc.level >= 3) / CARDINALITY(cp.required_competences))
        ELSE 0 
    END AS matching_score
FROM clients cl
JOIN client_profiles cp ON cl.profile_id = cp.id
CROSS JOIN users u
LEFT JOIN user_competences uc ON 
    uc.user_id = u.id 
    AND uc.competence_id = ANY(cp.required_competences)
WHERE cl.cabinet_id = u.cabinet_id
GROUP BY cl.id, cl.name, u.id, u.firstname, u.lastname, cp.code, cp.required_competences;

-- ============================================
-- FONCTIONS
-- ============================================

-- Fonction pour calculer le score de matching
CREATE OR REPLACE FUNCTION calculate_matching_score(
    p_client_id UUID,
    p_user_id UUID
) RETURNS INTEGER AS $$
DECLARE
    v_required_competences UUID[];
    v_matched_count INTEGER;
    v_required_count INTEGER;
BEGIN
    -- Récupérer les compétences requises du profil client
    SELECT cp.required_competences INTO v_required_competences
    FROM clients c
    JOIN client_profiles cp ON c.profile_id = cp.id
    WHERE c.id = p_client_id;
    
    v_required_count := CARDINALITY(v_required_competences);
    
    IF v_required_count = 0 THEN
        RETURN 100;
    END IF;
    
    -- Compter les compétences maîtrisées (niveau >= 3)
    SELECT COUNT(*) INTO v_matched_count
    FROM user_competences
    WHERE user_id = p_user_id
    AND competence_id = ANY(v_required_competences)
    AND level >= 3;
    
    RETURN ROUND(100.0 * v_matched_count / v_required_count);
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_cabinets_updated_at
    BEFORE UPDATE ON cabinets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

# 3. EDGE FUNCTIONS SUPABASE

## 3.1 generate-content

```typescript
// supabase/functions/generate-content/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      cabinet_id, 
      element_type, 
      element_id, 
      content_type_code 
    } = await req.json()

    // Init Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Récupérer le contexte cabinet
    const { data: cabinet } = await supabaseClient
      .from('cabinets')
      .select('*')
      .eq('id', cabinet_id)
      .single()

    // 2. Récupérer l'élément concerné
    let element
    if (element_type === 'competence') {
      const { data } = await supabaseClient
        .from('competences')
        .select('*')
        .eq('id', element_id)
        .single()
      element = data
    }
    // ... autres types

    // 3. Récupérer le prompt template
    const { data: contentType } = await supabaseClient
      .from('content_types')
      .select('*')
      .eq('code', content_type_code)
      .single()

    const { data: systemPrompt } = await supabaseClient
      .from('prompts')
      .select('template')
      .eq('code', 'SYS-001')
      .is('cabinet_id', null)
      .single()

    // 4. Construire le prompt final
    const finalPrompt = buildPrompt(
      systemPrompt.template,
      contentType.prompt_template,
      cabinet,
      element
    )

    // 5. Appeler Claude API
    const anthropic = new Anthropic({
      apiKey: Deno.env.get('ANTHROPIC_API_KEY'),
    })

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: finalPrompt }]
    })

    const generatedContent = message.content[0].text

    // 6. Sauvegarder le brouillon
    const { data: content, error } = await supabaseClient
      .from('contents')
      .insert({
        cabinet_id,
        element_type,
        element_id,
        content_type_id: contentType.id,
        status: 'draft',
        title: `${contentType.name} - ${element.name}`,
        body: generatedContent,
      })
      .select()
      .single()

    // 7. Log de production
    await supabaseClient
      .from('production_logs')
      .insert({
        cabinet_id,
        content_id: content.id,
        action: 'generated',
        details: { element_type, element_id, content_type_code }
      })

    return new Response(
      JSON.stringify({ success: true, content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function buildPrompt(systemTemplate, contentTemplate, cabinet, element) {
  let prompt = systemTemplate
    .replace(/\{\{cabinet_name\}\}/g, cabinet.name)
    .replace(/\{\{cabinet_size\}\}/g, cabinet.size)
    .replace(/\{\{cabinet_sectors\}\}/g, cabinet.sectors.join(', '))
    .replace(/\{\{cabinet_tools_compta\}\}/g, cabinet.tools?.compta || '')
    .replace(/\{\{cabinet_tools_paie\}\}/g, cabinet.tools?.paie || '')
    .replace(/\{\{cabinet_tone\}\}/g, cabinet.tone)
    // ... autres variables

  prompt += "\n\n---\n\n" + contentTemplate
    .replace(/\{\{element_name\}\}/g, element.name)
    .replace(/\{\{element_code\}\}/g, element.code || '')
    .replace(/\{\{competence_code\}\}/g, element.code || '')
    // ... autres variables

  return prompt
}
```

## 3.2 analyze-gaps

```typescript
// supabase/functions/analyze-gaps/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { cabinet_id } = await req.json()

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Utiliser la vue v_content_gaps
  const { data: gaps, error } = await supabaseClient
    .from('v_content_gaps')
    .select('*')
    .eq('cabinet_id', cabinet_id)
    .eq('status', 'missing')
    .order('family')

  // Grouper par famille et prioriser
  const prioritizedGaps = gaps.reduce((acc, gap) => {
    const key = `${gap.family}-${gap.content_type}`
    if (!acc[key]) {
      acc[key] = {
        family: gap.family,
        content_type: gap.content_type,
        count: 0,
        items: []
      }
    }
    acc[key].count++
    acc[key].items.push({
      competence_id: gap.competence_id,
      code: gap.code,
      name: gap.name
    })
    return acc
  }, {})

  return new Response(
    JSON.stringify({ 
      total_gaps: gaps.length,
      by_category: Object.values(prioritizedGaps)
    }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

---

# 4. STRUCTURE FRONTEND REACT

## 4.1 Arborescence

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── (auth)/
│       ├── login/
│       └── register/
│
├── features/
│   ├── cabinet/
│   │   ├── components/
│   │   │   ├── CabinetConfig.tsx
│   │   │   └── CabinetDashboard.tsx
│   │   ├── hooks/
│   │   │   └── useCabinet.ts
│   │   └── api/
│   │       └── cabinet.api.ts
│   │
│   ├── gaps/
│   │   ├── components/
│   │   │   ├── GapsAnalysis.tsx
│   │   │   ├── GapsList.tsx
│   │   │   └── GapCard.tsx
│   │   ├── hooks/
│   │   │   └── useGaps.ts
│   │   └── api/
│   │       └── gaps.api.ts
│   │
│   ├── generator/
│   │   ├── components/
│   │   │   ├── ContentGenerator.tsx
│   │   │   ├── PromptPreview.tsx
│   │   │   └── GeneratedContent.tsx
│   │   ├── hooks/
│   │   │   └── useGenerator.ts
│   │   └── api/
│   │       └── generator.api.ts
│   │
│   ├── production/
│   │   ├── components/
│   │   │   ├── ProductionDashboard.tsx
│   │   │   ├── ContentReview.tsx
│   │   │   └── ValidationWorkflow.tsx
│   │   └── hooks/
│   │       └── useProduction.ts
│   │
│   ├── matching/
│   │   ├── components/
│   │   │   ├── MatchingMatrix.tsx
│   │   │   └── AssignmentSuggestion.tsx
│   │   └── hooks/
│   │       └── useMatching.ts
│   │
│   └── referentiels/
│       ├── competences/
│       ├── profiles/
│       ├── sectors/
│       └── lifecycle/
│
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Navigation.tsx
│   └── common/
│       ├── DataTable.tsx
│       ├── SearchInput.tsx
│       └── StatusBadge.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── types.ts
│   ├── utils/
│   └── constants/
│
├── hooks/
│   ├── useAuth.ts
│   └── useRealtime.ts
│
└── types/
    ├── database.types.ts  # Generated by Supabase
    └── index.ts
```

## 4.2 Composants clés

### Dashboard Cabinet

```tsx
// src/features/cabinet/components/CabinetDashboard.tsx

import { useGaps } from '@/features/gaps/hooks/useGaps'
import { useProduction } from '@/features/production/hooks/useProduction'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function CabinetDashboard() {
  const { data: gaps, isLoading: gapsLoading } = useGaps()
  const { data: production, isLoading: prodLoading } = useProduction()

  const coverageRate = production 
    ? Math.round((production.published / (production.published + gaps?.total_gaps || 1)) * 100)
    : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Couverture KM</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{coverageRate}%</div>
          <Progress value={coverageRate} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Contenus manquants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{gaps?.total_gaps || 0}</div>
          <p className="text-xs text-muted-foreground">À produire</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">En validation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{production?.in_review || 0}</div>
          <p className="text-xs text-muted-foreground">En attente</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Publiés ce mois</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{production?.published_this_month || 0}</div>
          <p className="text-xs text-muted-foreground">Contenus</p>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Générateur de contenu

```tsx
// src/features/generator/components/ContentGenerator.tsx

import { useState } from 'react'
import { useGenerator } from '../hooks/useGenerator'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Loader2, Sparkles } from 'lucide-react'

interface ContentGeneratorProps {
  elementType: 'competence' | 'profile' | 'event' | 'sector'
  elementId: string
}

export function ContentGenerator({ elementType, elementId }: ContentGeneratorProps) {
  const [contentType, setContentType] = useState('PROC')
  const { generate, isGenerating, generatedContent, error } = useGenerator()

  const handleGenerate = async () => {
    await generate({
      element_type: elementType,
      element_id: elementId,
      content_type_code: contentType
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select
          value={contentType}
          onValueChange={setContentType}
          options={[
            { value: 'PROC', label: 'Procédure' },
            { value: 'CHECK', label: 'Checklist' },
            { value: 'FAQ', label: 'FAQ' },
            { value: 'MEMO', label: 'Fiche mémo' },
            { value: 'FORM', label: 'Support formation' },
          ]}
        />
        
        <Button onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Générer
        </Button>
      </div>

      {generatedContent && (
        <Card className="p-4">
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: marked(generatedContent.body) }} />
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button variant="outline">Modifier</Button>
            <Button variant="outline">Régénérer</Button>
            <Button>Soumettre pour validation</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
```

---

# 5. INTÉGRATION MCP NOTION

## 5.1 Architecture MCP

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Application   │────▶│   Supabase      │────▶│     Notion      │
│   React         │     │   Edge Function │     │    (via MCP)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               │ Appel MCP
                               ▼
                        ┌─────────────────┐
                        │   MCP Server    │
                        │   Notion        │
                        └─────────────────┘
```

## 5.2 Edge Function sync-notion

```typescript
// supabase/functions/sync-notion/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Configuration MCP Notion
const NOTION_MCP_URL = "https://mcp.notion.com/mcp"

serve(async (req) => {
  const { action, content_id, cabinet_id } = await req.json()

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  if (action === 'publish') {
    // Récupérer le contenu à publier
    const { data: content } = await supabaseClient
      .from('contents')
      .select(`
        *,
        content_types(name, code),
        competences(name, code, family)
      `)
      .eq('id', content_id)
      .single()

    // Récupérer la config Notion du cabinet
    const { data: cabinet } = await supabaseClient
      .from('cabinets')
      .select('config')
      .eq('id', cabinet_id)
      .single()

    const notionDatabaseId = cabinet.config?.notion_database_id

    // Appel MCP Notion pour créer la page
    const notionResponse = await fetch(NOTION_MCP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('NOTION_TOKEN')}`
      },
      body: JSON.stringify({
        method: 'pages.create',
        params: {
          parent: { database_id: notionDatabaseId },
          properties: {
            'Titre': { title: [{ text: { content: content.title } }] },
            'Type': { select: { name: content.content_types.name } },
            'Famille': { select: { name: content.competences?.family || 'Autre' } },
            'Code': { rich_text: [{ text: { content: content.competences?.code || '' } }] },
            'Statut': { select: { name: 'Publié' } },
          },
          children: markdownToNotionBlocks(content.body)
        }
      })
    })

    const notionPage = await notionResponse.json()

    // Mettre à jour le contenu avec l'ID Notion
    await supabaseClient
      .from('contents')
      .update({
        notion_page_id: notionPage.id,
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', content_id)

    return new Response(
      JSON.stringify({ success: true, notion_page_id: notionPage.id }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (action === 'scan') {
    // Scanner les contenus existants dans Notion
    // ... implementation
  }
})

function markdownToNotionBlocks(markdown: string) {
  // Convertir le markdown en blocs Notion
  // ... implementation
  return []
}
```

---

# 6. DÉPLOIEMENT

## 6.1 Environnements

| Environnement | URL | Usage |
|---------------|-----|-------|
| **Development** | localhost:3000 | Dev local |
| **Staging** | staging.km360.app | Tests |
| **Production** | app.km360.app | Production |

## 6.2 Variables d'environnement

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Claude API
ANTHROPIC_API_KEY=xxx

# Notion MCP
NOTION_TOKEN=xxx

# App
NEXT_PUBLIC_APP_URL=https://app.km360.app
```

## 6.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml

name: Deploy

on:
  push:
    branches: [main, staging]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: vercel/action@v3
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          
      - name: Deploy Supabase Functions
        run: npx supabase functions deploy
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

---

# 7. ROADMAP TECHNIQUE

## Phase 1 : MVP (4 semaines)
- [ ] Setup Supabase + schéma DB
- [ ] Auth + multi-tenant
- [ ] Import référentiels depuis Excel
- [ ] Dashboard basique
- [ ] Analyse des gaps

## Phase 2 : Génération (4 semaines)
- [ ] Intégration Claude API
- [ ] Interface de génération
- [ ] Workflow validation
- [ ] Éditeur de contenu

## Phase 3 : Notion (3 semaines)
- [ ] Intégration MCP Notion
- [ ] Sync bidirectionnel
- [ ] Publication automatique

## Phase 4 : Matching (3 semaines)
- [ ] Algorithme de matching
- [ ] Interface affectation
- [ ] Suggestions automatiques

## Phase 5 : Polish (2 semaines)
- [ ] Analytics & KPIs
- [ ] Notifications
- [ ] Optimisations performances

---

*Document technique généré le 24/12/2024*
*Version 1.0*
 processes(family);
CREATE INDEX idx_process_steps_process ON process_steps(process_id);
CREATE INDEX idx_business_rules_domain ON business_rules(domain);
CREATE INDEX idx_obligations_domain ON obligations_calendar(domain);
CREATE INDEX idx_sla_cabinet ON sla_commitments(cabinet_id);
CREATE INDEX idx_kpi_cabinet ON kpi_indicators(cabinet_id);
CREATE INDEX idx_kpi_values_kpi ON kpi_values(kpi_id);
CREATE INDEX idx_kpi_values_period ON kpi_values(period_start, period_end);
CREATE INDEX idx_reminder_scripts_cabinet ON reminder_scripts(cabinet_id);

-- ============================================
-- VUES PROCESSUS
-- ============================================

-- Vue des processus avec leurs étapes
CREATE VIEW v_processes_with_steps AS
SELECT 
    p.id AS process_id,
    p.code AS process_code,
    p.family,
    p.name AS process_name,
    p.frequency,
    p.criticality,
    ps.step_number,
    ps.name AS step_name,
    ps.responsible_role,
    ps.delay,
    ps.control_point
FROM processes p
LEFT JOIN process_steps ps ON p.id = ps.process_id
ORDER BY p.code, ps.step_number;

-- Vue des obligations à venir (pour alertes)
CREATE VIEW v_upcoming_obligations AS
SELECT 
    oc.*,
    c.id AS client_id,
    c.name AS client_name,
    cp.code AS profile_code
FROM obligations_calendar oc
CROSS JOIN clients c
JOIN client_profiles cp ON c.profile_id = cp.id
WHERE cp.code = ANY(oc.applicable_profiles)
   OR 'Tous' = ANY(oc.applicable_profiles);

-- Vue dashboard KPI
CREATE VIEW v_kpi_dashboard AS
SELECT 
    ki.cabinet_id,
    ki.category,
    ki.code,
    ki.name,
    kv.value,
    kv.status,
    kv.period_end,
    ki.threshold_green,
    ki.threshold_orange,
    ki.threshold_red
FROM kpi_indicators ki
LEFT JOIN LATERAL (
    SELECT * FROM kpi_values 
    WHERE kpi_id = ki.id 
    ORDER BY period_end DESC 
    LIMIT 1
) kv ON true;

-- ============================================
-- FONCTIONS PROCESSUS
-- ============================================

-- Fonction pour calculer les obligations d'un client sur une période
CREATE OR REPLACE FUNCTION get_client_obligations(
    p_client_id UUID,
    p_start_date DATE,
    p_end_date DATE
) RETURNS TABLE (
    obligation_code VARCHAR,
    obligation_name VARCHAR,
    deadline DATE,
    criticality VARCHAR,
    related_process VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        oc.code,
        oc.name,
        -- Calcul simplifié de la date - à adapter selon la logique métier
        p_end_date AS deadline,
        oc.criticality,
        pr.code AS related_process
    FROM obligations_calendar oc
    LEFT JOIN processes pr ON oc.related_process_id = pr.id
    JOIN clients c ON c.id = p_client_id
    JOIN client_profiles cp ON c.profile_id = cp.id
    WHERE cp.code = ANY(oc.applicable_profiles)
       OR 'Tous' = ANY(oc.applicable_profiles);
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir le RACI d'un processus
CREATE OR REPLACE FUNCTION get_process_raci(p_process_id UUID)
RETURNS TABLE (
    step_number INTEGER,
    step_name VARCHAR,
    collaborateur CHAR,
    manager CHAR,
    associe CHAR,
    client CHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ps.step_number,
        ps.name,
        MAX(CASE WHEN rm.role = 'collaborateur' THEN rm.raci_type END),
        MAX(CASE WHEN rm.role = 'manager' THEN rm.raci_type END),
        MAX(CASE WHEN rm.role = 'associe' THEN rm.raci_type END),
        MAX(CASE WHEN rm.role = 'client' THEN rm.raci_type END)
    FROM process_steps ps
    LEFT JOIN raci_matrix rm ON ps.id = rm.step_id
    WHERE ps.process_id = p_process_id
    GROUP BY ps.step_number, ps.name
    ORDER BY ps.step_number;
END;
$$ LANGUAGE plpgsql;
```

## 8.2 Edge Function : generate-process-content

```typescript
// supabase/functions/generate-process-content/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk'

serve(async (req) => {
  const { 
    cabinet_id, 
    process_id, 
    content_type // 'procedure' | 'checklist' | 'rules'
  } = await req.json()

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // 1. Récupérer le processus avec ses étapes
  const { data: process } = await supabaseClient
    .from('processes')
    .select('*')
    .eq('id', process_id)
    .single()

  const { data: steps } = await supabaseClient
    .from('process_steps')
    .select('*')
    .eq('process_id', process_id)
    .order('step_number')

  // 2. Récupérer les règles de gestion applicables
  const { data: rules } = await supabaseClient
    .from('business_rules')
    .select('*')

  // 3. Récupérer le contexte cabinet
  const { data: cabinet } = await supabaseClient
    .from('cabinets')
    .select('*')
    .eq('id', cabinet_id)
    .single()

  // 4. Récupérer le prompt approprié
  const promptCode = content_type === 'procedure' ? 'PROMPT-PROC-001' 
                   : content_type === 'checklist' ? 'PROMPT-PROC-002'
                   : 'PROMPT-PROC-003'

  // 5. Construire le prompt
  const stepsFormatted = steps.map(s => 
    `${s.step_number}. ${s.name}: ${s.description} (Responsable: ${s.responsible_role}, Délai: ${s.delay}, Contrôle: ${s.control_point})`
  ).join('\n')

  const applicableRules = rules.filter(r => 
    process.description?.includes(r.domain) || 
    r.domain === 'qualite'
  ).map(r => `- ${r.name}: ${r.description}`).join('\n')

  const prompt = buildProcessPrompt({
    process,
    steps: stepsFormatted,
    rules: applicableRules,
    cabinet,
    contentType: content_type
  })

  // 6. Appeler Claude
  const anthropic = new Anthropic({
    apiKey: Deno.env.get('ANTHROPIC_API_KEY'),
  })

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
    messages: [{ role: "user", content: prompt }]
  })

  return new Response(
    JSON.stringify({ 
      success: true, 
      content: message.content[0].text,
      process: process.name,
      type: content_type
    }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})

function buildProcessPrompt({ process, steps, rules, cabinet, contentType }) {
  return `Tu es un expert en Knowledge Management pour cabinets d'expertise comptable.

CONTEXTE CABINET :
- Nom : ${cabinet.name}
- Taille : ${cabinet.size}
- Outils : ${JSON.stringify(cabinet.tools)}
- Ton : ${cabinet.tone}

PROCESSUS À DOCUMENTER :
- Code : ${process.code}
- Nom : ${process.name}
- Famille : ${process.family}
- Description : ${process.description}
- Déclencheur : ${process.trigger_description}
- Fréquence : ${process.frequency}
- Criticité : ${process.criticality}
- Durée moyenne : ${process.avg_duration_minutes} minutes
- Responsable principal : ${process.owner_role}

ÉTAPES DU PROCESSUS :
${steps}

RÈGLES DE GESTION APPLICABLES :
${rules}

CONSIGNE :
Génère ${contentType === 'procedure' ? 'une procédure opérationnelle complète' 
       : contentType === 'checklist' ? 'une checklist opérationnelle exhaustive'
       : 'un référentiel de règles de gestion'} pour ce processus.

Adapte le contenu aux outils et au ton du cabinet.
Intègre les règles de gestion comme points de vigilance.
Sois concret, actionnable et professionnel.`
}
```

## 8.3 Composants React pour les processus

```tsx
// src/features/processes/components/ProcessViewer.tsx

import { useProcess, useProcessSteps } from '../hooks/useProcesses'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProcessSteps } from './ProcessSteps'
import { ProcessRaci } from './ProcessRaci'
import { ProcessGenerator } from './ProcessGenerator'

interface ProcessViewerProps {
  processId: string
}

export function ProcessViewer({ processId }: ProcessViewerProps) {
  const { data: process, isLoading } = useProcess(processId)
  const { data: steps } = useProcessSteps(processId)

  if (isLoading) return <div>Chargement...</div>

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{process.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{process.code}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant={process.criticality === 'critique' ? 'destructive' : 'secondary'}>
                {process.criticality}
              </Badge>
              <Badge>{process.frequency}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Déclencheur :</span>
              <p>{process.trigger_description}</p>
            </div>
            <div>
              <span className="font-medium">Durée moyenne :</span>
              <p>{process.avg_duration_minutes} min</p>
            </div>
            <div>
              <span className="font-medium">Responsable :</span>
              <p>{process.owner_role}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="steps">
        <TabsList>
          <TabsTrigger value="steps">Étapes ({steps?.length})</TabsTrigger>
          <TabsTrigger value="raci">RACI</TabsTrigger>
          <TabsTrigger value="generate">Générer contenu</TabsTrigger>
        </TabsList>
        
        <TabsContent value="steps">
          <ProcessSteps steps={steps} />
        </TabsContent>
        
        <TabsContent value="raci">
          <ProcessRaci processId={processId} />
        </TabsContent>
        
        <TabsContent value="generate">
          <ProcessGenerator processId={processId} processName={process.name} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

```tsx
// src/features/processes/components/ObligationsCalendar.tsx

import { useObligations } from '../hooks/useObligations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, AlertTriangle } from 'lucide-react'

export function ObligationsCalendar({ clientId }: { clientId?: string }) {
  const { data: obligations, isLoading } = useObligations(clientId)

  const getStatusColor = (daysUntil: number) => {
    if (daysUntil < 0) return 'destructive'
    if (daysUntil <= 7) return 'destructive'
    if (daysUntil <= 14) return 'warning'
    return 'secondary'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Échéances à venir
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {obligations?.map((obligation) => (
            <div 
              key={obligation.id} 
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p className="font-medium">{obligation.name}</p>
                <p className="text-sm text-muted-foreground">
                  {obligation.domain} • {obligation.frequency}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(obligation.days_until)}>
                  {obligation.days_until < 0 
                    ? `En retard de ${Math.abs(obligation.days_until)}j`
                    : `J-${obligation.days_until}`
                  }
                </Badge>
                {obligation.criticality === 'critique' && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

```tsx
// src/features/kpi/components/KpiDashboard.tsx

import { useKpis } from '../hooks/useKpis'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function KpiDashboard() {
  const { data: kpis, isLoading } = useKpis()

  const kpisByCategory = kpis?.reduce((acc, kpi) => {
    if (!acc[kpi.category]) acc[kpi.category] = []
    acc[kpi.category].push(kpi)
    return acc
  }, {} as Record<string, typeof kpis>)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green': return 'bg-green-500'
      case 'orange': return 'bg-orange-500'
      case 'red': return 'bg-red-500'
      default: return 'bg-gray-300'
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Object.entries(kpisByCategory || {}).map(([category, categoryKpis]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="capitalize">{category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryKpis.map((kpi) => (
              <div key={kpi.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{kpi.name}</span>
                  <span className="font-medium">
                    {kpi.value}{kpi.unit === '%' ? '%' : ` ${kpi.unit}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={parseFloat(kpi.value)} 
                    className="h-2"
                  />
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(kpi.status)}`} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

---

# 9. ROADMAP TECHNIQUE MISE À JOUR

## Phase 1 : MVP (4 semaines)
- [x] Setup Supabase + schéma DB de base
- [ ] Ajout tables processus (schéma V2)
- [ ] Auth + multi-tenant
- [ ] Import référentiels depuis Excel (30 onglets)
- [ ] Dashboard basique
- [ ] Analyse des gaps

## Phase 2 : Génération (4 semaines)
- [ ] Intégration Claude API
- [ ] Interface de génération contenus
- [ ] **Génération procédures/checklists processus**
- [ ] Workflow validation
- [ ] Éditeur de contenu

## Phase 3 : Processus (3 semaines) ⭐ NOUVEAU
- [ ] Visualisateur de processus
- [ ] Matrices RACI interactives
- [ ] Calendrier des obligations
- [ ] Dashboard KPI
- [ ] Scripts de relance automatisés

## Phase 4 : Notion (3 semaines)
- [ ] Intégration MCP Notion
- [ ] Sync bidirectionnel
- [ ] Publication automatique

## Phase 5 : Matching & Alertes (2 semaines)
- [ ] Algorithme de matching
- [ ] Interface affectation
- [ ] Alertes échéances
- [ ] Notifications automatiques

## Phase 6 : Polish (2 semaines)
- [ ] Analytics avancés
- [ ] Optimisations performances
- [ ] Tests utilisateurs

---

*Document technique mis à jour le 24/12/2024*
*Version 2.0 - Ajout pilier PROCESSUS*
# SCHÉMA CORRIGÉ - Liaison Contenus ↔ Processus

## 1. Table `contents` mise à jour

```sql
-- CONTENUS (corrigé V2.1)
CREATE TABLE contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cabinet_id UUID REFERENCES cabinets(id) ON DELETE CASCADE,
    
    -- SOURCES MULTIPLES (un contenu peut être lié à plusieurs éléments)
    -- Lien principal (obligatoire)
    primary_source_type VARCHAR(30) NOT NULL CHECK (primary_source_type IN (
        'competence',      -- Lié à une compétence
        'process',         -- Lié à un processus ⭐ AJOUT
        'process_step',    -- Lié à une étape de processus ⭐ AJOUT
        'profile',         -- Lié à un profil client
        'event',           -- Lié à un événement cycle de vie
        'sector',          -- Lié à un secteur
        'business_rule',   -- Lié à une règle de gestion ⭐ AJOUT
        'obligation'       -- Lié à une obligation calendrier ⭐ AJOUT
    )),
    primary_source_id UUID NOT NULL,
    
    -- Type et statut
    content_type_id UUID REFERENCES content_types(id),
    status VARCHAR(20) DEFAULT 'missing' CHECK (status IN (
        'missing', 'draft', 'review', 'validated', 'published', 'archived'
    )),
    
    -- Contenu
    title VARCHAR(255),
    body TEXT,
    
    -- Intégration Notion
    notion_page_id VARCHAR(100),
    notion_url TEXT,
    
    -- Workflow
    created_by UUID REFERENCES users(id),
    validated_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    validated_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    
    -- Qualité
    next_review DATE,
    feedback_score DECIMAL(3,2),
    view_count INTEGER DEFAULT 0,
    
    -- Métadonnées flexibles
    metadata JSONB DEFAULT '{}'
);

-- Index pour recherche par source
CREATE INDEX idx_contents_source ON contents(primary_source_type, primary_source_id);
CREATE INDEX idx_contents_cabinet ON contents(cabinet_id);
CREATE INDEX idx_contents_status ON contents(status);
```

## 2. Table de liaison multiple (un contenu peut référencer plusieurs éléments)

```sql
-- LIAISONS SECONDAIRES (un contenu peut être lié à plusieurs éléments)
CREATE TABLE content_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
    source_type VARCHAR(30) NOT NULL CHECK (source_type IN (
        'competence', 'process', 'process_step', 'profile', 
        'event', 'sector', 'business_rule', 'obligation'
    )),
    source_id UUID NOT NULL,
    relationship_type VARCHAR(20) DEFAULT 'related' CHECK (relationship_type IN (
        'primary',    -- Source principale
        'related',    -- Contenu connexe
        'requires',   -- Prérequis
        'extends'     -- Extension de
    )),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(content_id, source_type, source_id)
);

CREATE INDEX idx_content_sources_content ON content_sources(content_id);
CREATE INDEX idx_content_sources_source ON content_sources(source_type, source_id);
```

## 3. Vue cartographie Processus → Contenus

```sql
-- VUE : Cartographie complète des contenus par processus
CREATE VIEW v_process_content_map AS
SELECT 
    p.id AS process_id,
    p.code AS process_code,
    p.name AS process_name,
    p.family AS process_family,
    ct.code AS content_type_code,
    ct.name AS content_type_name,
    c.id AS content_id,
    c.title AS content_title,
    c.status AS content_status,
    CASE 
        WHEN c.id IS NOT NULL THEN true 
        ELSE false 
    END AS has_content
FROM processes p
CROSS JOIN content_types ct  -- Toutes les combinaisons possibles
LEFT JOIN contents c ON (
    c.primary_source_type = 'process' 
    AND c.primary_source_id = p.id 
    AND c.content_type_id = ct.id
)
ORDER BY p.family, p.code, ct.code;

-- VUE : Gaps de contenu par processus
CREATE VIEW v_process_content_gaps AS
SELECT 
    p.id AS process_id,
    p.code AS process_code,
    p.name AS process_name,
    p.family,
    ct.id AS content_type_id,
    ct.code AS content_type_code,
    ct.name AS content_type_name,
    pc.required  -- true/false selon mapping
FROM processes p
CROSS JOIN content_types ct
LEFT JOIN process_content_requirements pc ON (
    p.id = pc.process_id AND ct.id = pc.content_type_id
)
LEFT JOIN contents c ON (
    c.primary_source_type = 'process'
    AND c.primary_source_id = p.id
    AND c.content_type_id = ct.id
    AND c.status IN ('validated', 'published')
)
WHERE pc.required = true AND c.id IS NULL;  -- Requis mais absent
```

## 4. Table des exigences de contenu par processus

```sql
-- EXIGENCES : Quels contenus sont requis pour chaque processus
CREATE TABLE process_content_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    process_id UUID REFERENCES processes(id) ON DELETE CASCADE,
    content_type_id UUID REFERENCES content_types(id) ON DELETE CASCADE,
    required BOOLEAN DEFAULT true,
    priority VARCHAR(10) CHECK (priority IN ('critical', 'high', 'medium', 'low')),
    notes TEXT,
    UNIQUE(process_id, content_type_id)
);

-- Pré-remplissage basé sur l'onglet Processus_Contenus
INSERT INTO process_content_requirements (process_id, content_type_id, required, priority)
SELECT 
    p.id,
    ct.id,
    true,
    CASE 
        WHEN p.criticality = 'critique' THEN 'critical'
        WHEN p.criticality = 'haute' THEN 'high'
        ELSE 'medium'
    END
FROM processes p
CROSS JOIN content_types ct
WHERE ct.code IN ('PROC', 'CHECK')  -- Au minimum : procédure + checklist
  AND p.family IN ('COMPTABLE', 'FISCAL', 'SOCIAL', 'JURIDIQUE', 'TRANSVERSE');
```

## 5. Vue cartographie Étapes → Contenus

```sql
-- VUE : Contenus par étape de processus
CREATE VIEW v_step_content_map AS
SELECT 
    p.id AS process_id,
    p.code AS process_code,
    p.name AS process_name,
    ps.step_number,
    ps.name AS step_name,
    ct.code AS content_type_code,
    c.id AS content_id,
    c.title AS content_title,
    c.status
FROM processes p
JOIN process_steps ps ON p.id = ps.process_id
LEFT JOIN contents c ON (
    c.primary_source_type = 'process_step'
    AND c.primary_source_id = ps.id
)
LEFT JOIN content_types ct ON c.content_type_id = ct.id
ORDER BY p.code, ps.step_number;
```

## 6. Exemple de données

```sql
-- Exemple : Procédure liée au processus TVA CA3
INSERT INTO contents (
    cabinet_id, 
    primary_source_type, 
    primary_source_id,
    content_type_id,
    status,
    title,
    body
) VALUES (
    'uuid-cabinet',
    'process',  -- ⭐ Lié à un processus
    (SELECT id FROM processes WHERE code = 'PROC-FIS-001'),
    (SELECT id FROM content_types WHERE code = 'PROC'),
    'published',
    'Procédure - Déclaration TVA CA3 mensuelle',
    '## Objectif\n\nÉtablir et télétransmettre la déclaration de TVA...'
);

-- Exemple : Checklist liée à une étape spécifique
INSERT INTO contents (
    cabinet_id,
    primary_source_type,
    primary_source_id,
    content_type_id,
    status,
    title
) VALUES (
    'uuid-cabinet',
    'process_step',  -- ⭐ Lié à une étape
    (SELECT id FROM process_steps WHERE process_id = 
        (SELECT id FROM processes WHERE code = 'PROC-FIS-001')
        AND step_number = 2),  -- Étape "Contrôle cohérence"
    (SELECT id FROM content_types WHERE code = 'CHECK'),
    'published',
    'Checklist - Contrôle cohérence TVA/CA'
);

-- Liaison secondaire : le contenu est aussi lié à une compétence
INSERT INTO content_sources (content_id, source_type, source_id, relationship_type)
VALUES (
    'uuid-contenu',
    'competence',
    (SELECT id FROM competences WHERE code = 'FISC-012'),
    'related'
);
```

## 7. Requêtes utiles

```sql
-- Tous les contenus d'un processus (principal + secondaires)
SELECT 
    c.title,
    c.status,
    ct.name AS type,
    CASE 
        WHEN c.primary_source_type = 'process' THEN 'Principal'
        ELSE cs.relationship_type
    END AS link_type
FROM contents c
JOIN content_types ct ON c.content_type_id = ct.id
LEFT JOIN content_sources cs ON c.id = cs.content_id
WHERE 
    (c.primary_source_type = 'process' AND c.primary_source_id = 'uuid-processus')
    OR (cs.source_type = 'process' AND cs.source_id = 'uuid-processus');

-- Taux de couverture documentaire par famille de processus
SELECT 
    p.family,
    COUNT(DISTINCT p.id) AS nb_processes,
    COUNT(DISTINCT CASE WHEN c.status = 'published' THEN c.id END) AS nb_contents,
    ROUND(
        COUNT(DISTINCT CASE WHEN c.status = 'published' THEN c.id END)::DECIMAL / 
        (COUNT(DISTINCT p.id) * 4) * 100, 1  -- 4 types de contenus attendus
    ) AS coverage_percent
FROM processes p
LEFT JOIN contents c ON (
    c.primary_source_type = 'process' 
    AND c.primary_source_id = p.id
)
GROUP BY p.family
ORDER BY coverage_percent;
```

## 8. Schéma visuel corrigé

```
                    ┌──────────────────────────────────────────┐
                    │              PROCESSES                   │
                    │  (31 processus)                          │
                    └───────────────┬──────────────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
    ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
    │ PROCESS_STEPS   │   │ BUSINESS_RULES  │   │ OBLIGATIONS     │
    │ (48 étapes)     │   │ (25 règles)     │   │ (30 échéances)  │
    └────────┬────────┘   └────────┬────────┘   └────────┬────────┘
             │                     │                     │
             └──────────┬──────────┴──────────┬──────────┘
                        │                     │
                        ▼                     ▼
              ┌─────────────────────────────────────────┐
              │              CONTENTS                    │
              │                                          │
              │  primary_source_type:                    │
              │  - process ⭐                            │
              │  - process_step ⭐                       │
              │  - business_rule ⭐                      │
              │  - obligation ⭐                         │
              │  - competence                            │
              │  - profile                               │
              │  - event                                 │
              │  - sector                                │
              └─────────────────────────────────────────┘
                        │
                        ▼
              ┌─────────────────────────────────────────┐
              │          CONTENT_SOURCES                 │
              │  (liaisons multiples N:N)               │
              │                                          │
              │  Un contenu peut être lié à :            │
              │  - Son élément principal (obligatoire)   │
              │  - D'autres éléments (related, extends)  │
              └─────────────────────────────────────────┘
```
