"use client";

import Cookies from "js-cookie";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  status: string | null;
  card_id: string;
}

interface UserResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const readResponse = async (response: Response): Promise<UserResponse> => {
  const data: unknown = await response.json();

  if (!data || typeof data !== "object") {
    throw new Error("Respons server tidak valid.");
  }

  return data as UserResponse;
};

const ProfileSection = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [error, setError] = useState("");

  const getToken = () => {
    const token = Cookies.get("token");

    if (!token) {
      router.push("/login");
      throw new Error("Sesi login tidak ditemukan.");
    }

    return token;
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/user-ess/whoami`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await readResponse(response);

        if (!response.ok || !data.success || !data.user) {
          throw new Error(data.message || "Gagal memuat profil.");
        }

        setProfile(data.user);
        setName(data.user.name);
        setEmail(data.user.email);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Gagal memuat profil."
        );
      } finally {
        setLoadingProfile(false);
      }
    };

    void loadProfile();
  }, [router]);

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setProfileMessage("");
    setSavingProfile(true);

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/user-ess/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });
      const data = await readResponse(response);

      if (!response.ok || !data.success || !data.user) {
        throw new Error(data.message || "Gagal memperbarui profil.");
      }

      setProfile(data.user);
      setName(data.user.name);
      setEmail(data.user.email);
      setProfileMessage("Profil berhasil diperbarui.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Gagal memperbarui profil."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setPasswordMessage("");

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    setSavingPassword(true);

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/user-ess/changepassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await readResponse(response);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Gagal mengganti kata sandi.");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage("Kata sandi berhasil diperbarui.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Gagal mengganti kata sandi."
      );
    } finally {
      setSavingPassword(false);
    }
  };

  if (loadingProfile) {
    return <p className="pt-16 text-center text-[#3650A2]">Memuat profil...</p>;
  }

  return (
    <section className="mx-auto max-w-5xl py-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3650A2]">
          Akun SiJaga
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Profil Pengguna</h1>
        <p className="mt-2 text-gray-600">
          Kelola identitas akun dan keamanan kata sandi Anda.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={handleProfileSubmit}
          className="rounded-3xl bg-white p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-[#3650A2]">Informasi Profil</h2>

          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Nama
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                minLength={2}
                required
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#3650A2] focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#3650A2] focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              UID Kartu
              <input
                type="text"
                value={profile?.card_id ?? ""}
                readOnly
                className="mt-1 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
              />
            </label>

            <div className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3">
              <span className="text-sm text-gray-600">Status akun</span>
              <span className="rounded-full bg-[#3650A2] px-3 py-1 text-xs font-bold text-white">
                {profile?.status ?? "PENDING"}
              </span>
            </div>
          </div>

          {profileMessage && (
            <p className="mt-4 text-sm text-green-600">{profileMessage}</p>
          )}

          <button
            type="submit"
            disabled={savingProfile}
            className="mt-6 w-full rounded-xl bg-[#3650A2] px-4 py-3 font-semibold text-white transition hover:bg-[#2C4390] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {savingProfile ? "Menyimpan..." : "Simpan Profil"}
          </button>
        </form>

        <form
          onSubmit={handlePasswordSubmit}
          className="rounded-3xl bg-white p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-[#3650A2]">Ganti Kata Sandi</h2>

          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Kata sandi saat ini
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                autoComplete="current-password"
                required
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#3650A2] focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Kata sandi baru
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#3650A2] focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Konfirmasi kata sandi baru
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#3650A2] focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          {passwordMessage && (
            <p className="mt-4 text-sm text-green-600">{passwordMessage}</p>
          )}

          <button
            type="submit"
            disabled={savingPassword}
            className="mt-6 w-full rounded-xl bg-[#FFE492] px-4 py-3 font-semibold text-[#3650A2] transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {savingPassword ? "Memperbarui..." : "Ganti Kata Sandi"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ProfileSection;
