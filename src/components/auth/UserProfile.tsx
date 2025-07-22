import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { User } from '@supabase/supabase-js';

export function UserProfile() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  // Extrai as iniciais do nome do usuário para o avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0] || '')
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const userMetadata = (user as User).user_metadata as { full_name?: string } | null;
  const userEmail = (user as User).email || '';
  
  const userInitials = userMetadata?.full_name 
    ? getInitials(userMetadata.full_name)
    : userEmail.substring(0, 2).toUpperCase() || 'US';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userMetadata?.full_name || 'Usuário'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem>
            Configurações
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
