@echo off
echo.
echo ========================================
echo   APROVA.AE - Google Calendar Setup
echo ========================================
echo.
echo Abrindo Google Console para habilitar API...
echo.
echo PASSO 1: Habilitar Google Calendar API
start "" "https://console.cloud.google.com/apis/library/calendar.googleapis.com"
timeout /t 3 /nobreak >nul

echo PASSO 2: Verificar Credenciais OAuth
start "" "https://console.cloud.google.com/apis/credentials"
timeout /t 3 /nobreak >nul

echo PASSO 3: Configurar Tela de Consentimento
start "" "https://console.cloud.google.com/apis/credentials/consent"

echo.
echo ========================================
echo   INSTRUÇÕES:
echo ========================================
echo.
echo 1. HABILITE a Google Calendar API
echo 2. VERIFIQUE se o Client ID existe:
echo    487233347456-uvfdhq6tugm1kv5s0a30krg5nvbon2hd.apps.googleusercontent.com
echo 3. CONFIGURE os 3 escopos na tela de consentimento
echo 4. AGUARDE 2-3 minutos para propagação
echo 5. TESTE novamente no APROVA.AE
echo.
echo Pressione qualquer tecla para fechar...
pause >nul
