import {
  pgTable,
  text,
  integer,
  decimal,
  timestamp,
  date,
  boolean,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Enums
export const sourceTypeEnum = pgEnum("source_type", [
  "sell_in",
  "sell_out",
  "payment",
  "inventory",
  "master_data",
]);

export const sourcePartyEnum = pgEnum("source_party", [
  "koprindo",
  "gunawan_elektro",
  "ritel_modern",
  "konsultan",
  "manual_admin",
]);

export const channelEnum = pgEnum("channel", [
  "alfamart",
  "indomaret",
  "aksesmu",
  "all",
]);

export const validationStatusEnum = pgEnum("validation_status", [
  "received",
  "validated",
  "rejected",
  "published",
  "exception_review",
]);

export const qualityStatusEnum = pgEnum("quality_status", [
  "passed",
  "provisional",
  "blocked",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "unpaid",
  "partial",
  "paid",
  "disputed",
  "overdue",
]);

export const agingBucketEnum = pgEnum("aging_bucket", [
  "0_30",
  "31_45",
  "46_60",
  "61_plus",
]);

export const riskTypeEnum = pgEnum("risk_type", [
  "stockout_risk",
  "overstock_risk",
  "sell_in_sell_out_mismatch",
  "payment_overdue",
  "payment_aging_critical",
  "target_underachievement",
  "data_quality_failure",
  "source_delay",
]);

export const severityEnum = pgEnum("severity", [
  "info",
  "warning",
  "high",
  "critical",
]);

export const riskStatusEnum = pgEnum("risk_status", [
  "open",
  "acknowledged",
  "resolved",
  "ignored",
]);

export const ownerRoleEnum = pgEnum("owner_role", [
  "bd",
  "admin",
  "finance",
  "consultant",
  "management",
]);

// 4.1 batch_registry
export const batchRegistry = pgTable("batch_registry", {
  batchId: uuid("batch_id").primaryKey().defaultRandom(),
  sourceType: sourceTypeEnum("source_type").notNull(),
  sourceParty: sourcePartyEnum("source_party").notNull(),
  channel: channelEnum("channel"),
  periodMonth: integer("period_month").notNull(),
  periodYear: integer("period_year").notNull(),
  fileName: text("file_name").notNull(),
  fileChecksum: text("file_checksum").notNull(),
  fileSizeBytes: integer("file_size_bytes").notNull(),
  receivedAt: timestamp("received_at").defaultNow().notNull(),
  validationStatus: validationStatusEnum("validation_status").notNull(),
  qualityScore: decimal("quality_score", { precision: 5, scale: 2 }),
  revisionOfBatchId: uuid("revision_of_batch_id"),
});

// 4.2 sell_in_record
export const sellInRecord = pgTable("sell_in_record", {
  recordId: uuid("record_id").primaryKey().defaultRandom(),
  batchId: uuid("batch_id").references(() => batchRegistry.batchId).notNull(),
  periodKey: text("period_key").notNull(), // YYYY-MM
  channel: channelEnum("channel"),
  regionCode: text("region_code").notNull(),
  branchCode: text("branch_code").notNull(),
  outletCode: text("outlet_code").notNull(),
  skuCode: text("sku_code").notNull(),
  qtySellIn: decimal("qty_sell_in", { precision: 15, scale: 2 }).notNull(),
  shipmentDate: date("shipment_date"),
  receiptDate: date("receipt_date"),
  rawRowRef: text("raw_row_ref").notNull(),
});

// 4.3 sell_out_record
export const sellOutRecord = pgTable("sell_out_record", {
  recordId: uuid("record_id").primaryKey().defaultRandom(),
  batchId: uuid("batch_id").references(() => batchRegistry.batchId).notNull(),
  periodKey: text("period_key").notNull(), // YYYY-MM
  channel: channelEnum("channel").notNull(),
  regionCode: text("region_code").notNull(),
  branchCode: text("branch_code").notNull(),
  outletCode: text("outlet_code").notNull(),
  skuCode: text("sku_code").notNull(),
  qtySellOut: decimal("qty_sell_out", { precision: 15, scale: 2 }).notNull(),
  salesAmount: decimal("sales_amount", { precision: 15, scale: 2 }).notNull(),
  transactionCount: integer("transaction_count"),
  rawRowRef: text("raw_row_ref").notNull(),
});

// 4.4 inventory_position
export const inventoryPosition = pgTable("inventory_position", {
  recordId: uuid("record_id").primaryKey().defaultRandom(),
  batchId: uuid("batch_id").references(() => batchRegistry.batchId).notNull(),
  periodKey: text("period_key").notNull(), // YYYY-MM
  channel: channelEnum("channel").notNull(),
  regionCode: text("region_code").notNull(),
  branchCode: text("branch_code").notNull(),
  outletCode: text("outlet_code").notNull(),
  skuCode: text("sku_code").notNull(),
  openingStock: decimal("opening_stock", { precision: 15, scale: 2 }),
  closingStock: decimal("closing_stock", { precision: 15, scale: 2 }).notNull(),
  stockSnapshotDate: date("stock_snapshot_date"),
});

// 4.5 payment_record
export const paymentRecord = pgTable("payment_record", {
  paymentId: uuid("payment_id").primaryKey().defaultRandom(),
  batchId: uuid("batch_id").references(() => batchRegistry.batchId).notNull(),
  invoiceId: text("invoice_id").notNull(),
  invoiceType: text("invoice_type").notNull(), // 'retail_to_koprindo', 'koprindo_to_gunawan'
  payerParty: sourcePartyEnum("payer_party").notNull(),
  payeeParty: sourcePartyEnum("payee_party").notNull(),
  invoiceDate: date("invoice_date").notNull(),
  invoiceReceivedDate: date("invoice_received_date"),
  dueDate: date("due_date").notNull(),
  invoiceAmount: decimal("invoice_amount", { precision: 15, scale: 2 }).notNull(),
  paidAmount: decimal("paid_amount", { precision: 15, scale: 2 }).notNull(),
  lastPaymentDate: date("last_payment_date"),
  paymentStatus: paymentStatusEnum("payment_status").notNull(),
  agingDays: integer("aging_days").notNull(),
  agingBucket: agingBucketEnum("aging_bucket").notNull(),
});

// 4.6 data_quality_result
export const dataQualityResult = pgTable("data_quality_result", {
  qualityResultId: uuid("quality_result_id").primaryKey().defaultRandom(),
  batchId: uuid("batch_id").references(() => batchRegistry.batchId).notNull(),
  qualityScore: decimal("quality_score", { precision: 5, scale: 2 }).notNull(),
  blockingIssueCount: integer("blocking_issue_count").notNull(),
  warningIssueCount: integer("warning_issue_count").notNull(),
  reviewRequired: boolean("review_required").notNull(),
  qualityStatus: qualityStatusEnum("quality_status").notNull(),
  qualityNotes: text("quality_notes"),
});

// 4.7 risk_event
export const riskEvent = pgTable("risk_event", {
  riskEventId: uuid("risk_event_id").primaryKey().defaultRandom(),
  periodKey: text("period_key").notNull(),
  riskType: riskTypeEnum("risk_type").notNull(),
  severity: severityEnum("severity").notNull(),
  entityType: text("entity_type").notNull(), // 'channel', 'region', 'branch', 'outlet', 'invoice', 'batch'
  entityKey: text("entity_key").notNull(),
  metricName: text("metric_name").notNull(),
  observedValue: decimal("observed_value", { precision: 15, scale: 2 }),
  thresholdValue: decimal("thresholdValue", { precision: 15, scale: 2 }),
  status: riskStatusEnum("status").notNull(),
  ownerRole: ownerRoleEnum("owner_role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
