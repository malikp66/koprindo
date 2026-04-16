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

export const operationalStatusSummary = [
  {
    label: "Last updated",
    value: demoScenario.refreshTimestamp,
    note: "Near-real-time sesudah event ingest valid",
    tone: "info" as StatusTone,
  },
  {
    label: "Published posture",
    value: `${demoScenario.qualityPublishedCount} published`,
    note: `${demoScenario.qualityProvisionalCount} provisional menunggu review`,
    tone: "success" as StatusTone,
  },
  {
    label: "Data quality",
    value: demoScenario.schemaMatchRate,
    note: "Schema match rate periode aktif",
    tone: "success" as StatusTone,
  },
  {
    label: "Decision control",
    value: "Quality gate active",
    note: "Blocking issue tidak boleh publish ke executive layer",
    tone: "warning" as StatusTone,
  },
];

export const sourceIntakeContracts = [
  {
    id: "sell-in",
    title: "sell_in_record",
    owner: "Gunawan Elektro / Koprindo",
    cadence: "Per pengiriman / penerimaan",
    status: "Ready for intake",
    note: "Mencatat barang masuk ke gudang Koprindo atau gudang ritel sebagai basis distribusi awal.",
    requiredFields: ["periode", "channel", "wilayah", "sku", "qty_sell_in", "tanggal_terima"],
    output: "Dipakai untuk reconciliation, inventory position, dan stock risk.",
  },
  {
    id: "sell-out",
    title: "sell_out_record",
    owner: "PIC Ritel Modern",
    cadence: "Batch bulanan",
    status: "Primary control source",
    note: "Mencatat barang terjual ke konsumen akhir untuk target vs actual dan sell-through.",
    requiredFields: ["periode", "channel", "outlet", "sku", "qty_sell_out", "nilai_penjualan"],
    output: "Masuk ke monitoring channel, branch performance, dan executive pack.",
  },
  {
    id: "payment",
    title: "payment_record",
    owner: "Finance Koprindo / Finance Partner",
    cadence: "Harian / mingguan",
    status: "Critical financial source",
    note: "Mencatat invoice, due date, pembayaran, aging bucket, dan exposure arus kas.",
    requiredFields: ["invoice_id", "pihak_pembayar", "pihak_penerima", "due_date", "amount", "payment_status"],
    output: "Masuk ke payment watchlist, aging ledger, dan risk event finansial.",
  },
  {
    id: "inventory",
    title: "inventory_position",
    owner: "Warehouse / Distribution Ops",
    cadence: "Snapshot periodik",
    status: "Risk engine source",
    note: "Mencatat opening stock, closing stock, dan stock cover untuk mendeteksi stockout dan overstock.",
    requiredFields: ["periode", "channel", "cabang", "outlet", "sku", "closing_stock"],
    output: "Masuk ke stock imbalance rule, outlet risk, dan branch action lane.",
  },
  {
    id: "master",
    title: "master_distribusi",
    owner: "Admin Sistem",
    cadence: "Saat mapping berubah",
    status: "Governed source",
    note: "Master channel, wilayah, cabang, outlet, dan target turunan untuk menjaga konsistensi agregasi.",
    requiredFields: ["channel", "wilayah", "cabang", "outlet", "target_unit", "owner"],
    output: "Dipakai oleh semua modul untuk mapping, approval log, dan audit trail.",
  },
];

export const canonicalBatchStatusSummary = [
  { status: "received", count: "5", note: "Batch baru diregistrasi dan checksum tersimpan.", tone: "info" as StatusTone },
  { status: "validated", count: "4", note: "Schema, kolom wajib, dan tipe data lolos.", tone: "success" as StatusTone },
  { status: "normalized", count: "3", note: "Mapping dan standardisasi nilai selesai.", tone: "info" as StatusTone },
  { status: "reconciled", count: "2", note: "Sudah dibandingkan dengan source lain yang relevan.", tone: "success" as StatusTone },
  { status: "published", count: "2", note: "Boleh dipakai di monitoring dan reporting.", tone: "success" as StatusTone },
  { status: "exception_review", count: "1", note: "Masuk review karena mismatch atau kualitas rendah.", tone: "warning" as StatusTone },
  { status: "rejected", count: "1", note: "Blocking issue membuat batch ditolak.", tone: "danger" as StatusTone },
];

