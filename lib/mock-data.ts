export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

export const demoScenario = {
  periodLabel: "September 2026",
  totalSellOutUnits: "4.18 Juta Unit",
  totalSellOutCompact: "4.18 Juta",
  totalSellOutShort: "4.184M",
  totalRevenue: "Rp33,4 Miliar",
  activeOutletCount: "34.001",
  activeOutletRate: "84.2%",
  distributionCoverage: "87.5%",
  availabilityRate: "76.3%",
  returnRate: "0.42%",
  returnQty: "17.420",
  nationalTarget: "25.000.000 unit",
  targetProgress: "16.7%",
  sellInPublished: "4.52 Juta Unit",
  sellInSellOutVariance: "7.5%",
  invoiceExposure: "Rp3.12 M",
  aging45Plus: "Rp1.84 M",
  dso: "41 hari",
  riskOutletCount: "142 Outlet",
  qualityPublishedCount: "18",
  qualityProvisionalCount: "3",
  schemaMatchRate: "98.6%",
  refreshTimestamp: "11 Apr 2026, 09:24 WIB",
};

export const globalFilters = {
  period: demoScenario.periodLabel,
  channel: "Semua Channel",
  sync: demoScenario.refreshTimestamp,
};

export const foxProductPortfolio = [
  {
    title: "Entry / mass market disposable",
    skus: ["FOX Premium", "FOX Borobudur", "FOX Rocket"],
    priceBand: "Rp840 - Rp1.350",
    positioning:
      "Lini paling basic, mudah dipahami konsumen, dan jadi volume driver dengan repeat tinggi.",
    channels:
      "Warung, toko kelontong, agen rokok, grosir pasar, AksesMu, serta minimarket nasional.",
    modernRetailTag: "Core",
    badgeVariant: "success" as const,
    modernRetailRole:
      "Paling layak jadi SKU inti Alfamart dan Indomaret karena sederhana, cepat rotasi, dan aman di price point.",
  },
  {
    title: "Mid-tier upgrade / windproof ringan",
    skus: ["FOX Zenith 905", "FOX Zenith 905 Slim", "FOX Zenith 906", "FOX Zenith 906 Api Las", "FOX Gamma Kecil"],
    priceBand: "Rp2.400 - Rp3.000",
    positioning:
      "Trade-up dari korek basic untuk pengguna yang ingin rasa lebih bagus tanpa masuk ke premium metal-body.",
    channels:
      "GT premium, toko rokok rapi, kios outdoor, counter impulse dekat kasir, dan e-commerce multipack.",
    modernRetailTag: "Trade-up",
    badgeVariant: "warning" as const,
    modernRetailRole:
      "Cocok sebagai test SKU atau trade-up SKU di modern retail, bukan lini utama untuk all-store rollout.",
  },
  {
    title: "Premium accessible / body besi / style-driven",
    skus: ["FOX Zenith Alpha", "FOX Zenith Gamma (Bodi Besi)", "FOX Zenith Beta"],
    priceBand: "Rp3.000 - Rp4.250",
    positioning:
      "Dijual bukan hanya karena fungsi, tetapi karena desain, feel, dan kesan premium yang lebih kuat.",
    channels:
      "Toko rokok premium, vape shop, toko aksesori pria, kios hadiah kecil, dan e-commerce.",
    modernRetailTag: "Selective",
    badgeVariant: "info" as const,
    modernRetailRole:
      "Lebih cocok untuk selective listing dan margin play, bukan fokus utama minimarket nasional.",
  },
  {
    title: "Utility / jumbo torch",
    skus: ["FOX Zenith Sumo FL-008"],
    priceBand: "Rp15.900 - Rp19.500",
    positioning:
      "Masuk ke utility product jumbo dan refillable, bukan lagi korek rokok impulse biasa.",
    channels:
      "Toko alat rumah tangga, toko gas dan kompor, toko outdoor atau camping, hardware ringan, dan marketplace.",
    modernRetailTag: "Specialty",
    badgeVariant: "neutral" as const,
    modernRetailRole:
      "Lebih cocok untuk seasonal atau selected stores, bukan core assortment minimarket.",
  },
  {
    title: "Household / kitchen utility",
    skus: ["Korek Kompor BBQ FOX"],
    priceBand: "Household utility",
    positioning:
      "SKU rumah tangga untuk kebutuhan dapur dan BBQ, bukan item yang dipimpin konsumsi smoker-led.",
    channels:
      "Supermarket rumah tangga, toko peralatan dapur, toko gas LPG, toko BBQ, dan marketplace.",
    modernRetailTag: "Add-on",
    badgeVariant: "neutral" as const,
    modernRetailRole:
      "Masuk akal sebagai SKU tambahan selected stores, bukan produk utama modern retail nasional.",
  },
];

