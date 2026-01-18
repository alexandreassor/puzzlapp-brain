/**
 * Panel de documentation pour l'espace Admin
 *
 * Affiche la liste des articles de documentation par catégorie
 * et permet de lire le contenu en Markdown.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Search, Clock, Tag } from 'lucide-react';
import {
  documentationService,
  DOCUMENTATION_CATEGORIES,
  type Documentation,
  type DocumentationListItem,
  type DocumentationCategory,
} from '@/services/documentation';

// =============================================================================
// SOUS-COMPOSANTS
// =============================================================================

interface CategoryCardProps {
  category: DocumentationCategory;
  docs: DocumentationListItem[];
  onSelectDoc: (slug: string) => void;
}

function CategoryCard({ category, docs, onSelectDoc }: CategoryCardProps) {
  const categoryInfo = DOCUMENTATION_CATEGORIES[category];

  if (docs.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{categoryInfo.icon}</span>
          <div>
            <CardTitle className="text-lg">{categoryInfo.label}</CardTitle>
            <CardDescription className="text-sm">
              {categoryInfo.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {docs.map((doc) => (
            <button
              key={doc.id}
              className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors"
              onClick={() => onSelectDoc(doc.slug)}
            >
              <div className="font-medium">{doc.title}</div>
              {doc.summary && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {doc.summary}
                </p>
              )}
              {doc.tags.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {doc.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {doc.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{doc.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface DocViewerProps {
  doc: Documentation;
  onBack: () => void;
}

function DocViewer({ doc, onBack }: DocViewerProps) {
  const categoryInfo = DOCUMENTATION_CATEGORIES[doc.category];

  // Simple markdown to HTML (basique, peut être remplacé par react-markdown)
  const renderMarkdown = (md: string) => {
    // Convertir les headers
    let html = md
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-8 mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      // Convertir les listes
      .replace(/^\* (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
      // Convertir les tableaux simples (basique)
      .replace(/\| (.*) \|/g, (match) => {
        const cells = match.split('|').filter(Boolean).map(c => c.trim());
        return `<tr>${cells.map(c => `<td class="border px-3 py-2">${c}</td>`).join('')}</tr>`;
      })
      // Convertir le gras et l'italique
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Convertir les liens
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
      // Convertir les blocs de code
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      // Convertir les citations
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-primary pl-4 italic my-4">$1</blockquote>')
      // Convertir les paragraphes
      .replace(/\n\n/g, '</p><p class="my-3">')
      // Convertir les séparateurs
      .replace(/^---$/gm, '<hr class="my-6 border-t" />');

    return `<div class="prose prose-slate dark:prose-invert max-w-none"><p class="my-3">${html}</p></div>`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </Button>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={categoryInfo.color}>
              {categoryInfo.icon} {categoryInfo.label}
            </Badge>
            <Badge variant="outline">v{doc.version}</Badge>
          </div>
          <h1 className="text-2xl font-bold">{doc.title}</h1>
          {doc.summary && (
            <p className="text-muted-foreground mt-2">{doc.summary}</p>
          )}
        </div>
      </div>

      {/* Métadonnées */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {doc.author && (
          <span>Par {doc.author}</span>
        )}
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {new Date(doc.updated_at).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>

      {/* Tags */}
      {doc.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="h-4 w-4 text-muted-foreground" />
          {doc.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <Separator />

      {/* Contenu */}
      <ScrollArea className="h-[calc(100vh-350px)]">
        <div
          className="pr-4"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(doc.content_md) }}
        />
      </ScrollArea>
    </div>
  );
}

// =============================================================================
// COMPOSANT PRINCIPAL
// =============================================================================

export function DocumentationPanel() {
  const [docs, setDocs] = useState<DocumentationListItem[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Documentation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Charger la liste
  useEffect(() => {
    loadDocs();
  }, []);

  async function loadDocs() {
    setIsLoading(true);
    const data = await documentationService.getList();
    setDocs(data);
    setIsLoading(false);
  }

  async function handleSelectDoc(slug: string) {
    const doc = await documentationService.getBySlug(slug);
    setSelectedDoc(doc);
  }

  async function handleSearch() {
    if (!searchQuery.trim()) {
      loadDocs();
      return;
    }
    const results = await documentationService.search(searchQuery);
    setDocs(results);
  }

  // Grouper par catégorie
  const docsByCategory = docs.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<DocumentationCategory, DocumentationListItem[]>);

  // Vue détaillée d'un article
  if (selectedDoc) {
    return (
      <DocViewer
        doc={selectedDoc}
        onBack={() => setSelectedDoc(null)}
      />
    );
  }

  // Vue liste
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Documentation</h1>
        <p className="text-muted-foreground">
          Guides techniques et fonctionnels de PuzzlApp Brain
        </p>
      </div>

      {/* Recherche */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans la documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch} variant="secondary">
          Rechercher
        </Button>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : docs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {searchQuery
                ? 'Aucun résultat pour cette recherche'
                : 'Aucune documentation disponible'}
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Liste par catégorie */
        <div className="grid gap-6 md:grid-cols-2">
          {(Object.keys(DOCUMENTATION_CATEGORIES) as DocumentationCategory[]).map((category) => (
            <CategoryCard
              key={category}
              category={category}
              docs={docsByCategory[category] || []}
              onSelectDoc={handleSelectDoc}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DocumentationPanel;
