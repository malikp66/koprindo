# Checklist Go-Live Staging ke Production

Dokumen ini dipakai setelah workflow `staging` lolos uji dan sebelum `production` diaktifkan.

## 1. Freeze perubahan

- Pastikan file workflow yang akan dipakai sudah final:
  `KOPRINDO-FOX-e2e-production.json`
- Pastikan threshold bisnis sudah disetujui:
  stockout `120`, overstock `2800`, mismatch warning `10%`, mismatch high `20%`, mismatch critical `35%`, payment high `10 hari`, payment critical `30 hari`
- Jangan ubah workflow production pada hari yang sama dengan aktivasi tanpa alasan kuat.

## 2. Validasi staging terakhir

- Import file `KOPRINDO-FOX-e2e-staging.json` berhasil tanpa error.
- Semua node `Postgres` di staging sudah memakai credential yang benar.
- Minimal 4 payload contoh sudah lolos di staging:
  `sell_in`, `sell_out`, `inventory`, `payment`
- Tabel berikut sudah terisi sesuai test:
  `batch_registry`, `data_quality_result`, tabel records, `risk_event`
- Tidak ada execution merah pada run terakhir staging.

## 3. Validasi database production

- Host, port, database, username, dan password production sudah diverifikasi.
- User database production punya akses insert ke:
  `batch_registry`, `data_quality_result`, `sell_in_record`, `sell_out_record`, `inventory_position`, `payment_record`, `risk_event`
- Query baca sederhana ke database production sudah berhasil.
- Jika ada backup policy, pastikan snapshot terakhir tersedia.

## 4. Validasi environment variables production

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

Jika WhatsApp aktif:
- `META_WABA_API_VERSION`
- `META_WABA_PHONE_NUMBER_ID`
- `META_WABA_ACCESS_TOKEN`
- `OPS_WA_RECIPIENT_HIGH`
- `OPS_WA_RECIPIENT_CRITICAL`

## 5. Import workflow production

- Import `KOPRINDO-FOX-e2e-production.json`
- Pastikan nama workflow muncul sebagai:
  `Koprindo FOX - E2E Intake Publish Risk Orchestrator [Production]`
- Pastikan webhook path production adalah:
  `/webhook/koprindo-fox-e2e-intake-prod`
- Pastikan `Daily Risk Sweep` muncul dan schedule benar.

## 6. Smoke test production

Lakukan sebelum `Activate` penuh jika memungkinkan:
- Kirim 1 payload `inventory` kecil ke webhook production
- Pastikan insert berhasil ke `batch_registry`
- Pastikan risk event muncul bila nilai stok melewati threshold
- Pastikan tidak ada duplicate false positive

Jika WhatsApp aktif:
- Gunakan nomor internal test lebih dulu
- Pastikan notifikasi `high`/`critical` tidak terkirim ke nomor operasional yang salah

## 7. Aktivasi production

- Klik `Activate`
- Catat waktu aktivasi
- Catat siapa operator yang melakukan aktivasi
- Catat versi file workflow yang di-import

## 8. Monitoring 30 menit pertama

- Cek execution list di n8n
- Pastikan tidak ada node `Postgres` yang gagal
- Pastikan tidak ada error parsing pada payload pertama
- Jalankan query verifikasi insert
- Pastikan jumlah batch dan records sesuai payload test

## 9. Monitoring hari pertama

- Cek hasil `Daily Risk Sweep`
- Pastikan tidak ada spam risk event duplikat
- Pastikan event `open` hanya muncul untuk item yang memang melewati threshold
- Pastikan tidak ada channel atau source type yang salah mapping

## 10. Rollback trigger

Rollback atau pause workflow jika:
- insert database gagal berulang
- risk event duplikat masif
- webhook menerima payload tetapi records tidak masuk
- notifikasi WhatsApp terkirim ke recipient yang salah

## 11. Rollback minimum

- Pause workflow production
- Alihkan integrasi kembali ke staging atau matikan trigger dari upstream
- Dokumentasikan batch terakhir yang berhasil
- Simpan error execution terakhir
- Perbaiki env/credential/workflow sebelum aktif ulang
