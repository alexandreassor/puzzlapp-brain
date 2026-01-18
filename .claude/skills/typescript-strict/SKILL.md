---
name: typescript-strict
description: >
  Règles TypeScript strictes pour code maintenable.
  Appliqué sur tous les fichiers .ts et .tsx.
globs:
  - "**/*.ts"
  - "**/*.tsx"
---

# Règles TypeScript Strictes

## 1. Pas de `any`

```typescript
// ❌ INTERDIT
function process(data: any) { }

// ✅ CORRECT
function process(data: unknown) {
  if (isValidData(data)) {
    // utiliser data typé
  }
}

// ✅ CORRECT - Type explicite
interface Mission {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
}

function process(data: Mission) { }
```

## 2. Types stricts pour les props

```typescript
// ❌ INTERDIT
function Button(props) { }

// ✅ CORRECT
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

function Button({ label, onPress, variant = 'primary', disabled }: ButtonProps) { }
```

## 3. Null checks

```typescript
// ❌ INTERDIT
const name = user.name; // user peut être null

// ✅ CORRECT
const name = user?.name ?? 'Anonyme';

// ✅ CORRECT avec guard
if (!user) {
  throw new Error('User required');
}
const name = user.name;
```

## 4. Enums vs Union Types

```typescript
// Préférer les union types
type Status = 'pending' | 'in_progress' | 'completed';

// Ou const objects pour les valeurs
const STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

type Status = typeof STATUS[keyof typeof STATUS];
```

## 5. Zod pour validation runtime

```typescript
import { z } from 'zod';

const MissionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  status: z.enum(['pending', 'in_progress', 'completed']),
});

type Mission = z.infer<typeof MissionSchema>;

// Validation
const mission = MissionSchema.parse(unknownData);
```

## 6. Generics

```typescript
// Hook générique
function useData<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  // ...
  return data;
}
```
