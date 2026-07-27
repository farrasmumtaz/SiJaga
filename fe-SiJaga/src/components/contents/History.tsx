"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jakarta } from "../../../styles/fonts";
import Image from "next/image";
import Cookies from "js-cookie";
import { io, Socket } from "socket.io-client";

interface HistoryItem {
  id: number;
  Timestamp: string;
  name: string;
  status: string;
  card_id: string;
  availStatus: string;
}

const History = () => {
  const router = useRouter();
  const [selectedCondition, setSelectedCondition] = useState("Kondisi");
  const [selectedTime, setSelectedTime] = useState("Waktu");
  const [searchQuery, setSearchQuery] = useState("");
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [filteredHistoryData, setFilteredHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileName, setProfileName] = useState("");
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isConditionDropdownOpen, setIsConditionDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = Cookies.get("token");
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user-ess/whoami`;

      if (!token) {
        setError("Autentikasi gagal. Harap login kembali.");
        router.push("/login");
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
          throw new Error(`Gagal mendapatkan profil: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        if (data.success && data.user?.name) {
          setProfileName(data.user.name);
        } else {
          throw new Error("Data pengguna tidak valid.");
        }
      } catch (err) {
        console.error(err); // Optional: Log the error for debugging
        setError("Gagal memuat data history.");
      }
    };

    fetchUserProfile();
  }, [router]);

  // Fetch history data
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError("");

      const token = Cookies.get("token");
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/history/all`;

      if (!token) {
        setError("Token tidak ditemukan. Silakan login kembali.");
        router.push("/login");
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
          throw new Error(`Gagal mengambil data: ${response.status} - ${response.statusText}`);
        }

        const responseData = await response.json();
        if (responseData.success && Array.isArray(responseData.usageHistory)) {
          setHistoryData(responseData.usageHistory);
          setFilteredHistoryData(responseData.usageHistory); // Tampilkan semua data di awal
        } else {
          throw new Error("Data yang diterima tidak valid.");
        }
      } catch (err) {
        console.error(err); // Optional: Log the error for debugging
        setError("Gagal memuat data history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  // Set up WebSocket connection
  useEffect(() => {
    const socket = io(URL, {
      transports: ["websocket", "polling"], // Prioritaskan websocket
      withCredentials: true,
    });
  
    socketRef.current = socket;
  
    // Log saat berhasil terhubung
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });
  
    // Dengarkan event real-time dari server
    socket.on("usageHistory_update", (newData: HistoryItem) => {
      console.log("New real-time data received:", newData);
  
      // Pastikan ID unik sebelum menambahkannya ke history
      setHistoryData((prevHistory) => {
        if (!prevHistory.some(item => item.id === newData.id)) {
          return [newData, ...prevHistory];  // Hanya tambah jika ID belum ada
        }
        return prevHistory; // Tidak tambah jika ID sudah ada
      });
  
      setFilteredHistoryData((prevFiltered) => {
        if (!prevFiltered.some(item => item.id === newData.id)) {
          return [newData, ...prevFiltered];  // Hanya tambah jika ID belum ada
        }
        return prevFiltered; // Tidak tambah jika ID sudah ada
      });
    });
  
    // Tangani error koneksi
    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });
  
    // Bersihkan koneksi saat komponen dilepas
    return () => {
      socket.off("usageHistory_update");
      socket.disconnect();
    };
  }, [URL]);
  
  

  
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredHistoryData(historyData); // Tampilkan semua data jika query kosong
    } else {
      const filteredData = historyData.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) // Cari nama yang mengandung query
      );
      setFilteredHistoryData(filteredData);
    }
  }, [searchQuery, historyData]);

  const toggleTimeDropdown = () => {
    setIsTimeDropdownOpen((prev) => !prev);
    setIsConditionDropdownOpen(false); // Tutup dropdown lainnya
  };

  const toggleConditionDropdown = () => {
    setIsConditionDropdownOpen((prev) => !prev);
    setIsTimeDropdownOpen(false); // Tutup dropdown lainnya
  };

  const handleSelection = (value: string, type: string) => {
    if (type === "condition") {
      setSelectedCondition(value);
      setIsConditionDropdownOpen(false);
    } else if (type === "time") {
      setSelectedTime(value);
      setIsTimeDropdownOpen(false);
    }
  
    // Filter data berdasarkan waktu dan kondisi
    setTimeout(() => {
      let filteredData = historyData;
  
      // Filter berdasarkan waktu
      if (selectedTime === "Hari ini" || value === "Hari ini") {
        const today = new Date();
        filteredData = filteredData.filter((item) => {
          const itemDate = new Date(item.Timestamp);
          return (
            itemDate.getDate() === today.getDate() &&
            itemDate.getMonth() === today.getMonth() &&
            itemDate.getFullYear() === today.getFullYear()
          );
        });
      } else if (selectedTime === "Minggu ini" || value === "Minggu ini") {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
  
        filteredData = filteredData.filter((item) => {
          const itemDate = new Date(item.Timestamp);
          return itemDate >= sevenDaysAgo && itemDate <= today;
        });
      }
  
      // Filter berdasarkan kondisi
      if (selectedCondition === "ACTIVE" || value === "ACTIVE") {
        filteredData = filteredData.filter((item) => item.status === "ACTIVE");
      } else if (selectedCondition === "INACTIVE" || value === "INACTIVE") {
        filteredData = filteredData.filter((item) => item.status === "INACTIVE");
      }
  
      // Tampilkan semua data jika filter direset
      if (value === "Semua Waktu" || value === "Kondisi") {
        filteredData = historyData;
      }
  
      setFilteredHistoryData(filteredData);
    }, 0);
  };
  

  return (
    <div className={`${jakarta.className} mx-auto items-center md:ml-28 lg:translate-y-8`}>
      <div className="max-h-screen flex flex-col">
        <div className="w-full lg:w-4/5 container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-6">
            <div className="hidden lg:flex flex-col items-center gap-2">
              <Image src="/Logo sijaga.png" alt="Logo SiJaga" width={100} height={100} />
            </div>
            <div className="flex items-center gap-3 md:gap-5 w-full justify-end">
              <div className="bg-[#3650A2] text-white font-semibold px-4 py-2 rounded-full tracking-widest">
                {profileName || "Memuat..."}
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <Image
                  src="/human.png"
                  alt="User Icon"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
  
          {/* Search & Filter */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:max-h-[500px] xl:min-h-[500px]">
            <p className="text-2xl font-bold text-[#3650A2] pb-4">History</p>
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Cari nama"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 pl-5 rounded-full focus:outline-none focus:ring-2 focus:ring-[#3650A2] bg-[#CBDCEB] text-gray-700"
              />
            </div>
            <div className="flex gap-4 mb-6">
              {/* Time Filter */}
              <div ref={dropdownRef} className="relative w-40">
                <button
                  onClick={toggleTimeDropdown}
                  className="flex items-center justify-between w-full px-4 py-2 rounded-full bg-gray-100"
                >
                  {selectedTime}
                  <Image src="/dropdown-icon.png" alt="Dropdown Icon" width={16} height={16} />
                </button>
  
                {isTimeDropdownOpen && (
                  <div className="absolute left-0 w-full mt-2 bg-white rounded-lg shadow-lg z-10">
                    <ul className="py-2">
                      <li
                        onClick={() => handleSelection("Hari ini", "time")}
                        className="px-4 py-2 cursor-pointer rounded-lg hover:bg-[#CBDCEB]"
                      >
                        Hari ini
                      </li>
                      <li
                        onClick={() => handleSelection("Minggu ini", "time")}
                        className="px-4 py-2 cursor-pointer rounded-lg hover:bg-[#CBDCEB]"
                      >
                        Minggu ini
                      </li>
                      <li
                        onClick={() => handleSelection("Semua Waktu", "time")}
                        className="px-4 py-2 cursor-pointer rounded-lg hover:bg-[#CBDCEB]"
                      >
                        Semua Waktu
                      </li>
                    </ul>
                  </div>
                )}
              </div>
  
              {/* Condition Filter */}
              <div ref={dropdownRef} className="relative w-40">
                <button
                  onClick={toggleConditionDropdown}
                  className="flex items-center justify-between w-full px-4 py-2 rounded-full bg-gray-100"
                >
                  {selectedCondition}
                  <Image src="/dropdown-icon.png" alt="Dropdown Icon" width={16} height={16} />
                </button>
  
                {isConditionDropdownOpen && (
                  <div className="absolute left-0 w-full mt-2 bg-white rounded-lg shadow-lg z-10">
                    <ul className="py-2">
                      <li
                        onClick={() => handleSelection("ACTIVE", "condition")}
                        className="px-4 py-2 cursor-pointer rounded-lg hover:bg-[#CBDCEB]"
                      >
                        Active
                      </li>
                      <li
                        onClick={() => handleSelection("INACTIVE", "condition")}
                        className="px-4 py-2 cursor-pointer rounded-lg hover:bg-[#CBDCEB]"
                      >
                        Inactive
                      </li>
                      <li
                        onClick={() => handleSelection("Semua Kondisi", "condition")}
                        className="px-4 py-2 cursor-pointer rounded-lg hover:bg-[#CBDCEB]"
                      >
                        Semua Kondisi
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
  
            <div className="overflow-y-auto max-h-[300px]">
              {error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : loading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 font-semibold text-[#3650A2]">Catatan Waktu</th>
                      <th className="py-3 font-semibold text-[#3650A2]">Nama</th>
                      <th className="py-3 font-semibold text-[#3650A2]">Kondisi SiJaga</th>
                      <th className="py-3 font-semibold text-[#3650A2]">Status Barang</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistoryData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-3">
                        {loading
                          ? "Memuat..."
                          : new Date(item.Timestamp).toLocaleString() || "N/A"
                          }
                        </td>
                        <td className="py-3">{item.name}</td>
                        <td
                          className={`${
                            item.status === "buka" || item.status === "BUKA" || item.status === "Buka"
                              ? "text-green-500"
                              : "text-red-500"
                          } py-3 font-semibold`}
                        >
                          {item.status.toUpperCase()}
                        </td>
                        <td className="py-3">{item.availStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );  
};

export default History;