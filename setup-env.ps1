Write-Host "Criando arquivo .env com credenciais..." -ForegroundColor Cyan

# Google Calendar credentials
$env:VITE_GOOGLE_CLIENT_ID="487233347456-uvfdhq6tugm1kv5s0a30krg5nvbon2hd.apps.googleusercontent.com"
$env:VITE_GOOGLE_API_KEY="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"

$envContent = @"
# Google Calendar Integration
VITE_GOOGLE_CLIENT_ID=487233347456-uvfdhq6tugm1kv5s0a30krg5nvbon2hd.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=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

# Supabase Integration
VITE_SUPABASE_URL=https://glrdhaihzagnryzmmsuz.supabase.com
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdscmRoYWloemFnbnJ5em1tc3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMzc0OTQsImV4cCI6MjA2ODcxMzQ5NH0.6jwBiAxBZ83ZWBc0mHEcww8Tm_jAEVv_mNqjYd5xbPA
"@;

$envContent | Out-File -FilePath .env -Encoding UTF8
Write-Host " Arquivo .env criado com sucesso!" -ForegroundColor Green
Write-Host " Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Execute: npm run dev"
Write-Host "2. Teste a conexão com Google Calendar"
Write-Host "3. Verifique se o erro foi resolvido"
