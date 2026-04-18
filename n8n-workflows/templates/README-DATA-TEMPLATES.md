# Template Data untuk Parser Workflow

Folder ini berisi template `.csv` yang pasti cocok dengan parser pada workflow `KOPRINDO-FOX-e2e-*`.

## File yang tersedia

- `sell_in-template.csv`
- `sell_out-template.csv`
- `inventory-template.csv`
- `payment-template.csv`

## Aturan penting

- Header harus tetap sama seperti template.
- Nama kolom disarankan pakai huruf kecil dan underscore.
- Format tanggal gunakan `YYYY-MM-DD`.
- Nilai angka jangan pakai pemisah ribuan.
- Untuk `payment-template.csv`, biarkan `last_payment_date` kosong jika belum ada pembayaran.

## Cara membuat versi XLSX

Repo ini tidak memiliki library spreadsheet untuk membuat `.xlsx` secara otomatis. Karena itu template yang saya sediakan dalam bentuk `.csv`.

Jika Anda butuh `.xlsx`, lakukan ini:
1. Buka file `.csv` template di Excel.
2. Jangan ubah nama kolom header.
3. Isi data sesuai kebutuhan.
4. Klik `Save As`.
5. Pilih format `Excel Workbook (*.xlsx)`.

Parser workflow akan menerima `.xlsx` selama nama kolom tetap sesuai template.

## Mapping template ke sourceType

- `sell_in-template.csv` -> `sourceType=sell_in`
- `sell_out-template.csv` -> `sourceType=sell_out`
- `inventory-template.csv` -> `sourceType=inventory`
- `payment-template.csv` -> `sourceType=payment`
