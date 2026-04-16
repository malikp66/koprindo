# IMPLEMENTATION SPEC
## Sistem Monitoring & Kontrol Risiko Terpadu FOX 2026

---

| Atribut | Detail |
|---|---|
| Versi | 1.0 |
| Tanggal | April 2026 |
| Basis | `PRD_Sistem_Distribusi_FOX_2026.md` versi 4.0 |
| Fokus Modul | Dashboard, Ingest, Payment, Risk Engine |
| Status | Siap Implementasi |

---

## 1. Tujuan Dokumen

Dokumen ini menerjemahkan PRD ke level implementasi teknis yang dapat langsung dipakai untuk membangun sistem. Semua keputusan utama untuk modul inti sudah dikunci di sini agar implementer tidak perlu membuat keputusan arsitektural baru di tengah pengerjaan.

Dokumen ini mengatur:
- arsitektur logis modul inti
- kontrak data utama
- aturan validasi dan quality gate
- perilaku dashboard per role
- perhitungan dan aturan payment monitoring
- rule dan severity pada risk engine
- acceptance criteria teknis

---

## 2. Prinsip Implementasi

### 2.1 Prinsip Umum

1. Semua KPI final dan risk flag utama dihitung oleh pipeline **deterministik berbasis rule**.
2. AI hanya boleh dipakai untuk:
   - parsing file tidak standar
   - klasifikasi exception
   - insight naratif
   - rekomendasi non-final
3. Setiap angka yang tampil di dashboard eksekutif harus punya:
   - `source_batch_id`
   - `quality_status`
   - `last_updated_at`
4. Data yang gagal quality gate tidak boleh masuk view eksekutif sebagai angka final.
5. Semua entity inti harus bisa di-trace balik ke file mentah dan batch asal.

### 2.2 Scope Teknis v1

v1 dibangun sebagai sistem **batch/event-driven near-real-time** untuk ingest bulanan multi-file.

v1 tidak mengasumsikan:
- live API stream dari seluruh pihak
- ERP replacement
- forecasting machine learning sebagai sumber keputusan utama

---

## 3. Arsitektur Modul

Arsitektur implementasi dibagi menjadi 6 lapisan logis:

1. `Source Intake Layer`
2. `Validation & Normalization Layer`
3. `Reconciliation & Metric Engine`
4. `Payment Monitoring Engine`
5. `Risk Engine`
6. `Dashboard & Reporting Layer`

### 3.1 Alur Tingkat Tinggi

```
Raw Files / Input Sources
  -> Batch Registry
  -> Validation
  -> Normalization
  -> Master Mapping
  -> Reconciliation
  -> Metric Engine
  -> Payment Engine
  -> Risk Engine
  -> Dashboard / Reports / Alerts
```

### 3.2 Modul Implementasi Wajib

| Modul | Tanggung Jawab |
|---|---|
| `ingest` | registrasi batch, file intake, schema validation, normalization |
| `master-data` | mapping entity bisnis dan referensi |
| `reconciliation` | sinkronisasi sell-in, sell-out, stok, payment |
| `payment-monitoring` | invoice, due date, aging bucket, payment status |
| `risk-engine` | rule evaluation, severity scoring, risk event generation |
| `dashboard` | materialized view per role dan periodisasi |

---

## 4. Kontrak Data Inti

Semua data inti disimpan sebagai tabel logis yang immutable-by-batch. Koreksi tidak menimpa data lama, tetapi menghasilkan versi baru dengan referensi ke batch revisi.

### 4.1 `batch_registry`

Mencatat semua batch yang masuk.