export const foxModernRetailStrategy = [
  {
    title: "Core SKU",
    skus: "FOX Premium / FOX Borobudur / FOX Rocket",
    note: "Lini inti untuk volume, impulse purchase, dan rotasi tercepat di kanal ritel modern nasional.",
  },
  {
    title: "Test trade-up SKU",
    skus: "FOX Zenith 905 atau FOX Zenith 905 Slim",
    note: "Pakai sebagai step-up SKU terbatas untuk membaca appetite konsumen terhadap korek upgrade.",
  },
  {
    title: "Selective / non-core",
    skus: "FOX Zenith Alpha / FOX Zenith Gamma (Bodi Besi)",
    note: "Jaga hanya di outlet terpilih yang siap bermain di margin dan style, bukan volume mass market.",
  },
  {
    title: "Specialty / non-core modern retail",
    skus: "FOX Zenith Sumo FL-008 / Korek Kompor BBQ FOX",
    note: "Lebih kuat di specialty retail dan marketplace daripada dijadikan all-store core listing.",
  },
];

export const foxAcceptedSkus = [
  "FOX Premium",
  "FOX Borobudur",
  "FOX Rocket",
  "FOX Zenith 905",
  "FOX Zenith 905 Slim",
  "FOX Zenith 906",
  "FOX Zenith 906 Api Las",
  "FOX Gamma Kecil",
  "FOX Zenith Alpha",
  "FOX Zenith Gamma (Bodi Besi)",
  "FOX Zenith Beta",
  "FOX Zenith Sumo FL-008",
  "Korek Kompor BBQ FOX",
];

export const operationalStatusSummary = [
  {
    label: "Pembaruan terakhir",
    value: demoScenario.refreshTimestamp,
    note: "Hampir waktu nyata setelah data masuk tervalidasi",
    tone: "info" as StatusTone,
  },
  {
    label: "Status penerbitan",
    value: `${demoScenario.qualityPublishedCount} batch terbit`,
    note: `${demoScenario.qualityProvisionalCount} batch sementara menunggu peninjauan`,
    tone: "success" as StatusTone,
  },
  {
    label: "Kualitas data",
    value: demoScenario.schemaMatchRate,
    note: "Kesesuaian skema pada periode aktif",
    tone: "success" as StatusTone,
  },
  {
    label: "Kendali keputusan",
    value: "Pemeriksaan mutu aktif",
    note: "Masalah penghambat tidak boleh terbit ke tampilan pimpinan",
    tone: "warning" as StatusTone,
  },
];

export const sourceIntakeContracts = [
  {
    id: "sell-in",
    title: "Data barang masuk",
    owner: "Gunawan Elektro / Koprindo",
    cadence: "Per pengiriman / penerimaan",
    status: "Siap diproses",
    note: "Mencatat barang masuk ke gudang Koprindo atau gudang ritel sebagai basis distribusi awal.",
    requiredFields: ["periode", "channel", "wilayah", "sku", "qty_sell_in", "tanggal_terima"],
    output: "Dipakai untuk reconciliation, inventory position, dan stock risk.",
  },
  {
    id: "sell-out",
    title: "Data penjualan keluar",
    owner: "PIC Ritel Modern",
    cadence: "Batch bulanan",
    status: "Sumber kendali utama",
    note: "Mencatat barang terjual ke konsumen akhir untuk target vs actual dan sell-through.",
    requiredFields: ["periode", "channel", "outlet", "sku", "qty_sell_out", "nilai_penjualan"],
    output: "Masuk ke monitoring channel, branch performance, dan executive pack.",
  },
  {
    id: "payment",
    title: "Data pembayaran",
    owner: "Finance Koprindo / Finance Partner",
    cadence: "Harian / mingguan",
    status: "Sumber keuangan kritis",
    note: "Mencatat invoice, due date, pembayaran, aging bucket, dan exposure arus kas.",
    requiredFields: ["invoice_id", "pihak_pembayar", "pihak_penerima", "due_date", "amount", "payment_status"],
    output: "Masuk ke payment watchlist, aging ledger, dan risk event finansial.",
  },
  {
    id: "inventory",
    title: "Posisi persediaan",
    owner: "Warehouse / Distribution Ops",
    cadence: "Snapshot periodik",
    status: "Sumber mesin risiko",
    note: "Mencatat opening stock, closing stock, dan stock cover untuk mendeteksi stockout dan overstock.",
    requiredFields: ["periode", "channel", "cabang", "outlet", "sku", "closing_stock"],
    output: "Masuk ke stock imbalance rule, outlet risk, dan branch action lane.",
  },
  {
    id: "master",
    title: "master_distribusi",
    owner: "Admin Sistem",
    cadence: "Saat mapping berubah",
    status: "Sumber terkendali",
    note: "Master channel, wilayah, cabang, outlet, dan target turunan untuk menjaga konsistensi agregasi.",
    requiredFields: ["channel", "wilayah", "cabang", "outlet", "target_unit", "owner"],
    output: "Dipakai oleh semua modul untuk mapping, approval log, dan audit trail.",
  },
];

