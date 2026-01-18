import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading, profile } = useAuth();
  const location = useLocation();

  // Afficher un loader pendant le chargement de l'auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Rediriger vers login si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si on requiert admin, attendre que le profil soit chargé avant de décider
  if (requireAdmin) {
    // Profil pas encore chargé - afficher un loader
    if (profile === null) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }
    // Profil chargé mais pas admin - rediriger
    if (!isAdmin) {
      return <Navigate to="/reader" replace />;
    }
  }

  return <>{children}</>;
}
