# FOX Control Tower Frontend

Frontend ini dibangun sebagai representasi operasional dari PRD `Sistem Monitoring & Kontrol Risiko Terpadu` untuk distribusi nasional FOX. Fokus utamanya bukan showcase, tetapi portal kerja yang menampilkan siklus nyata `data intake -> monitoring -> exception control -> reporting`, dengan dashboard manajemen sebagai ringkasan masuk.

## Tujuan Frontend

- Menjadi baseline UI/UX final sebelum integrasi backend, n8n, storage, dan risk engine.
- Memastikan struktur halaman, CTA, hierarchy informasi, dan istilah bisnis sudah sesuai PRD terbaru.
- Menjadi acuan implementasi backend karena alur operasional, state utama, dan kebutuhan data sudah terlihat jelas di frontend.

## Alur Utama Sistem

### 1. Data Intake
Halaman: `/dashboard/upload`

Fungsi:
- registrasi batch per channel dan periode
- validasi schema, mandatory column, dan metadata batch
- quality gate untuk menentukan `published`, `provisional`, atau `blocked`
- batch registry dan lineage awal

Yang perlu dijelaskan saat presentasi:
- setiap file masuk harus memiliki metadata channel, periode, dan PIC
- quality gate memisahkan batch yang siap dipakai dan batch yang masih perlu review
- hasil intake tidak langsung tampil ke executive layer tanpa publish posture yang jelas

### 2. Monitoring
Halaman: `/dashboard/monitoring`

Fungsi:
- membaca `sell-in`, `sell-out`, coverage wilayah, stok, dan payment exposure
- menampilkan keputusan cabang prioritas
- menandai deviasi target, stock risk, dan aging payment
- menyediakan scorecard PKS

Yang perlu dijelaskan saat presentasi:
- monitoring hanya mengonsumsi batch yang sudah lolos quality gate
- cabang berisiko bisa langsung dibaca dari tabel, summary, dan action panel
- payment control tidak berdiri sendiri, tetapi dibaca bersama data distribusi

### 3. Exception Control
Halaman: `/dashboard/retur`

Fungsi:
- menangani retur dan anomali outlet
- mengoreksi `sell-out` efektif
- menjaga hubungan antara exception, branch quality, dan risk posture

Yang perlu dijelaskan saat presentasi:
- exception bukan modul tambahan, tetapi tahap wajib setelah monitoring menemukan anomali
- koreksi exception akan memengaruhi angka operasional yang kemudian masuk ke laporan

### 4. Reports
Halaman: `/dashboard/laporan`

Fungsi:
- menyusun executive pack
- menjaga audit trail distribusi laporan
- mengikat batch source, posture exception, dan status governance ke output laporan

Yang perlu dijelaskan saat presentasi:
- laporan adalah tahap akhir dari siklus operasional
- executive pack hanya menarik data yang posture-nya jelas
- distribution log menjaga akuntabilitas pelaporan lintas pihak

## Alur Manajemen

Halaman: `/dashboard`

Dashboard utama berfungsi sebagai pintu masuk manajemen:
- merangkum sell-out, outlet aktif, revenue, retur, dan performa provinsi
- memberi konteks cepat terhadap siklus operasional aktif
- memudahkan manajemen berpindah ke modul operasional saat ada risiko atau deviasi

Narasi presentasi:
- mulai dari dashboard untuk memberi konteks kinerja nasional
- pindah ke `Data Intake` untuk menunjukkan asal angka
- lanjut ke `Monitoring` untuk membaca implikasi operasional
- masuk ke `Exceptions` untuk koreksi dan tindakan
- tutup di `Reports` untuk menunjukkan output final yang siap dikirim

## Halaman Pendukung

### Governance
Halaman: `/dashboard/admin`

Fungsi:
- approval pengguna
- role mapping
- connector readiness
- policy threshold

Halaman ini bukan bagian utama narasi operasional, tetapi penting untuk menunjukkan bahwa sistem siap dipakai lintas fungsi dengan kontrol akses dan readiness integrasi yang jelas.

## Urutan Presentasi yang Disarankan

1. Buka `/dashboard`
   Jelaskan kondisi nasional, target, dan indikator utama.

2. Masuk ke `/dashboard/upload`
   Jelaskan bagaimana batch masuk, divalidasi, dan dipublish.

3. Pindah ke `/dashboard/monitoring`
   Tunjukkan bagaimana batch yang sudah lolos dipakai untuk membaca performa, risiko, dan payment.

4. Pindah ke `/dashboard/retur`
   Tunjukkan bagaimana exception mengoreksi sell-out efektif dan menjaga kualitas data operasional.

5. Tutup di `/dashboard/laporan`
   Jelaskan bagaimana laporan dibentuk dari data yang sudah punya posture jelas.

6. Jika diperlukan, buka `/dashboard/admin`
   Tunjukkan governance, role, dan readiness integrasi.

## Mapping ke PRD

- `Data Intake & Validation` -> `/dashboard/upload`
- `Monitoring & Reconciliation` -> `/dashboard/monitoring`
- `Risk Control Engine` -> `/dashboard/monitoring` dan `/dashboard/retur`
- `Reporting & Governance` -> `/dashboard/laporan` dan `/dashboard/admin`
- `Norma PKS / tanggung jawab para pihak` -> tercermin di monitoring, payment, reporting, dan governance

## Prinsip UI/UX yang Dikunci

- semua halaman memakai shell yang sama dan komponen shadcn/Tailwind yang konsisten
- tipografi desktop menggunakan ukuran yang lebih tegas; `text-sm` dipakai untuk supporting text
- CTA harus mengarah ke tindakan operasional yang jelas, bukan label presentasi
- copy harus terdengar seperti sistem kerja aktif, bukan prototype atau landing page
- setiap halaman inti harus menunjukkan posisi user di dalam siklus operasional

## Status Saat Ini

Frontend sudah difinalkan untuk:
- struktur navigasi
- hierarchy informasi
- istilah bisnis utama
- alur operasional lintas halaman
- state global role, period, dan channel
- drawer/detail panel untuk penjelasan konteks tanpa memutus alur

Frontend belum menghubungkan:
- API backend
- orchestrator n8n
- parser/storage service
- risk engine rule execution
- autentikasi dan approval persistence

## Implikasi untuk Implementasi Backend

Backend sebaiknya mengikuti kontrak dan flow frontend ini:
- intake menghasilkan batch registry dan publish posture
- monitoring membaca hanya batch yang boleh dikonsumsi
- exception memperbarui sell-out efektif dan risk posture
- reporting menarik data yang sudah melewati quality gate dan review yang relevan
- governance mengontrol akses, distribusi laporan, dan readiness integrasi

Jika backend mengikuti struktur ini, transisi dari frontend readiness ke sistem operasional penuh akan jauh lebih rapi karena struktur user flow, informasi, dan state utama sudah dikunci di frontend.
