"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import { io, Socket } from "socket.io-client";

interface SettingSectionProps {
  isRegistered: boolean;
  onRegisterSuccess: () => void;
}

interface CardIdResponse {
  card_id: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const CARD_API_URL = `${API_BASE_URL}/card-id/latest`;
const REGISTER_API_URL = `${API_BASE_URL}/user/register`;

const SettingSection: React.FC<SettingSectionProps> = ({ isRegistered, onRegisterSuccess }) => {
  const [zoomOut, setZoomOut] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>(
    isRegistered ? "/scanimage-success.png" : "/scanimage.png"
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardId, setCardId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL tidak terdefinisi");
      return;
    }

    const socket = io(API_BASE_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("WebSocket connected!");
    });

    socket.on("cardIdDump_latest", (data: CardIdResponse) => {
      if (data?.card_id) {
        setCardId(data.card_id);
        console.log("Card ID:", data.card_id);
      } else {
        console.error("Data card-scanned tidak valid:", data);
      }
    });    

    socket.on("error", (err) => {
      console.error("WebSocket error:", err);
    });

    return () => {
      socket.off("cardIdDump_latest");
      socket.disconnect();
    };
  }, []);  

  const handleRegisterSuccess = () => {
    setCurrentImage("/scanimage-success.png");
    setZoomOut(true);

    setName("");
    setEmail("");
    setPassword("");
    setConfirm(false);
    setCardId(null);

    setTimeout(() => {
      setZoomOut(false);
    }, 5000);

    onRegisterSuccess();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardId) {
      setError("Card ID tidak ditemukan. Harap coba lagi.");
      return;
    }

    if (!name || !email || !password) {
      setError("Isi Kredensial yang dibutuhkan dengan benar.");
      return;
    }

    if (!confirm) {
      setError("Harap konfirmasi untuk melanjutkan.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = { name, email, card_id: cardId, password };
      const response = await axios.post(REGISTER_API_URL, data);

      console.log("Response:", response.data);

      handleRegisterSuccess();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        const errorMessage = err.response.data.message.includes("UID sudah terdaftar")
          ? "UID sudah terdaftar. Harap gunakan kartu lain."
          : err.response.data.message;
        setError(errorMessage);
      } else {
        setError("Pendaftaran gagal. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCardId = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(CARD_API_URL);
      const cardIdFromApi = response?.data?.data?.card_id;
      if (cardIdFromApi) {
        setCardId(cardIdFromApi);
      } else {
        setError("Card ID tidak ditemukan dalam respons API.");
      }
    } catch (err) {
      console.error("Error fetching Card ID:", err);
      setError("Gagal mengambil Card ID");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCardId();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row w-full space-y-4 lg:space-y-6 lg:space-x-3 lg:mt-10">
      <div className="flex flex-col items-center justify-start w-full lg:w-1/2">
        <div className="text-[#3650A2] flex flex-col items-center">
          <h1 className="hidden text-xl font-bold text-blue-900 lg:flex items-center mb-8 lg:-translate-x-4 lg:-translate-y-[-40px] self-start ml-4 md:ml-6 lg:ml-0">
            <Image
              src="/logo.png"
              alt="Dashboard Icon"
              className="mr-2 mb-2"
              width={24}
              height={24}
            />
            SiJaga
          </h1>

          <h2 className="text-3xl font-semibold mb-8 opacity-80 lg:-translate-y-[-40px]">Tambahkan Kartu Baru</h2>

          <div className={`w-60 h-60 md:w-70 md:h-70 mb-10 mt-4 lg:translate-y-[80px] ${zoomOut ? 'animate-zoom' : ''}`}>
            <Image
              src={currentImage}
              alt="Scan Icon"
              width={900}
              height={900}
              className="w-70 h-70 object-contain animate-zoom overflow-hidden"
            />
          </div>

          <p className="text-center text-black mt-4 lg:translate-y-[80px]">
            Pindai kartu akses yang ingin didaftarkan pada box SiJaga
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2">
        <div className="bg-white p-6 rounded-lg shadow-md lg:mt-20 lg:mr-20 lg:ml-20 lg:mb-20">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Tambahkan Kredensial Kartu Baru</h3>
          <p className="text-sm text-gray-600 mb-4">Masukkan informasi kartu untuk memberikan akses baru.</p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="uid" className="block text-sm font-medium text-gray-700">
                UID
              </label>
              <input
                id="uid"
                type="text"
                value={loading ? 'Memuat Card ID...' : cardId || 'Card ID tidak tersedia'}
                readOnly
                className={`w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-100 ${
                  loading ? 'text-gray-400 italic' : 'text-gray-700'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError(false);
                }}
                className={`w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  nameError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {nameError && <p className="text-red-500 text-sm mt-1">Nama harus diisi.</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(false);
                }}
                className={`w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  emailError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {emailError && <p className="text-red-500 text-sm mt-1">Email harus diisi.</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!name || !email}
                className={`w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  !name || !email ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="confirm"
                checked={confirm}
                onChange={() => setConfirm(!confirm)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="confirm" className="ml-2 text-sm text-gray-700">
                Apakah Anda yakin ingin menambahkan pengguna ini?
              </label>
            </div>
            <button
              type="submit"
              className={`w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-all duration-300 ${
                isRegistered ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading || isRegistered}
            >
              {isRegistered ? (
                <div className="flex items-center justify-center space-x-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></span>
                  <span>Mendaftarkan...</span>
                </div>
              ) : loading ? (
                'Memproses...'
              ) : (
                'Daftar'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingSection;