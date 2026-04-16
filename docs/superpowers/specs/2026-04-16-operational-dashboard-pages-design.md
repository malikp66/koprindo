# Operational Dashboard Pages Design

Date: 2026-04-16
Project: Koprindo Sistem
Status: Approved in conversation, pending written-spec review by user

## Context

The current dashboard experience is uneven. The main dashboard already reads like an operational surface, but the other pages still contain too much backend-facing language and system explanation. Terms and sections such as source contracts, canonical batch status, orchestration readiness, backend intake, and risk engine logic make the product feel like internal documentation instead of a working operational tool.

The redesign keeps the main dashboard intact for now and rewrites the remaining pages so they behave like pages people actually use during daily operations.

## Problem Statement

Most non-home pages currently over-explain internal system behavior instead of helping users understand:

- what is happening now
- what needs attention
- what action should be taken next

This creates two failures:

1. The pages feel like implementation notes instead of product surfaces.
2. Users are forced to translate backend concepts into business actions themselves.

## Goals

- Keep the main dashboard as-is for now.
- Rewrite the remaining pages to be user-facing and operational.
- Make each page serve one clear mental model.
- Remove backend-facing copy and documentation-style framing.
- Make summaries, tables, and detail drawers answer practical user questions.
- Convert the documentation page into a lightweight usage guide.

## Non-Goals

- Redesign the main dashboard in this pass.
- Explain backend pipelines, orchestration, or data contracts inside working pages.
- Turn every page into a documentation center.
- Introduce new product modules outside the existing navigation.

## Design Direction

The approved direction is a hybrid operational model:

- Action-heavy pages: Data Intake, Retur
- Decision-heavy pages: Monitoring, Laporan, Admin
- Guidance page: Panduan Penggunaan

This keeps page behavior aligned with real usage instead of forcing one content pattern across the whole product.

## Core Principles

### 1. User language, not system language

Use phrases such as:

- unggah file
- perlu revisi
- belum upload
- perlu follow-up
- siap dikirim
- menunggu persetujuan
- butuh perhatian

Avoid phrases such as:

- source contract
- canonical batch status
- pipeline
- backend intake
- orchestration
- rule engine
- publish posture
- reconciliation checkpoint
- backend readiness

### 2. Every section must earn its place

A card, panel, or table is only valid if it does at least one of these:

- gives status
- shows priority
- enables action
- explains how to use the system

Anything that mainly explains internal implementation should be removed.

### 3. One page, one mental model

- Data Intake: upload and validate incoming files
- Monitoring: read operational condition and decide what to do next
- Retur: record and resolve return cases
- Laporan: prepare, review, and distribute reports
- Admin: manage people, approvals, and practical settings
- Panduan Penggunaan: teach users how to use the system

### 4. Detail views must answer “so what?”

When a row is opened, the user should quickly see:

- what the problem is
- who owns it
- what impact it has
- what should happen next

## Information Architecture

### Dashboard Utama

No major changes in this pass. It already works as the best current example of an operational summary page.

### Data Intake

Purpose:
Operational workbench for uploading data, checking upload results, and following up problematic batches.

Structure:

1. Header with primary action `Upload File` and secondary action `Unduh Template`
2. Summary cards:
   - batch hari ini
   - berhasil diproses
   - perlu perbaikan
   - belum upload
3. Main left panel: Upload and validation workspace
4. Main right panel: Prioritas hari ini
5. Bottom table: Riwayat upload
6. Detail drawer: masalah file, PIC, dampak, tindakan berikutnya

Remove:

- source intake contracts
- canonical batch status
- backend intake framing
- publish decision framing
- technical reconciliation sections

### Monitoring

Purpose:
Decision surface for reading operational condition, spotting risk, and prioritizing follow-up.

Structure:

1. Header with `Export Ringkasan` and `Refresh Data`
2. KPI row:
   - sell-out
   - outlet aktif
   - retur
   - aging payment
   - cabang butuh perhatian
   - pencapaian target
3. Main chart panel for sales trend and target progress
4. Priority panel for urgent actions
5. Tabs:
   - Ringkasan
   - Cabang
   - Pembayaran
   - Masalah Operasional
   - Evaluasi PKS
6. Right-side panels and drawers focused on decision and next action

Remove or de-emphasize:

- risk logic explanation
- agent action phrasing
- workflow-state jargon
- signal explain language that feels system-centric

### Retur