| Field | Type | Wajib | Keterangan |
|---|---|---|---|
| `batch_id` | string | Ya | UUID batch |
| `source_type` | enum | Ya | `sell_in`, `sell_out`, `payment`, `inventory`, `master_data` |
| `source_party` | enum | Ya | `koprindo`, `gunawan_elektro`, `ritel_modern`, `konsultan`, `manual_admin` |
| `channel` | enum nullable | Tidak | `alfamart`, `indomaret`, `aksesmu`, `all` |
| `period_month` | int | Ya | 1-12 |
| `period_year` | int | Ya | tahun data |
| `file_name` | string | Ya | nama file |
| `file_checksum` | string | Ya | SHA-256 |
| `file_size_bytes` | int | Ya | ukuran file |
| `received_at` | datetime | Ya | waktu diterima |
| `validation_status` | enum | Ya | `received`, `validated`, `rejected`, `published`, `exception_review` |
| `quality_score` | decimal nullable | Tidak | 0-100 |
| `revision_of_batch_id` | string nullable | Tidak | jika revisi |

### 4.2 `sell_in_record`

| Field | Type | Keterangan |
|---|---|---|
| `record_id` | string | UUID |
| `batch_id` | string | referensi batch |
| `period_key` | string | `YYYY-MM` |
| `channel` | enum | channel distribusi |
| `region_code` | string | kode wilayah |
| `branch_code` | string | kode cabang |
| `outlet_code` | string | kode outlet |
| `sku_code` | string | kode SKU normal |
| `qty_sell_in` | decimal | qty masuk |
| `shipment_date` | date nullable | tanggal kirim |
| `receipt_date` | date nullable | tanggal terima |
| `raw_row_ref` | string | penanda row source |

### 4.3 `sell_out_record`

| Field | Type | Keterangan |
|---|---|---|
| `record_id` | string | UUID |
| `batch_id` | string | referensi batch |
| `period_key` | string | `YYYY-MM` |
| `channel` | enum | channel penjualan |
| `region_code` | string | kode wilayah |
| `branch_code` | string | kode cabang |
| `outlet_code` | string | kode outlet |
| `sku_code` | string | kode SKU normal |
| `qty_sell_out` | decimal | qty terjual |
| `sales_amount` | decimal | nilai penjualan |
| `transaction_count` | int nullable | jumlah transaksi bila tersedia |
| `raw_row_ref` | string | penanda row source |

### 4.4 `inventory_position`

| Field | Type | Keterangan |
|---|---|---|
| `record_id` | string | UUID |
| `batch_id` | string | referensi batch |
| `period_key` | string | `YYYY-MM` |
| `channel` | enum | channel |
| `region_code` | string | wilayah |
| `branch_code` | string | cabang |
| `outlet_code` | string | outlet |
| `sku_code` | string | SKU |
| `opening_stock` | decimal nullable | stok awal |
| `closing_stock` | decimal | stok akhir |
| `stock_snapshot_date` | date nullable | tanggal snapshot |

### 4.5 `payment_record`

| Field | Type | Keterangan |
|---|---|---|
| `payment_id` | string | UUID |
| `batch_id` | string | referensi batch |
| `invoice_id` | string | nomor invoice |
| `invoice_type` | enum | `retail_to_koprindo`, `koprindo_to_gunawan` |
| `payer_party` | enum | pihak pembayar |
| `payee_party` | enum | pihak penerima |
| `invoice_date` | date | tanggal invoice |
| `invoice_received_date` | date nullable | tanggal invoice diterima lengkap |
| `due_date` | date | tanggal jatuh tempo |
| `invoice_amount` | decimal | nominal invoice |
| `paid_amount` | decimal | total dibayar |
| `last_payment_date` | date nullable | tanggal bayar terakhir |
| `payment_status` | enum | `unpaid`, `partial`, `paid`, `disputed`, `overdue` |
| `aging_days` | int | usia invoice |
| `aging_bucket` | enum | `0_30`, `31_45`, `46_60`, `61_plus` |

### 4.6 `data_quality_result`

