import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth as useAuthHook } from '@/hooks/useAuth';

// Cria o contexto de autenticação
const AuthContext = createContext<ReturnType<typeof useAuthHook> | undefined>(undefined);

// Provider que usa o hook useAuth
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthHook();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