export const batchRegistryDetailed = [
  {
    batchId: "BAT-SOUT-ALF-20260410-001",
    sourceType: "sell_out_record",
    channel: "Alfamart",
    period: "Sep-2026",
    status: "published",
    qualityScore: "98.6",
    reconciliation: "matched",
    owner: "Rina Prameswari",
    updatedAt: "10 Apr 2026 10:18",
    issueCount: 0,
  },
  {
    batchId: "BAT-PAY-ALF-20260410-004",
    sourceType: "payment_record",
    channel: "Alfamart",
    period: "Sep-2026",
    status: "reconciled",
    qualityScore: "96.2",
    reconciliation: "aging variance cleared",
    owner: "Finance Koprindo",
    updatedAt: "10 Apr 2026 11:02",
    issueCount: 1,
  },
  {
    batchId: "BAT-SOUT-IDM-20260410-002",
    sourceType: "sell_out_record",
    channel: "Indomaret",
    period: "Sep-2026",
    status: "exception_review",
    qualityScore: "84.3",
    reconciliation: "14 row non-FOX, menunggu review",
    owner: "Fajar Nugraha",
    updatedAt: "10 Apr 2026 08:42",
    issueCount: 14,
  },
  {
    batchId: "BAT-INV-KOP-20260409-001",
    sourceType: "inventory_position",
    channel: "Semua Channel",
    period: "Sep-2026",
    status: "validated",
    qualityScore: "91.1",
    reconciliation: "pending against sell-in",
    owner: "Distribution Ops",
    updatedAt: "09 Apr 2026 18:21",
    issueCount: 2,
  },
  {
    batchId: "BAT-MSTR-20260408-001",
    sourceType: "master_distribusi",
    channel: "Semua Channel",
    period: "Sep-2026",
    status: "published",
    qualityScore: "100",
    reconciliation: "mapping approved",
    owner: "Admin Sistem",
    updatedAt: "08 Apr 2026 15:06",
    issueCount: 0,
  },
];

export const reconciliationCheckpoints = [
  {
    title: "sell-in vs sell-out",
    value: demoScenario.sellInSellOutVariance,
    note: "Variance nasional masih dalam ambang kontrol, tetapi dua cabang perlu penelusuran lebih detail.",
    tone: "warning" as StatusTone,
  },
  {
    title: "payment vs invoice",
    value: "97.4% matched",
    note: "Seluruh invoice aktif punya due date dan payment status. Satu invoice masih partial payment.",
    tone: "info" as StatusTone,
  },
  {
    title: "inventory vs distribution",
    value: "142 outlet flagged",
    note: "Stock cover outlet kritis sudah diturunkan ke risk engine untuk prioritas intervensi.",
    tone: "danger" as StatusTone,
  },
];

