import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import AuthCallback from '../AuthCallback';
import { supabase } from '@/integrations/supabase/client';

// Mock do react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: jest.fn(),
  useNavigate: () => jest.fn(),
}));

// Mock do sonner (toast)
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('AuthCallback', () => {
  const mockNavigate = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configura o mock do useSearchParams
    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams(),
      jest.fn(),
    ]);
    
    // Configura o mock do navigate
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));
    
    // Configura o mock do localStorage
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
    
    // Configura o mock do sessionStorage
    sessionStorage.getItem = jest.fn();
    sessionStorage.setItem = jest.fn();
    sessionStorage.removeItem = jest.fn();
    
    // Configura o mock do window.location
    delete window.location;
    window.location = {
      ...window.location,
      href: 'http://localhost:3000/auth/callback',
      search: '',
      hash: '',
      assign: jest.fn(),
    };
  });

  it('deve mostrar o carregamento inicial', () => {
    render(
      <MemoryRouter>
        <AuthCallback />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Processando autenticação...')).toBeInTheDocument();
  });

  it('deve lidar com erro de autenticação', async () => {
    const errorMessage = 'Erro de autenticação';
    (supabase.auth.setSession as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    
    render(
      <MemoryRouter>
        <AuthCallback />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(`Ocorreu um erro ao processar sua autenticação: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  it('deve lidar com email não confirmado', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      user_metadata: { full_name: 'Test User' },
    };
    
    // Primeira chamada falha com email não confirmado
    (supabase.auth.setSession as jest.Mock)
      .mockRejectedValueOnce(new Error('Email not confirmed'))
      .mockResolvedValueOnce({ data: { session: { user: mockUser } }, error: null });
    
    // Mock para getUser
    (supabase.auth.getUser as jest.Mock).mockResolvedValueOnce({
      data: { user: mockUser },
      error: null,
    });
    
    // Mock para updateUser
    (supabase.auth.updateUser as jest.Mock).mockResolvedValueOnce({
      data: { user: mockUser },
      error: null,
    });
    
    render(
      <MemoryRouter>
        <AuthCallback />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(supabase.auth.getUser).toHaveBeenCalled();
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        data: { email_confirmed_at: expect.any(String) }
      });
    });
  });

  it('deve redirecionar após login bem-sucedido', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      user_metadata: { full_name: 'Test User' },
    };
    
    (supabase.auth.setSession as jest.Mock).mockResolvedValueOnce({
      data: { session: { user: mockUser } },
      error: null,
    });
    
    render(
      <MemoryRouter>
        <AuthCallback />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(supabase.auth.setSession).toHaveBeenCalled();
    });
  });
});
