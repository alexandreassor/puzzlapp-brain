/**
 * Carte de statistiques du mémoire
 *
 * Affiche le compteur de mots, pages estimées et progression DEC
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BookOpen, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMemoireStats, type MemoireStats } from '@/services';

interface MemoireStatsCardProps {
  className?: string;
}

export function MemoireStatsCard({ className }: MemoireStatsCardProps) {
  const [stats, setStats] = useState<MemoireStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getMemoireStats();
      setStats(data);
    } catch (err) {
      console.error('Erreur chargement stats:', err);
      setError('Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Statistiques mémoire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground animate-pulse">
            Chargement...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Statistiques mémoire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-destructive">{error || 'Données non disponibles'}</div>
          <Button variant="outline" size="sm" onClick={loadStats} className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  const statusColors = {
    under: 'text-amber-600',
    optimal: 'text-emerald-600',
    over: 'text-red-600',
  };

  const statusIcons = {
    under: <AlertTriangle className="h-4 w-4" />,
    optimal: <CheckCircle className="h-4 w-4" />,
    over: <AlertTriangle className="h-4 w-4" />,
  };

  const progressColors = {
    under: 'bg-amber-500',
    optimal: 'bg-emerald-500',
    over: 'bg-red-500',
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Progression DEC
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={loadStats} className="h-8 w-8">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Limite recommandée : 100 pages (≈ 250 000 mots)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Compteurs principaux */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-3xl font-bold text-primary">
              {stats.totalWords.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">mots</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-3xl font-bold text-primary">
              {stats.estimatedPages}
            </div>
            <div className="text-xs text-muted-foreground">pages estimées</div>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progression</span>
            <span className="font-medium">{stats.progress.percentage}%</span>
          </div>
          <div className="relative h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full transition-all ${progressColors[stats.progress.status]}`}
              style={{ width: `${Math.min(100, stats.progress.percentage)}%` }}
            />
            {/* Marqueur zone optimale (70-100%) */}
            <div
              className="absolute top-0 h-full w-px bg-emerald-700"
              style={{ left: '70%' }}
            />
          </div>
          <div className={`flex items-center gap-1 text-xs ${statusColors[stats.progress.status]}`}>
            {statusIcons[stats.progress.status]}
            <span>{stats.progress.message}</span>
          </div>
        </div>

        {/* Détails par chapitre (top 5) */}
        {stats.byChapter.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <BookOpen className="h-3 w-3" />
              Répartition par chapitre
            </div>
            <div className="space-y-1 max-h-[120px] overflow-y-auto">
              {stats.byChapter
                .filter(c => c.words > 0)
                .sort((a, b) => b.words - a.words)
                .slice(0, 5)
                .map((chapter) => (
                  <div
                    key={chapter.chapterId}
                    className="flex items-center justify-between text-xs py-1"
                  >
                    <span className="truncate text-muted-foreground max-w-[60%]">
                      {chapter.chapterOrder}. {chapter.chapterTitle}
                    </span>
                    <span className="font-mono">
                      {chapter.words.toLocaleString()} mots
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Métriques secondaires */}
        <div className="flex justify-between text-xs text-muted-foreground border-t pt-2">
          <span>{stats.totalChapters} chapitres</span>
          <span>{stats.sectionsWithContent}/{stats.totalSections} sections rédigées</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default MemoireStatsCard;
