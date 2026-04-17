# Koprindo n8n Hybrid Workflow Design

Tanggal: 2026-04-17
Status: approved for implementation

## Tujuan
Menyediakan paket workflow n8n modular untuk sistem Koprindo FOX yang mengikuti alur frontend dan implementasi spec repo ini: intake -> monitoring -> exception-aware risk control -> reporting support.

## Prinsip desain
- Orkestrasi utama tetap deterministik dan berbasis rule.
- AI hanya dipakai untuk dua hal: fallback parsing file tidak standar dan ringkasan notifikasi.
- Sumber dengan otoritas tertinggi adalah web app manual upload.
- Google Drive dan SFTP diperlakukan sebagai feeder otomatis dengan prioritas lebih rendah.
- WhatsApp Business Cloud API dipakai langsung untuk eskalasi high dan critical.
- Paket diekspor modular agar mudah diuji dan di-debug per alur.

## Modul workflow
- WF01 - Intake Web App Manual Upload
- WF02 - Intake Google Drive Poller
- WF03 - Intake SFTP Poller
- WF04 - Normalize Validate Batch
- WF05 - AI Fallback Parser
- WF06 - Publish Batch To Web App API
- WF07 - Reconciliation Risk Evaluation
- WF08 - Payment Aging Monitor
- WF09 - WhatsApp Cloud Escalation Router
- WF10 - AI Notification Summary Builder

## Kontrak internal
Semua sumber intake dinormalisasi menjadi envelope yang sama sebelum validasi:
- ingressSource
- sourcePriority
- sourceType
- sourceParty
- channel
- periodMonth
- periodYear
- fileName
- fileExtension
- mimeType
- fileSizeBytes
- fileChecksum
- uploadedBy
- receivedAt
- binaryBase64
- storageRef

Output validasi mengikuti kontrak batch endpoint aplikasi saat ini:
- batchId
- sourceType
- sourceParty
- channel
- periodMonth
- periodYear
- fileName
- fileChecksum
- fileSizeBytes
- records
- qualityScore
- blockingIssueCount
- warningIssueCount
- qualityStatus
- validationStatus
- aiAssisted
- parserMode
- qualityNotes

## Guardrail AI
AI tidak dipakai untuk:
- quality scoring final
- publish decision
- severity decision
- payment aging calculation
- sell-in vs sell-out variance
- dedup final

AI fallback parser wajib mengembalikan JSON schema yang ketat dan tetap melewati validasi pasca-parse. Jika gagal, batch tetap blocked.

AI summary builder hanya menghasilkan teks ringkas 1-2 kalimat. Jika gagal, workflow tetap mengirim fallback summary deterministik.

## Integrasi dengan codebase saat ini
Workflow v1 diselaraskan dengan endpoint yang memang ada di repo:
- /api/intake/batch
- /api/intake/risk-event

Karena helper endpoint seperti preflight duplicate check belum tersedia, paket workflow ini belum memaksakan duplicate registry lintas sumber di level API. Prioritas sumber tetap dicerminkan di desain intake dan dapat diperketat saat endpoint tambahan tersedia.

## Keputusan implementasi penting
Awalnya desain modular memakai Execute Sub-workflow. Untuk artefak ekspor yang lebih portabel, implementasi akhir memakai webhook internal antar-workflow. Ini mengurangi ketergantungan pada workflow ID saat import/export antar instance.
