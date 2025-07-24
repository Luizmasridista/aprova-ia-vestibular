@echo off

REM Google Calendar credentials
set VITE_GOOGLE_CLIENT_ID=487233347456-uvfdhq6tugm1kv5s0a30krg5nvbon2hd.apps.googleusercontent.com
set VITE_GOOGLE_API_KEY=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

echo Criando arquivo .env com credenciais...
echo.

echo # Google Calendar Integration > .env
echo VITE_GOOGLE_CLIENT_ID=487233347456-uvfdhq6tugm1kv5s0a30krg5nvbon2hd.apps.googleusercontent.com >> .env
echo VITE_GOOGLE_API_KEY=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 >> .env
echo. >> .env
echo # Supabase Integration >> .env
echo VITE_SUPABASE_URL=https://glrdhaihzagnryzmmsuz.supabase.com >> .env
echo VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdscmRoYWloemFnbnJ5em1tc3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMzc0OTQsImV4cCI6MjA2ODcxMzQ5NH0.6jwBiAxBZ83ZWBc0mHEcww8Tm_jAEVv_mNqjYd5xbPA >> .env
echo. >> .env
echo Credenciais configuradas com sucesso! >> .env
echo.
echo Arquivo .env criado com sucesso!
echo.
echo Próximos passos:
echo 1. Execute: npm run dev
echo 2. Acesse o calendário e teste a conexão com Google Calendar
echo 3. Se ainda houver erro, verifique as URIs autorizadas no Google Cloud Console
echo.
pause
