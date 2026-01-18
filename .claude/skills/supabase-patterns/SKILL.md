---
name: supabase-patterns
description: >
  Patterns Supabase (Auth, Database, Storage) pour KM 360°.
  Appliqué automatiquement sur les fichiers Supabase.
globs:
  - "supabase/**/*"
  - "**/supabase*.ts"
  - "**/*supabase*.tsx"
---

# Patterns Supabase pour KM 360°

## 1. Structure Multi-Tenant

Toutes les tables métier DOIVENT avoir :
- `cabinet_id UUID NOT NULL REFERENCES cabinets(id)`
- RLS activé avec policy filtrant par cabinet

```sql
-- Pattern standard
CREATE TABLE public.{table_name} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cabinet_id UUID NOT NULL REFERENCES cabinets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.{table_name} ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cabinet_isolation" ON public.{table_name}
  USING (cabinet_id IN (
    SELECT cabinet_id FROM user_cabinets WHERE user_id = auth.uid()
  ));
```

## 2. Auth Patterns

```typescript
// Client-side auth check
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect('/login');

// Server-side (Edge Function)
const authHeader = req.headers.get('Authorization');
const { data: { user } } = await supabase.auth.getUser(
  authHeader?.replace('Bearer ', '')
);
```

## 3. Queries Optimisées

```typescript
// Toujours sélectionner les colonnes nécessaires
const { data } = await supabase
  .from('missions')
  .select('id, title, status, client:clients(id, name)')
  .eq('cabinet_id', cabinetId)
  .order('created_at', { ascending: false })
  .limit(50);
```

## 4. Real-time

```typescript
// Subscription avec filtre cabinet
const channel = supabase
  .channel('missions-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'missions',
    filter: `cabinet_id=eq.${cabinetId}`
  }, handleChange)
  .subscribe();
```

## 5. Storage

```typescript
// Upload avec path cabinet
const path = `${cabinetId}/${missionId}/${file.name}`;
const { data } = await supabase.storage
  .from('documents')
  .upload(path, file);
```
