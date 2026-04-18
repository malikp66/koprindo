# Panduan Import n8n untuk Operator

Dokumen ini ditulis untuk operator yang ingin memasang workflow FOX tanpa perlu membaca detail teknis kode.

## File yang dipakai

Gunakan salah satu file berikut:
- `KOPRINDO-FOX-e2e-staging.json`
- `KOPRINDO-FOX-e2e-production.json`

File pendukung:
- `KOPRINDO-FOX-webhook-intake-payload-examples.json`
- `KOPRINDO-FOX-webhook-postman-collection.json`
- `KOPRINDO-FOX-webhook-test-requests.md`
- `test-all-webhook-payloads.ps1`
- `test-all-webhook-payloads.sh`
- `.env.n8n.example`

## Pilih environment yang benar

Pakai `staging` jika:
- masih tahap uji coba
- ingin cek alur tanpa menyentuh nomor operasional utama
- ingin verifikasi data lebih dulu

Pakai `production` jika:
- workflow sudah lolos uji
- koneksi database sudah benar
- nomor WhatsApp operasional sudah siap dipakai

## Sebelum import

Pastikan 4 hal ini siap:
1. Anda bisa login ke n8n.
2. Database Postgres FOX sudah bisa diakses dari server n8n.
3. Nilai environment variables sudah diisi berdasarkan `.env.n8n.example`.
4. Untuk production atau staging dengan notifikasi aktif, nomor WhatsApp dan access token sudah tersedia.

## Langkah import

1. Buka n8n di browser.
2. Login ke akun operator.
3. Klik `Workflows`.
4. Klik `Import from File`.
5. Pilih salah satu file:
   `KOPRINDO-FOX-e2e-staging.json` atau `KOPRINDO-FOX-e2e-production.json`.
6. Tunggu sampai workflow muncul di canvas.
7. Simpan workflow jika diminta.

## Hubungkan credential database

1. Klik salah satu node `Postgres`.
2. Pada bagian credential, pilih atau buat credential Postgres baru.
3. Isi host, port, database, username, dan password.
4. Klik test connection.
5. Jika berhasil, pakai credential yang sama untuk semua node Postgres di workflow.

## Isi environment variables

Nilai minimal yang harus ada:
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

Jika notifikasi WhatsApp dipakai:
- Production:
  `META_WABA_API_VERSION`, `META_WABA_PHONE_NUMBER_ID`, `META_WABA_ACCESS_TOKEN`, `OPS_WA_RECIPIENT_HIGH`, `OPS_WA_RECIPIENT_CRITICAL`
- Staging:
  `STAGING_META_WABA_API_VERSION`, `STAGING_META_WABA_PHONE_NUMBER_ID`, `STAGING_META_WABA_ACCESS_TOKEN`, `STAGING_OPS_WA_RECIPIENT_HIGH`, `STAGING_OPS_WA_RECIPIENT_CRITICAL`

## Jalankan test pertama

Pilihan paling mudah:

### Opsi A: pakai Postman
1. Import file `KOPRINDO-FOX-webhook-postman-collection.json`.
2. Ubah variable `baseUrl` jika host n8n bukan `http://localhost:5678`.
3. Buka folder `Staging`.
4. Jalankan request `Sell Out`.
5. Jika berhasil, lanjutkan `Sell In`, `Inventory`, dan `Payment`.

### Opsi B: pakai PowerShell
1. Buka PowerShell di folder repo ini.
2. Jalankan:

```powershell
./n8n-workflows/test-all-webhook-payloads.ps1 -Environment staging
```

Untuk melihat isi request tanpa mengirim:

```powershell
./n8n-workflows/test-all-webhook-payloads.ps1 -Environment staging -DryRun
```

### Opsi C: pakai shell script
1. Pastikan `jq` tersedia.
2. Jalankan:

```bash
bash n8n-workflows/test-all-webhook-payloads.sh staging http://localhost:5678
```

Untuk melihat isi request tanpa mengirim:

```bash
DRY_RUN=1 bash n8n-workflows/test-all-webhook-payloads.sh staging http://localhost:5678
```

## Cek hasil test

Sesudah request dikirim, cek:
1. Workflow execution di n8n tidak merah.
2. Tabel `batch_registry` bertambah.
3. Tabel data terkait bertambah sesuai `sourceType`.
4. Jika ada risiko, tabel `risk_event` bertambah.
5. Untuk severity tinggi, cek apakah WhatsApp terkirim bila fitur itu diaktifkan.

## Aktivasi workflow

Jika test staging sudah benar:
1. Pastikan file production yang di-import adalah `KOPRINDO-FOX-e2e-production.json`.
2. Pastikan env production sudah benar.
3. Pastikan webhook production dipakai aplikasi:
   `/webhook/koprindo-fox-e2e-intake-prod`
4. Klik `Activate`.

## Jika ada masalah

Masalah umum yang paling sering:
- Import gagal:
  file JSON rusak atau belum lengkap
- Execute merah:
  credential Postgres belum benar
- Data tidak masuk:
  payload salah format atau dianggap duplikat
- WhatsApp tidak terkirim:
  env token, phone number ID, atau recipient belum diisi
- Risiko tidak muncul:
  data belum melewati threshold

## Rekomendasi operasional

- Selalu uji di `staging` lebih dulu.
- Jangan aktifkan `production` sebelum credential database lolos test.
- Simpan salinan `.env.n8n.example` yang sudah diisi sebagai referensi internal operator.
