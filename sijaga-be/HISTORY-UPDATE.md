# Pembaruan riwayat dan pengelolaan pengguna

Hentikan backend sebelum regenerasi Prisma di Windows agar DLL tidak terkunci.

Untuk database lama yang dibuat manual, jalankan SQL berikut melalui SQL Editor
Supabase (jangan menjalankan semua migration tanpa memeriksa baseline terlebih dahulu):

```sql
ALTER TABLE public.usage_history ADD COLUMN IF NOT EXISTS avail_status TEXT;
```

Tidak perlu indeks tambahan: kolom ini hanya ditampilkan; indeks riwayat berdasarkan
user_id, Timestamp, id yang sudah ada tetap mendukung pembacaan riwayat.

Kemudian dari folder sijaga-be:

```powershell
npx prisma generate
npm test
npm run dev
```

Snapshot barang menggunakan laporan sensor terbaru, maksimal berumur 60 detik,
saat aktivitas dicatat. Ini bukan konfirmasi hasil penempatan/pengambilan barang.
Riwayat lama tetap NULL dan ditampilkan sebagai Tidak tercatat.

Admin: GET /user-ess/users dan DELETE /user-ess/users/:id dengan Bearer token.
Penghapusan akun admin atau pemilik loker aktif ditolak. Foreign key riwayat
ON DELETE SET NULL mempertahankan catatan, sedangkan autentikasi selalu membaca
akun aktual sehingga token akun terhapus tidak dapat dipakai kembali.

Uji manual: admin melihat pengguna dan dialog konfirmasi; user biasa mendapat 403;
admin tidak bisa dihapus; pemilik loker aktif mendapat 409. Uji penghapusan hanya
pada akun percobaan, bukan akun nyata. Setelah penghapusan, riwayat tetap terlihat
oleh admin dan akun tidak dapat masuk atau membuka loker.
