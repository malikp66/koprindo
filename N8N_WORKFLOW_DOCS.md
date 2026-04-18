# N8N Workflow Docs

Paket workflow n8n terbaru untuk repo ini sekarang ada di folder `n8n-workflows/` dan bundle `koprindo_n8n_workflows.json`.

## Single workflow import
- `n8n-workflows/KOPRINDO-FOX-e2e-single-workflow.json`
- `n8n-workflows/KOPRINDO-FOX-e2e-production.json`
- `n8n-workflows/KOPRINDO-FOX-e2e-staging.json`
- `n8n-workflows/KOPRINDO-FOX-webhook-intake-payload-examples.json`
- `n8n-workflows/KOPRINDO-FOX-webhook-test-requests.md`
- `n8n-workflows/KOPRINDO-FOX-webhook-postman-collection.json`
- `.env.n8n.example`
- `n8n-workflows/test-all-webhook-payloads.ps1`
- `n8n-workflows/test-all-webhook-payloads.sh`
- `n8n-workflows/README-IMPORT-OPERATOR.md`
- `n8n-workflows/GO-LIVE-CHECKLIST-STAGING-TO-PRODUCTION.md`
- `n8n-workflows/VERIFY-WEBHOOK-INSERTS.sql`
- `n8n-workflows/templates/README-DATA-TEMPLATES.md`
- `n8n-workflows/templates/*.csv`

Workflow ini adalah versi satu file yang bisa langsung di-import sebagai orkestrator utama. Berbeda dari paket modular lama, versi ini:
- menulis langsung ke Postgres agar tidak tergantung endpoint intake Next.js yang masih belum konsisten dengan enum database saat ini
- mendukung `Webhook Intake`, `Manual Trigger`, dan `Daily Risk Sweep`
- menangani intake `sell_in`, `sell_out`, `inventory`, dan `payment`
- membentuk risk event langsung ke tabel `risk_event`
- opsional mengirim eskalasi ke WhatsApp Cloud API untuk severity `high` dan `critical`

Environment variable yang disarankan untuk workflow single-file:
- `DEFAULT_SOURCE_TYPE`
- `DEFAULT_SOURCE_PARTY`
- `DEFAULT_CHANNEL`
- `DEFAULT_PERIOD_MONTH`
- `DEFAULT_PERIOD_YEAR`
- `KOPRINDO_STOCKOUT_THRESHOLD`
- `KOPRINDO_OVERSTOCK_THRESHOLD`
- `KOPRINDO_RECON_WARNING_THRESHOLD`
- `KOPRINDO_RECON_HIGH_THRESHOLD`
- `KOPRINDO_RECON_CRITICAL_THRESHOLD`
- `KOPRINDO_PAYMENT_HIGH_DAYS`
- `KOPRINDO_PAYMENT_CRITICAL_DAYS`
- `META_WABA_API_VERSION`
- `META_WABA_PHONE_NUMBER_ID`
- `META_WABA_ACCESS_TOKEN`
- `OPS_WA_RECIPIENT_HIGH`
- `OPS_WA_RECIPIENT_CRITICAL`

Default threshold yang sekarang dipakai sebagai baseline FOX:
- `KOPRINDO_STOCKOUT_THRESHOLD=120`
- `KOPRINDO_OVERSTOCK_THRESHOLD=2800`
- `KOPRINDO_RECON_WARNING_THRESHOLD=0.10`
- `KOPRINDO_RECON_HIGH_THRESHOLD=0.20`
- `KOPRINDO_RECON_CRITICAL_THRESHOLD=0.35`
- `KOPRINDO_PAYMENT_HIGH_DAYS=10`
- `KOPRINDO_PAYMENT_CRITICAL_DAYS=30`

Pemisahan environment:
- `KOPRINDO-FOX-e2e-production.json` memakai webhook path `/webhook/koprindo-fox-e2e-intake-prod` dan env WhatsApp utama.
- `KOPRINDO-FOX-e2e-staging.json` memakai webhook path `/webhook/koprindo-fox-e2e-intake-staging` dan env WhatsApp terpisah.
- Untuk staging, siapkan env berikut bila mau mengaktifkan eskalasi:
  `STAGING_META_WABA_API_VERSION`, `STAGING_META_WABA_PHONE_NUMBER_ID`, `STAGING_META_WABA_ACCESS_TOKEN`, `STAGING_OPS_WA_RECIPIENT_HIGH`, `STAGING_OPS_WA_RECIPIENT_CRITICAL`

## Isi paket
- `WF01-intake-web-app-manual-upload.json`
- `WF02-intake-google-drive-poller.json`
- `WF03-intake-sftp-poller.json`
- `WF04-normalize-validate-batch.json`
- `WF05-ai-fallback-parser.json`
- `WF06-publish-batch-to-web-app-api.json`
- `WF07-reconciliation-risk-evaluation.json`
- `WF08-payment-aging-monitor.json`
- `WF09-whatsapp-cloud-escalation-router.json`
- `WF10-ai-notification-summary-builder.json`

## Cara import
Untuk import lewat UI n8n, pakai file JSON individual di folder `n8n-workflows/`.

Untuk import massal via CLI/API, pakai `koprindo_n8n_workflows.json` yang berisi array workflow export.

## Environment variables
Set minimal environment variable berikut di instance n8n Anda:
- `N8N_INTERNAL_WEBHOOK_BASE_URL`
- `KOPRINDO_WEBAPP_BASE_URL`
- `KOPRINDO_WEBAPP_API_KEY`
- `GOOGLE_DRIVE_SHARED_FOLDER_ID`
- `SFTP_INBOUND_PATH`
- `DEFAULT_SOURCE_TYPE`
- `DEFAULT_SOURCE_PARTY`
- `DEFAULT_CHANNEL`
- `DEFAULT_PERIOD_MONTH`
- `DEFAULT_PERIOD_YEAR`
- `OPENAI_API_KEY`
- `OPENAI_MODEL_PARSER`
- `OPENAI_MODEL_SUMMARY`
- `META_WABA_API_VERSION`
- `META_WABA_PHONE_NUMBER_ID`
- `META_WABA_ACCESS_TOKEN`
- `OPS_WA_RECIPIENT_HIGH`
- `OPS_WA_RECIPIENT_CRITICAL`

## Kredensial n8n yang perlu dihubungkan
Workflow menggunakan node native untuk:
- Google Drive
- SFTP/FTP
- Postgres

Untuk workflow single-file, yang wajib hanya:
- Postgres

Opsional:
- HTTP outbound ke WhatsApp Cloud API

Jadi setelah import, attach credential nyata ke node-node terkait sebelum aktivasi.

## Catatan penting
- AI dipakai hanya di `WF05` dan `WF10`.
- Publish batch mengikuti endpoint Next.js yang ada di repo saat ini.
- Risk event juga mengikuti endpoint Next.js yang ada.
- Paket ini valid sebagai JSON, tetapi tetap membutuhkan credential dan env var agar bisa dijalankan di instance nyata.
