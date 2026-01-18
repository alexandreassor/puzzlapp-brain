---
name: react-native-patterns
description: >
  Patterns et conventions React Native + TypeScript pour KM 360°.
  Appliqué sur tous les fichiers frontend mobile.
globs:
  - "src/**/*.tsx"
  - "src/**/*.ts"
  - "app/**/*.tsx"
  - "components/**/*.tsx"
---

# Patterns React Native pour KM 360°

## 1. Structure Composant

```tsx
// components/ui/Card.tsx
import { View, Text, Pressable } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva('rounded-xl p-4', {
  variants: {
    variant: {
      default: 'bg-white border border-gray-200',
      elevated: 'bg-white shadow-md',
      outlined: 'border-2 border-primary-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface CardProps extends VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  onPress?: () => void;
}

export function Card({ variant, children, onPress }: CardProps) {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper onPress={onPress} className={cardVariants({ variant })}>
      {children}
    </Wrapper>
  );
}
```

## 2. Hooks Data

```tsx
// hooks/useMissions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useMissions() {
  return useQuery({
    queryKey: ['missions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}
```

## 3. Écrans avec Loading/Error

```tsx
export default function MissionsScreen() {
  const { data, isLoading, error } = useMissions();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error.message} />;
  if (!data?.length) return <EmptyState />;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <MissionCard mission={item} />}
    />
  );
}
```

## 4. Formulaires

```tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(3),
  // ...
});

export function MyForm() {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });
  // ...
}
```

## 5. Navigation Expo Router

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```