| Field | Type | Keterangan |
|---|---|---|
| `quality_result_id` | string | UUID |
| `batch_id` | string | referensi batch |
| `quality_score` | decimal | 0-100 |
| `blocking_issue_count` | int | isu kritikal |
| `warning_issue_count` | int | isu non-blocking |
| `review_required` | boolean | perlu review manual |
| `quality_status` | enum | `passed`, `provisional`, `blocked` |
| `quality_notes` | text | ringkasan isu |

### 4.7 `risk_event`

| Field | Type | Keterangan |
|---|---|---|
| `risk_event_id` | string | UUID |
| `period_key` | string | periode evaluasi |
| `risk_type` | enum | jenis risiko |
| `severity` | enum | `info`, `warning`, `high`, `critical` |
| `entity_type` | enum | `channel`, `region`, `branch`, `outlet`, `invoice`, `batch` |
| `entity_key` | string | identitas entity |
| `metric_name` | string | metrik pemicu |
| `observed_value` | decimal nullable | nilai aktual |
| `threshold_value` | decimal nullable | ambang rule |
| `status` | enum | `open`, `acknowledged`, `resolved`, `ignored` |
| `owner_role` | enum | `bd`, `admin`, `finance`, `consultant`, `management` |
| `created_at` | datetime | waktu event |

---

## 5. Modul Ingest

### 5.1 Tujuan

Modul ingest bertanggung jawab menerima file dari sumber operasional, mendaftarkan batch, menjalankan validasi, normalisasi, dan menentukan apakah batch:
- diterima penuh
- diterima provisional
- ditolak
- masuk review exception

### 5.2 Sumber Data v1

| Source Type | Sumber Utama | Format v1 |
|---|---|---|
| `sell_out` | ritel modern | `.xlsx`, `.csv` |
| `sell_in` | Koprindo / ritel / dokumen distribusi | `.xlsx`, `.csv` |
| `payment` | finance / invoice tracker | `.xlsx`, `.csv` |
| `inventory` | stok outlet / gudang | `.xlsx`, `.csv` |
| `master_data` | admin sistem | `.xlsx`, `.csv` |

### 5.3 Intake Flow

1. File diterima oleh endpoint / workflow intake.
2. Sistem menghitung checksum.
3. Sistem menolak file duplikat jika checksum + source metadata sama dengan batch yang sudah published.
4. Sistem membuat `batch_registry`.
5. Sistem menjalankan validation pipeline.
6. Jika validasi lolos, sistem menormalisasi field.
7. Sistem menyimpan raw parse output dan normalized records.
8. Sistem membuat `data_quality_result`.
9. Sistem meneruskan batch ke reconciliation layer jika status `passed` atau `provisional`.

### 5.4 Validation Rules

#### 5.4.1 File-Level Validation

- Ekstensi hanya `.xlsx` atau `.csv`
- Ukuran file maksimal default `20MB` per file
- Period key wajib ada
- Source type wajib diketahui
- Channel wajib valid bila source terkait channel

#### 5.4.2 Schema Validation

Setiap source type punya template wajib:

| Source Type | Kolom Wajib |
|---|---|
| `sell_out` | period, channel, outlet_code, sku_code, qty_sell_out |
| `sell_in` | period, channel, outlet_code atau branch_code, sku_code, qty_sell_in |
| `payment` | invoice_id, invoice_date, invoice_amount, payer_party, payee_party, due_date |
| `inventory` | period, channel, outlet_code, sku_code, closing_stock |
| `master_data` | entity_type, entity_code, entity_name |

Jika kolom wajib tidak ada, batch status menjadi `blocked`.

#### 5.4.3 Data Type Validation

- qty dan amount harus numerik
- tanggal harus valid
- enum harus ada di whitelist
- record dengan tipe salah dihitung sebagai issue

### 5.5 Normalization Rules

- trimming whitespace
- uppercasing kode entity
- standardisasi period menjadi `YYYY-MM`
- normalisasi angka desimal
- mapping alias branch / region / outlet / SKU menggunakan master map

### 5.6 Quality Scoring

Rumus awal:

`quality_score = 100 - (10 x blocking_issue_count) - (2 x warning_issue_count) - (0.5 x duplicate_row_pct)`

Status:
- `passed`: score >= 90 dan blocking_issue_count = 0
- `provisional`: score 75-89 dan blocking_issue_count = 0
- `blocked`: score < 75 atau blocking_issue_count > 0

### 5.7 AI Usage in Ingest

AI hanya aktif bila:
- kolom tekstual tidak standar
- SKU mapping ambigu
- file mengandung variasi label yang tidak tertangani parser rule-based

AI output tidak langsung dipublish. Hasil AI harus:
- diberi `ai_assisted = true`
- melewati validator pasca-parse
- masuk review jika confidence di bawah threshold

### 5.8 Acceptance Criteria Modul Ingest

- file duplikat terdeteksi dan tidak membuat double counting
- file invalid ditolak dengan alasan spesifik
- batch provisional tetap dapat diproses tetapi tampil berlabel exception
- raw row ke normalized row bisa ditelusuri

---

## 6. Modul Reconciliation & Metric Engine

### 6.1 Tujuan

Modul ini menghasilkan metrik final berbasis rule dari data yang telah lolos ingest.

### 6.2 Rekonsiliasi Inti

Rekonsiliasi dilakukan minimal pada 3 relasi:

1. `sell_in` vs `sell_out`
2. `sell_out` vs `inventory_position`
3. `payment_record` vs invoice master / due schedule

### 6.3 Rule Rekonsiliasi v1

#### 6.3.1 Sell-In vs Sell-Out Variance

Per entity `channel -> region -> branch -> outlet -> sku -> period`:

`variance_qty = qty_sell_in - qty_sell_out`

Flag:
- `info` jika variance dalam rentang wajar
- `warning` jika variance > 15% dari sell-in
- `high` jika variance > 30%

#### 6.3.2 Inventory Consistency

Jika tersedia `opening_stock`, maka:

`expected_closing = opening_stock + sell_in - sell_out`

Jika selisih terhadap `closing_stock` aktual lebih besar dari threshold 5%, buat exception reconciliation.

### 6.4 KPI Deterministik Wajib

| KPI | Formula |
|---|---|
| `total_sell_in` | sum(qty_sell_in) |
| `total_sell_out` | sum(qty_sell_out) |
| `sell_through_rate` | total_sell_out / total_sell_in |
| `target_achievement_pct` | total_sell_out / target_qty |
| `stock_cover_days` | closing_stock / avg_daily_sell_out |
| `variance_sell_in_sell_out_pct` | (sell_in - sell_out) / sell_in |

### 6.5 Grain Perhitungan

Metrik harus tersedia pada grain:
- nasional
- channel
- region
- branch
- outlet
- invoice untuk payment-related metrics

### 6.6 Materialized Views

Implementasi harus menyiapkan view teragregasi:
- `mv_dashboard_national_period`
- `mv_dashboard_channel_period`
- `mv_dashboard_branch_period`
- `mv_dashboard_outlet_period`
- `mv_payment_period`
- `mv_risk_summary_period`

---

## 7. Modul Payment Monitoring

### 7.1 Tujuan

Memberikan visibility atas termin pembayaran, status invoice, aging, dan exposure arus kas.

### 7.2 Payment Flows yang Dipantau

1. `retail_to_koprindo`
2. `koprindo_to_gunawan`

### 7.3 Perhitungan Inti

#### 7.3.1 Due Date

Jika `invoice_received_date` tersedia:
- `retail_to_koprindo`: `invoice_received_date + 30 sampai 45 hari kerja`
- `koprindo_to_gunawan`: `invoice_received_date + 45 sampai 60 hari kerja`

Untuk v1, sistem menyimpan satu `due_date` final dari sumber data. Range term digunakan untuk klasifikasi SLA dan tampilan.

#### 7.3.2 Aging Days