export const canonicalBatchStatusSummary = [
  { status: "Diterima", count: "5", note: "Batch baru diregistrasi dan checksum tersimpan.", tone: "info" as StatusTone },
  { status: "Tervalidasi", count: "4", note: "Skema, kolom wajib, dan tipe data lolos.", tone: "success" as StatusTone },
  { status: "Dinormalisasi", count: "3", note: "Pemetaan dan standardisasi nilai selesai.", tone: "info" as StatusTone },
  { status: "Direkonsiliasi", count: "2", note: "Sudah dibandingkan dengan sumber lain yang relevan.", tone: "success" as StatusTone },
  { status: "Terbit", count: "2", note: "Boleh dipakai di monitoring dan pelaporan.", tone: "success" as StatusTone },
  { status: "Tinjau pengecualian", count: "1", note: "Masuk peninjauan karena selisih atau kualitas rendah.", tone: "warning" as StatusTone },
  { status: "Ditolak", count: "1", note: "Masalah penghambat membuat batch ditolak.", tone: "danger" as StatusTone },
];

export const batchRegistryDetailed = [
  {
    batchId: "BAT-SOUT-ALF-20260410-001",
    sourceType: "Data penjualan keluar",
    channel: "Alfamart",
    period: "Sep-2026",
    status: "terbit",
    qualityScore: "98.6",
    reconciliation: "sesuai",
    owner: "Rina Prameswari",
    updatedAt: "10 Apr 2026 10:18",
    issueCount: 0,
  },
  {
    batchId: "BAT-PAY-ALF-20260410-004",
    sourceType: "Data pembayaran",
    channel: "Alfamart",
    period: "Sep-2026",
    status: "direkonsiliasi",
    qualityScore: "96.2",
    reconciliation: "selisih umur piutang sudah bersih",
    owner: "Finance Koprindo",
    updatedAt: "10 Apr 2026 11:02",
    issueCount: 1,
  },
  {
    batchId: "BAT-SOUT-IDM-20260410-002",
    sourceType: "Data penjualan keluar",
    channel: "Indomaret",
    period: "Sep-2026",
    status: "tinjau pengecualian",
    qualityScore: "84.3",
    reconciliation: "14 row non-FOX, menunggu review",
    owner: "Fajar Nugraha",
    updatedAt: "10 Apr 2026 08:42",
    issueCount: 14,
  },
  {
    batchId: "BAT-INV-KOP-20260409-001",
    sourceType: "Posisi persediaan",
    channel: "Semua Channel",
    period: "Sep-2026",
    status: "tervalidasi",
    qualityScore: "91.1",
    reconciliation: "menunggu dibandingkan dengan barang masuk",
    owner: "Distribution Ops",
    updatedAt: "09 Apr 2026 18:21",
    issueCount: 2,
  },
  {
    batchId: "BAT-MSTR-20260408-001",
    sourceType: "master_distribusi",
    channel: "Semua Channel",
    period: "Sep-2026",
    status: "terbit",
    qualityScore: "100",
    reconciliation: "pemetaan disetujui",
    owner: "Admin Sistem",
    updatedAt: "08 Apr 2026 15:06",
    issueCount: 0,
  },
];

