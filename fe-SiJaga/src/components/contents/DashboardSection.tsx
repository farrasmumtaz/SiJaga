'use client';
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { jakarta } from "@/styles/fonts";
import { io, Socket } from "socket.io-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log("FETCHING:", `${API_BASE_URL}/availability/get-latest`);
interface UsageHistoryUpdate {
  id?: null;
  name: string;
  Timestamp: string;
  status: string;
  card_id: string;
}

const DashboardSection = () => {
  const socketRef = useRef<Socket | null>(null);
  const [lastUser, setLastUser] = useState({
    id: null,
    name: "Memuat...",
    timestamp: "",
    status: "",
    cardId: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileName, setProfileName] = useState(""); // Default name
  const [availableStatus, setAvailableStatus] = useState("");

  const fetchUserProfile = async () => {
    const token = Cookies.get("token");
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user-ess/whoami`;

    if (!token) {
      console.error("Token tidak ditemukan.");
      setError("Autentikasi gagal. Harap login kembali.");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Gagal mendapatkan profil: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      if (data.success && data.user?.name) {
        setProfileName(data.user.name);
      } else {
        throw new Error("Data pengguna tidak valid.");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Gagal memuat profil pengguna.");
    }
  };

  useEffect(() => {
    console.log("API BASE URL:", API_BASE_URL);
    const socket = io(API_BASE_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      timeout: 20000,
    });
  
    socketRef.current = socket;
  
    // Event handler ketika socket berhasil terhubung
    socket.on("connect", () => {
      console.log("Connected to Socket.io URL");
    });
  
    // Event handler untuk update history
    socket.on("usageHistory_update", (data: UsageHistoryUpdate) => {
      console.log("Data received from usageHistory_update:", data);
    
      // Validate data before setting it to state
      if (data && data.name && data.Timestamp && data.status && data.card_id) {
        setLastUser({
          id: data.id || null,
          name: data.name || "Tidak diketahui",
          timestamp: data.Timestamp || "",
          status: data.status || "",
          cardId: data.card_id || "",
        });
      } else {
        console.error("Data yang diterima dari usageHistory_update tidak valid.");
      }
    });
  
    // Cleanup function saat komponen di-unmount
    return () => {
      if (socketRef.current) {
        socket.off("usageHistory_update");
        socket.disconnect();
        console.log("Socket disconnected.");
      }
    };
  }, []);
  
  const fetchLastUser = async () => {
    setLoading(true);
    setError("");
    const token = Cookies.get("token");
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/history/latest`;

    if (!token) {
      setError("Token tidak ditemukan. Silakan login kembali.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Gagal mengambil data: ${response.status} - ${response.statusText}`
        );
      }

      const responseData = await response.json();
      if (responseData.success && responseData.latestUsageHistory) {
        const { name, Timestamp, status, card_id } =
          responseData.latestUsageHistory;
        setLastUser({
          id: null, // Tetapkan nilai default
          name,
          timestamp: Timestamp,
          status,
          cardId: card_id,
        });
      } else {
          setLastUser({
          id: null,
          name: "Belum ada data",
          timestamp: "",
          status: "",
          cardId: "",
  });
}
    } catch (error) {
      console.error("Error fetching last user data:", error);
      setError("Gagal memuat data pengguna terakhir.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailable = async () => {
    setLoading(true);
    setError("");
    const token = Cookies.get("token");
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/availability/get-latest`;
  
    if (!token) {
      setError("Token tidak ditemukan. Silakan login kembali.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(
          `Gagal mengambil data: ${response.status} - ${response.statusText}`
        );
      }
  
      const responseData = await response.json();
      console.log("Availability response:", responseData);
      if (responseData.status?.status?.startsWith("LOCKED_")) {
        setAvailableStatus("ADA BARANG");
      } else {
        setAvailableStatus("TIDAK ADA BARANG");
      }
    } catch (error) {
      console.error("Error fetching availability data:", error);
      setError("Gagal memuat data ketersediaan terbaru.");
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  fetchUserProfile();
  fetchLastUser();
  fetchAvailable();
}, []);

  return (
    <div
    className={`${jakarta.className} flex-1 py-6 px-4 sm:py-8 sm:px-6 lg:py-16 lg:-translate-y-12 lg:px-8 bg-cover bg-center justify-center items-center lg:ml-24`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-8 max-w-[1200px] mx-auto">
        {/* Logo dan Dashboard */}
        <div className="hidden lg:flex items-center">
          <Image 
          src="/logo.png" 
          alt="Dashboard Icon" 
          width={34}
          height={34}
          className="mr-2 mb-2 w-6 h-6" />
          <h1 className="text-lg sm:text-xl  font-bold text-blue">Dashboard</h1>
        </div>

      {/* Profil */}
      <div className="flex items-center space-x-2 mt-0 sm:mt-0 ml-auto w-full justify-end lg:ml-0">
        <span className="text-white bg-[#3650A2] rounded-full px-3 py-1 text-sm sm:text-base font-bold tracking-widest">
          {profileName || "Memuat..."}
        </span>
        <div className="rounded-full flex items-center justify-center">
          <Image
            src="/human.png"
            alt="User Icon"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </div>
      </div>
      {/* Main Content */}
      <div className="lg:mt-20">
        <div className="w-full max-w-[1200px] mx-auto bg-gradient-to-b from-[#385CBD] to-[#3650A2] rounded-3xl p-6 shadow-lg pb-8 items-center">
          {/* Section Header */}
          <h1 className="text-white text-2xl md:text-3xl font-bold mb-4">Terkini</h1>
          {/* Main Grid */}
          <div className="grid grid-rows-2 gap-6">
            {/* Card 1: Pengguna Terakhir */}
            <div className="bg-white text-gray-800 rounded-3xl p-6 shadow-lg items-center grid grid-cols-1 grid-rows-2 md:grid-rows-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center">
                  <Image
                    src="/human.png"
                    alt="Pengguna Terakhir"
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h2 className="font-light text-gray-500 text-md md:text-xl">
                    Pengguna Terakhir
                  </h2>
                  <p className="text-gray-800 text-xl md:text-3xl font-bold tracking-wider">
                    {loading ? "Memuat..." : lastUser.name || "Tidak ditemukan"}
                  </p>
                </div>
              </div>
              <div className="bg-[#3650A2] text-white p-3 rounded-2xl shadow-md flex items-center justify-center space-x-8 md:space-x-10 lg:space-x-4 lg:max-w-[580px]">
                <Image
                  src="/gembok-icon.png"
                  alt="Clock Icon"
                  width={36}
                  height={36}
                  className="w-9 h-9"
                />
                <p className="text-lg md:text-xl font-semibold">
                  {loading
                    ? "Memuat..."
                    : new Date(lastUser.timestamp).toLocaleString() || "N/A"}
                </p>
              </div>
            </div>

            {/* Row 2: Two Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Card 2: Status Barang */}
              <div className="bg-white rounded-3xl p-4 shadow-lg flex items-center space-x-4 ">
                <div className="w-16 h-16 md:w-16 md:h-16 bg-[#3650A2] rounded-[20px] flex items-center justify-center">
                  <Image
                    src="/Subtract.png"
                    alt="Status Barang"
                    width={48}
                    height={48}
                    className="w-9 h-9 "
                  />
                </div>
                <div>
                  <h2 className="text-gray-300 font-medium text-base md:text-lg">
                    Status Barang
                  </h2>
                  <p
                    className={`text-md md:text-2xl font-bold ${
                      loading
                        ? "text-gray-300"
                        : availableStatus === "ADA BARANG"
                        ? "text-[#FF4B69]"
                        : "text-[#59DFB5]"
                    }`}
                  >
                    {loading ? "Memuat..." : (availableStatus).toUpperCase() || "Tidak ditemukan"}
                  </p>
                </div>
              </div>

              {/* Card 3: Kondisi SiJaga */}
              <div
                className={`${
                  lastUser.status === "BUKA" || lastUser.status === "buka" || lastUser.status === "Buka"? "bg-[#59DFB5]" : "bg-[#FF4B69]"
                } text-white rounded-3xl p-4 shadow-lg flex items-center space-x-4`}
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
                  <Image
                    src="/logo-gembok.png"
                    alt="Kondisi SiJaga"
                    width={48}
                    height={48}
                    className="w-9 h-9"
                  />
                </div>
                <div>
                  <h2 className="text-white font-medium text-base md:text-lg opacity-75">
                    Kondisi SiJaga
                  </h2>
                  <p className="text-lg md:text-2xl font-bold">
                    {loading
                      ? "Memuat..."
                      : (lastUser.status || "Tidak tersedia").toUpperCase()}
                  </p>
                </div>
              </div>
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;