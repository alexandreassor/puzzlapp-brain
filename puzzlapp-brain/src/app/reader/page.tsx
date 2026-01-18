import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ReaderLayout, OnboardingFlow } from '@/components/reader';
import { NotionConnectButton, NotionExportModal, NotionWorkspaceBuilder } from '@/components/reader/notion';
import { useNotionExport, useAgentNotionIntegration, AGENT_NOTION_CONFIG } from '@/hooks';
import { useReaderStore, initializeReaderStore } from '@/stores/readerStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MiniProgress } from '@/components/reader/ProgressBar';
import type { Deliverable, ParcoursWithProgress } from '@/types';

// Données mock pour le développement
const mockParcours: ParcoursWithProgress[] = [
  {
    id: 'avant-vente',
    name: 'Avant-Vente',
    description: 'Transformez votre approche commerciale avec Sophie',
    agent_type: 'sophie',
    sections: ['s1', 's2', 's3', 's4', 's5'],
    created_at: new Date().toISOString(),
    progress: 0,
    sectionsCompleted: 0,
    totalSections: 5,
  },
  {
    id: 'onboarding',
    name: 'Onboarding Client',
    description: 'Créez une expérience client mémorable avec Marc',
    agent_type: 'marc',
    sections: ['s6', 's7', 's8'],
    created_at: new Date().toISOString(),
    progress: 0,
    sectionsCompleted: 0,
    totalSections: 3,
  },
];

export function ReaderPage() {
  const { profile } = useAuth();
  const { isConnected, connection } = useNotionExport();
  useAgentNotionIntegration();

  // Reader store pour l'onboarding et l'instance active
  const { onboardingCompleted, setOnboardingCompleted } = useReaderStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialiser le store au montage
  useEffect(() => {
    initializeReaderStore().then(() => {
      setIsInitialized(true);
    });
  }, []);

  const [showExportModal, setShowExportModal] = useState(false);
  const [showWorkspaceBuilder, setShowWorkspaceBuilder] = useState(false);
  const [workspaceBuilderConfig, setWorkspaceBuilderConfig] = useState<{
    templateId: string;
    agentName: string;
    agentEmoji: string;
  } | null>(null);
  const [currentParcoursId, setCurrentParcoursId] = useState<string | undefined>();
  const [currentSectionId, setCurrentSectionId] = useState<string | undefined>();

  // TODO: Récupérer les vrais livrables depuis la base de données
  const mockDeliverables: Deliverable[] = [];

  // TODO: Récupérer les vrais parcours depuis la base de données
  const parcours = mockParcours;

  const handleExportComplete = (result: { success: boolean; databaseUrl?: string }) => {
    setShowExportModal(false);
    if (result.success && result.databaseUrl) {
      window.open(result.databaseUrl, '_blank');
    }
  };

  // Ouvrir le builder Notion depuis un agent
  const handleOpenWorkspaceBuilder = (agentType: 'leo' | 'sophie' | 'marc') => {
    const agent = AGENT_NOTION_CONFIG[agentType];
    setWorkspaceBuilderConfig({
      templateId: agent.defaultTemplate,
      agentName: agent.name,
      agentEmoji: agent.emoji,
    });
    setShowWorkspaceBuilder(true);
  };

  const handleSelectParcours = (parcoursId: string) => {
    setCurrentParcoursId(parcoursId);
    // Sélectionner la première section du parcours
    const selected = parcours.find(p => p.id === parcoursId);
    if (selected && selected.sections.length > 0) {
      setCurrentSectionId(selected.sections[0]);
    }
  };

  const handleSelectSection = (sectionId: string) => {
    setCurrentSectionId(sectionId);
  };

  // Afficher un loader pendant l'initialisation
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  // Afficher l'onboarding si non complété
  if (!onboardingCompleted) {
    return <OnboardingFlow onComplete={() => setOnboardingCompleted(true)} />;
  }

  return (
    <ReaderLayout
      parcours={parcours}
      currentParcoursId={currentParcoursId}
      currentSectionId={currentSectionId}
      onSelectParcours={handleSelectParcours}
      onSelectSection={handleSelectSection}
    >
      {/* Contenu principal */}
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Si aucun parcours sélectionné → Dashboard */}
        {!currentParcoursId ? (
          <DashboardView
            profile={profile}
            parcours={parcours}
            deliverables={mockDeliverables}
            isNotionConnected={isConnected}
            notionConnection={connection}
            onSelectParcours={handleSelectParcours}
            onOpenExportModal={() => setShowExportModal(true)}
            onOpenWorkspaceBuilder={handleOpenWorkspaceBuilder}
          />
        ) : (
          /* Si parcours sélectionné → Vue lecture */
          <ReadingView
            parcoursId={currentParcoursId}
            sectionId={currentSectionId}
            parcours={parcours}
          />
        )}
      </div>

      {/* Modal d'export Notion */}
      <NotionExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        deliverables={mockDeliverables}
        parcoursName={parcours.find(p => p.id === currentParcoursId)?.name ?? 'Mon parcours'}
        onExportComplete={handleExportComplete}
      />

      {/* Modal de création d'espace Notion (via agent) */}
      {workspaceBuilderConfig && (
        <NotionWorkspaceBuilder
          isOpen={showWorkspaceBuilder}
          onClose={() => {
            setShowWorkspaceBuilder(false);
            setWorkspaceBuilderConfig(null);
          }}
          templateId={workspaceBuilderConfig.templateId}
          agentName={workspaceBuilderConfig.agentName}
          agentEmoji={workspaceBuilderConfig.agentEmoji}
          deliverables={mockDeliverables}
        />
      )}
    </ReaderLayout>
  );
}

