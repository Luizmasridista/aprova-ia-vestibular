import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  gradient?: string;
  comingSoon?: boolean;
}

export function FeatureCard({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  gradient = "bg-gradient-primary",
  comingSoon = false 
}: FeatureCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!comingSoon) {
      navigate(href);
    } else if (href === "/estudos") {
      navigate(href); // Allow navigation to the coming soon page
    }
  };
  return (
    <Card className="group relative overflow-hidden border-0 bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-500 hover:-translate-y-2">
      <div className={`absolute top-0 left-0 w-full h-1 ${gradient}`} />
      
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${gradient} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          {comingSoon && (
            <span className="px-2 py-1 text-xs font-medium text-accent-foreground bg-accent rounded-full">
              Em breve
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">{description}</p>
        <Button 
          className="w-full group-hover:bg-primary/90 transition-colors duration-300"
          onClick={handleClick}
        >
          {comingSoon ? 'Ver Detalhes' : 'Acessar'}
        </Button>
      </CardContent>
    </Card>
  );
}