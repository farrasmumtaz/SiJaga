"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function AdminOnly({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    const controller = new AbortController();
    async function checkAccess(): Promise<void> {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user-ess/whoami`,
          { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal }
        );
        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        if (!response.ok) throw new Error("Gagal memeriksa akses. Silakan muat ulang halaman.");
        const data: { success?: boolean; user?: { role?: string } } = await response.json();
        if (!data.success || data.user?.role !== "ADMIN") {
          router.replace("/dashboard");
          return;
        }
        if (!controller.signal.aborted) setAllowed(true);
      } catch (cause: unknown) {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : "Gagal memeriksa akses.");
        }
      }
    }
    void checkAccess();
    return () => controller.abort();
  }, [router]);

  if (!allowed) {
    return <p role="status" className="p-8 text-center text-gray-600">
      {error ?? "Memeriksa akses admin..."}
    </p>;
  }
  return children;
}
