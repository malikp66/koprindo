# Dokumen Spesifikasi n8n Workflows Koprindo

Berikut adalah rincian arsitektur n8n workflow yang direncanakan. Implementasi n8n dapat dilakukan dengan membuat node-node ini ke dalam canvas n8n Anda. 

Semua workflow n8n dirancang sebagai "Business Logic Executer" untuk Koprindo Backend.

---

## Workflow 1: Intake & Data Parsing Pipeline
**Tujuan:** Mengawasi *dropzone* FTP/Google Drive, mengambil file, melakukan validasi kontrak, memparsing isinya (opsional menggunakan AI jika *unstructured*), lalu mengirimkannya ke Next.js DB.

### Diagram Node

1. **Trigger Node:** `Schedule` (cron tiap jam 18:00) atau `Webhook` dari Dashboard Next.js.
2. **Download File Node:** `HTTP Request` / `Google Drive Node` / `FTP Node` untuk meretrieve `.csv` atau `.xlsx`.
3. **Parse Node:** `Spreadsheet File Node` (Read to JSON).
4. **Validation Logic (Code Node):**
   ```javascript
   // Pseudo-code n8n:
   const items = $input.all();
   const requiredFields = ["period", "channel", "sku_code", "qty_sell_out"];
   let blockingIssues = 0;

   items.forEach(item => {
     requiredFields.forEach(field => {
       if (!item.json[field]) blockingIssues++;
     });
   });

   return [{
      json: {
        batchId: $execution.id, // UUID
        sourceType: "sell_out",
        sourceParty: "ritel_modern",
        records: items.map(i => i.json),
        qualityScore: blockingIssues > 0 ? 50 : 100,
        blockingIssueCount: blockingIssues
      }
   }];
   ```
5. **Ingest to Next.js API:** `HTTP Request Node`  
   - **Method:** POST
   - **URL:** `https://your-domain.com/api/intake/batch`
   - **Body:** Data JSON dari node sebelumnya.
6. **Notification Node:** `Slack`/`Telegram`/`Brevo` "Intake selesai dengan status pass/fail".

---

## Workflow 2: Reconciliation & Integrity Check Scheduler
**Tujuan:** Melakukan pengecekan *Sell-In* vs *Sell-Out Mismatch*.

### Diagram Node

1. **Trigger Node:** `Cron` tiap jam 02:00 pagi setiap hari.
2. **Postgres Query Node (Fetch Data):**  
   Kueri ke `DATABASE_URL` Supabase Anda.
   ```sql
   SELECT 
     si.sku_code,
     SUM(si.qty_sell_in) as total_in,
     SUM(so.qty_sell_out) as total_out
   FROM sell_in_record si
   JOIN sell_out_record so ON si.sku_code = so.sku_code
   WHERE si.period_key = '2026-09'
   GROUP BY si.sku_code;
   ```
3. **Calculation & Rule Evaluation (Code Node):**  
   Sesuai `IMPLEMENTATION_SPEC` Section 8.4.4.
   ```javascript
   const items = $input.all();
   let riskEvents = [];

   items.forEach(item => {
      let total_in = item.json.total_in;
      let total_out = item.json.total_out;
      let variance = (total_in - total_out) / total_in;

      if(variance > 0.5) {
         riskEvents.push({ riskType: "sell_in_sell_out_mismatch", severity: "critical", sku: item.json.sku_code });
      } else if (variance > 0.3) {
         riskEvents.push({ riskType: "sell_in_sell_out_mismatch", severity: "high", sku: item.json.sku_code });
      }
   });

   return riskEvents.map(e => ({json: e}));
   ```
4. **Post Risk Event to API:** `HTTP Request Node`.  
   POST `https://your-domain.com/api/intake/risk-event` untuk register isu supaya bisa masuk ke Dashboard Executive.

---

## Workflow 3: Payment Due Date / Aging Monitoring
**Tujuan:** Menggeser status Payment dari *unpaid* ke *overdue* secara otomatis memantau kalender.

### Diagram Node

1. **Trigger:** `Cron` jam 01:00 AM.
2. **PostgreSQL Node (Select Overdue):**
   ```sql
   SELECT * FROM payment_record 
   WHERE payment_status IN ('unpaid', 'partial')
   AND due_date < CURRENT_DATE;
   ```
3. **PostgreSQL Node (Update DB):**
   ```sql
   UPDATE payment_record 
   SET payment_status = 'overdue',
       aging_bucket = CASE 
         WHEN CURRENT_DATE - due_date <= 30 THEN '0_30'
         WHEN CURRENT_DATE - due_date <= 45 THEN '31_45'
         ELSE '46_60'
       END
   WHERE payment_id = {{$json.payment_id}}
   ```
4. **Create Risk Event (HTTP Node):**
   Jika masuk ke aging 46_60, kirim POST ke `/api/intake/risk-event` dengan tipe `payment_aging_critical`.

---

## Workflow 4: Escalation Notification Routing
**Tujuan:** Mendengarkan Notifikasi yang bersifat "High" atau "Critical" dan melakukan eskalasi.

### Diagram Node

1. **Trigger:** `Webhook Node` (URL: `https://your-n8n.com/webhook/escalation-alert`). Next.js akan ping endpoint ini jika user di dashboard / sistem menggolongkan risk.
2. **Switch / IF Node:**
   - Kondisi 1: `{{ $json.severity }} == "high"`
   - Kondisi 2: `{{ $json.severity }} == "critical"`
3. **Delivery Channels:**
   - Branch untuk High: Terhubung ke `Slack` `#ops-finance`.
   - Branch untuk Critical: Terhubung ke `WhatsApp Business API` ke CEO / VP Finance Koprindo dan `Brevo/SendGrid` untuk *email template* merah.
