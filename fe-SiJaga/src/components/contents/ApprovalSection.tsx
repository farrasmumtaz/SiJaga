"use client";

import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { FiCheck, FiRefreshCw, FiX } from "react-icons/fi";
import { jakarta } from "@/styles/fonts";

type PendingUser = {
  id: number;
  name: string;
  email: string;
  card_id: string;
  status: "PENDING";
};

type Action = "approve" | "reject";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const ApprovalSection = () => {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => Cookies.get("token");

  const loadPendingUsers = useCallback(async () => {
    const token = getToken();

    if (!API_BASE_URL || !token) {
      setError("Autentikasi atau alamat backend tidak tersedia.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/user-ess/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: { success: boolean; users?: PendingUser[]; message?: string } =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Gagal memuat pengguna yang menunggu persetujuan.");
      }

      setUsers(data.users || []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Gagal memuat pengguna yang menunggu persetujuan."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPendingUsers();
  }, [loadPendingUsers]);

  const updateUserStatus = async (user: PendingUser, action: Action) => {
    const token = getToken();

    if (!API_BASE_URL || !token) {
      setError("Autentikasi atau alamat backend tidak tersedia.");
      return;
    }

    setActionUserId(user.id);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/user-ess/${action}/${user.id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data: { success: boolean; message?: string } = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Gagal memperbarui status pengguna.");
      }

      setUsers((currentUsers) => currentUsers.filter(({ id }) => id !== user.id));
      setMessage(
        action === "approve"
          ? `${user.name} telah disetujui.`
          : `${user.name} telah ditolak.`
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Gagal memperbarui status pengguna."
      );
    } finally {
      setActionUserId(null);
    }
  };

  return (
    <section className={`${jakarta.className} flex-1 px-4 py-8 lg:ml-24 lg:px-8 lg:py-16`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#3650A2]">Admin</p>
            <h1 className="text-3xl font-bold text-[#1E2A4A]">Persetujuan Pengguna</h1>
            <p className="mt-2 text-gray-600">
              Tinjau pengguna dan kartu RFID yang menunggu akses SiJaga.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadPendingUsers()}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3650A2] px-4 py-3 font-semibold text-white transition hover:bg-[#2C4390] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
            Muat ulang
          </button>
        </div>

        {message && (
          <p className="mb-4 rounded-xl bg-green-100 px-4 py-3 text-sm font-medium text-green-800">
            {message}
          </p>
        )}
        {error && (
          <p className="mb-4 rounded-xl bg-red-100 px-4 py-3 text-sm font-medium text-red-800">
            {error}
          </p>
        )}

        <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
          <div className="border-b border-gray-100 px-6 py-5">
            <h2 className="text-lg font-bold text-[#1E2A4A]">Menunggu Persetujuan</h2>
            <p className="mt-1 text-sm text-gray-500">{users.length} pengguna pending</p>
          </div>

          {isLoading ? (
            <div className="px-6 py-12 text-center text-gray-500">Memuat pengguna pending...</div>
          ) : users.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              Tidak ada pengguna yang menunggu persetujuan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead className="bg-[#F4F6FC] text-sm text-[#3650A2]">
                  <tr>
                    <th className="px-6 py-4 font-bold">Pengguna</th>
                    <th className="px-6 py-4 font-bold">Email</th>
                    <th className="px-6 py-4 font-bold">UID Kartu</th>
                    <th className="px-6 py-4 text-right font-bold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => {
                    const isUpdating = actionUserId === user.id;

                    return (
                      <tr key={user.id} className="text-sm text-gray-700">
                        <td className="px-6 py-5 font-semibold text-[#1E2A4A]">{user.name}</td>
                        <td className="px-6 py-5">{user.email}</td>
                        <td className="px-6 py-5 font-mono font-semibold tracking-wide">{user.card_id}</td>
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => void updateUserStatus(user, "approve")}
                              className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-3 py-2 font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <FiCheck /> Setujui
                            </button>
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => void updateUserStatus(user, "reject")}
                              className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <FiX /> Tolak
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ApprovalSection;