export const reconciliationCheckpoints = [
  {
    title: "Barang masuk vs penjualan keluar",
    value: demoScenario.sellInSellOutVariance,
    note: "Variance nasional masih dalam ambang kontrol, tetapi dua cabang perlu penelusuran lebih detail.",
    tone: "warning" as StatusTone,
  },
  {
    title: "Pembayaran vs invoice",
    value: "97.4% sesuai",
    note: "Seluruh invoice aktif punya due date dan payment status. Satu invoice masih partial payment.",
    tone: "info" as StatusTone,
  },
  {
    title: "Persediaan vs distribusi",
    value: "142 outlet ditandai",
    note: "Stock cover outlet kritis sudah diturunkan ke risk engine untuk prioritas intervensi.",
    tone: "danger" as StatusTone,
  },
];

export const riskEventQueue = [
  {
    eventId: "RISK-STK-001",
    eventType: "Stok kosong",
    severity: "Kritis",
    entityType: "Cabang",
    entityKey: "Cirebon Raya",
    owner: "Tim BD Jawa Barat",
    sla: "4 jam",
    status: "Terbuka",
    observedValue: "Stock cover 2 hari",
    thresholdRule: "stock_cover_days < 3",
    source: "inventory_position",
    workflowState: "Disetujui untuk ditindaklanjuti",
    agentAction: "AI mengelompokkan -> manusia menyetujui",
    confidence: "96%",
    updatedAt: "11 Apr 2026 09:24",
  },
  {
    eventId: "RISK-DIST-004",
    eventType: "Selisih barang masuk dan penjualan keluar",
    severity: "Tinggi",
    entityType: "Channel",
    entityKey: "Indomaret",
    owner: "Ops Channel Indomaret",
    sla: "1 hari",
    status: "Tinjau pengecualian",
    observedValue: "14 row non-FOX, variance 9.2%",
    thresholdRule: "variance > 8% or invalid row > 0",
    source: "sell_out_record",
    workflowState: "Peninjauan sedang berjalan",
    agentAction: "AI menormalkan -> peninjau membuka",
    confidence: "91%",
    updatedAt: "10 Apr 2026 08:42",
  },
  {
    eventId: "RISK-PAY-002",
    eventType: "Pembayaran tidak patuh",
    severity: "Tinggi",
    entityType: "Invoice",
    entityKey: "ALF-SEP-2026-112",
    owner: "Finance Koprindo",
    sla: "8 jam",
    status: "Sedang ditangani",
    observedValue: "Aging bucket 31-45, partial payment",
    thresholdRule: "aging_bucket >= 31-45 and paid_amount < amount",
    source: "payment_record",
    workflowState: "Eskalasi dijadwalkan",
    agentAction: "AI menjadwalkan pengingat",
    confidence: "89%",
    updatedAt: "11 Apr 2026 08:57",
  },
  {
    eventId: "RISK-DATA-003",
    eventType: "Batch berkualitas rendah",
    severity: "Peringatan",
    entityType: "Batch",
    entityKey: "BAT-SOUT-IDM-20260410-002",
    owner: "Admin Sistem",
    sla: "1 hari",
    status: "Menunggu validasi",
    observedValue: "Quality score 84.3",
    thresholdRule: "quality_score < 85",
    source: "data_quality_result",
    workflowState: "Validasi tertahan",
    agentAction: "AI meminta pemetaan ulang",
    confidence: "84%",
    updatedAt: "10 Apr 2026 08:44",
  },
];

export const invoiceLedger = [
  {
    invoiceId: "ALF-SEP-2026-112",
    payer: "Alfamart",
    payee: "Koprindo",
    dueDate: "19 Apr 2026",
    amount: "Rp320 Jt",
    paidAmount: "Rp120 Jt",
    status: "Sebagian",
    agingBucket: "31-45 hari",
    compliance: "Perlu perhatian",
    owner: "Finance Koprindo",
  },
  {
    invoiceId: "IDM-SEP-2026-087",
    payer: "Indomaret",
    payee: "Koprindo",
    dueDate: "28 Apr 2026",
    amount: "Rp540 Jt",
    paidAmount: "Rp0",
    status: "Terbuka",
    agingBucket: "0-30 hari",
    compliance: "Lancar",
    owner: "Finance Koprindo",
  },
  {
    invoiceId: "KOP-GE-2026-031",
    payer: "Koprindo",
    payee: "Gunawan Elektro",
    dueDate: "14 Mei 2026",
    amount: "Rp1.14 M",
    paidAmount: "Rp0",
    status: "Terbuka",
    agingBucket: "0-30 hari",
    compliance: "Lancar",
    owner: "Finance Koprindo",
  },
  {
    invoiceId: "AKS-SEP-2026-014",
    payer: "AksesMu",
    payee: "Koprindo",
    dueDate: "07 Apr 2026",
    amount: "Rp180 Jt",
    paidAmount: "Rp60 Jt",
    status: "Lewat jatuh tempo",
    agingBucket: "46-60 hari",
    compliance: "Tinggi",
    owner: "Finance Collections",
  },
];

