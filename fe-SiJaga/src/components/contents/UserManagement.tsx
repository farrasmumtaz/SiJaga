"use client";

import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";

interface RegularUser { id: number; name: string; email: string; status: string | null }
interface ResponseData { success?: boolean; users?: RegularUser[]; message?: string }
const API = process.env.NEXT_PUBLIC_API_BASE_URL;
const statuses: Record<string, string> = { APPROVED: "Disetujui", PENDING: "Menunggu persetujuan", REJECTED: "Ditolak" };

export default function UserManagement({ onDeleted }: { onDeleted: () => Promise<void> }) {
  const [users, setUsers] = useState<RegularUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [target, setTarget] = useState<RegularUser | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      if (!API || !token) throw new Error("Autentikasi atau alamat backend tidak tersedia.");
      const response = await fetch(`${API}/user-ess/users`, { headers: { Authorization: `Bearer ${token}` } });
      const data: ResponseData = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Gagal memuat pengguna.");
      setUsers(data.users || []); setError("");
    } catch (e) { setError(e instanceof Error ? e.message : "Gagal memuat pengguna."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void reload(); }, [reload]);
  const remove = async () => {
    if (!target || busy) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const token = Cookies.get("token");
      if (!API || !token) throw new Error("Autentikasi atau alamat backend tidak tersedia.");
      const response = await fetch(`${API}/user-ess/users/${target.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      const data: ResponseData = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Gagal menghapus pengguna.");
      setUsers(previous => previous.filter(user => user.id !== target.id));
      setMessage("Akun berhasil dihapus. Riwayat penggunaan tetap disimpan."); setTarget(null);
      await onDeleted();
    } catch (e) { setError(e instanceof Error ? e.message : "Gagal menghapus pengguna."); }
    finally { setBusy(false); }
  };
  return <section className="mt-8 rounded-3xl bg-white p-6 shadow-lg">
    <div className="mb-4 flex items-center justify-between gap-4"><h2 className="text-xl font-bold text-[#1E2A4A]">Kelola Akun Pengguna</h2><button type="button" disabled={loading || busy} onClick={() => void reload()} className="rounded-lg bg-[#3650A2] px-4 py-2 text-white disabled:opacity-50">Muat ulang</button></div>
    <p className="mb-4 text-sm text-gray-600">Hanya akun pengguna biasa yang dapat dihapus. Riwayat tetap disimpan.</p>
    {error && <p role="alert" className="mb-4 text-red-700">{error}</p>}
    {message && <p role="status" className="mb-4 text-green-700">{message}</p>}
    {target && <div role="dialog" aria-modal="false" aria-label="Konfirmasi hapus akun" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4">
      <p>Hapus akun {target.name} ({target.email})? Akun dan akses kartunya akan dicabut. Tindakan ini tidak dapat dibatalkan.</p>
      <div className="mt-3 flex gap-3"><button type="button" disabled={busy} onClick={() => void remove()} className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-50">{busy ? "Menghapus..." : "Ya, hapus akun"}</button><button type="button" disabled={busy} onClick={() => setTarget(null)} className="rounded-lg bg-gray-200 px-4 py-2">Batal</button></div>
    </div>}
    {loading ? <p>Memuat pengguna...</p> : <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left"><thead><tr>{["Nama", "Email", "Status", "Aksi"].map(label => <th key={label} className="py-3">{label}</th>)}</tr></thead><tbody>{users.map(user => <tr key={user.id} className="border-t"><td className="py-3">{user.name}</td><td>{user.email}</td><td>{statuses[user.status || ""] || "Tidak diketahui"}</td><td><button type="button" disabled={busy} onClick={() => { setTarget(user); setError(""); }} className="rounded-lg bg-red-100 px-3 py-2 text-red-800 disabled:opacity-50">Hapus akun</button></td></tr>)}</tbody></table>{users.length === 0 && <p className="py-4">Tidak ada akun pengguna biasa.</p>}</div>}
  </section>;
}
