"use client";

import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { jakarta } from "@/styles/fonts";

interface HistoryItem {
  id: number;
  Timestamp: string;
  name: string;
  status: string;
  availStatus?: string | null;
}

const activities: Record<string, { label: string; color: string }> = {
  LOGIN: { label: "Masuk", color: "bg-blue-100 text-blue-800" },
  STORE_ITEM: { label: "Taruh barang", color: "bg-amber-100 text-amber-800" },
  TAKE_ITEM: { label: "Ambil barang", color: "bg-green-100 text-green-800" },
  ACCESS_DENIED: { label: "Akses ditolak", color: "bg-red-100 text-red-800" },
  LOGOUT: { label: "Keluar", color: "bg-gray-100 text-gray-800" },
};
const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function History() {
  const router = useRouter();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [activity, setActivity] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) { router.replace("/login"); return; }
    if (!API) { setError("Alamat backend belum dikonfigurasi."); setLoading(false); return; }
    let active = true;
    const reload = async () => {
      try {
        const response = await fetch(`${API}/history/all`, { headers: { Authorization: `Bearer ${token}` } });
        const data: { success?: boolean; usageHistory?: HistoryItem[] } = await response.json();
        if (!response.ok || !data.success || !Array.isArray(data.usageHistory)) throw new Error("Gagal memuat riwayat.");
        if (active) { setItems(data.usageHistory); setError(""); }
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Gagal memuat riwayat.");
      } finally { if (active) setLoading(false); }
    };
    const socket = io(API, { auth: { token }, withCredentials: true });
    socket.on("connect", () => void reload());
    socket.on("usageHistory_update", (item: HistoryItem) => {
      setItems(previous => [item, ...previous.filter(row => row.id !== item.id)]);
    });
    void reload();
    return () => { active = false; socket.disconnect(); };
  }, [router]);

  const filtered = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    if (time === "today") start.setHours(0, 0, 0, 0);
    else start.setDate(start.getDate() - 7);
    return items.filter(item => {
      const date = new Date(item.Timestamp);
      return item.name.toLocaleLowerCase("id-ID").includes(search.toLocaleLowerCase("id-ID"))
        && (!activity || item.status === activity)
        && (!time || (date >= start && date <= now));
    });
  }, [items, search, activity, time]);

  return (
    <section className={`${jakarta.className} flex-1 px-4 py-8 lg:ml-24 lg:px-8 lg:py-16`}>
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-6 shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-[#3650A2]">Riwayat Penggunaan</h1>
        <input aria-label="Cari nama pengguna" placeholder="Cari nama" value={search} onChange={e => setSearch(e.target.value)} className="mb-4 w-full rounded-xl bg-[#CBDCEB] p-3" />
        <div className="mb-6 flex flex-wrap gap-4">
          <select aria-label="Filter waktu" value={time} onChange={e => setTime(e.target.value)} className="rounded-xl bg-gray-100 p-3">
            <option value="">Semua waktu</option><option value="today">Hari ini</option><option value="week">Tujuh hari terakhir</option>
          </select>
          <select aria-label="Filter aktivitas" value={activity} onChange={e => setActivity(e.target.value)} className="rounded-xl bg-gray-100 p-3">
            <option value="">Semua aktivitas</option>
            {Object.entries(activities).map(([value, entry]) => <option key={value} value={value}>{entry.label}</option>)}
          </select>
        </div>
        <p className="mb-4 text-sm text-gray-500">Kondisi barang adalah pembacaan sensor saat aktivitas dicatat, sebelum proses menaruh atau mengambil barang selesai.</p>
        {error ? <p role="alert" className="text-red-700">{error}</p> : loading ? <p>Memuat riwayat...</p> :
          <div className="max-h-[500px] overflow-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead><tr className="border-b text-[#3650A2]">{["Waktu", "Nama", "Aktivitas", "Kondisi Barang"].map(title => <th key={title} className="p-3">{title}</th>)}</tr></thead>
              <tbody>{filtered.map(item => {
                const entry = activities[item.status] ?? { label: "Aktivitas lainnya", color: "bg-gray-100 text-gray-800" };
                return <tr key={item.id} className="border-b">
                  <td className="p-3">{new Date(item.Timestamp).toLocaleString("id-ID")}</td>
                  <td className="p-3">{item.name}</td>
                  <td className="p-3"><span className={`rounded-full px-3 py-1 text-sm font-semibold ${entry.color}`}>{entry.label}</span></td>
                  <td className="p-3">{item.availStatus === "ADA BARANG" ? "Ada barang" : item.availStatus === "TIDAK ADA BARANG" ? "Tidak ada barang" : "Tidak tercatat"}</td>
                </tr>;
              })}</tbody>
            </table>
            {filtered.length === 0 && <p className="py-8 text-center text-gray-500">Tidak ada riwayat yang sesuai.</p>}
          </div>}
      </div>
    </section>
  );
}