export const primaryMetrics = [
  {
    label: "Outlet Aktif",
    value: demoScenario.activeOutletRate,
    delta: "+4.8%",
    tone: "success" as StatusTone,
    trend: [62, 68, 72, 74, 79, 84],
  },
  {
    label: "Coverage Distribusi",
    value: demoScenario.distributionCoverage,
    delta: "+2.1%",
    tone: "success" as StatusTone,
    trend: [70, 71, 74, 78, 84, 88],
  },
  {
    label: "Availability Produk",
    value: demoScenario.availabilityRate,
    delta: "-1.4%",
    tone: "warning" as StatusTone,
    trend: [78, 79, 80, 78, 77, 76],
  },
  {
    label: "Sell-out Bulan Berjalan",
    value: demoScenario.totalSellOutCompact,
    delta: "+11.3%",
    tone: "info" as StatusTone,
    trend: [3.2, 3.4, 3.5, 3.7, 3.8, 4.18],
  },
  {
    label: "Growth MoM",
    value: "11.3%",
    delta: "Target +3.0%",
    tone: "success" as StatusTone,
    trend: [2, 4, 3, 6, 8, 11.3],
  },
];

export const uploadStatus = [
  {
    channel: "Alfamart",
    pic: "Rina Prameswari",
    status: "Selesai diproses",
    tone: "success" as StatusTone,
    uploadedAt: "10 Apr 2026, 10:18",
    progress: 100,
  },
  {
    channel: "Indomaret",
    pic: "Fajar Nugraha",
    status: "Sedang divalidasi",
    tone: "warning" as StatusTone,
    uploadedAt: "10 Apr 2026, 08:42",
    progress: 68,
  },
  {
    channel: "aksesmu",
    pic: "Siti Fauziah",
    status: "Menunggu unggahan",
    tone: "danger" as StatusTone,
    uploadedAt: "-",
    progress: 22,
  },
];

export const validationIssues = [
  {
    title: "aksesmu belum upload periode September 2026",
    detail: "Reminder tahap kedua terjadwal 11 Apr 2026 pukul 08:00 WIB.",
    tone: "danger" as StatusTone,
  },
  {
    title: "Indomaret file masih memuat 14 row SKU non-FOX",
    detail: "Workflow AI filter akan drop row noise setelah validasi kolom selesai.",
    tone: "warning" as StatusTone,
  },
  {
    title: "Alfamart berhasil diproses ke penjualan_ritel",
    detail: "1.284 row valid, 0 duplicate, 0 mandatory field missing.",
    tone: "success" as StatusTone,
  },
];

export const selloutSeries = [
  { month: "Apr", alfamart: 620, indomaret: 590, aksesmu: 280 },
  { month: "Mei", alfamart: 710, indomaret: 640, aksesmu: 320 },
  { month: "Jun", alfamart: 760, indomaret: 690, aksesmu: 360 },
  { month: "Jul", alfamart: 810, indomaret: 720, aksesmu: 395 },
  { month: "Agu", alfamart: 870, indomaret: 760, aksesmu: 410 },
  { month: "Sep", alfamart: 940, indomaret: 815, aksesmu: 428 },
];

export const branchRanking = [
  {
    rank: 1,
    branch: "Cabang Jabodetabek Barat",
    region: "DKI Jakarta",
    sellout: "782.000",
    growth: "+16.4%",
    activeOutlet: "92%",
    stock: "Normal",
    tone: "success" as StatusTone,
  },
  {
    rank: 2,
    branch: "Cabang Bandung Inti",
    region: "Jawa Barat",
    sellout: "705.400",
    growth: "+13.1%",
    activeOutlet: "88%",
    stock: "Normal",
    tone: "success" as StatusTone,
  },
  {
    rank: 12,
    branch: "Cabang Surabaya Timur",
    region: "Jawa Timur",
    sellout: "218.100",
    growth: "-11.2%",
    activeOutlet: "64%",
    stock: "Menipis",
    tone: "warning" as StatusTone,
  },
  {
    rank: 18,
    branch: "Cabang Cirebon Raya",
    region: "Jawa Barat",
    sellout: "147.600",
    growth: "-28.9%",
    activeOutlet: "49%",
    stock: "Kritis",
    tone: "danger" as StatusTone,
  },
];

