Write-Host "Running type check before push..." -ForegroundColor Yellow
pnpm typecheck
if ($LASTEXITCODE -ne 0) {
    Write-Host "Type check failed! Push aborted." -ForegroundColor Red
    exit 1
}
Write-Host "Type check passed!" -ForegroundColor Green
