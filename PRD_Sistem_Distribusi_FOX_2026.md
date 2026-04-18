# ENGINEERING-READY SPEC
## Sistem Monitoring & Kontrol Risiko Terpadu FOX 2026
**Web Application Specification**

---

| Atribut | Detail |
|---|---|
| Versi | 5.0 |
| Tanggal | April 2026 |
| Status | Engineering Ready Draft |
| Tujuan Dokumen | Acuan implementasi aplikasi web |
| Audience | Product, UI/UX, Frontend, Backend, QA |
| Klasifikasi | Internal Use Only |

---

## Daftar Isi

1. [Tujuan Dokumen](#1-tujuan-dokumen)
2. [Scope Aplikasi](#2-scope-aplikasi)
3. [Modul Utama](#3-modul-utama)
4. [Role & Permission](#4-role--permission)
5. [Struktur Halaman Web](#5-struktur-halaman-web)
6. [Functional Requirements](#6-functional-requirements)
7. [Entitas Data](#7-entitas-data)
8. [Relasi Data](#8-relasi-data)
9. [API Specification](#9-api-specification)
10. [Backend Rules & Business Logic](#10-backend-rules--business-logic)
11. [Status, Alert, & Severity Model](#11-status-alert--severity-model)
12. [Dashboard Metrics](#12-dashboard-metrics)
13. [Upload & Data Processing Flow](#13-upload--data-processing-flow)
14. [Non-Functional Requirements](#14-non-functional-requirements)
15. [Acceptance Criteria](#15-acceptance-criteria)
16. [Out of Scope](#16-out-of-scope)

---

## 1. Tujuan Dokumen

Dokumen ini bukan dokumen meeting atau presentasi. Dokumen ini adalah spesifikasi teknis untuk membangun **aplikasi web siap pakai** yang sesuai dengan ruang lingkup pada gambar konsep:

1. **Sistem Monitoring Berbasis Dashboard**
2. **Sistem Kontrol Risiko**

Dokumen ini harus cukup detail untuk dijadikan acuan oleh:
- tim frontend dalam membangun halaman dan komponen UI
- tim backend dalam membangun model data, endpoint, dan rule engine
- tim QA dalam menyusun test scenario dan acceptance test

---

## 2. Scope Aplikasi

### 2.1 In-Scope

Aplikasi web harus menyediakan fungsi berikut:
- monitoring `sell-in`
- monitoring `sell-out`
- monitoring distribusi per wilayah
- monitoring `aging payment`
- pembaruan data `near-real-time` berbasis batch publish
- kontrol `sell-out` dan stok
- kontrol pembayaran
- deteksi `overstock`
- deteksi `stockout`
- monitoring arus kas in-scope
- monitoring kepatuhan termin pembayaran

### 2.2 Definisi Real-Time

Dalam spesifikasi ini, `real-time` berarti:
- data dashboard diperbarui otomatis setelah batch valid selesai diproses dan dipublish
- tidak mensyaratkan integrasi live streaming API dari seluruh sumber
- setiap widget dan tabel wajib menampilkan `last_updated_at`

### 2.3 Tujuan Produk

Produk ini harus menjadi aplikasi web operasional yang:
- memberi satu tampilan data untuk distribusi, stok, dan pembayaran
- menampilkan risiko yang perlu ditindaklanjuti
- mendukung keputusan operasional cepat
- menjaga agar angka final dapat diaudit dan diverifikasi ulang

---

## 3. Modul Utama

### 3.1 Monitoring Dashboard

Modul ini menampilkan:
- total `sell-in`
- total `sell-out`
- distribusi per wilayah
- `aging payment`
- status sinkronisasi data

### 3.2 Kontrol Sell-Out & Stok

Modul ini menampilkan:
- perbandingan `sell-in` vs `sell-out`
- posisi stok
- indikator `overstock`
- indikator `stockout`
- prioritas tindak lanjut distribusi

### 3.3 Kontrol Pembayaran

Modul ini menampilkan:
- invoice list
- due date
- aging bucket
- outstanding amount
- payment compliance
- alert keterlambatan pembayaran

### 3.4 Data Intake & Validation

Modul ini menangani:
- upload file sumber
- validasi format dan schema
- deteksi duplikasi
- batch registration
- publish data ke dashboard

### 3.5 Alert & Risk Event

Modul ini menangani:
- pembentukan event risiko
- severity classification
- assignment owner
- update status tindak lanjut

---

## 4. Role & Permission

### 4.1 Role

| Role | Deskripsi |
|---|---|
| `admin` | Mengelola master data, upload, validasi, dan konfigurasi rule |
| `ops` | Memantau distribusi, sell-in, sell-out, stok, dan menindaklanjuti risk event operasional |
| `finance` | Memantau pembayaran, invoice, aging, dan menindaklanjuti risk event pembayaran |
| `management` | Melihat dashboard eksekutif dan status risiko |
| `viewer` | Read-only untuk dashboard sesuai scope akses |

### 4.2 Permission Matrix

| Fitur | admin | ops | finance | management | viewer |
|---|---|---|---|---|---|
| Login | Ya | Ya | Ya | Ya | Ya |
| Lihat dashboard overview | Ya | Ya | Ya | Ya | Ya |
| Lihat monitoring sell-in/sell-out | Ya | Ya | Tidak | Ya | Ya |
| Lihat distribusi wilayah | Ya | Ya | Tidak | Ya | Ya |
| Lihat pembayaran & aging | Ya | Tidak | Ya | Ya | Read-only terbatas |
| Upload file batch | Ya | Ya | Ya | Tidak | Tidak |
| Validasi & publish batch | Ya | Tidak | Tidak | Tidak | Tidak |
| Kelola master wilayah/outlet/SKU | Ya | Tidak | Tidak | Tidak | Tidak |
| Update status risk event operasional | Ya | Ya | Tidak | Tidak | Tidak |
| Update status risk event pembayaran | Ya | Tidak | Ya | Tidak | Tidak |
| Ubah threshold rule | Ya | Tidak | Tidak | Tidak | Tidak |

---

## 5. Struktur Halaman Web

### 5.1 Route Map

| Route | Halaman | Tujuan |
|---|---|---|
| `/login` | Login | Autentikasi pengguna |
| `/dashboard` | Dashboard Overview | Ringkasan monitoring dan risiko |
| `/dashboard/sell-in` | Sell-In Monitoring | Detail data `sell-in` |
| `/dashboard/sell-out` | Sell-Out Monitoring | Detail data `sell-out` |
| `/dashboard/distribution` | Distribution Monitoring | Detail distribusi per wilayah |
| `/dashboard/payments` | Payment Monitoring | Detail aging dan pembayaran |
| `/risk/stock` | Risk Control Sell-Out & Stock | Daftar risiko `overstock` dan `stockout` |
| `/risk/payments` | Risk Control Payments | Daftar risiko pembayaran |
| `/uploads` | Batch Upload Center | Upload file, validasi, publish |
| `/uploads/:batchId` | Batch Detail | Hasil validasi, error, publish status |
| `/events/:eventId` | Risk Event Detail | Detail event, history, owner, status |
| `/master/regions` | Master Wilayah | Master data wilayah |
| `/master/outlets` | Master Outlet | Master data outlet |
| `/master/skus` | Master SKU | Master data SKU |
| `/settings/rules` | Rule Settings | Konfigurasi threshold risiko |

### 5.2 Layout Global

Semua halaman setelah login wajib memiliki:
- top bar
- sidebar navigation
- filter bar kontekstual
- `last updated` indicator
- role-based action button

### 5.3 Dashboard Overview Layout

Komponen wajib:
- kartu KPI `sell-in`
- kartu KPI `sell-out`
- kartu KPI total outstanding
- kartu KPI invoice past due
- widget distribusi per wilayah
- widget trend `sell-in` vs `sell-out`
- widget aging bucket
- panel risk summary
- panel recent batch status

### 5.4 Sell-In Monitoring Page

Komponen wajib:
- filter periode
- filter wilayah
- filter channel
- tabel `sell-in`
- chart trend
- total quantity
- export button

### 5.5 Sell-Out Monitoring Page

Komponen wajib:
- filter periode
- filter wilayah
- filter channel
- tabel `sell-out`
- chart trend
- perbandingan terhadap `sell-in`
- export button

### 5.6 Distribution Monitoring Page

Komponen wajib:
- peta atau tabel distribusi per wilayah
- ranking wilayah berdasarkan volume distribusi
- coverage indicator per wilayah
- drill-down ke outlet atau node distribusi

### 5.7 Payment Monitoring Page

Komponen wajib:
- total outstanding
- total current due
- total past due
- aging bucket chart
- tabel invoice
- filter status pembayaran
- filter aging bucket

### 5.8 Risk Stock Page

Komponen wajib:
- daftar event `overstock`
- daftar event `stockout`
- severity badge
- owner
- due action date
- status tindak lanjut

### 5.9 Risk Payment Page

Komponen wajib:
- daftar invoice risk event
- severity badge
- due date
- aging days
- payment status
- status tindak lanjut

### 5.10 Upload Center Page

Komponen wajib:
- upload area
- daftar batch terbaru
- batch status
- validation error summary
- publish action untuk batch valid

---

## 6. Functional Requirements

### 6.1 Authentication

FR-001:
- sistem harus menyediakan login berbasis email dan password

FR-002:
- sistem harus menerapkan role-based access control setelah login

### 6.2 Upload & Validation

FR-003:
- sistem harus menerima upload file untuk `sell-in`, `sell-out`, `inventory`, dan `payments`

FR-004:
- sistem harus memvalidasi schema file sesuai tipe sumber data

FR-005:
- sistem harus menolak file dengan kolom wajib yang hilang

FR-006:
- sistem harus mendeteksi duplikasi batch berdasarkan checksum atau fingerprint file

FR-007:
- sistem harus menyimpan hasil validasi per batch

FR-008:
- hanya batch berstatus valid yang dapat dipublish ke dashboard

### 6.3 Monitoring Dashboard

FR-009:
- dashboard harus menampilkan angka final terbaru untuk `sell-in`, `sell-out`, distribusi wilayah, dan pembayaran

FR-010:
- dashboard harus menampilkan `last_updated_at` per halaman atau widget

FR-011:
- pengguna harus dapat memfilter data berdasarkan periode, wilayah, channel, dan status

FR-012:
- pengguna harus dapat mengekspor data tabel ke format file yang disepakati implementasi

### 6.4 Risk Control

FR-013:
- sistem harus membentuk risk event `overstock` berdasarkan threshold stok

FR-014:
- sistem harus membentuk risk event `stockout` berdasarkan threshold stok minimum atau stock cover

FR-015:
- sistem harus membentuk risk event pembayaran untuk invoice yang mendekati atau melewati termin

FR-016:
- setiap risk event harus memiliki severity, owner, status, dan timestamp

FR-017:
- pengguna yang berwenang harus dapat mengubah status risk event

### 6.5 Payment Monitoring

FR-018:
- sistem harus menghitung aging bucket untuk seluruh invoice in-scope

FR-019:
- sistem harus menghitung outstanding amount berdasarkan `amount - paid_amount`

FR-020:
- sistem harus menampilkan payment compliance terhadap termin

### 6.6 Master Data

FR-021:
- sistem harus menyediakan master data wilayah, outlet, dan SKU

FR-022:
- perhitungan dashboard dan risk engine harus menggunakan master data aktif

### 6.7 Audit Trail

FR-023:
- sistem harus mencatat aktivitas upload, validasi, publish, dan perubahan status event

FR-024:
- sistem harus mencatat siapa yang melakukan aksi dan kapan aksi dilakukan

---

## 7. Entitas Data

### 7.1 `users`

| Field | Type | Keterangan |
|---|---|---|
| `id` | uuid | primary key |
| `name` | varchar | nama user |
| `email` | varchar | unik |
| `password_hash` | varchar | hash password |
| `role` | enum | `admin`, `ops`, `finance`, `management`, `viewer` |
| `status` | enum | `active`, `inactive` |
| `created_at` | timestamp | waktu dibuat |
| `updated_at` | timestamp | waktu diubah |

### 7.2 `regions`

| Field | Type | Keterangan |
|---|---|---|
| `id` | uuid | primary key |
| `code` | varchar | kode wilayah |
| `name` | varchar | nama wilayah |
| `status` | enum | `active`, `inactive` |
| `created_at` | timestamp | waktu dibuat |

### 7.3 `outlets`

| Field | Type | Keterangan |
|---|---|---|
| `id` | uuid | primary key |
| `region_id` | uuid | relasi ke `regions` |
| `code` | varchar | kode outlet |
| `name` | varchar | nama outlet |
| `channel` | varchar | channel distribusi |
| `status` | enum | `active`, `inactive` |
| `created_at` | timestamp | waktu dibuat |

### 7.4 `skus`

| Field | Type | Keterangan |
|---|---|---|
| `id` | uuid | primary key |
| `code` | varchar | kode SKU |
| `name` | varchar | nama SKU |
| `status` | enum | `active`, `inactive` |
| `created_at` | timestamp | waktu dibuat |

### 7.5 `batches`

| Field | Type | Keterangan |
|---|---|---|
| `id` | uuid | primary key |
| `source_type` | enum | `sell_in`, `sell_out`, `inventory`, `payment` |
| `file_name` | varchar | nama file |
| `fingerprint` | varchar | checksum atau hash |
| `uploaded_by` | uuid | relasi ke `users` |
| `uploaded_at` | timestamp | waktu upload |
| `validation_status` | enum | `received`, `validated`, `rejected`, `published`, `exception_review` |
| `error_count` | int | total error validasi |
| `published_at` | timestamp nullable | waktu publish |

### 7.6 `sell_in_records`

| Field | Type | Keterangan |
|---|---|---|
| `id` | uuid | primary key |
| `batch_id` | uuid | relasi ke `batches` |
| `period_date` | date | periode data |
| `region_id` | uuid | relasi ke `regions` |
| `outlet_id` | uuid | relasi ke `outlets` |
| `sku_id` | uuid | relasi ke `skus` |
| `qty_sell_in` | numeric | kuantitas masuk |
| `delivery_date` | date | tanggal kirim |
| `created_at` | timestamp | waktu simpan |

### 7.7 `sell_out_records`

| Field | Type | Keterangan |
|---|---|---|
| `id` | uuid | primary key |
| `batch_id` | uuid | relasi ke `batches` |
| `period_date` | date | periode data |
| `region_id` | uuid | relasi ke `regions` |
| `outlet_id` | uuid | relasi ke `outlets` |
| `sku_id` | uuid | relasi ke `skus` |
| `qty_sell_out` | numeric | kuantitas keluar |
| `transaction_date` | date | tanggal transaksi |
| `created_at` | timestamp | waktu simpan |

### 7.8 `inventory_positions`

| Field | Type | Keterangan |
|---|---|---|
| `id` | uuid | primary key |
| `batch_id` | uuid | relasi ke `batches` |
| `period_date` | date | periode data |
| `region_id` | uuid | relasi ke `regions` |
| `outlet_id` | uuid | relasi ke `outlets` |
| `sku_id` | uuid | relasi ke `skus` |
| `opening_stock` | numeric | stok awal |
| `closing_stock` | numeric | stok akhir |
| `stock_cover_days` | numeric | cakupan stok |
| `created_at` | timestamp | waktu simpan |

### 7.9 `payment_records`

| Field | Type | Keterangan |
|---|---|---|
| `id` | uuid | primary key |
| `batch_id` | uuid | relasi ke `batches` |
| `invoice_number` | varchar | nomor invoice |
| `invoice_date` | date | tanggal invoice |
| `due_date` | date | tanggal jatuh tempo |
| `amount` | numeric | nilai invoice |
| `paid_amount` | numeric | total dibayar |
| `outstanding_amount` | numeric | hasil perhitungan |
| `payment_status` | enum | `unpaid`, `partial`, `paid`, `overdue` |
| `aging_days` | int | selisih hari terhadap due date |
| `aging_bucket` | enum | `0_30`, `31_45`, `46_60`, `over_60` |
| `created_at` | timestamp | waktu simpan |

### 7.10 `risk_rules`

| Field | Type | Keterangan |
|---|---|---|
| `id` | uuid | primary key |
| `rule_type` | enum | `overstock`, `stockout`, `payment_due`, `payment_overdue` |
| `threshold_value` | numeric | ambang batas |
| `threshold_unit` | varchar | satuan rule |
| `severity_if_hit` | enum | `warning`, `high`, `critical` |
| `is_active` | boolean | status aktif |
| `created_at` | timestamp | waktu dibuat |

### 7.11 `risk_events`

| Field | Type | Keterangan |
|---|---|---|
| `id` | uuid | primary key |
| `event_type` | enum | `overstock`, `stockout`, `payment_due`, `payment_overdue` |
| `severity` | enum | `warning`, `high`, `critical` |
| `entity_type` | enum | `inventory`, `payment` |
| `entity_id` | uuid | relasi ke data sumber |
| `region_id` | uuid nullable | wilayah terkait |
| `owner_user_id` | uuid nullable | owner tindak lanjut |
| `status` | enum | `open`, `in_progress`, `resolved`, `closed` |
| `triggered_at` | timestamp | waktu terbentuk |
| `resolved_at` | timestamp nullable | waktu selesai |
| `notes` | text nullable | catatan tindak lanjut |

### 7.12 `audit_logs`

| Field | Type | Keterangan |
|---|---|---|
| `id` | uuid | primary key |
| `actor_user_id` | uuid | relasi ke `users` |
| `action_type` | varchar | jenis aksi |
| `entity_type` | varchar | tipe entitas |
| `entity_id` | uuid | id entitas |
| `metadata_json` | json | detail aksi |
| `created_at` | timestamp | waktu aksi |

---

## 8. Relasi Data

- `regions` satu ke banyak dengan `outlets`
- `batches` satu ke banyak dengan `sell_in_records`
- `batches` satu ke banyak dengan `sell_out_records`
- `batches` satu ke banyak dengan `inventory_positions`
- `batches` satu ke banyak dengan `payment_records`
- `risk_events` mengacu ke entitas sumber melalui `entity_type` dan `entity_id`
- `users` satu ke banyak dengan `batches.uploaded_by`
- `users` satu ke banyak dengan `risk_events.owner_user_id`
- `users` satu ke banyak dengan `audit_logs.actor_user_id`

---

## 9. API Specification

### 9.1 Auth

`POST /api/auth/login`
- request:
```json
{
  "email": "user@example.com",
  "password": "secret"
}
```
- response `200`:
```json
{
  "token": "jwt-or-session-token",
  "user": {
    "id": "uuid",
    "name": "User Name",
    "role": "admin"
  }
}
```

`POST /api/auth/logout`

### 9.2 Dashboard

`GET /api/dashboard/overview?startDate=&endDate=&regionId=&channel=`
- response berisi:
  - total `sell_in`
  - total `sell_out`
  - total outstanding
  - invoice past due
  - risk summary
  - `last_updated_at`

`GET /api/dashboard/sell-in`

`GET /api/dashboard/sell-out`

`GET /api/dashboard/distribution`

`GET /api/dashboard/payments`

### 9.3 Risk Events

`GET /api/risk-events?type=&severity=&status=&regionId=`

`GET /api/risk-events/:id`

`PATCH /api/risk-events/:id/status`
- request:
```json
{
  "status": "in_progress",
  "notes": "Sedang ditindaklanjuti"
}
```

### 9.4 Uploads & Batches

`POST /api/uploads`
- multipart file upload
- parameter:
  - `source_type`
  - `file`

`GET /api/batches`

`GET /api/batches/:id`

`POST /api/batches/:id/validate`

`POST /api/batches/:id/publish`

### 9.5 Master Data

`GET /api/regions`

`POST /api/regions`

`GET /api/outlets`

`POST /api/outlets`

`GET /api/skus`

`POST /api/skus`

### 9.6 Rule Settings

`GET /api/risk-rules`

`POST /api/risk-rules`

`PATCH /api/risk-rules/:id`

### 9.7 Payments

`GET /api/payments?status=&agingBucket=&startDate=&endDate=`

`GET /api/payments/:id`

---

## 10. Backend Rules & Business Logic

### 10.1 Batch Validation Rules

BR-001:
- setiap file upload wajib punya `source_type`

BR-002:
- schema wajib berbeda untuk `sell_in`, `sell_out`, `inventory`, dan `payment`

BR-003:
- file dengan fingerprint yang sama dan source type yang sama harus ditolak sebagai duplikat

BR-004:
- batch tidak boleh dipublish jika `validation_status != validated`

### 10.2 Sell-In & Sell-Out Rules

BR-005:
- total `sell_in` dihitung dari penjumlahan `qty_sell_in` pada data yang berasal dari batch published

BR-006:
- total `sell_out` dihitung dari penjumlahan `qty_sell_out` pada data yang berasal dari batch published

BR-007:
- distribusi per wilayah dihitung berdasarkan agregasi `sell_in` dan/atau `sell_out` per `region_id`

### 10.3 Inventory Rules

BR-008:
- `overstock` terbentuk jika `closing_stock` atau `stock_cover_days` melebihi threshold rule aktif

BR-009:
- `stockout` terbentuk jika `closing_stock <= 0` atau `stock_cover_days` berada di bawah threshold rule aktif

BR-010:
- jika event untuk entitas yang sama dan tipe yang sama sudah berstatus `open` atau `in_progress`, sistem tidak boleh membuat event duplikat

### 10.4 Payment Rules

BR-011:
- `outstanding_amount = amount - paid_amount`

BR-012:
- `payment_status = paid` jika `outstanding_amount <= 0`

BR-013:
- `payment_status = partial` jika `paid_amount > 0` dan `outstanding_amount > 0`

BR-014:
- `payment_status = unpaid` jika `paid_amount = 0` dan due date belum lewat

BR-015:
- `payment_status = overdue` jika `outstanding_amount > 0` dan current date > due date

BR-016:
- `aging_days = current_date - due_date`

BR-017:
- bucket aging dihitung dengan aturan:
  - `0_30` jika `aging_days <= 30`
  - `31_45` jika `aging_days >= 31` dan `aging_days <= 45`
  - `46_60` jika `aging_days >= 46` dan `aging_days <= 60`
  - `over_60` jika `aging_days > 60`

BR-018:
- risk event `payment_due` terbentuk saat invoice mendekati threshold due reminder

BR-019:
- risk event `payment_overdue` terbentuk saat invoice melewati due date atau threshold overdue

### 10.5 Publish Rules

BR-020:
- dashboard hanya boleh membaca data dari batch `published`

BR-021:
- publish batch harus memicu refresh materialized data atau cache dashboard

BR-022:
- setiap publish batch wajib tercatat pada `audit_logs`

### 10.6 Event Workflow Rules

BR-023:
- status default risk event adalah `open`

BR-024:
- risk event hanya boleh berpindah status:
  - `open -> in_progress`
  - `in_progress -> resolved`
  - `resolved -> closed`

BR-025:
- perubahan status wajib mencatat user, timestamp, dan notes

---

## 11. Status, Alert, & Severity Model

### 11.1 Batch Status

| Status | Arti |
|---|---|
| `received` | file sudah diterima |
| `validated` | file lolos validasi |
| `rejected` | file gagal validasi |
| `published` | data aktif di dashboard |
| `exception_review` | perlu review manual |

### 11.2 Risk Status

| Status | Arti |
|---|---|
| `open` | event baru terbentuk |
| `in_progress` | sedang ditindaklanjuti |
| `resolved` | akar masalah sudah ditangani |
| `closed` | event selesai dan ditutup |

### 11.3 Severity

| Severity | Arti |
|---|---|
| `warning` | perlu perhatian |
| `high` | perlu tindak lanjut segera |
| `critical` | perlu eskalasi prioritas tinggi |

### 11.4 Alert Placement di UI

Alert wajib muncul pada:
- dashboard overview
- halaman risk stock
- halaman risk payments
- batch detail jika batch gagal validasi

---

## 12. Dashboard Metrics

### 12.1 KPI Wajib

| KPI | Sumber |
|---|---|
| Total sell-in | `sell_in_records` published |
| Total sell-out | `sell_out_records` published |
| Distribusi per wilayah | agregasi per `region_id` |
| Total outstanding | `payment_records.outstanding_amount` |
| Invoice past due | `payment_status = overdue` |
| Overstock count | `risk_events` tipe `overstock` aktif |
| Stockout count | `risk_events` tipe `stockout` aktif |
| Payment risk count | `risk_events` tipe pembayaran aktif |

### 12.2 Filter Global

Filter global minimal:
- periode
- wilayah
- channel
- severity
- status

---

## 13. Upload & Data Processing Flow

1. User upload file ke `/uploads`.
2. Sistem membuat `batch` dengan status `received`.
3. User atau sistem memicu validasi batch.
4. Jika valid, status batch menjadi `validated`.
5. Data dimasukkan ke tabel sesuai `source_type`.
6. Admin publish batch.
7. Status batch menjadi `published`.
8. Dashboard refresh.
9. Risk engine menjalankan evaluasi rule.
10. Jika threshold terpenuhi, sistem membuat atau meng-update `risk_event`.
11. Semua aktivitas dicatat ke `audit_logs`.

---

## 14. Non-Functional Requirements

NFR-001:
- seluruh halaman utama harus dapat dibuka pada desktop minimal lebar 1280px

NFR-002:
- aplikasi harus tetap usable pada tablet

NFR-003:
- response dashboard overview target maksimal 3 detik pada data published normal

NFR-004:
- seluruh endpoint write harus mencatat audit log

NFR-005:
- seluruh endpoint harus memeriksa authorization berbasis role

NFR-006:
- password harus disimpan dalam bentuk hash yang aman

NFR-007:
- sistem harus mendukung export data dari tabel monitoring dan payments

---

## 15. Acceptance Criteria

### 15.1 Dashboard Monitoring

AC-001:
- ketika batch `sell-in` dan `sell-out` telah dipublish, dashboard overview menampilkan total nilai terbaru

AC-002:
- ketika user memilih filter wilayah, seluruh widget yang relevan berubah sesuai wilayah tersebut

AC-003:
- setiap halaman monitoring menampilkan `last_updated_at`

### 15.2 Risk Control Stok

AC-004:
- ketika `closing_stock` melebihi threshold aktif, sistem membuat event `overstock`

AC-005:
- ketika `closing_stock <= 0` atau stock cover di bawah threshold aktif, sistem membuat event `stockout`

AC-006:
- event stok yang sudah terbentuk tampil pada halaman `/risk/stock`

### 15.3 Risk Control Pembayaran

AC-007:
- ketika invoice melewati due date dan outstanding masih ada, sistem memberi status `overdue`

AC-008:
- invoice overdue memicu risk event pembayaran

AC-009:
- data aging bucket tampil benar pada halaman payment monitoring

### 15.4 Upload & Publish

AC-010:
- file dengan schema tidak valid ditandai `rejected` dan tidak masuk dashboard

AC-011:
- batch yang valid bisa dipublish oleh admin

AC-012:
- dashboard hanya menampilkan data dari batch published

### 15.5 Audit & Permission

AC-013:
- perubahan status risk event tercatat pada audit log

AC-014:
- user tanpa permission tidak dapat mengakses route yang tidak sesuai role

---

## 16. Out of Scope

Hal berikut tidak termasuk implementasi tahap ini:
- AI insight, AI recommendation, atau AI-generated narrative
- forecasting machine learning
- legal module atau contract management
- perhitungan margin komersial detail
- live streaming API dari semua pihak
- mobile app native
- workflow orchestration eksternal sebagai inti logic sistem