export const anomalyFeed = [
  {
    severity: "Kritis",
    title: "Cabang Cirebon Raya turun 28.9% MoM",
    detail: "Outlet aktif turun 17% dan availability hanya 52%.",
    action: "Jalankan Evaluasi PKS",
    tone: "danger" as StatusTone,
  },
  {
    severity: "Peringatan",
    title: "Indomaret wilayah Bandung Timur stok akhir < ambang aman",
    detail: "7 outlet berada di bawah threshold 10 unit.",
    action: "Buka monitoring cabang",
    tone: "warning" as StatusTone,
  },
  {
    severity: "Info",
    title: "Alfamart Jabodetabek melewati target distribusi bulanan",
    detail: "Pertumbuhan sell-out 16.4% dengan retur rendah.",
    action: "Lihat rekomendasi PO",
    tone: "info" as StatusTone,
  },
];

export const recentActivities = [
  "10 Apr 2026 10:18 - File Alfamart September 2026 diproses sukses.",
  "10 Apr 2026 08:55 - Reminder upload kedua dikirim ke PIC aksesmu.",
  "09 Apr 2026 16:32 - Evaluasi PKS Agustus 2026 disimpan ke evaluasi_pks.",
  "09 Apr 2026 11:15 - Retur 180 unit dari Cabang Surabaya Timur dicatat.",
];

export const monitoringMetrics = [
  { label: "Total Sell-out", value: demoScenario.totalSellOutUnits, note: "+11.3% vs bulan lalu" },
  { label: "Avg Sell-out / Outlet", value: "182 Unit", note: "Naik 9 unit" },
  { label: "Cabang Critical", value: "3 Cabang", note: "1 cabang baru" },
  { label: "Availability", value: demoScenario.availabilityRate, note: "Di atas target minimum 75%" },
  { label: "Outlet Aktif", value: demoScenario.activeOutletCount, note: `${demoScenario.activeOutletRate} dari total outlet` },
  { label: "Retur Berdampak", value: demoScenario.returnRate, note: "Masuk batas toleransi" },
];

export const pksEvaluation = {
  status: "Early Warning",
  summary:
    "Distribusi nasional masih tumbuh, namun ada tekanan pada 3 cabang, 1 channel yang masih provisional, dan aging payment yang perlu dijaga sebelum masuk bucket kritis. Rekomendasi utama adalah intervensi wilayah Jawa Barat, percepatan replenishment outlet kritis, dan follow-up payment retail.",
  scorecards: [
    { label: "Outlet Aktif", value: demoScenario.activeOutletRate, target: ">80%", tone: "success" as StatusTone },
    { label: "Coverage", value: demoScenario.distributionCoverage, target: ">85%", tone: "success" as StatusTone },
    { label: "Availability", value: demoScenario.availabilityRate, target: ">75%", tone: "success" as StatusTone },
    { label: "Sell-out", value: demoScenario.totalSellOutCompact, target: "4.0 Juta", tone: "success" as StatusTone },
    { label: "Growth", value: "11.3%", target: "Positif", tone: "warning" as StatusTone },
  ],
};

export const uploadHistory = [
  {
    time: "10 Apr 2026 10:18",
    channel: "Alfamart",
    period: "Sep-2026",
    pic: "Rina Prameswari",
    file: "alfamart_sep_2026.csv",
    status: "Processed",
    rows: 1284,
    issues: 0,
  },
  {
    time: "10 Apr 2026 08:42",
    channel: "Indomaret",
    period: "Sep-2026",
    pic: "Fajar Nugraha",
    file: "indo_sep_2026.xlsx",
    status: "Validating",
    rows: 1130,
    issues: 14,
  },
  {
    time: "09 Apr 2026 14:10",
    channel: "aksesmu",
    period: "Agu-2026",
    pic: "Siti Fauziah",
    file: "aksesmu_aug_2026.csv",
    status: "Processed",
    rows: 862,
    issues: 2,
  },
];

export const registrationStats = [
  { label: "Menunggu Review", value: "12", tone: "warning" as StatusTone },
  { label: "Koordinator Aktif", value: "8", tone: "success" as StatusTone },
  { label: "PIC Ritel Aktif", value: "14", tone: "success" as StatusTone },
  { label: "Perlu Revisi", value: "3", tone: "warning" as StatusTone },
  { label: "Ditolak", value: "1", tone: "danger" as StatusTone },
];

