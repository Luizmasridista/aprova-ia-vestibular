import { Loader2 } from 'lucide-react';

export function LoadingScreen({ className = '', size = 8, text = 'Carregando...' }) {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <Loader2 className={`h-${size} w-${size} animate-spin text-blue-600`} />
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingScreen size={12} />
    </div>
  );
}
