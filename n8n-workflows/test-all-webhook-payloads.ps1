param(
  [ValidateSet("single", "staging", "production")]
  [string]$Environment = "staging",
  [string]$BaseUrl = "http://localhost:5678",
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$payloadFile = Join-Path $PSScriptRoot "KOPRINDO-FOX-webhook-intake-payload-examples.json"
if (-not (Test-Path $payloadFile)) {
  throw "Payload examples file not found: $payloadFile"
}

$payloads = Get-Content -Raw $payloadFile | ConvertFrom-Json

$pathMap = @{
  single = "/webhook/koprindo-fox-e2e-intake"
  staging = "/webhook/koprindo-fox-e2e-intake-staging"
  production = "/webhook/koprindo-fox-e2e-intake-prod"
}

$targetUrl = ($BaseUrl.TrimEnd("/")) + $pathMap[$Environment]
$exampleNames = @("sell_out", "sell_in", "inventory", "payment")

Write-Host "Target environment : $Environment"
Write-Host "Target webhook     : $targetUrl"
Write-Host "Dry run            : $DryRun"

foreach ($name in $exampleNames) {
  $body = $payloads.examples.$name | ConvertTo-Json -Depth 20
  Write-Host ""
  Write-Host "=== Sending payload: $name ==="

  if ($DryRun) {
    Write-Host $body
    continue
  }

  try {
    $response = Invoke-RestMethod -Method Post -Uri $targetUrl -ContentType "application/json" -Body $body
    $responseJson = $response | ConvertTo-Json -Depth 10 -Compress
    Write-Host "Response: $responseJson"
  }
  catch {
    Write-Host "Request failed for $name"
    Write-Host $_.Exception.Message
  }
}