export const riskEventQueue = [
  {
    eventId: "RISK-STK-001",
    eventType: "Stockout",
    severity: "Critical",
    entityType: "Cabang",
    entityKey: "Cirebon Raya",
    owner: "Tim BD Jawa Barat",
    sla: "4 jam",
    status: "Open",
    observedValue: "Stock cover 2 hari",
    thresholdRule: "stock_cover_days < 3",
    source: "inventory_position",
    workflowState: "Approved for action",
    agentAction: "AI classified -> human approved",
    confidence: "96%",
    updatedAt: "11 Apr 2026 09:24",
  },
  {
    eventId: "RISK-DIST-004",
    eventType: "Sell-in/Sell-out mismatch",
    severity: "High",
    entityType: "Channel",
    entityKey: "Indomaret",
    owner: "Ops Channel Indomaret",
    sla: "1 hari",
    status: "Exception Review",
    observedValue: "14 row non-FOX, variance 9.2%",
    thresholdRule: "variance > 8% or invalid row > 0",
    source: "sell_out_record",
    workflowState: "Review in progress",
    agentAction: "AI normalized -> reviewer open",
    confidence: "91%",
    updatedAt: "10 Apr 2026 08:42",
  },
  {
    eventId: "RISK-PAY-002",
    eventType: "Payment non-compliance",
    severity: "High",
    entityType: "Invoice",
    entityKey: "ALF-SEP-2026-112",
    owner: "Finance Koprindo",
    sla: "8 jam",
    status: "In Progress",
    observedValue: "Aging bucket 31-45, partial payment",
    thresholdRule: "aging_bucket >= 31-45 and paid_amount < amount",
    source: "payment_record",
    workflowState: "Escalation scheduled",
    agentAction: "AI reminder queued",
    confidence: "89%",
    updatedAt: "11 Apr 2026 08:57",
  },
  {
    eventId: "RISK-DATA-003",
    eventType: "Low quality batch",
    severity: "Warning",
    entityType: "Batch",
    entityKey: "BAT-SOUT-IDM-20260410-002",
    owner: "Admin Sistem",
    sla: "1 hari",
    status: "Pending Validation",
    observedValue: "Quality score 84.3",
    thresholdRule: "quality_score < 85",
    source: "data_quality_result",
    workflowState: "Validation blocked",
    agentAction: "AI requested remap",
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
    status: "Partial",
    agingBucket: "31-45",
    compliance: "Warning",
    owner: "Finance Koprindo",
  },
  {
    invoiceId: "IDM-SEP-2026-087",
    payer: "Indomaret",
    payee: "Koprindo",
    dueDate: "28 Apr 2026",
    amount: "Rp540 Jt",
    paidAmount: "Rp0",
    status: "Open",
    agingBucket: "0-30",
    compliance: "Current",
    owner: "Finance Koprindo",
  },
  {
    invoiceId: "KOP-GE-2026-031",
    payer: "Koprindo",
    payee: "Gunawan Elektro",
    dueDate: "14 Mei 2026",
    amount: "Rp1.14 M",
    paidAmount: "Rp0",
    status: "Open",
    agingBucket: "0-30",
    compliance: "Current",
    owner: "Finance Koprindo",
  },
  {
    invoiceId: "AKS-SEP-2026-014",
    payer: "AksesMu",
    payee: "Koprindo",
    dueDate: "07 Apr 2026",
    amount: "Rp180 Jt",
    paidAmount: "Rp60 Jt",
    status: "Past Due",
    agingBucket: "46-60",
    compliance: "High",
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
    status: "Processed",
    tone: "success" as StatusTone,
    uploadedAt: "10 Apr 2026, 10:18",
    progress: 100,
  },
  {
    channel: "Indomaret",
    pic: "Fajar Nugraha",
    status: "Validating",
    tone: "warning" as StatusTone,
    uploadedAt: "10 Apr 2026, 08:42",
    progress: 68,
  },
  {
    channel: "aksesmu",
    pic: "Siti Fauziah",
    status: "Pending Upload",
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
    severity: "Critical",
    title: "Cabang Cirebon Raya turun 28.9% MoM",
    detail: "Outlet aktif turun 17% dan availability hanya 52%.",
    action: "Jalankan Evaluasi PKS",
    tone: "danger" as StatusTone,
  },
  {
    severity: "Warning",
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
  { label: "Unresolved Cases", value: "7", note: "Perlu follow-up" },
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
  { label: "Laporan Periode Aktif", value: "4", note: "2 generated, 2 queued" },
  { label: "Status PDF", value: "2 Siap Kirim", note: "1 draft, 1 failed" },
  { label: "Distribusi Principal", value: "Terakhir 07 Apr 2026", note: "On time" },
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
    title: "Quality gate",
    status: "active",
    note: "Review issue row non-FOX dan publish decision sedang berjalan.",
  },
  {
    id: "publish",
    title: "Executive publish",
    status: "pending",
    note: "Angka final hanya tayang setelah batch dipublish atau diberi flag provisional.",
  },
] as const;