Purpose:
Operational page for recording returns, reviewing patterns, and resolving return-driven issues.

Structure:

1. Header with `Input Retur`
2. Summary cards:
   - qty retur bulan ini
   - outlet dengan retur terbanyak
   - kasus belum selesai
   - nilai dampak
3. Left panel for trend and reasons
4. Right panel for cases needing action
5. Return ledger table
6. Detail drawer with chronology, impact, status, and next step

Remove:

- exception-control framing
- sell-out correction phrasing
- risk-engine linkage explanation

### Laporan

Purpose:
User-facing page for preparing, reviewing, and distributing actual reports.

Structure:

1. Header with `Buat Laporan` and `Refresh Data`
2. Summary cards:
   - laporan siap kirim
   - laporan draft
   - jadwal hari ini
   - pengiriman gagal
3. Tabs:
   - Daftar Laporan
   - Laporan Terbuat
   - Riwayat Pengiriman
4. Selected report panel showing report summary and readiness
5. Preview drawer focused on contents and send-readiness

Remove or simplify:

- heavy governance/compliance framing
- “executive pack and audit reporting” language
- checklist copy that reads like an internal memo

### Admin

Purpose:
Practical governance page for approvals, users, integrations, and operational settings.

Structure:

1. Header with `Tambah Pengguna`
2. Summary cards:
   - permintaan baru
   - akun aktif
   - perlu revisi
   - integrasi aktif
3. Tabs:
   - Persetujuan
   - Pengguna
   - Integrasi
   - Pengaturan
4. Approval queue and review panel
5. User directory and role notes
6. Integration status shown in practical user terms
7. Settings fields framed as daily operations controls

Remove:

- orchestration readiness language
- storage/parser/internal setup framing
- technical implementation checklist tone

### Panduan Penggunaan

Purpose:
Replace documentation with a lightweight usage guide.

Structure:

1. Intro: what the system is for
2. Start here by role:
   - PIC Upload
   - Tim Operasional
   - Finance
   - Pimpinan
3. Daily workflow
4. User-facing status meanings
5. FAQ
6. Contact / PIC help section

Remove entirely:

- product documentation tone
- backend readiness notes
- AI/orchestration explanation as page headline

## Component and Data Behavior

This redesign does not require new product domains. It is mainly a rewrite of hierarchy, labels, descriptions, and panel purpose.

Preferred component mapping:

- summary cards for immediate status
- action cards for required follow-up
- data tables for work queues and history
- detail drawers for issue context and next actions
- tabs only when they separate distinct work modes

Data presentation rules:

- status labels must be human-readable
- metrics should be tied to business action
- table columns should reflect user tasks, not backend traceability
- descriptions should explain consequence, not implementation

## Error Handling and Empty States

Error and empty states should also stay user-facing.

Examples:

- Instead of “schema mismatch detected”, say “format file belum sesuai template”
- Instead of “publish blocked”, say “data ini belum siap ditampilkan karena masih perlu revisi”
- Instead of “reconciliation pending”, say “masih menunggu pengecekan lanjutan”

Every operational page should support:

- no data yet state
- waiting for user input state
- needs revision state
- complete/success state

## Copy Guardrails

- Never lead with architecture.
- Never explain backend implementation inside a working page.
- Never make AI, automation, parser, or n8n the hero of the interface.
- Keep headings short and task-oriented.
- Keep descriptions focused on outcome and next step.
- Prefer “apa yang perlu dilakukan” over “bagaimana sistem bekerja”.

## Acceptance Criteria

The redesign is successful when:

1. Non-home pages no longer read like backend documentation.
2. Users can understand page purpose within a few seconds.
3. Each page has a clear operational or decision-making role.
4. Most visible copy refers to user action, business condition, or practical status.
5. Technical implementation terms are removed from the main content surface unless absolutely necessary.
6. The documentation page becomes a usable onboarding guide.

## Testing and Review Checklist

Before implementation is considered done, verify:

- page headers reflect daily user jobs
- top cards show meaningful operational status
- every panel has a clear purpose
- tables prioritize user-facing fields
- detail drawers explain issue, owner, impact, next step
- removed sections are not reintroduced under different names
- no page feels like a backend spec or engineering memo
- the documentation page clearly functions as Panduan Penggunaan

## Implementation Notes

Implementation should prefer reuse of the current component library and layout patterns where possible. The redesign is mostly about changing information hierarchy and content framing, not inventing a new visual system.
