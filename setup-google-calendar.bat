@echo off
echo ========================================
echo APROVA.AE - Configuracao Google Calendar
echo ========================================
echo.

echo Criando arquivo .env com configuracoes do Google Calendar...
echo.

(
echo # Google Calendar Integration
echo VITE_GOOGLE_CLIENT_ID=487233347456-uvfdhq6tugm1kv5s0a30krg5nvbon2hd.apps.googleusercontent.com
echo VITE_GOOGLE_API_KEY=
echo.
echo # Outras configuracoes podem ser adicionadas aqui
echo # VITE_SUPABASE_URL=your_supabase_url_here
echo # VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
) > .env

echo ✅ Arquivo .env criado com sucesso!
echo.
echo 📋 Configuracoes aplicadas:
echo    - Client ID: 487233347456-uvfdhq6tugm1kv5s0a30krg5nvbon2hd.apps.googleusercontent.com
echo    - API Key: (nao necessaria para OAuth2)
echo.
echo 🔧 Proximos passos:
echo    1. Execute 'npm run dev' para iniciar o servidor
echo    2. Acesse a pagina do Calendario
echo    3. Clique em "Conectar com Google Calendar"
echo    4. Use o botao "Testar Conexao" para diagnosticar problemas
echo.
echo 💡 Se houver problemas:
echo    - Verifique se o dominio localhost:5173 esta autorizado no Google Console
echo    - Abra o console do navegador (F12) para ver logs detalhados
echo    - Use a funcao testGoogleCalendar() no console para diagnostico
echo.
pause