`aging_days = current_date - invoice_date` bila belum lunas  
`aging_days = last_payment_date - invoice_date` bila lunas

#### 7.3.3 Aging Bucket

| Bucket | Rule |
|---|---|
| `0_30` | aging_days <= 30 |
| `31_45` | 31 <= aging_days <= 45 |
| `46_60` | 46 <= aging_days <= 60 |
| `61_plus` | aging_days > 60 |

#### 7.3.4 Payment Status

- `unpaid` jika `paid_amount = 0`
- `partial` jika `0 < paid_amount < invoice_amount`
- `paid` jika `paid_amount >= invoice_amount`
- `overdue` jika unpaid/partial dan current_date > due_date
- `disputed` jika ditandai manual oleh finance/admin

### 7.4 Metrik Payment Dashboard

| Metrik | Grain |
|---|---|
| total outstanding | per payer/payee/channel |
| overdue amount | per payer/payee/channel |
| overdue invoice count | per payer/payee/channel |
| aging composition | nasional, party, channel |
| payment compliance rate | per payer/payee |
| average collection age | per payer/payee |

### 7.5 Acceptance Criteria Payment Module

- invoice masuk ke aging bucket yang benar
- overdue invoices otomatis berubah status tanpa intervensi manual
- dashboard dapat memfilter by payment flow
- outstanding dan overdue bisa drill-down ke daftar invoice

---

## 8. Modul Risk Engine

### 8.1 Tujuan

Menghasilkan event risiko operasional dan finansial yang terukur, dapat diaudit, dan dapat ditindaklanjuti.

### 8.2 Engine Design

Risk engine berjalan setelah:
- quality status batch tidak `blocked`
- metric engine selesai menghitung materialized metrics

Engine membaca input dari:
- aggregated sell-in metrics
- aggregated sell-out metrics
- inventory metrics
- payment metrics
- reconciliation exceptions
- data quality results

### 8.3 Risk Types v1

| `risk_type` | Deskripsi |
|---|---|
| `stockout_risk` | stok tidak cukup untuk demand berjalan |
| `overstock_risk` | stok terlalu tinggi terhadap velocity |
| `sell_in_sell_out_mismatch` | perbedaan tidak wajar antara barang masuk dan barang keluar |
| `payment_overdue` | invoice melewati due date |
| `payment_aging_critical` | aging masuk bucket berat |
| `target_underachievement` | pencapaian target berada di bawah threshold |
| `data_quality_failure` | batch atau source quality rendah |
| `source_delay` | data tidak masuk sesuai SLA |

### 8.4 Severity Rules v1

#### 8.4.1 Stockout Risk

Input:
- closing_stock
- avg_daily_sell_out
- stock_cover_days

Rule:
- `warning`: stock_cover_days < 14
- `high`: stock_cover_days < 7
- `critical`: stock_cover_days < 3

#### 8.4.2 Overstock Risk

Rule:
- `warning`: stock_cover_days > 45
- `high`: stock_cover_days > 60
- `critical`: stock_cover_days > 90

#### 8.4.3 Payment Overdue

Rule:
- `warning`: 1-7 hari lewat due date
- `high`: 8-30 hari lewat due date
- `critical`: >30 hari lewat due date

#### 8.4.4 Sell-In / Sell-Out Mismatch

Rule:
- `warning`: variance > 15%
- `high`: variance > 30%
- `critical`: variance > 50%

#### 8.4.5 Data Quality Failure

Rule:
- `warning`: quality_status = provisional
- `critical`: quality_status = blocked pada source kritikal

### 8.5 Event Lifecycle

1. event dibuat
2. owner_role ditentukan
3. event tampil di dashboard
4. owner mengubah status ke `acknowledged`
5. penyelesaian dicatat
6. event diubah ke `resolved` atau `ignored`

### 8.6 Notification Policy v1

- `warning`: dashboard only
- `high`: dashboard + inbox operational
- `critical`: dashboard + inbox + notification escalation

