---
name: saas-security
description: >
  Checklist sécurité SaaS pour KM 360°.
  Appliqué avant chaque mise en production.
globs:
  - "**/*.ts"
  - "**/*.tsx"
  - "supabase/**/*"
---

# Checklist Sécurité SaaS

## 1. Authentification

- [ ] Supabase Auth configuré
- [ ] Magic link ou OAuth (pas de passwords stockés)
- [ ] Session timeout configuré
- [ ] Logout propre (clear tokens)

## 2. Autorisation (RLS)

```sql
-- Chaque table DOIT avoir RLS activé
ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;

-- Policy minimum
CREATE POLICY "isolation" ON {table}
  USING (cabinet_id = get_user_cabinet_id());
```

## 3. Validation des Inputs

```typescript
// Toujours valider avec Zod
const input = InputSchema.parse(req.body);

// Jamais faire confiance au client
// ❌ const id = req.params.id;
// ✅ const id = z.string().uuid().parse(req.params.id);
```

## 4. Secrets

- [ ] Secrets dans variables d'environnement
- [ ] .env dans .gitignore
- [ ] Pas de secrets dans le code
- [ ] Service role key JAMAIS côté client

## 5. HTTPS

- [ ] HTTPS forcé en production
- [ ] HSTS activé
- [ ] Cookies secure

## 6. RGPD

- [ ] Consentement cookies
- [ ] Mentions légales
- [ ] Politique de confidentialité
- [ ] Export données utilisateur
- [ ] Suppression compte possible

## 7. Headers de Sécurité

```typescript
// Edge Function headers
return new Response(data, {
  headers: {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  },
});
```

## 8. Rate Limiting

```typescript
// Implémenter sur les Edge Functions sensibles
const rateLimit = new Map();
const MAX_REQUESTS = 100;
const WINDOW_MS = 60000;
```
