import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  title?: string;
  breadcrumb?: { label: string; href?: string }[];
  isVictorOpen?: boolean;
  onToggleVictor?: () => void;
}

export function AdminHeader({
  title = 'Dashboard',
  breadcrumb,
  isVictorOpen = false,
  onToggleVictor,
}: AdminHeaderProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : profile?.email?.substring(0, 2).toUpperCase() || 'AD';

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-6">
      {/* Navigation rapide */}
      <div className="flex items-center gap-2 mr-4">
        <Link
          to="/reader"
          className="px-2 py-1 bg-emerald-600 text-white text-xs font-medium rounded hover:bg-emerald-700"
        >
          Lecteur
        </Link>
        <Link
          to="/admin"
          className="px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded"
        >
          Admin
        </Link>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Admin</span>
        {breadcrumb?.map((item, index) => (
          <span key={index} className="flex items-center gap-2">
            <span className="text-muted-foreground">/</span>
            {item.href ? (
              <Link to={item.href} className="hover:underline">
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
          </span>
        ))}
        {!breadcrumb && (
          <>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{title}</span>
          </>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Victor toggle button */}
        {onToggleVictor && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isVictorOpen ? 'default' : 'outline'}
                  size="sm"
                  onClick={onToggleVictor}
                  className={cn(
                    'gap-2',
                    isVictorOpen && 'bg-purple-500 hover:bg-purple-600'
                  )}
                >
                  <Bot className="h-4 w-4" />
                  <span>Victor</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isVictorOpen ? 'Fermer Victor' : 'Ouvrir Victor'}</p>
                <p className="text-xs text-muted-foreground">Ctrl+Shift+V</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <Separator orientation="vertical" className="h-6" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {profile?.full_name && (
                  <p className="font-medium">{profile.full_name}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {profile?.email}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/admin">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/reader">Interface Lecteur</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/settings">Paramètres</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleSignOut}
            >
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
