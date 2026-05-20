"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import MobileNav from "./MobileNav";

export const Header = () => {
    const pathname = usePathname();

    return (
        <header className={`mx-auto transition-transform duration-300 px-12 w-full`}>
            <nav className="hidden lg:flex justify-between max-w-[1400px] mx-auto py-4">
                {/* Logo Section */}
                <div className="flex items-center justify-start gap-2">
                    <div className="flex">
                        <Image
                            src="/gembok-sijaga.png"
                            alt="gembok"
                            width={30}
                            height={30}
                        />
                    </div>
                    <Link href="/" className="flex items-center gap-2">
                        <h1 className="text-xl font-semibold text-[#3650A2]">
                            SiJaga
                        </h1>
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="flex gap-8 justify-center items-center ">
                    <Link
                        href="/"
                        className={`text-lg font-medium relative group ${
                            pathname === "/" ? "text-blue-800" : "text-gray-700"
                        } hover:text-blue-800`}
                    >
                        Beranda
                        <span
                            className="absolute left-0 bottom-[-2px] w-0 h-[2px] bg-blue-800 transition-all duration-300 group-hover:w-full group-hover:left-auto group-hover:right-0"
                        ></span>
                    </Link>
                    <Link
                        href="/fitur"
                        className={`text-lg font-medium relative group ${
                            pathname === "/fitur" ? "text-blue-800" : "text-gray-700"
                        } hover:text-blue-800`}
                    >
                        Fitur
                        <span
                            className="absolute left-0 bottom-[-2px] w-0 h-[2px] bg-blue-800 transition-all duration-300 group-hover:w-full group-hover:left-auto group-hover:right-0"
                        ></span>
                    </Link>
                    <Link
                        href="/login"
                        className="bg-blue-800 text-white px-6 py-2 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
                    >
                        Masuk
                    </Link>
                </div>

                {/* Login Button */}
                
            </nav>
            <MobileNav />
        </header>
    );
};

export default Header;
