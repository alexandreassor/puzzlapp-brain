/**
 * Mapper des erreurs Supabase Auth vers des messages utilisateur en français
 */

export type ErrorType = 'error' | 'warning' | 'success' | 'info';

export type ActionType =
  | 'resend_email'
  | 'login'
  | 'reset_password'
  | 'retry'
  | 'contact_support';

export interface AuthErrorResult {
  message: string;
  type: ErrorType;
  action?: {
    label: string;
    type: ActionType;
  };
  secondaryAction?: {
    label: string;
    type: ActionType;
  };
  contactEmail?: string;
}

const SUPPORT_EMAIL = 'contact@puzzlapp.fr';

const ERROR_MAP: Record<string, AuthErrorResult> = {
  'Invalid login credentials': {
    message: 'Email ou mot de passe incorrect. Vérifiez vos identifiants.',
    type: 'error',
  },
  'Email not confirmed': {
    message: 'Votre email n\'est pas encore confirmé. Consultez votre boîte mail ou vérifiez vos spams.',
    type: 'warning',
    action: {
      label: 'Renvoyer l\'email de confirmation',
      type: 'resend_email',
    },
  },
  'User not found': {
    message: 'Email ou mot de passe incorrect. Vérifiez vos identifiants.',
    type: 'error',
  },
  'Invalid email': {
    message: 'L\'adresse email saisie n\'est pas valide.',
    type: 'error',
  },
  'Too many requests': {
    message: 'Trop de tentatives. Veuillez patienter quelques minutes avant de réessayer.',
    type: 'warning',
  },
  'User already registered': {
    message: 'Cette adresse email est déjà utilisée.',
    type: 'warning',
    action: {
      label: 'Se connecter',
      type: 'login',
    },
  },
  'Password should be at least 6 characters': {
    message: 'Le mot de passe doit contenir au moins 6 caractères.',
    type: 'error',
  },
  'Session expired': {
    message: 'Votre session a expiré. Veuillez vous reconnecter.',
    type: 'warning',
    action: {
      label: 'Se reconnecter',
      type: 'login',
    },
  },
  'NetworkError': {
    message: 'Connexion impossible. Vérifiez votre connexion internet et réessayez.',
    type: 'warning',
    action: {
      label: 'Réessayer',
      type: 'retry',
    },
  },
  'Failed to fetch': {
    message: 'Connexion impossible. Vérifiez votre connexion internet et réessayez.',
    type: 'warning',
    action: {
      label: 'Réessayer',
      type: 'retry',
    },
  },
};

const DEFAULT_ERROR: AuthErrorResult = {
  message: 'Une erreur est survenue. Veuillez réessayer.',
  type: 'error',
  action: {
    label: 'Réessayer',
    type: 'retry',
  },
};

export function mapAuthError(errorMessage: string | null | undefined): AuthErrorResult {
  if (!errorMessage) {
    return DEFAULT_ERROR;
  }

  if (ERROR_MAP[errorMessage]) {
    return ERROR_MAP[errorMessage];
  }

  const partialMatch = Object.keys(ERROR_MAP).find(key =>
    errorMessage.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(errorMessage.toLowerCase())
  );

  if (partialMatch) {
    return ERROR_MAP[partialMatch];
  }

  if (
    errorMessage.toLowerCase().includes('network') ||
    errorMessage.toLowerCase().includes('fetch') ||
    errorMessage.toLowerCase().includes('timeout')
  ) {
    return ERROR_MAP['NetworkError'];
  }

  console.warn('[AuthErrorMapper] Erreur non mappée:', errorMessage);
  return DEFAULT_ERROR;
}

export function getPasswordResetSuccessMessage(): AuthErrorResult {
  return {
    message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
    type: 'success',
  };
}

export function getSupportEmail(): string {
  return SUPPORT_EMAIL;
}