export const registrationQueue = [
  {
    name: "Novi Amelia",
    type: "PIC Ritel",
    org: "Alfamart",
    role: "PIC Upload Pusat",
    whatsapp: "0812-7788-2100",
    email: "novi.alfamart@example.com",
    date: "11 Apr 2026",
    otp: "Verified",
    approval: "Pending Review",
  },
  {
    name: "Bima Saputra",
    type: "Koordinator Internal",
    org: "Koprindo BD",
    role: "BD Coordinator",
    whatsapp: "0813-1122-3300",
    email: "bima.saputra@koprindo.co.id",
    date: "10 Apr 2026",
    otp: "Verified",
    approval: "Pending Review",
  },
  {
    name: "Putri Lestari",
    type: "PIC Ritel",
    org: "aksesmu",
    role: "Area PIC",
    whatsapp: "0821-2233-4400",
    email: "putri.aksesmu@example.com",
    date: "09 Apr 2026",
    otp: "Verified",
    approval: "Needs Revision",
  },
];

export const userDirectory = [
  {
    code: "USR-INT-001",
    name: "Yessy Kurnia",
    type: "Koordinator Internal",
    unit: "Business Development",
    role: "BD Lead",
    status: "Active",
    lastActivity: "11 Apr 2026 08:14",
  },
  {
    code: "USR-RTL-014",
    name: "Rina Prameswari",
    type: "PIC Ritel",
    unit: "Alfamart",
    role: "PIC Upload Pusat",
    status: "Active",
    lastActivity: "10 Apr 2026 10:18",
  },
  {
    code: "USR-RTL-021",
    name: "Siti Fauziah",
    type: "PIC Ritel",
    unit: "aksesmu",
    role: "PIC Upload",
    status: "Active",
    lastActivity: "09 Apr 2026 14:10",
  },
];

export const returnSummary = [
  { label: "Qty Retur Bulan Ini", value: demoScenario.returnQty, note: `${demoScenario.returnRate} dari sell-out` },
  { label: "Outlet Dengan Retur", value: "128", note: "11 outlet baru" },
  { label: "Cabang Retur Tertinggi", value: "Surabaya Timur", note: "3.440 unit" },
  { label: "Kasus Belum Selesai", value: "7", note: "Perlu tindak lanjut" },
];

export const returnReasons = [
  { label: "Bocor", value: 36 },
  { label: "Rusak Fisik", value: 24 },
  { label: "Salah Kirim", value: 18 },
  { label: "Kemasan Cacat", value: 12 },
  { label: "Lainnya", value: 10 },
];

export const returnLedger = [
  {
    date: "10 Apr 2026",
    id: "RET-20260410-014",
    channel: "Indomaret",
    branch: "Surabaya Timur",
    outlet: "IDM-230144",
    qty: 180,
    reason: "Bocor",
    operator: "Gudang Koprindo",
    status: "Pending",
    impact: "-180 unit",
  },
  {
    date: "09 Apr 2026",
    id: "RET-20260409-008",
    channel: "Alfamart",
    branch: "Bandung Inti",
    outlet: "ALF-110224",
    qty: 72,
    reason: "Kemasan Cacat",
    operator: "Admin Distribusi",
    status: "Resolved",
    impact: "-72 unit",
  },
  {
    date: "08 Apr 2026",
    id: "RET-20260408-003",
    channel: "aksesmu",
    branch: "Jakarta Barat",
    outlet: "AKS-009102",
    qty: 45,
    reason: "Salah Kirim",
    operator: "Gudang Koprindo",
    status: "Review",
    impact: "-45 unit",
  },
];

export const reportSummary = [
  { label: "Laporan Periode Aktif", value: "4", note: "2 sudah dibuat, 2 dalam antrean" },
  { label: "Status PDF", value: "2 siap kirim", note: "1 draf, 1 gagal" },
  { label: "Distribusi Prinsipal", value: "Terakhir 07 Apr 2026", note: "Tepat waktu" },
  { label: "Retry Diperlukan", value: "1 laporan", note: "Email principal gagal" },
];

export const batchWorkflowSteps = [
  {
    id: "received",
    title: "Batch diterima",
    status: "done",
    note: "Metadata source, periode, dan checksum tersimpan di registry.",
  },
  {
    id: "validation",
    title: "Schema validation",
    status: "done",
    note: "Kolom wajib, tipe data, dan format periode diperiksa.",
  },
  {
    id: "quality",
    title: "Pemeriksaan mutu",
    status: "active",
    note: "Review issue row non-FOX dan publish decision sedang berjalan.",
  },
  {
    id: "publish",
    title: "Terbit ke pimpinan",
    status: "pending",
    note: "Angka final hanya tayang setelah batch dipublish atau diberi flag provisional.",
  },
] as const;

