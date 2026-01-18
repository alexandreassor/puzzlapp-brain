import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoginPage } from '@/components/auth/LoginPage';
import { AdminPage } from '@/app/admin/page';
import { ReaderPage } from '@/app/reader/page';

function HomePage() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin' : '/reader'} replace />;
  }

  // Landing page pour les non-connectés
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in-up">
            PuzzlApp Brain
          </h1>
          <p className="text-xl text-muted-foreground mb-8 animate-fade-in-up animation-delay-200">
            Transformez la gestion des connaissances de votre cabinet avec une expérience interactive guidée par l'IA.
          </p>
          <div className="flex gap-4 justify-center animate-fade-in-up animation-delay-400">
            <Link
              to="/login"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Commencer
            </Link>
            <a
              href="#features"
              className="px-6 py-3 border rounded-lg font-medium hover:bg-accent transition-colors"
            >
              En savoir plus
            </a>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-card border rounded-lg">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="font-semibold mb-2">Mémoire Interactif</h3>
            <p className="text-sm text-muted-foreground">
              Un mémoire académique transformé en expérience de lecture guidée avec parcours personnalisés.
            </p>
          </div>

          <div className="p-6 bg-card border rounded-lg">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🎮</span>
            </div>
            <h3 className="font-semibold mb-2">Jeux Design Thinking</h3>
            <p className="text-sm text-muted-foreground">
              Des exercices pratiques pour appliquer les concepts à votre propre cabinet.
            </p>
          </div>

          <div className="p-6 bg-card border rounded-lg">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="font-semibold mb-2">Agents IA</h3>
            <p className="text-sm text-muted-foreground">
              Léo, Sophie et Marc vous accompagnent avec des conseils personnalisés.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected - Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Protected - Reader */}
          <Route
            path="/reader"
            element={
              <ProtectedRoute>
                <ReaderPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