### 8.7 Acceptance Criteria Risk Engine

- event tidak double-create untuk entity + metric + period yang sama tanpa perubahan status
- severity konsisten terhadap threshold rule
- resolved event tidak muncul di default active dashboard
- semua event bisa drill-down ke metric dan batch pemicu

---

## 9. Modul Dashboard

### 9.1 Tujuan

Dashboard adalah layer presentasi utama untuk:
- monitoring operasional
- pemantauan risiko
- transparansi data lintas pihak
- pelaporan berkala

### 9.2 Prinsip UI Data

Setiap widget wajib menampilkan:
- periode aktif
- status kualitas data
- last updated timestamp

Setiap angka kritikal wajib punya:
- drill-down ke detail
- label `final` atau `provisional`

### 9.3 Role-Based Views

#### 9.3.1 Koprindo Operational View

Widget wajib:
- target vs actual nasional
- sell-in vs sell-out by channel
- peta distribusi per wilayah
- stock risk summary
- aging payment summary
- active risk events
- reconciliation exceptions

#### 9.3.2 Management / Executive View

Widget wajib:
- headline KPIs
- target achievement
- top risks
- overdue exposure
- data quality summary
- executive notes

#### 9.3.3 Gunawan Elektro View

Widget wajib:
- status distribusi nasional
- performance per channel
- visibility pembayaran dari Koprindo
- risk summary yang relevan untuk kemitraan

Tidak menampilkan:
- detail internal yang tidak relevan untuk pihak principal

#### 9.3.4 Consultant View

Widget wajib:
- sell-in / sell-out trend
- penetration progress
- risk distribution by region
- aging payment health
- reporting snapshots
- transparency and quality indicators

### 9.4 Halaman Dashboard v1

| Halaman | Tujuan |
|---|---|
| `overview` | ringkasan nasional dan target |
| `distribution` | sell-in, sell-out, regional map, channel performance |
| `inventory-risk` | stock cover, overstock, stockout |
| `payment-monitoring` | aging, overdue, outstanding |
| `risk-center` | event list, severity, status, owner |
| `data-quality` | batch quality, reconciliation issues |

### 9.5 Widget Wajib per Halaman

#### `overview`
- total target nasional
- total actual sell-out
- target achievement %
- total sell-in
- sell-through rate
- outstanding amount
- count of open high/critical risks

#### `distribution`
- channel comparison table
- trend chart sell-in vs sell-out
- regional distribution map
- branch performance table

#### `inventory-risk`
- stock cover distribution
- top stockout risks
- top overstock risks
- inventory exception table

#### `payment-monitoring`
- aging bucket chart
- overdue by party
- invoice list
- compliance rate

#### `risk-center`
- risk event list
- severity filters
- owner filters
- status filters

#### `data-quality`
- batch list
- quality score distribution
- blocking issues
- provisional metrics count

### 9.6 Dashboard API / Data Interface Assumption

Jika dashboard diimplementasikan di aplikasi web, minimal harus ada query contract berikut:
- `getOverviewMetrics(periodKey, role)`
- `getDistributionMetrics(periodKey, filters)`
- `getInventoryRiskMetrics(periodKey, filters)`
- `getPaymentMetrics(periodKey, flowType, filters)`
- `getRiskEvents(periodKey, filters)`
- `getDataQualitySummary(periodKey, filters)`

Implementasi endpoint boleh REST, RPC, atau direct DB query layer, tetapi shape data harus mengikuti kontrak view di atas.

### 9.7 Acceptance Criteria Dashboard

- semua angka headline punya `last_updated_at`
- provisional data diberi flag visual
- user dapat drill-down dari angka agregat ke tabel detail
- role filtering konsisten dan tidak bocor data lintas pihak

---

## 10. Master Data & Mapping

### 10.1 Master Data Entities

Minimal master data yang wajib ada:
- channel
- region
- branch
- outlet
- sku
- party
- invoice_type

