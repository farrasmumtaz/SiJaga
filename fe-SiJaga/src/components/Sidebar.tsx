"use client";

import Link from "next/link";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FiHome,
  FiEdit,
  FiClock,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";
import Cookies from "js-cookie";


const Sidebar: React.FC = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("Token not found in cookies");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!apiUrl) {
        console.error("API base URL not defined");
        return;
      }

      const response = await fetch(`${apiUrl}/user/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Cookies.remove("token");
        router.push("/");
      } else {
        const errorText = await response.text();
        console.error("Failed to log out:", errorText);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const isActive = (path: string) => pathname.startsWith(path);

  const menuItems = [
    { href: "/dashboard", label: "Beranda", icon: FiHome },
    { href: "/riwayat", label: "Riwayat", icon: FiClock },
    { href: "/setting", label: "Daftar", icon: FiEdit },

  ];

  return (
    <>
      {isSidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setSidebarVisible(false)}
        />
      )}

      {/* Sidebar for larger screens (lg and up) */}
      <div className="fixed hidden lg:flex bg-[#3650A2] text-white w-10 md:w-20 flex flex-col justify-between items-center p-6 ml-10 mt-10 rounded-3xl lg:min-h-[670px] z-50">
        <nav className="space-y-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex flex-col items-center text-sm p-3 rounded-lg transition-all duration-300 hover:scale-105 ${
                isActive(item.href) ? "text-[#FFE492]" : ""
              }`}
            >
              <item.icon
                size={28}
                className={`transition-transform duration-300 transform group-hover:scale-110 ${
                  isActive(item.href) ? "text-[#FFE492]" : ""
                }`}
              />
              <span
                className={`mt-1 hidden md:block text-xs font-semibold ${
                  isActive(item.href) ? "text-[#FFE492]" : ""
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-4 mb-2 group flex flex-col items-center text-sm rounded-lg transition-all duration-300 hover:scale-105"
        >
          <FiLogOut
            size={28}
            className="transition-transform duration-300 transform group-hover:scale-110"
          />
          <span className="mt-1 hidden md:block text-xs font-semibold">
            Keluar
          </span>
        </button>
      </div>

      {/* Sidebar for smaller screens (lg and below) */}
      <div
        className={`fixed lg:hidden top-0 left-0 h-full bg-[#3650A2] text-white z-50 transform transition-transform duration-300 ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } w-64 flex flex-col justify-between items-center p-6 shadow-lg`}
      >
        <nav className="space-y-6 w-full">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center text-sm p-3 rounded-lg transition-all duration-300 hover:bg-[#2C4390] ${
                isActive(item.href) ? "text-[#FFE492]" : ""
              }`}
            >
              <item.icon
                size={24}
                className="transition duration-300 transform group-hover:scale-125"
              />
              <span className="ml-4 text-sm font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="group flex items-center mt-4 mb-2 p-1 rounded-lg hover:bg-[#2b3d7d] transition-colors"
        >
          <FiLogOut
            size={24}
            className="transition duration-300 transform group-hover:scale-125"
          />
          <span className="ml-2 text-sm font-semibold">Keluar</span>
        </button>
      </div>

      {/* Hamburger button for smaller screens */}
      {!isSidebarVisible && (
        <button
          onClick={() => setSidebarVisible(true)}
          className="fixed top-[40px] left-0 lg:hidden bg-[#3650A2] text-white p-3 rounded-r-full z-50 transform transition-transform duration-300"
        >
          <FiMenu size={24} />
        </button>
      )}
    </>
  );
};

export default Sidebar;
