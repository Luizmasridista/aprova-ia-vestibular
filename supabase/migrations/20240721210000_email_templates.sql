-- Atualiza o template de confirmação de e-mail
UPDATE auth.users
SET confirmation_token = NULL
WHERE confirmation_token IS NOT NULL;

-- Configura o template de confirmação de e-mail
UPDATE auth.providers 
SET 
  confirm_email_template_id = 'confirm',
  email_change_confirm_template_id = 'email-change-confirm',
  recovery_email_template_id = 'recovery'
WHERE id = 'email';

-- Configuração de URL base para os links de confirmação
UPDATE auth.providers
SET url = 'https://seu-dominio.com'
WHERE id = 'email';

-- Template de confirmação de e-mail
INSERT INTO auth.email_templates (id, subject, content, created_at, updated_at)
VALUES (
  'confirm',
  'Confirme seu e-mail para o APROVA.AE',
  '<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Confirme seu e-mail</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background-color: #2563eb; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
      .header h1 { color: white; margin: 0; }
      .content { padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
      .button { display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; margin: 20px 0; }
      .footer { margin-top: 20px; font-size: 12px; color: #6b7280; text-align: center; }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>APROVA.AE</h1>
    </div>
    <div class="content">
      <h2>Olá, {{ .user.name }}!</h2>
      <p>Obrigado por se cadastrar no APROVA.AE. Por favor, confirme seu endereço de e-mail clicando no botão abaixo:</p>
      <div style="text-align: center;">
        <a href="{{ .confirmation_url }}" class="button">Confirmar E-mail</a>
      </div>
      <p>Se você não se cadastrou no APROVA.AE, pode ignorar este e-mail.</p>
      <p>Atenciosamente,<br>Equipe APROVA.AE</p>
      <div class="footer">
        <p>© 2025 APROVA.AE. Todos os direitos reservados.</p>
      </div>
    </div>
  </body>
  </html>',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  subject = EXCLUDED.subject,
  content = EXCLUDED.content,
  updated_at = now();

-- Template de recuperação de senha
INSERT INTO auth.email_templates (id, subject, content, created_at, updated_at)
VALUES (
  'recovery',
  'Redefina sua senha do APROVA.AE',
  '<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Redefinição de Senha</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background-color: #2563eb; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
      .header h1 { color: white; margin: 0; }
      .content { padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
      .button { display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; margin: 20px 0; }
      .footer { margin-top: 20px; font-size: 12px; color: #6b7280; text-align: center; }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>APROVA.AE</h1>
    </div>
    <div class="content">
      <h2>Redefinição de Senha</h2>
      <p>Recebemos uma solicitação para redefinir a senha da sua conta. Se você fez essa solicitação, clique no botão abaixo para criar uma nova senha:</p>
      <div style="text-align: center;">
        <a href="{{ .confirmation_url }}" class="button">Redefinir Senha</a>
      </div>
      <p>Este link é válido por 24 horas. Se você não solicitou a redefinição de senha, ignore este e-mail.</p>
      <p>Atenciosamente,<br>Equipe APROVA.AE</p>
      <div class="footer">
        <p>© 2025 APROVA.AE. Todos os direitos reservados.</p>
      </div>
    </div>
  </body>
  </html>',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  subject = EXCLUDED.subject,
  content = EXCLUDED.content,
  updated_at = now();

-- Template de confirmação de mudança de e-mail
INSERT INTO auth.email_templates (id, subject, content, created_at, updated_at)
VALUES (
  'email-change-confirm',
  'Confirme a alteração do seu e-mail no APROVA.AE',
  '<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Confirmação de Alteração de E-mail</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background-color: #2563eb; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
      .header h1 { color: white; margin: 0; }
      .content { padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
      .button { display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; margin: 20px 0; }
      .footer { margin-top: 20px; font-size: 12px; color: #6b7280; text-align: center; }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>APROVA.AE</h1>
    </div>
    <div class="content">
      <h2>Confirmação de Alteração de E-mail</h2>
      <p>Você solicitou alterar o e-mail da sua conta para {{ .email }}. Para confirmar esta alteração, clique no botão abaixo:</p>
      <div style="text-align: center;">
        <a href="{{ .confirmation_url }}" class="button">Confirmar Alteração de E-mail</a>
      </div>
      <p>Se você não solicitou esta alteração, entre em contato com nosso suporte imediatamente.</p>
      <p>Atenciosamente,<br>Equipe APROVA.AE</p>
      <div class="footer">
        <p>© 2025 APROVA.AE. Todos os direitos reservados.</p>
      </div>
    </div>
  </body>
  </html>',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  subject = EXCLUDED.subject,
  content = EXCLUDED.content,
  updated_at = now();

-- Habilita o envio de e-mails
UPDATE auth.providers
SET is_enabled = true
WHERE id = 'email';

-- Configurações adicionais de e-mail (SMTP)
-- IMPORTANTE: Substitua com suas credenciais SMTP reais
INSERT INTO auth.provider_configs (provider_id, property, value, created_at, updated_at)
VALUES 
  ('email', 'SMTP_HOST', 'smtp.seu-provedor.com', now(), now()),
  ('email', 'SMTP_PORT', '587', now(), now()),
  ('email', 'SMTP_USER', 'seu-email@seu-provedor.com', now(), now()),
  ('email', 'SMTP_PASS', 'sua-senha-segura', now(), now()),
  ('email', 'SMTP_SENDER_NAME', 'APROVA.AE', now(), now()),
  ('email', 'SMTP_SENDER_EMAIL', 'noreply@seu-dominio.com', now(), now())
ON CONFLICT (provider_id, property) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();
