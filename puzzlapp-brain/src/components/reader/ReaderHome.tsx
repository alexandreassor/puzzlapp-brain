/**
 * Dashboard principal de l'interface Reader
 */

import { Link } from 'react-router-dom';
import { useReaderStore } from '@/stores/readerStore';
import { CabinetCard } from './CabinetCard';
import { useAuth } from '@/context/AuthContext';

export function ReaderHome() {
  const { profile } = useAuth();
  const { activeInstance } = useReaderStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Titre de bienvenue */}
      <div>
        <h1 className="text-2xl font-bold">
          Bienvenue, {profile?.full_name || 'Lecteur'} !
        </h1>
        <p className="text-muted-foreground mt-1">
          Découvrez comment transformer la gestion des connaissances de votre cabinet.
        </p>
      </div>

      {/* Cabinet actif */}
      {activeInstance && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Votre cabinet de travail</h2>
          <CabinetCard cabinet={activeInstance} />
        </section>
      )}

      {/* Accès rapides */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Que souhaitez-vous faire ?</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Lire le mémoire */}
          <Link
            to="/reader/chapter/1"
            className="p-4 bg-card border rounded-lg hover:border-primary transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                📖
              </div>
              <div>
                <h3 className="font-semibold">Lire le mémoire</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Commencer ou reprendre votre lecture
                </p>
              </div>
            </div>
          </Link>

          {/* Faire un diagnostic */}
          <Link
            to="/reader/games/diagnostic"
            className="p-4 bg-card border rounded-lg hover:border-primary transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                🎯
              </div>
              <div>
                <h3 className="font-semibold">Diagnostic KMMM</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Évaluer la maturité KM de votre cabinet
                </p>
              </div>
            </div>
          </Link>

          {/* Crash Test */}
          <Link
            to="/reader/games/crash-test"
            className="p-4 bg-card border rounded-lg hover:border-primary transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                💥
              </div>
              <div>
                <h3 className="font-semibold">Crash Test KM</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Simuler un départ clé
                </p>
              </div>
            </div>
          </Link>

          {/* Créer un persona */}
          <Link
            to="/reader/games/persona"
            className="p-4 bg-card border rounded-lg hover:border-primary transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                👤
              </div>
              <div>
                <h3 className="font-semibold">Créer un Persona</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Identifier les profils types
                </p>
              </div>
            </div>
          </Link>

          {/* Parler à Léo */}
          <Link
            to="/reader/agent/leo"
            className="p-4 bg-card border rounded-lg hover:border-primary transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                🤖
              </div>
              <div>
                <h3 className="font-semibold">Parler à Léo</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Votre conseiller stratégie KM
                </p>
              </div>
            </div>
          </Link>

          {/* Mes livrables */}
          <Link
            to="/reader/export"
            className="p-4 bg-card border rounded-lg hover:border-primary transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                📦
              </div>
              <div>
                <h3 className="font-semibold">Mes livrables</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Voir et exporter mes résultats
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Conseil du jour */}
      <section className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl">
            💡
          </div>
          <div>
            <h3 className="font-semibold">Conseil de Léo</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Commencez par le Diagnostic KMMM pour avoir une vision claire de la maturité
              KM actuelle de votre cabinet. C'est la base de toute démarche d'amélioration !
            </p>
            <Link
              to="/reader/games/diagnostic"
              className="inline-block mt-3 text-sm text-primary font-medium hover:underline"
            >
              Lancer le diagnostic →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats rapides */}
      {activeInstance && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Vue d'ensemble du cabinet</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 bg-card border rounded-lg text-center">
              <p className="text-3xl font-bold text-primary">
                {activeInstance.employees_count}
              </p>
              <p className="text-sm text-muted-foreground">Collaborateurs</p>
            </div>
            <div className="p-4 bg-card border rounded-lg text-center">
              <p className="text-3xl font-bold text-amber-600">
                {activeInstance.kmmm_score.toFixed(1)}/5
              </p>
              <p className="text-sm text-muted-foreground">Score KMMM</p>
            </div>
            <div className="p-4 bg-card border rounded-lg text-center">
              <p className="text-3xl font-bold text-red-600">
                {activeInstance.crash_test_score}%
              </p>
              <p className="text-sm text-muted-foreground">Crash Test</p>
            </div>
            <div className="p-4 bg-card border rounded-lg text-center">
              <p className="text-3xl font-bold text-purple-600">
                {activeInstance.challenges.length}
              </p>
              <p className="text-sm text-muted-foreground">Défis identifiés</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default ReaderHome;
