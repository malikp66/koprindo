# PRODUCT REQUIREMENTS DOCUMENT
## Sistem Monitoring & Kontrol Risiko Terpadu FOX 2026
**Koprindo × PT Gunawan Elektro × Ritel Modern**

---

| Atribut | Detail |
|---|---|
| Versi | 4.1 |
| Tanggal | April 2026 |
| Status | Draft Final Revisi |
| Periode Eksekusi | Juli – Desember 2026 |
| Dibuat oleh | Tim Business Development Koprindo |
| Reviewer | Pak Ramsudin, Pak Jhon Ferry, Yessy |
| Klasifikasi | Konfidensial – Internal Use Only |

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Scope Produk](#2-scope-produk)
3. [Latar Belakang & Konteks Operasional](#3-latar-belakang--konteks-operasional)
4. [Tujuan & Sasaran Produk](#4-tujuan--sasaran-produk)
5. [Stakeholder & Hak Akses](#5-stakeholder--hak-akses)
6. [Monitoring & Risk Control Model](#6-monitoring--risk-control-model)
7. [Arsitektur Produk](#7-arsitektur-produk)
8. [Spesifikasi Fitur Inti](#8-spesifikasi-fitur-inti)
9. [Model Data & Antarmuka Konseptual](#9-model-data--antarmuka-konseptual)
10. [Kebijakan Data, AI, & Akurasi Angka](#10-kebijakan-data-ai--akurasi-angka)
11. [Financial Flow & Payment Monitoring](#11-financial-flow--payment-monitoring)
12. [Alur Data End-to-End](#12-alur-data-end-to-end)
13. [Governance, Audit Trail, & Decision Controls](#13-governance-audit-trail--decision-controls)
14. [Keamanan & Privasi Data](#14-keamanan--privasi-data)
15. [Timeline Implementasi](#15-timeline-implementasi)
16. [Kriteria Sukses & KPI Sistem](#16-kriteria-sukses--kpi-sistem)
17. [Analisa Risiko & Mitigasi](#17-analisa-risiko--mitigasi)
18. [Asumsi & Ketergantungan](#18-asumsi--ketergantungan)
19. [Out of Scope](#19-out-of-scope)

---

## 1. Ringkasan Eksekutif

Dokumen ini mendefinisikan kebutuhan produk untuk **Sistem Monitoring & Kontrol Risiko Terpadu FOX 2026** sebagai sistem operasional berbasis dashboard yang hanya berfokus pada dua area utama:

1. **Sistem Monitoring Berbasis Dashboard**
2. **Sistem Kontrol Risiko**

Sesuai ruang lingkup visual konsep, sistem harus mencakup kemampuan berikut:
- tracking `sell-in` dan `sell-out`
- distribusi per wilayah
- monitoring `aging payment`
- pembaruan data `near-real-time`
- kontrol `sell-out` dan stok
- kontrol pembayaran

Sistem ini diposisikan sebagai **control tower operasional** untuk memantau distribusi, stok, dan pembayaran secara terintegrasi. Fokus utamanya adalah memberi pandangan yang konsisten, dapat diaudit, dan cukup cepat untuk tindakan korektif bisnis.

AI boleh digunakan sebagai lapisan bantu untuk membuat insight, ringkasan, dan draft analisa. Namun seluruh angka final yang tampil di dashboard utama harus berasal dari pipeline rule-based yang deterministik.

---

## 2. Scope Produk

### 2.1 Pilar 1: Sistem Monitoring Berbasis Dashboard

Dashboard utama hanya perlu mencakup:
- tracking `sell-in`
- tracking `sell-out`
- distribusi per wilayah seperti Jawa, Sumatera, dan wilayah operasional lain
- monitoring `aging payment`
- status pembaruan data `near-real-time`

### 2.2 Pilar 2: Sistem Kontrol Risiko

Modul kontrol risiko hanya perlu mencakup:
- kontrol `sell-out` dan stok untuk optimasi distribusi
- pencegahan `overstock`
- pencegahan `stockout`
- kontrol pembayaran
- monitoring arus kas
- monitoring kepatuhan termin pembayaran

### 2.3 Definisi Real-Time

Dalam PRD ini, istilah `real-time` berarti **near-real-time berbasis event ingest**:
- dashboard diperbarui segera setelah batch valid selesai diproses
- tidak diasumsikan seluruh sumber data terhubung via live API streaming
- seluruh tampilan harus memuat `last updated timestamp`

---

## 3. Latar Belakang & Konteks Operasional

### 3.1 Konteks Distribusi

Alur operasional inti yang dipantau sistem:

`Produsen -> Gunawan Elektro -> Koprindo -> Ritel Modern`

### 3.2 Konteks Operasional yang Harus Dipantau

Sistem dibutuhkan karena operasional distribusi FOX membutuhkan visibilitas yang konsisten atas:
- barang masuk ke kanal distribusi (`sell-in`)
- barang terjual ke konsumen (`sell-out`)
- penyebaran distribusi per wilayah
- kondisi stok yang berisiko `overstock` atau `stockout`
- invoice, jatuh tempo, dan `aging payment`

### 3.3 Masalah yang Harus Diselesaikan

| No | Masalah | Dampak |
|---|---|---|
| 1 | Data `sell-in`, `sell-out`, stok, dan pembayaran tersebar di beberapa sumber | Pandangan operasional tidak utuh |
| 2 | Tidak ada dashboard tunggal untuk distribusi per wilayah | Tindakan korektif lambat |
| 3 | Risiko `overstock` dan `stockout` terlambat terdeteksi | Distribusi tidak optimal |
| 4 | `Aging payment` dan termin pembayaran tidak termonitor konsisten | Risiko arus kas meningkat |
| 5 | Angka dari berbagai sumber sulit diverifikasi | Keputusan bisnis sulit diaudit |

---

## 4. Tujuan & Sasaran Produk

### 4.1 Tujuan Utama

1. Menyediakan dashboard monitoring operasional untuk `sell-in`, `sell-out`, distribusi wilayah, dan `aging payment`.
2. Menyediakan kontrol risiko untuk stok dan pembayaran.
3. Memungkinkan tindakan korektif yang lebih cepat terhadap `overstock`, `stockout`, dan keterlambatan pembayaran.
4. Menjaga agar angka operasional utama dapat ditelusuri kembali ke data mentah dan diverifikasi ulang.

### 4.2 Sasaran Terukur

| Sasaran | Target | Periode |
|---|---|---|
| Waktu proses batch ke dashboard | <2 jam | Per event ingest |
| Akurasi metrik rule-based vs audit manual | >99% | Bulanan |
| Ketuntasan lineage dari data mentah ke angka final | 100% | Setiap batch |
| Deteksi risiko prioritas berbasis threshold | 100% terekam sebagai event | Setiap siklus |
| Visibility status pembayaran in-scope | 100% | Bulanan |

---

## 5. Stakeholder & Hak Akses

### 5.1 Pengguna Sistem

| Stakeholder | Kebutuhan Utama | Akses Utama |
|---|---|---|
| Tim Operasional / BD Koprindo | Monitoring distribusi harian dan tindak lanjut risiko | Dashboard operasional |
| Finance Koprindo | Monitoring invoice, due date, dan aging | Dashboard pembayaran |
| Manajemen Koprindo | Ringkasan performa distribusi, stok, dan pembayaran | Dashboard eksekutif |
| Admin Sistem | Validasi data, mapping, exception review | Konsol admin |
| Gunawan Elektro | Status distribusi dan pembayaran yang relevan | Dashboard read-only sesuai scope |

### 5.2 Prinsip Hak Akses

- akses berbasis role
- least privilege
- segregasi data per pihak
- data finansial detail hanya terlihat oleh role yang relevan

---

## 6. Monitoring & Risk Control Model

### 6.1 Domain Monitoring Wajib

| Domain | Fokus |
|---|---|
| `Sell-in monitoring` | volume barang masuk, distribusi per wilayah |
| `Sell-out monitoring` | volume barang keluar / terjual |
| `Inventory monitoring` | stok, stock cover, indikasi overstock / stockout |
| `Payment monitoring` | invoice, due date, aging payment, payment compliance |

### 6.2 Domain Risiko Wajib

| Risiko | Definisi |
|---|---|
| Risiko stok | `overstock`, `stockout`, stok tidak sehat |
| Risiko distribusi | ketimpangan distribusi wilayah, mismatch `sell-in` vs `sell-out` |
| Risiko pembayaran | invoice melewati termin, aging memburuk, outstanding menumpuk |
| Risiko data | file invalid, duplikasi, mismatch, kualitas data rendah |

---

## 7. Arsitektur Produk

Arsitektur produk dibatasi ke 4 domain inti berikut.

### 7.1 Data Intake & Validation

Tanggung jawab:
- menerima file atau batch data dari sumber operasional
- memvalidasi format, schema, mandatory fields, tipe data, dan periode
- melakukan registrasi batch dan versioning

### 7.2 Deterministic Metric Engine

Tanggung jawab:
- menghitung angka final `sell-in`, `sell-out`, distribusi wilayah, stok, dan pembayaran
- melakukan rekonsiliasi antar sumber
- menghasilkan metrik final yang dapat diaudit

### 7.3 Risk Control Engine

Tanggung jawab:
- menghasilkan `risk_event` berbasis threshold rule
- memberi severity dan owner tindak lanjut
- memisahkan data valid dari data provisional atau exception

### 7.4 Dashboard & Reporting Layer

Tanggung jawab:
- menampilkan dashboard monitoring
- menampilkan risk alert dan status tindak lanjut
- menampilkan ringkasan analisa berbantuan AI sebagai lapisan tambahan, bukan angka final

### 7.5 Diagram Konseptual

```text
Data Sources
   -> Intake & Validation
   -> Deterministic Metric Engine
   -> Risk Control Engine
   -> Dashboard & Reporting
```

---

## 8. Spesifikasi Fitur Inti

### 8.1 Fitur: Data Intake & Validation

Sistem harus menyediakan intake untuk data:
- `sell_in_record`
- `sell_out_record`
- `payment_record`
- `inventory_position`
- master wilayah / outlet

Kebutuhan inti:
- schema validation
- mandatory field checks
- duplicate detection
- batch registration
- rejection reason yang eksplisit

### 8.2 Fitur: Monitoring Dashboard

Dashboard inti harus mencakup:
- tracking `sell-in`
- tracking `sell-out`
- distribusi per wilayah
- monitoring `aging payment`
- status pembaruan data `near-real-time`
- data quality status

### 8.3 Fitur: Kontrol Sell-Out & Stok

Modul ini harus mendukung:
- deteksi mismatch `sell-in` vs `sell-out`
- pemantauan stok per wilayah / node distribusi
- deteksi `overstock`
- deteksi `stockout`
- prioritas tindak lanjut distribusi

### 8.4 Fitur: Kontrol Pembayaran

Modul ini harus mendukung:
- monitoring invoice
- monitoring due date
- klasifikasi `aging payment`
- outstanding visibility
- payment compliance check terhadap termin

### 8.5 Fitur: Analisa Berbantuan AI

AI hanya boleh dipakai untuk:
- ringkasan insight operasional
- draft narasi analisa
- rangkuman exception
- draft rekomendasi tindak lanjut

AI output harus:
- diberi label `AI-assisted`
- dipisahkan dari angka final dashboard
- tidak boleh auto-publish sebagai keputusan final

---

## 9. Model Data & Antarmuka Konseptual

### 9.1 `sell_in_record`

Field inti:
- periode
- wilayah
- channel
- outlet
- sku
- qty_sell_in
- tanggal_kirim
- batch_id
- source_file_id

### 9.2 `sell_out_record`

Field inti:
- periode
- wilayah
- channel
- outlet
- sku
- qty_sell_out
- tanggal_transaksi
- source_file_id

### 9.3 `inventory_position`

Field inti:
- periode
- wilayah
- channel
- outlet
- sku
- opening_stock
- closing_stock
- stock_cover_days

### 9.4 `payment_record`

Field inti:
- invoice_id
- pihak_pembayar
- pihak_penerima
- invoice_date
- due_date
- amount
- paid_amount
- payment_status
- aging_bucket

### 9.5 `data_quality_result`

Field inti:
- batch_id
- source_type
- quality_score
- validation_status
- blocking_issue_count
- review_required

### 9.6 `risk_event`

Field inti:
- event_id
- event_type
- severity
- entity_type
- entity_key
- threshold_rule
- observed_value
- event_status
- owner

### 9.7 `ai_insight_draft`

Field inti:
- insight_id
- reporting_period
- source_scope
- summary_text
- recommendation_text
- review_status
- reviewer

---

## 10. Kebijakan Data, AI, & Akurasi Angka

### 10.1 Prinsip Dasar

Sistem harus memilih:
- **akurasi di atas otomatisasi penuh**
- **auditability di atas kenyamanan narasi**
- **rule-based final numbers di atas AI interpretation**

### 10.2 Angka Final yang Wajib Rule-Based

Komponen berikut wajib dihasilkan oleh pipeline deterministik:
- total `sell-in`
- total `sell-out`
- distribusi per wilayah
- status `aging payment`
- `aging bucket`
- outstanding amount
- payment compliance
- status risiko final

### 10.3 Area AI yang Diizinkan

AI hanya boleh digunakan untuk:
- menjelaskan pola distribusi dalam bentuk narasi
- merangkum exception dan anomali
- menyusun draft executive summary
- menyusun draft rekomendasi follow-up

### 10.4 Area AI yang Dilarang Menjadi Sumber Kebenaran

AI tidak boleh menetapkan secara mandiri:
- angka KPI final
- nilai invoice final
- bucket aging final
- status publish data
- severity risiko final
- keputusan operasional final

### 10.5 Implikasi UI

Frontend dan backend harus mendukung:
- pemisahan visual antara `Final Value` dan `AI Insight`
- label `AI-assisted` pada semua output AI
- review gate untuk hasil AI sebelum dibagikan keluar
- audit trail atas siapa yang menyetujui insight AI

---

## 11. Financial Flow & Payment Monitoring

### 11.1 Scope

Modul pembayaran memantau:
- invoice ritel modern ke Koprindo
- kewajiban pembayaran Koprindo yang in-scope
- due date
- aging bucket
- outstanding
- kepatuhan termin

### 11.2 Metrik Pembayaran Wajib

| Metrik | Definisi |
|---|---|
| Total outstanding | Total invoice belum lunas |
| Current due | Invoice belum jatuh tempo |
| Past due | Invoice melewati due date |
| Aging bucket | 0–30, 31–45, 46–60, >60 hari |
| Payment compliance | % invoice dibayar sesuai termin |

### 11.3 Alert Pembayaran

Minimal severity:
- `warning`: mendekati jatuh tempo
- `high`: melewati termin
- `critical`: aging di atas threshold yang disepakati

---

## 12. Alur Data End-to-End

### 12.1 Siklus Umum

1. Sumber data mengirim batch operasional.
2. Sistem membuat `batch registration`.
3. Validasi format dan schema dijalankan.
4. Data valid masuk ke area normalisasi.
5. Rekonsiliasi antar sumber dijalankan.
6. `Deterministic metric engine` menghitung angka final.
7. `Risk control engine` menghasilkan event.
8. Dashboard diperbarui.
9. Insight AI opsional dibuat dari data yang sudah lolos quality gate.
10. Semua langkah dicatat dalam audit trail.

### 12.2 Status Batch

Setiap batch harus memiliki status:
- `received`
- `validated`
- `rejected`
- `normalized`
- `reconciled`
- `published`
- `exception_review`

---

## 13. Governance, Audit Trail, & Decision Controls

### 13.1 Audit Trail

Sistem wajib mencatat:
- file atau batch diterima dari siapa dan kapan
- hasil validasi
- hasil rekonsiliasi
- aturan risiko yang memicu event
- publikasi dashboard
- insight AI yang dibuat
- intervensi manual dan approval

### 13.2 Governance Operasional

Pembagian tanggung jawab minimum:
- admin sistem: validasi, mapping, exception review
- tim operasional: tindak lanjut distribusi dan stok
- finance: tindak lanjut pembayaran
- manajemen: approval keputusan berdampak tinggi

### 13.3 Decision Controls

Keputusan berikut wajib berbasis data yang lolos quality gate:
- publikasi dashboard utama
- status distribusi wilayah
- status stok kritikal
- status `aging payment`
- status risiko final

Insight AI hanya boleh menjadi bahan bantu analisa dan tidak boleh menggantikan keputusan final.

---

## 14. Keamanan & Privasi Data

### 14.1 Prinsip Keamanan

- akses berbasis role
- least privilege
- segregasi view antar pihak
- seluruh akses dan perubahan tercatat

### 14.2 Batasan Transparansi

Transparansi dalam scope PRD ini berarti:
- pihak terkait dapat melihat data yang diperlukan untuk monitoring dan tindak lanjut
- data sensitif finansial tidak dibuka di luar role yang berwenang

### 14.3 Retensi Data

Data mentah, hasil validasi, event risiko, dan ringkasan dashboard harus disimpan cukup lama untuk:
- audit
- investigasi dispute
- analisa tren historis

---

## 15. Timeline Implementasi

| Fase | Fokus | Deliverable Utama |
|---|---|---|
| Fase 0 | Penyelarasan data source dan rule operasional | baseline rule, owner, source list |
| Fase 1 | Data intake & validation | registry batch, schema validation, quality scoring |
| Fase 2 | Monitoring dashboard | `sell-in`, `sell-out`, distribusi wilayah, `aging payment` |
| Fase 3 | Risk control | kontrol stok dan kontrol pembayaran |
| Fase 4 | Governance & reporting | audit trail, alerting, AI insight labeling |
| Fase 5 | UAT & hardening | test skenario, backtracking, sign-off |

---

## 16. Kriteria Sukses & KPI Sistem

### 16.1 KPI Sistem

| KPI | Target |
|---|---|
| Akurasi kalkulasi rule-based | >99% vs audit manual |
| Ketuntasan audit trail | 100% batch kritikal punya lineage lengkap |
| Deteksi risiko stok dan pembayaran | 100% threshold event tercatat |
| Ketepatan klasifikasi aging bucket | 100% invoice termonitor sesuai due date |
| Ketepatan label AI-assisted | 100% output AI terpisah dari angka final |

### 16.2 Acceptance Scenarios

PRD dianggap berhasil diterjemahkan dengan benar bila implementer dapat membangun sistem yang lolos skenario:
- dashboard menampilkan `sell-in`, `sell-out`, distribusi wilayah, dan `aging payment`
- risiko `overstock` dan `stockout` muncul dari rule yang dapat diaudit
- invoice melewati termin ter-flag otomatis
- semua angka final dapat ditelusuri kembali ke sumber data mentah
- insight AI tampil terpisah dan tidak menimpa angka final dashboard

---

## 17. Analisa Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Schema sumber data berubah | Perhitungan gagal atau salah | schema validation dan versioning |
| Data antar sumber tidak sinkron | dashboard tidak akurat | reconciliation layer dan mismatch event |
| AI memberi narasi yang menyesatkan | pengguna salah membaca kondisi | label `AI-assisted`, review gate, pisahkan dari final value |
| Aging payment tidak lengkap | risiko arus kas tidak terlihat | payment data contract dan exception flag |
| Stok tidak termonitor akurat | risiko `overstock` / `stockout` tidak terdeteksi | inventory validation dan threshold rule |

---

## 18. Asumsi & Ketergantungan

### 18.1 Asumsi

- sumber data operasional tersedia secara periodik
- definisi wilayah distribusi disepakati lintas pihak
- termin pembayaran dapat dipetakan ke rule sistem
- monitoring `real-time` dimaknai sebagai `near-real-time` berbasis event ingest

### 18.2 Ketergantungan

- konsistensi format file dari sumber operasional
- ketersediaan master wilayah, outlet, dan SKU
- kesepakatan threshold risiko stok dan pembayaran
- kesepakatan hak akses antar stakeholder

---

## 19. Out of Scope

Hal berikut berada di luar scope PRD inti ini:
- legal drafting atau dokumen kerja sama formal
- perhitungan margin komersial detail
- forecasting machine learning sebagai sumber keputusan utama
- AI agent atau workflow orchestration sebagai inti logic perhitungan
- live API penuh untuk semua pihak
- modul di luar monitoring dashboard dan kontrol risiko yang digambarkan pada konsep visual