// Vue Dashboard (accueil)
interface DashboardViewProps {
  profile: any;
  parcours: ParcoursWithProgress[];
  deliverables: Deliverable[];
  isNotionConnected: boolean;
  notionConnection: any;
  onSelectParcours: (id: string) => void;
  onOpenExportModal: () => void;
  onOpenWorkspaceBuilder: (agentType: 'leo' | 'sophie' | 'marc') => void;
}

function DashboardView({
  profile,
  parcours,
  deliverables,
  isNotionConnected,
  notionConnection,
  onSelectParcours,
  onOpenExportModal,
  onOpenWorkspaceBuilder,
}: DashboardViewProps) {
  // Agent icons par type
  const agentInfo: Record<string, { emoji: string; name: string; color: string }> = {
    leo: { emoji: '🤖', name: 'Léo', color: 'bg-blue-500/10 border-blue-500/20' },
    sophie: { emoji: '👩‍💼', name: 'Sophie', color: 'bg-purple-500/10 border-purple-500/20' },
    marc: { emoji: '👨‍💼', name: 'Marc', color: 'bg-amber-500/10 border-amber-500/20' },
  };

  return (
    <div className="space-y-8">
      {/* Header de bienvenue */}
      <div>
        <h1 className="text-2xl font-bold">
          Bienvenue, {profile?.full_name || 'Lecteur'} !
        </h1>
        <p className="text-muted-foreground mt-1">
          Découvrez comment transformer la gestion des connaissances de votre cabinet.
        </p>
      </div>

      {/* Parcours disponibles */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Parcours disponibles</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {parcours.map((p) => {
            const agent = p.agent_type ? agentInfo[p.agent_type] : null;

            return (
              <Card
                key={p.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => onSelectParcours(p.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${agent?.color ?? 'bg-muted'}`}>
                      <span className="text-2xl">{agent?.emoji ?? '📚'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{p.name}</h3>
                        {p.progress === 100 && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Terminé
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {agent ? `Avec ${agent.name}` : ''} — {p.totalSections} sections
                      </p>
                      <div className="mt-3">
                        <MiniProgress value={p.progress} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Agent Léo */}
      <section>
        <Card className="bg-accent/50 border-accent">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Léo — Orchestrateur KM</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Votre guide personnel pour la transformation KM. Posez-lui vos questions sur la stratégie, le modèle SECI, ou le Crash Test.
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm">
                    Discuter avec Léo
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onOpenWorkspaceBuilder('leo')}
                  >
                    <NotionIcon className="w-4 h-4 mr-1" />
                    Créer mon espace Notion
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Mes livrables */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Mes livrables</h2>
          {deliverables.length > 0 && (
            <Button onClick={onOpenExportModal} size="sm" variant="outline">
              <NotionIcon className="w-4 h-4 mr-2" />
              Exporter vers Notion
            </Button>
          )}
        </div>

        {deliverables.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                Vos livrables apparaîtront ici au fur et à mesure de votre progression.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* TODO: Afficher les livrables */}
          </div>
        )}
      </section>

      {/* Section Notion */}
      <section>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center">
                <NotionIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Exportez vers Notion</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Connectez votre workspace Notion pour sauvegarder automatiquement vos livrables KM.
                  Gardez le contrôle de vos données dans votre propre espace.
                </p>
                <div className="mt-3">
                  <NotionConnectButton />
                </div>
                {isNotionConnected && notionConnection && (
                  <p className="text-xs text-muted-foreground mt-2">
                    ✓ Connecté à {notionConnection.workspace_name}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

// Vue Lecture (quand un parcours est sélectionné)
interface ReadingViewProps {
  parcoursId: string;
  sectionId?: string;
  parcours: ParcoursWithProgress[];
}

function ReadingView({ parcoursId, sectionId, parcours }: ReadingViewProps) {
  const currentParcours = parcours.find(p => p.id === parcoursId);

  if (!currentParcours) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Parcours non trouvé</p>
      </div>
    );
  }

  // TODO: Récupérer le contenu de la section depuis la base de données
  return (
    <div className="space-y-6">
      {/* Header de la section */}
      <div className="border-b pb-4">
        <Badge variant="outline" className="mb-2">
          {currentParcours.name}
        </Badge>
        <h1 className="text-2xl font-bold">
          {sectionId ? `Section ${currentParcours.sections.indexOf(sectionId) + 1}` : 'Introduction'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {currentParcours.description}
        </p>
      </div>

      {/* Contenu de la section (placeholder) */}
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground">
          Le contenu de cette section sera chargé depuis la base de données.
        </p>
        <p>
          Pour l'instant, c'est un placeholder. L'éditeur TipTap de l'interface Admin
          permettra de créer le contenu qui sera affiché ici avec un rendu riche.
        </p>

        <div className="my-8 p-6 bg-muted/50 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">🎮 Jeu Design Thinking</h3>
          <p className="text-sm text-muted-foreground">
            Un jeu interactif sera intégré ici pour mettre en pratique les concepts appris.
          </p>
          <Button className="mt-4" variant="outline">
            Lancer le jeu
          </Button>
        </div>
      </div>

      {/* Navigation section */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button variant="outline" disabled>
          ← Section précédente
        </Button>
        <Button>
          Section suivante →
        </Button>
      </div>
    </div>
  );
}

// Icône Notion
function NotionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 3.5c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5-3.5 1.57-3.5 3.5zm5 0c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z"/>
    </svg>
  );
}
