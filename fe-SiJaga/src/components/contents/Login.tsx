"use client";
import { useState } from "react";
import { jakarta } from "../../../styles/fonts";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie"; // Import js-cookie
import axios from "axios";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const LOGIN_API_URL = `${API_BASE_URL}/user/login`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        LOGIN_API_URL,
        { email, password },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      const { token } = response.data;
      Cookies.set("token", token, { expires: 7 });
      console.log("Login success, token saved. Redirecting to Dashboard...");
      router.push("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage =
          err.response.data.message || "Login failed. Please check your credentials.";
        setError(errorMessage);
      } else {
        setError("An unknown error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${jakarta.className} min-h-screen flex items-center justify-center`}>
      <div className="container mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 flex flex-col md:flex-row items-start gap-6 lg:gap-12">
        <div className="md:w-1/2 w-full flex flex-col ml-4">
          <div className="sm:hidden flex justify-start mb-4">
            <Link href="/">
              <div className="w-10 h-10 flex items-center justify-center bg-[#3650A2] hover:bg-[#385CBD] text-white font-bold rounded-full transition duration-300">
                <Image src="/icon-back.png" alt="back" width={10} height={10} className="max-w-full h-auto" />
              </div>
            </Link>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left px-4 lg:px-8">
            <div className="hidden sm:block mb-6">
              <Link href="/">
                <div className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-[#3650A2] hover:bg-[#385CBD] text-white font-bold rounded-full transition duration-300">
                  <Image src="/icon-back.png" alt="back" width={10} height={10} className="max-w-full h-auto" />
                </div>
              </Link>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-relaxed mb-4">
              Makin Aman <br /> Bersama <span className="text-[#3650A2]">SiJaga</span>
            </h1>
            <div className="hidden md:block mt-4">
              <Image src="/Gambar Locker.png" alt="Safe Illustration" width={400} height={400} className="max-w-full h-auto" />
            </div>
          </div>
        </div>
        <div className="md:w-1/2 w-full flex justify-center md:justify-start ml-4">
          <div className="bg-[#3650A2] text-white rounded-2xl shadow-lg overflow-hidden p-10 lg:p-12 max-w-[500px] w-full min-w-[300px]">
            <div className="flex flex-col items-center mb-6">
              <Image src="/logo sijaga white.png" alt="SiJaga Logo" width={100} height={100} className="w-24 h-auto md:w-28" />
              <h2 className="text-xl md:text-2xl text-center font-bold mt-6">Masuk</h2>
              <p className="text-sm mt-2 text-blue-100 text-center">
                Barang berharga terlindungi, SiJaga selalu di hati
              </p>
            </div>
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Kata Sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    <Image
                      src={showPassword ? "/eye.png" : "/eye-off.png"}
                      alt={showPassword ? "Hide password" : "Show password"}
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className={`w-full bg-[#FFE492] text-[#3650A2] font-semibold py-2 rounded-xl shadow-md transition flex items-center justify-center ${
                    loading ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-400"
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <span className="loader rounded-full h-4 w-4 border-t-2 border-[#3650A2] mr-2 animate-spin"></span>
                      Memproses...
                    </div>
                  ) : (
                    "Masuk"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
