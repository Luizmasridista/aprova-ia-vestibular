# APROVA.AE - Plataforma de Estudos para Vestibulares

## Visão Geral

O APROVA.AE é uma plataforma de estudos personalizados para vestibulares que utiliza IA para criar planos de estudo adaptados às necessidades de cada aluno.

## Configuração do Ambiente

### Pré-requisitos

- Node.js 16+ e npm
- Conta no Supabase
- Conta em um serviço de e-mail (como SendGrid, Mailgun, etc.)

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

# Configurações de e-mail (para desenvolvimento)
SMTP_HOST=smtp.seu-provedor.com
SMTP_PORT=587
SMTP_USER=seu-email@exemplo.com
SMTP_PASS=sua-senha
SMTP_FROM=noreply@seu-dominio.com
SMTP_FROM_NAME="APROVA.AE"
```

### Configuração do Supabase

1. Crie um novo projeto no [Supabase](https://supabase.com/)
2. Habilite o provedor de autenticação por e-mail/senha
3. Configure as URLs de redirecionamento no painel do Supabase:
   - `http://localhost:5173/auth/callback` (desenvolvimento)
   - `https://seu-dominio.com/auth/callback` (produção)
   - `http://localhost:5173/reset-password` (redefinição de senha)
   - `https://seu-dominio.com/reset-password` (redefinição de senha em produção)

4. Execute as migrações SQL para configurar os templates de e-mail:
   - Execute o script `supabase/migrations/20240721210000_email_templates.sql` no SQL Editor do Supabase
   - Atualize as configurações de SMTP com suas credenciais reais

## Desenvolvimento

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/aprova-ae.git
   cd aprova-ae
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse a aplicação em [http://localhost:5173](http://localhost:5173)

## Estrutura do Projeto

- `/src/components` - Componentes reutilizáveis
- `/src/pages` - Páginas da aplicação
- `/src/lib` - Utilitários e configurações
- `/src/hooks` - Custom React Hooks
- `/src/types` - Definições de tipos TypeScript
- `/public` - Arquivos estáticos

## Funcionalidades

- Autenticação de usuários com e-mail/senha
- Redefinição de senha
- Geração de plano de estudos personalizado com IA
- Acompanhamento de progresso
- Simulados e questões
- Calendário de estudos

## Licença

MIT

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/10380fce-41fc-43c2-8b4c-e0a6df9556fc) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/10380fce-41fc-43c2-8b4c-e0a6df9556fc) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
