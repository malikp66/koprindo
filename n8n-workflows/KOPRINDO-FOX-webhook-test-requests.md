# KOPRINDO FOX Webhook Test Requests

Gunakan file payload berikut sebagai sumber body request:
- `n8n-workflows/KOPRINDO-FOX-webhook-intake-payload-examples.json`

Base webhook:
- Single template: `http://localhost:5678/webhook/koprindo-fox-e2e-intake`
- Staging: `http://localhost:5678/webhook/koprindo-fox-e2e-intake-staging`
- Production: `http://localhost:5678/webhook/koprindo-fox-e2e-intake-prod`

Catatan:
- Contoh di bawah memakai `jq` agar bisa mengambil subset payload dari file JSON contoh.
- Jika Anda tidak memakai `jq`, copy objek payload terkait ke file JSON terpisah lalu kirim dengan `--data @file.json`.
- Sesuaikan host jika n8n Anda tidak berjalan di `localhost:5678`.

## cURL: sell_out

```bash
curl --request POST "http://localhost:5678/webhook/koprindo-fox-e2e-intake-staging" \
  --header "Content-Type: application/json" \
  --data "$(jq '.examples.sell_out' n8n-workflows/KOPRINDO-FOX-webhook-intake-payload-examples.json)"
```

## cURL: sell_in

```bash
curl --request POST "http://localhost:5678/webhook/koprindo-fox-e2e-intake-staging" \
  --header "Content-Type: application/json" \
  --data "$(jq '.examples.sell_in' n8n-workflows/KOPRINDO-FOX-webhook-intake-payload-examples.json)"
```

## cURL: inventory

```bash
curl --request POST "http://localhost:5678/webhook/koprindo-fox-e2e-intake-staging" \
  --header "Content-Type: application/json" \
  --data "$(jq '.examples.inventory' n8n-workflows/KOPRINDO-FOX-webhook-intake-payload-examples.json)"
```

## cURL: payment

```bash
curl --request POST "http://localhost:5678/webhook/koprindo-fox-e2e-intake-staging" \
  --header "Content-Type: application/json" \
  --data "$(jq '.examples.payment' n8n-workflows/KOPRINDO-FOX-webhook-intake-payload-examples.json)"
```

## PowerShell: sell_out

```powershell
$payload = Get-Content -Raw 'n8n-workflows/KOPRINDO-FOX-webhook-intake-payload-examples.json' | ConvertFrom-Json
$body = $payload.examples.sell_out | ConvertTo-Json -Depth 10
Invoke-RestMethod -Method Post -Uri 'http://localhost:5678/webhook/koprindo-fox-e2e-intake-staging' -ContentType 'application/json' -Body $body
```

## PowerShell: sell_in

```powershell
$payload = Get-Content -Raw 'n8n-workflows/KOPRINDO-FOX-webhook-intake-payload-examples.json' | ConvertFrom-Json
$body = $payload.examples.sell_in | ConvertTo-Json -Depth 10
Invoke-RestMethod -Method Post -Uri 'http://localhost:5678/webhook/koprindo-fox-e2e-intake-staging' -ContentType 'application/json' -Body $body
```

## PowerShell: inventory

```powershell
$payload = Get-Content -Raw 'n8n-workflows/KOPRINDO-FOX-webhook-intake-payload-examples.json' | ConvertFrom-Json
$body = $payload.examples.inventory | ConvertTo-Json -Depth 10
Invoke-RestMethod -Method Post -Uri 'http://localhost:5678/webhook/koprindo-fox-e2e-intake-staging' -ContentType 'application/json' -Body $body
```

## PowerShell: payment

```powershell
$payload = Get-Content -Raw 'n8n-workflows/KOPRINDO-FOX-webhook-intake-payload-examples.json' | ConvertFrom-Json
$body = $payload.examples.payment | ConvertTo-Json -Depth 10
Invoke-RestMethod -Method Post -Uri 'http://localhost:5678/webhook/koprindo-fox-e2e-intake-staging' -ContentType 'application/json' -Body $body
```

## Ganti target environment

Ubah URI berikut sesuai target:
- Single template: `http://localhost:5678/webhook/koprindo-fox-e2e-intake`
- Staging: `http://localhost:5678/webhook/koprindo-fox-e2e-intake-staging`
- Production: `http://localhost:5678/webhook/koprindo-fox-e2e-intake-prod`

## Upload file CSV/XLSX

Untuk test multipart upload, kirim metadata sebagai field form dan file sebagai binary:

```bash
curl --request POST "http://localhost:5678/webhook/koprindo-fox-e2e-intake-staging" \
  --form "sourceType=sell_out" \
  --form "sourceParty=koprindo" \
  --form "channel=alfamart" \
  --form "periodMonth=4" \
  --form "periodYear=2026" \
  --form "uploadedBy=ops-koprindo" \
  --form "data=@C:/path/to/sellout-alfamart-2026-04.xlsx"
```
