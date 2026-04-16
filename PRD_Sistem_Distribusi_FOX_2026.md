# PRODUCT REQUIREMENTS DOCUMENT
## Sistem Monitoring & Kontrol Risiko Terpadu FOX 2026
**Koprindo (Distributor Nasional) × PT Gunawan Elektro × Ritel Modern**

---

| Atribut | Detail |
|---|---|
| Versi | 4.0 |
| Tanggal | April 2026 |
| Status | Draft Final Revisi |
| Periode Eksekusi | Juli – Desember 2026 |
| Dibuat oleh | Tim Business Development Koprindo |
| Reviewer | Pak Ramsudin, Pak Jhon Ferry, Yessy |
| Klasifikasi | Konfidensial – Internal Use Only |

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Latar Belakang & Konteks Bisnis](#2-latar-belakang--konteks-bisnis)
3. [Tujuan & Sasaran Produk](#3-tujuan--sasaran-produk)
4. [Stakeholder & Peran Para Pihak](#4-stakeholder--peran-para-pihak)
5. [Monitoring & Risk Control Model](#5-monitoring--risk-control-model)
6. [Arsitektur Produk](#6-arsitektur-produk)
7. [Spesifikasi Fitur Inti](#7-spesifikasi-fitur-inti)
8. [Model Data & Antarmuka Konseptual](#8-model-data--antarmuka-konseptual)
9. [Data Reliability & Accuracy Framework](#9-data-reliability--accuracy-framework)
10. [Financial Flow & Payment Monitoring](#10-financial-flow--payment-monitoring)
11. [Alur Data End-to-End](#11-alur-data-end-to-end)
12. [Governance, Audit Trail, and Decision Controls](#12-governance-audit-trail-and-decision-controls)
13. [Keamanan & Privasi Data](#13-keamanan--privasi-data)
14. [Timeline Implementasi](#14-timeline-implementasi)
15. [Kriteria Sukses & KPI Sistem](#15-kriteria-sukses--kpi-sistem)
16. [Analisa Risiko & Mitigasi](#16-analisa-risiko--mitigasi)
17. [Asumsi & Ketergantungan](#17-asumsi--ketergantungan)
18. [Out of Scope](#18-out-of-scope)
19. [Lampiran A — Norma PKS / Pokok Kesepakatan](#19-lampiran-a--norma-pks--pokok-kesepakatan)
20. [Lampiran B — Orkestrasi n8n AI Agent & Human Review](#20-lampiran-b--orkestrasi-n8n-ai-agent--human-review)

---

## 1. Ringkasan Eksekutif

Dokumen ini mendefinisikan kebutuhan produk untuk **Sistem Monitoring & Kontrol Risiko Terpadu FOX 2026**, yaitu sistem control tower operasional yang mendukung kemitraan distribusi nasional antara **PT Gunawan Elektro**, **Koprindo**, **ritel modern** (Alfamart, Indomaret, AksesMu), dan **pihak konsultan**.

Sistem ini tidak lagi diposisikan hanya sebagai dashboard ranking distribusi, tetapi sebagai **pusat pemantauan operasional dan risiko** yang menghubungkan:
- alur distribusi nasional dari produsen hingga ritel modern
- monitoring `sell-in`, `sell-out`, distribusi per wilayah, dan `aging payment`
- kontrol risiko atas `overstock`, `stockout`, mismatch distribusi, dan keterlambatan pembayaran
- transparansi data serta pelaporan berkala untuk pengambilan keputusan lintas pihak

### Pernyataan Masalah

Model distribusi FOX memiliki tanggung jawab operasional dan finansial yang tinggi. Tanpa sistem monitoring terpadu, para pihak tidak memiliki pandangan objektif atas:
- barang masuk ke kanal ritel (`sell-in`)
- barang terjual ke konsumen akhir (`sell-out`)
- penyebaran distribusi per wilayah dan per channel
- ketersediaan stok dan risiko kelebihan atau kekurangan stok
- arus kas dan kepatuhan termin pembayaran
- akurasi data yang dipakai untuk laporan, evaluasi, dan keputusan bisnis

Akibatnya, risiko utama tidak dapat dikendalikan dini: distribusi tidak merata, penumpukan barang, kekosongan stok, keterlambatan pembayaran, laporan tidak sinkron, dan keputusan bisnis tidak cukup dapat diaudit.

### Solusi

Membangun sistem monitoring berbasis dashboard dan workflow data yang:
- menerima data operasional dari beberapa sumber bisnis dalam batch bulanan dan event-driven
- melakukan validasi, rekonsiliasi, scoring kualitas data, dan pencatatan lineage penuh
- menghasilkan metrik rule-based yang deterministik untuk KPI operasional, finansial, dan risiko
- memberikan exception management, alert, dan laporan periodik sesuai peran pengguna
- tetap dapat menggunakan AI untuk parsing tidak standar, klasifikasi exception, dan insight, tetapi **bukan sebagai sumber kebenaran angka final**

### Hasil yang Diharapkan

Pada akhir implementasi, sistem harus mampu menjadi satu-satunya control tower operasional yang dipakai para pihak untuk:
- memonitor status target nasional **25.000.000 unit**
- memantau performa channel Alfamart, Indomaret, dan AksesMu
- memverifikasi kesehatan distribusi dan arus kas
- mengidentifikasi risiko sebelum menjadi masalah bisnis besar
- menjaga akurasi data untuk pelaporan, evaluasi PKS, dan keputusan manajemen

---

## 2. Latar Belakang & Konteks Bisnis

### 2.1 Struktur Distribusi Nasional

Struktur distribusi nasional yang disepakati adalah:

`Produsen China -> Gunawan Elektro (Impor & Logistik) -> Koprindo (Distributor Nasional) -> Ritel Modern (Alfamart, Indomaret, AksesMu)`

### 2.2 Peran Bisnis Inti

| Pihak | Posisi Bisnis | Tanggung Jawab Inti |
|---|---|---|
| Produsen China | Sumber barang | Produksi barang FOX |
| Gunawan Elektro | Impor & logistik | Pengadaan impor, logistik dari produsen ke Indonesia |
| Koprindo | Distributor nasional | Pengelolaan barang, pergudangan, distribusi ke gerai ritel |
| Ritel modern | End-point sales | Titik penjualan akhir ke konsumen |
| Konsultan | Strategic oversight | Strategi penetrasi, pengawasan distribusi, monitoring, pelaporan terpadu |

### 2.3 Target Penjualan Nasional

| Channel | Target Unit | Catatan |
|---|---|---|
| Alfamart | 10.000.000 unit | Kanal ritel modern utama |
| Indomaret | 10.000.000 unit | Kanal ritel modern utama |
| AksesMu | 5.000.000 unit | Kanal distribusi warung / jaringan mitra |
| **Total** | **25.000.000 unit** | Target kumulatif nasional |

Estimasi performa dasar yang digunakan untuk pemantauan adalah **3–4 unit per toko per hari** atau sekitar **100 unit per toko per bulan**.

### 2.4 Konteks Arus Kas

| Aliran Pembayaran | Termin |
|---|---|
| Ritel modern -> Koprindo | 30–45 hari kerja setelah invoice lengkap dan benar |
| Koprindo -> Gunawan Elektro | 45–60 hari kerja |

Konsekuensinya, sistem wajib memantau **aging payment**, **jatuh tempo invoice**, dan **exposure arus kas**, karena kontrol distribusi tanpa kontrol pembayaran akan menghasilkan risiko operasional yang tidak lengkap.

### 2.5 Masalah yang Harus Diselesaikan Sistem

| No | Masalah | Dampak |
|---|---|---|
| 1 | Tidak ada pandangan tunggal atas `sell-in`, `sell-out`, stok, dan pembayaran | Keputusan tidak komprehensif |
| 2 | Tidak ada rekonsiliasi data antar sumber | Angka dashboard rawan tidak sinkron |
| 3 | Tidak ada kontrol dini terhadap `overstock` dan `stockout` | Risiko distribusi dan service level meningkat |
| 4 | Tidak ada monitoring usia piutang dan kepatuhan termin | Risiko arus kas meningkat |
| 5 | Tidak ada governance data yang kuat | Angka sulit diaudit dan dipertanggungjawabkan |
| 6 | Tidak ada mekanisme exception management yang sistematis | Investigasi masih manual dan terlambat |

---

## 3. Tujuan & Sasaran Produk

### 3.1 Tujuan Utama

1. Menyediakan **control tower terpadu** untuk distribusi, stok, pembayaran, dan risiko.
2. Menjamin **akurasi data** untuk keputusan bernilai tinggi dan pelaporan resmi.
3. Memastikan target distribusi nasional **25 juta unit** dapat dipantau dan diturunkan ke channel, wilayah, cabang, dan toko.
4. Memungkinkan intervensi dini atas risiko `overstock`, `stockout`, mismatch distribusi, dan keterlambatan pembayaran.
5. Mendukung peran strategis konsultan dalam monitoring, transparansi data, dan pelaporan berkala.

### 3.2 Sasaran Terukur

| Sasaran | Target | Periode |
|---|---|---|
| Akurasi KPI deterministik vs audit manual | >99% | Bulanan |
| Ketuntasan lineage sumber data ke angka final | 100% | Setiap batch |
| Waktu proses batch ke dashboard | <2 jam | Per event ingest |
| Coverage rekonsiliasi data kritikal | 100% untuk data yang tersedia | Bulanan |
| Deteksi risiko prioritas | 100% threshold tercatat sebagai event | Setiap siklus |
| Ketepatan pelaporan berkala | 100% sesuai role dan jadwal | Bulanan |

---

## 4. Stakeholder & Peran Para Pihak

### 4.1 Pengguna Sistem

| Stakeholder | Kepentingan | Akses Utama |
|---|---|---|
| Tim BD Koprindo | Operasional harian, pengawasan distribusi, tindakan korektif | Dashboard penuh operasional dan alert |
| Manajemen Koprindo | Kinerja channel, arus kas, risiko | Dashboard eksekutif dan laporan periodik |
| Gunawan Elektro | Status distribusi nasional, performa channel, pembayaran dari Koprindo | Dashboard read-only sesuai scope |
| PIC ritel modern | Pengiriman data dan klarifikasi exception | Portal intake / upload |
| Pihak Konsultan | Strategi penetrasi, monitoring, transparansi data, laporan performa | Dashboard strategy & reporting |
| Admin sistem | Pengelolaan mapping, exception, review kualitas data | Konsol admin penuh |

### 4.2 Prinsip Hak Akses

- Gunawan Elektro melihat status distribusi, target, dan pembayaran dari Koprindo yang relevan untuk kemitraan.
- Koprindo melihat detail operasional paling lengkap.
- Konsultan melihat data yang diperlukan untuk pengawasan, monitoring, analisis, dan pelaporan.
- Data sensitif yang tidak relevan bagi pihak lain harus disaring per role.

---

## 5. Monitoring & Risk Control Model

### 5.1 Domain Monitoring Wajib

Sistem harus memonitor minimal 4 domain berikut:

| Domain | Fokus |
|---|---|
| Distribusi | `sell-in`, distribusi per wilayah, channel, cabang, outlet |
| Penjualan | `sell-out`, sell-through, target vs actual |
| Persediaan | stok, velocity, stock cover, risiko overstock/stockout |
| Finansial | invoice, due date, aging payment, kepatuhan termin |

### 5.2 Domain Risiko Wajib

| Risiko | Definisi |
|---|---|
| Risiko stok | overstock, stockout, stok tidak bergerak |
| Risiko distribusi | deviasi target, mismatch sell-in vs sell-out, coverage rendah |
| Risiko pembayaran | invoice melewati termin, aging memburuk, konsentrasi piutang |
| Risiko data | file invalid, schema drift, duplikasi, mismatch, data quality rendah |

### 5.3 Definisi “Real-Time”

Dalam PRD ini, istilah `real-time` didefinisikan sebagai **near-real-time berbasis event ingest**:
- dashboard diperbarui segera setelah batch / event valid selesai diproses
- tidak diasumsikan ada integrasi live API stream untuk seluruh sumber data
- semua tampilan harus menyertakan `last updated timestamp` dan status kualitas data

---

## 6. Arsitektur Produk

Arsitektur produk dirombak menjadi 4 domain inti.

### 6.1 Data Intake & Validation

Tanggung jawab:
- menerima file atau batch data dari sumber operasional
- memvalidasi format, schema, mandatory fields, tipe data, ukuran, periode, dan idempotency
- melakukan registrasi batch dan versioning

### 6.2 Monitoring & Reconciliation

Tanggung jawab:
- menyatukan `sell_in_record`, `sell_out_record`, `payment_record`, dan master data
- menghitung metrik operasional yang deterministik
- melakukan rekonsiliasi antar sumber dan mencatat mismatch

### 6.3 Risk Control Engine

Tanggung jawab:
- menghasilkan `risk_event` berbasis threshold rule
- mengelompokkan severity, owner, dan SLA tindak lanjut
- menjaga gating data berkualitas rendah agar tidak menjadi angka eksekutif tanpa flag

### 6.4 Reporting & Governance

Tanggung jawab:
- dashboard per role
- laporan berkala
- audit trail dan drill-down ke sumber mentah
- review manual untuk metrik kritikal

### 6.5 Diagram Arsitektur Konseptual

```
Data Sources
   -> Intake & Validation
   -> Monitoring & Reconciliation
   -> Risk Control Engine
   -> Reporting & Governance
```

---

## 7. Spesifikasi Fitur Inti

### 7.1 Fitur: Data Intake & Validation

Sistem harus menyediakan intake untuk data:
- sell-in
- sell-out
- payment / invoice
- inventory position
- master distribusi

Kebutuhan inti:
- schema validation
- mandatory column checks
- type checks
- duplicate detection
- versioning file
- checksum / batch fingerprint
- rejection reason yang eksplisit

### 7.2 Fitur: Monitoring Dashboard

Dashboard inti harus mencakup:
- tracking `sell-in` dan `sell-out`
- distribusi per wilayah
- target vs actual per channel
- stok, velocity, dan stock cover
- aging payment
- variance `sell-in` vs `sell-out`
- data quality status

### 7.3 Fitur: Risk Control Engine

Minimal harus ada rule untuk:
- risiko overstock
- risiko stockout
- aging payment melewati threshold
- mismatch sell-in dan sell-out
- keterlambatan data / batch
- deviasi target distribusi

Setiap risk event harus punya:
- `event_id`
- jenis risiko
- severity
- entitas terdampak
- timestamp
- rule yang memicu
- status penanganan
- owner tindak lanjut

### 7.4 Fitur: Reporting Berkala

Laporan harus tersedia dalam bentuk:
- dashboard role-based
- ringkasan eksekutif bulanan
- laporan performa channel
- laporan risiko prioritas
- laporan evaluasi PKS

### 7.5 Fitur: Strategic Consultant View

View khusus konsultan harus mendukung:
- strategi penetrasi ritel
- monitoring performa distribusi
- transparansi data antar pihak
- pelaporan bisnis berkala
- narasi evaluasi berbasis data yang dapat diaudit

---

## 8. Model Data & Antarmuka Konseptual

Dokumen ini menambah domain data inti berikut.

### 8.1 `sell_in_record`

Representasi barang masuk ke kanal ritel atau gudang ritel.

Field inti:
- periode
- channel
- wilayah
- cabang
- outlet
- sku
- qty_sell_in
- tanggal_kirim / tanggal_terima
- batch_id
- source_file_id

### 8.2 `sell_out_record`

Representasi barang terjual ke konsumen akhir.

Field inti:
- periode
- channel
- wilayah
- cabang
- outlet
- sku
- qty_sell_out
- nilai_penjualan
- source_file_id

### 8.3 `payment_record`

Representasi invoice dan status pembayaran.

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

### 8.4 `inventory_position`

Representasi posisi stok.

Field inti:
- periode
- channel
- wilayah
- cabang
- outlet
- sku
- opening_stock
- closing_stock
- stock_cover_days

### 8.5 `data_quality_result`

Representasi kualitas data per batch / file.

Field inti:
- batch_id
- source_type
- quality_score
- validation_status
- issue_count
- blocking_issue_count
- review_required

### 8.6 `risk_event`

Representasi event risiko yang dihasilkan engine.

Field inti:
- event_id
- event_type
- severity
- entity_type
- entity_key
- metric_name
- threshold_rule
- observed_value
- event_status

### 8.7 `executive_report`

Representasi output pelaporan eksekutif.

Field inti:
- reporting_period
- audience
- headline_metrics
- major_risks
- data_quality_summary
- decision_notes

---

## 9. Data Reliability & Accuracy Framework

Ini adalah section kritikal dari PRD.

### 9.1 Prinsip Dasar

Sistem harus memilih:
- **akurasi di atas otomatisasi penuh**
- **auditability di atas kecepatan semu**
- **deterministic computation di atas AI-only interpretation**

### 9.2 Mekanisme Keandalan Data

Sistem wajib memiliki:
- template intake per sumber data
- schema validation
- versioning file dan batch
- checksum / fingerprint untuk idempotency
- duplicate detection
- master data mapping
- referential checks antar entitas
- rekonsiliasi antar `sell-in`, `sell-out`, `payment`
- quality score per file dan per batch
- audit trail penuh dari file mentah ke metrik final

### 9.3 Posisi AI dalam Sistem

AI hanya boleh digunakan untuk:
- parsing format tidak standar
- klasifikasi exception
- insight naratif
- rekomendasi analitis non-final

AI tidak boleh menjadi sumber kebenaran tunggal untuk:
- KPI final
- aging payment
- nilai invoice
- target vs actual
- status risiko final

### 9.4 Decision Control

Aturan wajib:
- batch dengan blocking issue tidak boleh dipublikasikan ke dashboard utama
- batch dengan quality score rendah harus tampil dengan flag exception
- metrik finansial dan KPI PKS wajib dapat diverifikasi ulang secara manual
- perubahan master mapping harus tercatat siapa, kapan, dan alasannya

### 9.5 Acceptance Rules

Sistem dianggap memenuhi desain ini bila:
- semua angka final dapat ditelusuri balik ke sumber mentah
- mismatch antar sumber muncul sebagai event yang jelas
- pengguna dapat membedakan data valid, provisional, dan exception

---

## 10. Financial Flow & Payment Monitoring

### 10.1 Scope

Modul ini memantau:
- invoice keluar dari ritel modern ke Koprindo
- invoice / kewajiban Koprindo ke Gunawan Elektro
- due date
- aging bucket
- exposure arus kas

### 10.2 Metrik Pembayaran Wajib

| Metrik | Definisi |
|---|---|
| Total outstanding | Total nilai invoice belum lunas |
| Current due | Invoice belum jatuh tempo |
| Past due | Invoice melewati due date |
| Aging bucket | 0–30, 31–45, 46–60, >60 hari |
| DSO proxy | Rata-rata usia piutang aktif |
| Payment compliance | % invoice dibayar sesuai termin |

### 10.3 Alert Pembayaran

Minimal severity:
- warning: mendekati jatuh tempo
- high: melewati termin
- critical: aging berada di atas threshold yang disepakati

---

## 11. Alur Data End-to-End

### 11.1 Siklus Umum

1. Sumber data mengirim batch operasional.
2. Sistem membuat `batch registration`.
3. Validasi format dan schema dijalankan.
4. Jika lolos, data masuk ke area normalisasi.
5. Master mapping diterapkan.
6. Rekonsiliasi antar sumber dijalankan.
7. KPI dan metrik rule-based dihitung.
8. Risk engine menghasilkan event.
9. Dashboard dan laporan diperbarui.
10. Semua langkah dicatat dalam audit trail.

### 11.2 Status Batch

Setiap batch harus memiliki status:
- received
- validated
- rejected
- normalized
- reconciled
- published
- exception_review

---

## 12. Governance, Audit Trail, and Decision Controls

### 12.1 Audit Trail

Sistem wajib mencatat:
- file / batch diterima dari siapa dan kapan
- hasil validasi
- perubahan mapping
- hasil rekonsiliasi
- aturan risiko yang memicu event
- publikasi dashboard / laporan
- intervensi manual dan approval

### 12.2 Governance Operasional

Harus ada pembagian tanggung jawab:
- admin sistem: mapping, quality review, exception resolution
- tim BD: tindakan operasional dan investigasi
- manajemen: approval untuk keputusan berdampak tinggi
- konsultan: analisis, transparansi, pelaporan berkala

### 12.3 Decision Controls

Keputusan berikut wajib berbasis data yang lolos quality gate:
- laporan resmi performa
- status target distribusi
- keputusan koreksi distribusi
- evaluasi PKS
- laporan aging payment

---

## 13. Keamanan & Privasi Data

### 13.1 Prinsip Keamanan

- akses berbasis role
- least privilege
- segregasi view antar pihak
- seluruh sumber data memiliki pemilik dan jejak akses

### 13.2 Batasan Transparansi

Transparansi data dalam PRD ini berarti:
- pihak yang relevan dapat melihat data yang dibutuhkan untuk keputusan
- tetapi tidak semua pihak dapat melihat seluruh detail komersial atau operasional

### 13.3 Retensi dan Audit

Data mentah, hasil validasi, event risiko, dan laporan eksekutif harus disimpan cukup lama untuk:
- audit
- investigasi dispute
- analisis tren historis

---

## 14. Timeline Implementasi

| Fase | Fokus | Deliverable Utama |
|---|---|---|
| Fase 0 | Penyelarasan bisnis & norma PKS | baseline rule, owner, data source list |
| Fase 1 | Data intake & validation | registry batch, schema validation, quality scoring |
| Fase 2 | Monitoring & reconciliation | model data inti, KPI deterministik, mismatch detection |
| Fase 3 | Risk control & financial monitoring | risk engine, aging payment, stock control |
| Fase 4 | Dashboard & governance | role-based dashboard, laporan berkala, audit trail |
| Fase 5 | UAT & operational hardening | test skenario, data backtracking, sign-off |

---

## 15. Kriteria Sukses & KPI Sistem

### 15.1 KPI Sistem

| KPI | Target |
|---|---|
| Akurasi kalkulasi KPI rule-based | >99% vs audit manual |
| Ketuntasan audit trail | 100% batch kritikal punya lineage lengkap |
| Deteksi mismatch antar sumber | 100% mismatch signifikan ter-flag |
| Ketepatan klasifikasi aging bucket | 100% invoice termonitor sesuai due date |
| Ketepatan risk event | 100% threshold rule tercatat konsisten |

### 15.2 KPI Bisnis Utama

| KPI | Target |
|---|---|
| Total distribusi nasional | 25.000.000 unit |
| Target Alfamart | 10.000.000 unit |
| Target Indomaret | 10.000.000 unit |
| Target AksesMu | 5.000.000 unit |
| Visibility pembayaran | 100% invoice in-scope punya status |

### 15.3 Acceptance Scenarios

PRD dianggap berhasil diterjemahkan dengan benar bila implementer dapat membangun sistem yang lolos skenario:
- ingest multi-file bulanan tanpa duplikasi dan tanpa kehilangan lineage
- mismatch `sell-in` dan `sell-out` terdeteksi
- aging payment otomatis terkelompok sesuai bucket
- risiko `overstock` dan `stockout` muncul dari rule yang dapat diaudit
- dashboard eksekutif hanya menampilkan data yang lolos quality gate atau diberi flag
- target 25 juta unit dapat diturunkan ke channel dan dipantau terhadap aktual
- angka kritikal dapat ditelusuri kembali ke sumber data mentah

---

## 16. Analisa Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Schema sumber data berubah | Perhitungan gagal atau salah | schema validation, versioning, source-specific templates |
| Data antar sumber tidak sinkron | dashboard tidak akurat | reconciliation layer dan mismatch event |
| AI salah parsing | angka turunan keliru | deterministic KPI pipeline, review queue, fallback manual |
| Aging payment tidak lengkap | risiko arus kas tidak terlihat | payment data contract dan exception flag |
| Master data tidak konsisten | agregasi salah | mapping governance dan approval log |
| Data kualitas rendah tetap tampil | keputusan salah | quality gating dan label provisional |

---

## 17. Asumsi & Ketergantungan

### 17.1 Asumsi

- Koprindo adalah distributor nasional.
- Gunawan Elektro menangani impor dan logistik dari produsen China.
- Ritel modern adalah titik penjualan akhir.
- Konsultan memiliki peran eksplisit dalam strategi penetrasi, monitoring, pengawasan distribusi, dan pelaporan.
- Monitoring `real-time` dimaknai sebagai `near-real-time` berbasis event ingest.
- Akurasi dan auditability diprioritaskan di atas otomatisasi penuh.

### 17.2 Ketergantungan

- ketersediaan sumber data operasional yang konsisten
- definisi master data lintas pihak
- kesepakatan governance untuk review exception
- kesepakatan hak akses antar stakeholder

---

## 18. Out of Scope

Hal berikut berada di luar scope PRD inti ini:
- legal drafting final PKS dengan bahasa hukum final
- otomasi live API penuh untuk semua pihak
- forecasting berbasis machine learning yang menjadi sumber keputusan utama
- penggantian ERP atau sistem keuangan utama milik masing-masing pihak

---

## 19. Lampiran A — Norma PKS / Pokok Kesepakatan

Lampiran ini merangkum norma bisnis dari materi meeting dan menjadi dasar requirement sistem.

### Pasal 1 — Peran dan Tanggung Jawab Para Pihak

1. Gunawan Elektro bertanggung jawab atas proses impor dan logistik dari produsen China ke Indonesia.
2. Koprindo bertindak sebagai distributor nasional yang bertanggung jawab atas pengelolaan barang, pergudangan, dan distribusi ke gerai ritel.
3. Pihak ritel modern bertindak sebagai titik penjualan akhir kepada konsumen.
4. Pihak konsultan bertindak sebagai perancang strategi, pengawas distribusi, dan penyedia sistem pelaporan terpadu.

**Implikasi sistem:**
- role-based visibility
- pelaporan lintas pihak
- ownership yang jelas pada setiap event dan data source

### Pasal 2 — Alur Distribusi & Operasional Barang

1. Alur distribusi: `Produsen China -> Gunawan Elektro -> Gudang Koprindo -> Gudang Ritel Modern`.
2. PO diterbitkan oleh ritel modern kepada Koprindo, lalu diteruskan ke Gunawan Elektro untuk pengadaan dan pengiriman.

**Implikasi sistem:**
- sistem harus dapat melacak status `sell-in` dan aliran distribusi
- sistem harus mampu membandingkan rencana, barang masuk, dan penjualan keluar

### Pasal 3 — Target Penjualan

1. Target nasional kumulatif adalah **25.000.000 unit**.
2. Alokasi per kanal:
   - Alfamart: 10.000.000 unit
   - Indomaret: 10.000.000 unit
   - AksesMu: 5.000.000 unit
3. Target performa dasar: 3–4 unit per hari per toko atau sekitar 100 unit per bulan.

**Implikasi sistem:**
- target harus tersedia di level nasional, channel, dan turunan operasional
- dashboard harus menampilkan target vs actual

### Pasal 4 — Skema Komersial dan Pembagian Margin

1. Margin ritel modern: **5%**.
2. Margin distributor Koprindo: **3%**.
3. Biaya jasa konsultan: **Rp1.000 per unit** yang berhasil didistribusikan / terjual.

**Implikasi sistem:**
- pelaporan harus mampu memberi konteks akuntabilitas performa terhadap skema komersial
- fee konsultan dicatat sebagai konteks pelaporan, bukan kalkulator keuangan final tanpa approval

### Pasal 5 — Termin Pembayaran / Arus Kas

1. Termin pembayaran ritel modern ke Koprindo: **30–45 hari kerja** setelah invoice diterima lengkap dan benar.
2. Termin pembayaran Koprindo ke Gunawan Elektro: **45–60 hari kerja**.

**Implikasi sistem:**
- wajib ada modul invoice, due date, aging payment, outstanding, dan payment compliance

### Pasal 6 — Sistem Monitoring dan Kontrol Risiko

1. Para pihak sepakat menggunakan sistem monitoring berbasis dashboard yang mencakup:
   - `sell-in`
   - `sell-out`
   - distribusi per wilayah
   - `aging payment`
2. Pihak konsultan dan distributor wajib melakukan kontrol ketat terhadap ketersediaan stok guna memitigasi `overstock` dan `stockout`.

**Implikasi sistem:**
- dashboard control tower
- risk engine untuk stok, distribusi, dan pembayaran
- event-driven updates

### Pasal 7 — Peran Strategis Konsultan

1. Konsultan wajib memberi panduan strategi penetrasi ritel.
2. Konsultan memonitor pergerakan penjualan.
3. Konsultan menyajikan laporan performa bisnis secara berkala.
4. Konsultan menjamin transparansi data dan akurasi pelaporan untuk pengambilan keputusan objektif.

**Implikasi sistem:**
- view strategy dan executive reporting untuk konsultan
- akurasi dan transparansi menjadi requirement inti produk

---

**Catatan:** Lampiran ini adalah kerangka norma bisnis untuk mengikat kebutuhan sistem. Bahasa hukum final tetap perlu ditinjau dan dibakukan oleh tim legal sebelum dimasukkan ke dokumen PKS final.

---

## 20. Lampiran B — Orkestrasi n8n AI Agent & Human Review

Lampiran ini menegaskan posisi `n8n` dan `AI agent` sebagai **lapisan orkestrasi dan assistive intelligence**, bukan sebagai sumber kebenaran utama untuk angka operasional dan finansial.

### 20.1 Peran n8n dalam Arsitektur

`n8n` direkomendasikan menjadi orchestration layer untuk:
- menerima trigger dari event ingest, exception, dan reporting
- menjalankan workflow notifikasi, reminder, assignment, dan routing approval
- memanggil AI agent untuk parsing atau enrichment yang non-deterministik
- mengirim hasil agent ke review queue atau modul operasional yang relevan

`n8n` **tidak** menjadi tempat kalkulasi KPI final, aging payment final, atau penetapan status risiko final.

### 20.1.1 Notification & Escalation Channels

Kanal notifikasi yang direkomendasikan untuk implementasi production:

| Kanal | Fungsi Utama | Contoh Trigger |
|---|---|---|
| In-app notification | alert operasional harian di dashboard | batch gagal validasi, risk event baru |
| WhatsApp | notifikasi cepat untuk tindak lanjut lapangan dan finance | reminder upload, aging payment warning, approval task, critical stock alert |
| Email | distribusi laporan resmi dan jejak audit | executive pack, laporan PKS, approval summary |

Aturan dasar kanal:
- `WhatsApp` diprioritaskan untuk notifikasi yang membutuhkan respons cepat atau acknowledgement manusia
- `Email` diprioritaskan untuk artefak formal, lampiran, dan distribusi laporan
- `In-app notification` menjadi default untuk event operasional yang perlu terlihat di workspace tanpa harus keluar sistem

### 20.1.2 WhatsApp Notification Rules

Jika integrasi WhatsApp diaktifkan, sistem harus mendukung minimal:
- reminder pengiriman batch `sell_out_record` kepada PIC ritel modern
- warning aging payment kepada finance owner saat invoice mendekati atau melewati termin
- critical stock alert kepada owner cabang atau operator distribusi
- approval task kepada reviewer ketika hasil AI atau exception membutuhkan keputusan manusia

Setiap pesan WhatsApp wajib membawa metadata minimum:
- `event_id` atau `batch_id`
- severity
- owner / penerima
- timestamp
- tautan kembali ke halaman kerja atau review queue yang relevan

### 20.1.3 Notification Governance

Agar tidak menjadi spam dan tetap audit-friendly:
- semua notifikasi keluar harus tercatat di audit trail
- severity `warning` dan `critical` boleh dikirim ke WhatsApp
- severity `info` sebaiknya tetap di in-app notification kecuali ada aturan bisnis khusus
- distribusi ke pihak eksternal harus mengikuti hak akses dan scope data masing-masing
- notifikasi yang berasal dari hasil AI harus ditandai sebagai `AI-assisted` bila keputusan final belum disetujui manusia

### 20.2 Peran AI Agent yang Diizinkan

AI agent hanya boleh digunakan untuk:
- parsing file atau dokumen dengan format tidak standar
- klasifikasi exception awal berdasarkan deskripsi kasus atau dokumen pendukung
- membuat draft `recommendation_note` untuk operator, finance, atau konsultan
- membuat draft narasi laporan atau executive summary non-final
- membantu triase task dan prioritas follow-up

### 20.3 Area yang Wajib Tetap Deterministik

Komponen berikut harus tetap dihasilkan oleh pipeline rule-based dan dapat diaudit:
- KPI final dashboard
- target vs actual
- nilai invoice, paid amount, outstanding, dan aging bucket
- status publish batch
- status risiko final
- closure event yang memengaruhi laporan resmi

### 20.4 Human Review Checkpoint

Human review wajib ada sebelum:
- batch dengan quality issue dipublish ke dashboard utama
- hasil parsing AI dipakai untuk data finansial atau KPI kritikal
- risk event berstatus `closed` atau `resolved`
- laporan eksternal didistribusikan ke principal, ritel, atau pihak lain
- rekomendasi AI diubah menjadi keputusan operasional final

### 20.5 Kontrak Output AI Agent

Agar backend dan workflow engine konsisten, keluaran AI agent harus dibatasi ke artefak berikut:

| Output | Fungsi | Wajib Review |
|---|---|---|
| `parse_result` | hasil ekstraksi struktur dari file tidak standar | Ya |
| `exception_classification` | label awal atas kasus mismatch / retur / payment issue | Ya |
| `recommendation_note` | draft rekomendasi tindakan operasional atau finansial | Ya |
| `report_draft` | draft narasi laporan / summary | Ya |
| `review_task` | task yang dikirim ke owner tertentu | Tidak, tetapi tetap terlacak |

### 20.6 Implikasi UI dan Workflow

Frontend dan backend harus mendukung:
- status `AI-assisted` pada artefak yang berasal dari agent
- review queue terpisah untuk hasil AI yang belum disetujui
- audit trail untuk prompt context, hasil agent, reviewer, dan keputusan final
- pemisahan jelas antara `assistant output` dan `final published value`

### 20.7 Prinsip Keputusan

Prinsip yang wajib dipertahankan:
- AI membantu percepatan kerja, bukan menggantikan kontrol bisnis
- n8n mengorkestrasi workflow, bukan menggantikan logic layer inti
- semua keputusan yang memengaruhi angka resmi harus dapat dijelaskan, dilacak, dan diverifikasi ulang