export const reportPreviewSections = [
  {
    id: "executive",
    title: "Executive Summary",
    summary: `Sell-out ${demoScenario.totalSellOutCompact}, progress target ${demoScenario.targetProgress}, dan status PKS Early Warning.`,
    bullets: [
      `Outlet aktif ${demoScenario.activeOutletCount} dengan coverage ${demoScenario.distributionCoverage}.`,
      `Return impact ${demoScenario.returnRate} dan quality gate menandai 1 channel provisional.`,
      `Aging payment ${demoScenario.aging45Plus} masih perlu perhatian finance.`,
    ],
  },
  {
    id: "risk",
    title: "Risk Control",
    summary: "Ringkasan risiko cabang, payment watchlist, dan exception outlet untuk steering mingguan.",
    bullets: [
      `Stock risk terdeteksi di ${demoScenario.riskOutletCount}.`,
      `Variance sell-in dan sell-out berada di ${demoScenario.sellInSellOutVariance}.`,
      "Cabang Cirebon Raya dan Surabaya Timur tetap menjadi fokus intervensi.",
    ],
  },
  {
    id: "governance",
    title: "Governance Notes",
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
    title: "Branch signal",
    value: "Cirebon Raya",
    detail: "Growth -28.9%, outlet aktif 49%, dan stok masuk kategori kritis.",
  },
  {
    title: "Immediate action",
    value: "Audit coverage outlet",
    detail: "Turunkan alokasi, cek visibility stok, dan review rute distribusi 7 hari ke depan.",
  },
  {
    title: "Financial note",
    value: "Payment follow-up",
    detail: "Cabang terkait masuk watchlist payment karena channel masih membawa exposure aging.",
  },
] as const;

export const reportCatalog = [
  {
    title: "Laporan Rekap Bulanan",
    detail: "KPI sell-out, ranking cabang, anomaly center, dan aktivitas upload.",
    status: "Ready",
  },
  {
    title: "Evaluasi PKS",
    detail: "Status threshold dan hasil evaluasi performa distributor per periode.",
    status: "Draft",
  },
  {
    title: "Rekomendasi Alokasi PO",
    detail: "Saran PO bulan berikutnya berdasarkan sell-out dan stok akhir.",
    status: "Queued",
  },
  {
    title: "Ringkasan Retur",
    detail: "Retur per channel, alasan, dan dampak pada sell-out efektif.",
    status: "Ready",
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
    distribution: "Sent",
    recipient: "Management Internal",
  },
  {
    name: "Evaluasi PKS September 2026",
    type: "PKS",
    period: "Sep-2026",
    generated: "11 Apr 2026 07:12",
    by: "Admin Sistem",
    format: "PDF",
    distribution: "Draft",
    recipient: "Belum dikirim",
  },
  {
    name: "Alokasi PO Oktober 2026",
    type: "PO",
    period: "Okt-2026",
    generated: "11 Apr 2026 07:20",
    by: "n8n Scheduler",
    format: "XLSX",
    distribution: "Queued",
    recipient: "Tim BD Koprindo",
  },
];

export const activityLog = [
  "11 Apr 2026 07:20 - Rekomendasi Alokasi PO Oktober 2026 dibuat.",
  "11 Apr 2026 07:12 - Evaluasi PKS September 2026 dijalankan manual.",
  "11 Apr 2026 07:05 - Rekap bulanan September 2026 digenerate otomatis.",
];
