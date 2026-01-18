-- =============================================================================
-- Table: content_drafts
-- Description: Brouillons de contenu Markdown à valider et intégrer
-- =============================================================================

CREATE TABLE content_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content_md TEXT DEFAULT '',
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'validated', 'integrated')),
  target_chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
  target_section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour filtrage par statut
CREATE INDEX idx_content_drafts_status ON content_drafts(status);

-- Index pour filtrage par utilisateur
CREATE INDEX idx_content_drafts_user ON content_drafts(user_id);

-- Index pour tri par date
CREATE INDEX idx_content_drafts_created ON content_drafts(created_at DESC);

-- RLS Policies
ALTER TABLE content_drafts ENABLE ROW LEVEL SECURITY;

-- Lecture : utilisateurs authentifiés peuvent voir leurs propres brouillons
CREATE POLICY "Users can view own drafts"
  ON content_drafts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Création : utilisateurs authentifiés peuvent créer des brouillons
CREATE POLICY "Users can create drafts"
  ON content_drafts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Modification : utilisateurs peuvent modifier leurs propres brouillons
CREATE POLICY "Users can update own drafts"
  ON content_drafts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Suppression : utilisateurs peuvent supprimer leurs propres brouillons
CREATE POLICY "Users can delete own drafts"
  ON content_drafts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger pour updated_at automatique
CREATE OR REPLACE FUNCTION update_content_drafts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_content_drafts_updated_at
  BEFORE UPDATE ON content_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_content_drafts_updated_at();

-- Commentaires
COMMENT ON TABLE content_drafts IS 'Brouillons de contenu Markdown à valider puis intégrer dans le mémoire';
COMMENT ON COLUMN content_drafts.status IS 'draft: en cours, validated: relu et validé, integrated: intégré dans une section';
COMMENT ON COLUMN content_drafts.target_chapter_id IS 'Chapitre cible prévu (optionnel)';
COMMENT ON COLUMN content_drafts.target_section_id IS 'Section cible prévue (optionnel)';
