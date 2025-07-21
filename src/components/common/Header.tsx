import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  showBackButton?: boolean;
}

export function Header({ showBackButton = true }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="hover:bg-accent"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="gap-2 font-semibold text-lg hover:bg-accent"
            >
              <Home className="h-5 w-5" />
              EduVest IA
            </Button>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/calendario")}
              className="hover:text-primary"
            >
              Calendário
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/simulados")}
              className="hover:text-primary"
            >
              Simulados
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/questoes")}
              className="hover:text-primary"
            >
              Questões
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}