export const reportPreviewSections = [
  {
    id: "executive",
    title: "Ringkasan Pimpinan",
    summary: `Sell-out ${demoScenario.totalSellOutCompact}, progress target ${demoScenario.targetProgress}, dan status PKS Early Warning.`,
    bullets: [
      `Outlet aktif ${demoScenario.activeOutletCount} dengan coverage ${demoScenario.distributionCoverage}.`,
      `Return impact ${demoScenario.returnRate} dan quality gate menandai 1 channel provisional.`,
      `Aging payment ${demoScenario.aging45Plus} masih perlu perhatian finance.`,
    ],
  },
  {
    id: "risk",
    title: "Kendali Risiko",
    summary: "Ringkasan risiko cabang, payment watchlist, dan exception outlet untuk steering mingguan.",
    bullets: [
      `Stock risk terdeteksi di ${demoScenario.riskOutletCount}.`,
      `Variance sell-in dan sell-out berada di ${demoScenario.sellInSellOutVariance}.`,
      "Cabang Cirebon Raya dan Surabaya Timur tetap menjadi fokus intervensi.",
    ],
  },
  {
    id: "governance",
    title: "Catatan Tata Kelola",
    summary: "Catatan kualitas data, approval, dan status distribusi laporan untuk stakeholder.",
    bullets: [
      `${demoScenario.qualityPublishedCount} batch published dan ${demoScenario.qualityProvisionalCount} batch provisional.`,
      `Schema match rate ${demoScenario.schemaMatchRate}.`,
      `Refresh timestamp ${demoScenario.refreshTimestamp}.`,
    ],
  },
] as const;

export const branchDetailMoments = [
  {
    title: "Sinyal cabang",
    value: "Cirebon Raya",
    detail: "Growth -28.9%, outlet aktif 49%, dan stok masuk kategori kritis.",
  },
  {
    title: "Tindakan segera",
    value: "Audit cakupan outlet",
    detail: "Turunkan alokasi, cek visibility stok, dan review rute distribusi 7 hari ke depan.",
  },
  {
    title: "Catatan keuangan",
    value: "Tindak lanjut pembayaran",
    detail: "Cabang terkait masuk watchlist payment karena channel masih membawa exposure aging.",
  },
] as const;

export const reportCatalog = [
  {
    title: "Laporan Rekap Bulanan",
    detail: "KPI sell-out, ranking cabang, anomaly center, dan aktivitas upload.",
    status: "Siap",
  },
  {
    title: "Evaluasi PKS",
    detail: "Status threshold dan hasil evaluasi performa distributor per periode.",
    status: "Draf",
  },
  {
    title: "Rekomendasi Alokasi PO",
    detail: "Saran PO bulan berikutnya berdasarkan sell-out dan stok akhir.",
    status: "Dalam antrean",
  },
  {
    title: "Ringkasan Retur",
    detail: "Retur per channel, alasan, dan dampak pada sell-out efektif.",
    status: "Siap",
  },
];

export const generatedReports = [
  {
    name: "Rekap Bulanan September 2026",
    type: "Bulanan",
    period: "Sep-2026",
    generated: "11 Apr 2026 07:05",
    by: "n8n Scheduler",
    format: "PDF",
    distribution: "Terkirim",
    recipient: "Manajemen internal",
  },
  {
    name: "Evaluasi PKS September 2026",
    type: "PKS",
    period: "Sep-2026",
    generated: "11 Apr 2026 07:12",
    by: "Admin Sistem",
    format: "PDF",
    distribution: "Draf",
    recipient: "Belum dikirim",
  },
  {
    name: "Alokasi PO Oktober 2026",
    type: "PO",
    period: "Okt-2026",
    generated: "11 Apr 2026 07:20",
    by: "n8n Scheduler",
    format: "XLSX",
    distribution: "Dalam antrean",
    recipient: "Tim BD Koprindo",
  },
];

export const activityLog = [
  "11 Apr 2026 07:20 - Rekomendasi Alokasi PO Oktober 2026 dibuat.",
  "11 Apr 2026 07:12 - Evaluasi PKS September 2026 dijalankan manual.",
  "11 Apr 2026 07:05 - Rekap bulanan September 2026 digenerate otomatis.",
];
