# N8N Workflow Docs

Paket workflow n8n terbaru untuk repo ini sekarang ada di folder `n8n-workflows/` dan bundle `koprindo_n8n_workflows.json`.

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

Jadi setelah import, attach credential nyata ke node-node terkait sebelum aktivasi.

## Catatan penting
- AI dipakai hanya di `WF05` dan `WF10`.
- Publish batch mengikuti endpoint Next.js yang ada di repo saat ini.
- Risk event juga mengikuti endpoint Next.js yang ada.
- Paket ini valid sebagai JSON, tetapi tetap membutuhkan credential dan env var agar bisa dijalankan di instance nyata.
