-- KOPRINDO FOX verification queries
-- Pakai setelah test webhook atau setelah go-live.
-- Ganti nilai periode, checksum, atau invoice sesuai batch yang sedang diuji.

-- 1. Batch terbaru
SELECT
  batch_id,
  source_type,
  source_party,
  channel,
  period_month,
  period_year,
  file_name,
  file_checksum,
  validation_status,
  quality_score,
  received_at
FROM batch_registry
ORDER BY received_at DESC
LIMIT 20;

-- 2. Cari batch berdasarkan checksum
SELECT
  batch_id,
  source_type,
  file_name,
  file_checksum,
  validation_status,
  quality_score,
  received_at
FROM batch_registry
WHERE file_checksum = 'fox-sellout-alfamart-2026-04-v1';

-- 3. Data quality result untuk batch terbaru
SELECT
  dqr.quality_result_id,
  dqr.batch_id,
  dqr.quality_score,
  dqr.blocking_issue_count,
  dqr.warning_issue_count,
  dqr.review_required,
  dqr.quality_status,
  dqr.quality_notes
FROM data_quality_result dqr
JOIN batch_registry br ON br.batch_id = dqr.batch_id
ORDER BY br.received_at DESC
LIMIT 20;

-- 4. Ringkasan jumlah records per tabel untuk batch terbaru
WITH latest_batch AS (
  SELECT batch_id, source_type
  FROM batch_registry
  ORDER BY received_at DESC
  LIMIT 1
)
SELECT
  lb.batch_id,
  lb.source_type,
  (SELECT COUNT(*) FROM sell_in_record si WHERE si.batch_id = lb.batch_id) AS sell_in_count,
  (SELECT COUNT(*) FROM sell_out_record so WHERE so.batch_id = lb.batch_id) AS sell_out_count,
  (SELECT COUNT(*) FROM inventory_position ip WHERE ip.batch_id = lb.batch_id) AS inventory_count,
  (SELECT COUNT(*) FROM payment_record pr WHERE pr.batch_id = lb.batch_id) AS payment_count
FROM latest_batch lb;

-- 5. Detail sell_in terbaru
SELECT
  batch_id,
  period_key,
  channel,
  region_code,
  branch_code,
  outlet_code,
  sku_code,
  qty_sell_in,
  shipment_date,
  receipt_date,
  raw_row_ref
FROM sell_in_record
ORDER BY record_id DESC
LIMIT 20;

-- 6. Detail sell_out terbaru
SELECT
  batch_id,
  period_key,
  channel,
  region_code,
  branch_code,
  outlet_code,
  sku_code,
  qty_sell_out,
  sales_amount,
  transaction_count,
  raw_row_ref
FROM sell_out_record
ORDER BY record_id DESC
LIMIT 20;

-- 7. Detail inventory terbaru
SELECT
  batch_id,
  period_key,
  channel,
  region_code,
  branch_code,
  outlet_code,
  sku_code,
  opening_stock,
  closing_stock,
  stock_snapshot_date
FROM inventory_position
ORDER BY record_id DESC
LIMIT 20;

-- 8. Detail payment terbaru
SELECT
  batch_id,
  invoice_id,
  invoice_type,
  payer_party,
  payee_party,
  invoice_date,
  due_date,
  invoice_amount,
  paid_amount,
  payment_status,
  aging_days,
  aging_bucket
FROM payment_record
ORDER BY payment_id DESC
LIMIT 20;

-- 9. Risk event terbaru
SELECT
  risk_event_id,
  period_key,
  risk_type,
  severity,
  entity_type,
  entity_key,
  metric_name,
  observed_value,
  "thresholdValue",
  status,
  owner_role,
  created_at
FROM risk_event
ORDER BY created_at DESC
LIMIT 30;

-- 10. Hitung risk event per severity untuk periode aktif
SELECT
  period_key,
  risk_type,
  severity,
  COUNT(*) AS total_events
FROM risk_event
WHERE period_key = to_char(CURRENT_DATE, 'YYYY-MM')
GROUP BY period_key, risk_type, severity
ORDER BY risk_type, severity;

-- 11. Cek potensi duplikat risk event yang masih terbuka
SELECT
  period_key,
  risk_type,
  entity_key,
  COUNT(*) AS open_duplicates
FROM risk_event
WHERE status IN ('open', 'acknowledged')
GROUP BY period_key, risk_type, entity_key
HAVING COUNT(*) > 1
ORDER BY open_duplicates DESC, period_key DESC;

-- 12. Cek invoice sample dari payload payment
SELECT
  batch_id,
  invoice_id,
  invoice_amount,
  paid_amount,
  payment_status,
  aging_days,
  aging_bucket
FROM payment_record
WHERE invoice_id IN ('INV-KOP-2026-04018', 'INV-KOP-2026-04019')
ORDER BY invoice_id;

-- 13. Cek mismatch sell_in vs sell_out untuk periode aktif
SELECT
  COALESCE(si.period_key, so.period_key) AS period_key,
  COALESCE(si.channel, so.channel) AS channel,
  COALESCE(si.branch_code, so.branch_code) AS branch_code,
  COALESCE(si.outlet_code, so.outlet_code) AS outlet_code,
  COALESCE(si.sku_code, so.sku_code) AS sku_code,
  SUM(COALESCE(si.qty_sell_in, 0)) AS total_sell_in,
  SUM(COALESCE(so.qty_sell_out, 0)) AS total_sell_out,
  ROUND(
    CASE
      WHEN SUM(COALESCE(si.qty_sell_in, 0)) = 0 THEN 0
      ELSE (SUM(COALESCE(si.qty_sell_in, 0)) - SUM(COALESCE(so.qty_sell_out, 0))) / SUM(COALESCE(si.qty_sell_in, 0))
    END
  , 4) AS variance_pct
FROM sell_in_record si
FULL OUTER JOIN sell_out_record so
  ON si.period_key = so.period_key
 AND si.channel = so.channel
 AND si.branch_code = so.branch_code
 AND si.outlet_code = so.outlet_code
 AND si.sku_code = so.sku_code
WHERE COALESCE(si.period_key, so.period_key) = to_char(CURRENT_DATE, 'YYYY-MM')
GROUP BY 1,2,3,4,5
ORDER BY variance_pct DESC, channel, branch_code, outlet_code;