### 10.2 Mapping Rules

- satu outlet hanya boleh punya satu canonical `outlet_code`
- alias branch / region disimpan terpisah dari canonical code
- perubahan mapping harus melalui admin workflow dan tercatat

### 10.3 Mapping Table Minimum

| Table | Kegunaan |
|---|---|
| `md_channel` | referensi channel |
| `md_region` | referensi wilayah |
| `md_branch` | referensi cabang |
| `md_outlet` | referensi outlet |
| `md_sku` | referensi SKU |
| `md_alias_map` | alias source ke canonical entity |

---

## 11. Quality Gate dan Publish Policy

### 11.1 Publish Policy

| Quality Status | Publish ke Dashboard | Catatan |
|---|---|---|
| `passed` | Ya | tampil sebagai final |
| `provisional` | Ya | tampil dengan flag provisional |
| `blocked` | Tidak | hanya tampil di admin quality view |

### 11.2 Publish Guard

Angka berikut tidak boleh dipublish sebagai final bila source utama masih provisional atau blocked:
- target achievement
- sell-through rate
- overdue amount
- outstanding amount
- stock cover aggregate
- headline risk counts

---

## 12. Logging, Audit, dan Observability

### 12.1 Log Wajib

Setiap modul wajib mengirim log terstruktur:
- module_name
- batch_id atau entity_key
- event_type
- status
- timestamp
- actor / system
- error_reason nullable

### 12.2 Audit Trails Wajib

- batch ingest history
- mapping changes
- manual override changes
- risk status changes
- report publication history

### 12.3 Observability Minimum

Metrik operasional minimum:
- ingest success rate
- blocked batch count
- provisional batch count
- risk events created per period
- overdue invoice count
- dashboard publish latency

---

## 13. Test Plan Teknis

### 13.1 Ingest Tests

- upload file valid untuk setiap source_type
- upload file duplikat
- upload file dengan kolom wajib hilang
- upload file dengan enum invalid
- upload revisi batch

### 13.2 Reconciliation Tests

- sell-in lebih besar dari sell-out dalam batas wajar
- sell-in dan sell-out mismatch berat
- inventory closing tidak cocok dengan formula

### 13.3 Payment Tests

- invoice unpaid masuk bucket 0-30
- invoice partial tetap overdue setelah due date
- invoice paid penuh keluar dari overdue summary

### 13.4 Risk Engine Tests

- stock cover rendah menghasilkan `stockout_risk`
- stock cover tinggi menghasilkan `overstock_risk`
- quality provisional memicu `data_quality_failure`
- overdue >30 hari memicu severity `critical`

### 13.5 Dashboard Tests

- role gunawan tidak melihat data internal yang dibatasi
- provisional badge muncul jika source belum final
- drill-down mengarah ke entity yang benar

---

## 14. Acceptance Checklist Implementasi

Implementasi dianggap siap bila:

1. Semua kontrak data inti tersedia.
2. Semua batch dapat ditelusuri dari raw file ke metric final.
3. KPI utama dihitung rule-based tanpa ketergantungan AI.
4. Payment monitoring menampilkan aging bucket dan overdue status dengan benar.
5. Risk engine menghasilkan event yang konsisten dan dapat diaudit.
6. Dashboard role-based berjalan dengan quality gate yang jelas.
7. Semua skenario teknis pada bagian test plan lolos.

---

## 15. Asumsi Implementasi

- Detail storage engine belum dikunci di dokumen ini; implementer boleh memakai DB relasional atau kombinasi staging + warehouse, selama kontrak data dan audit trail terpenuhi.
- Kanal input awal tetap batch/file-based.
- Workflow orchestration boleh tetap memakai n8n pada v1, tetapi logic kritikal harus tersentral di layer yang dapat diuji dan diaudit.
- Endpoint / service names final boleh mengikuti struktur codebase saat implementasi, tetapi behaviour modul harus mengikuti spec ini.
