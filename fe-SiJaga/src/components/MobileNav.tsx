import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { jakarta } from "@/styles/fonts";

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event : MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <nav
            ref={navRef}
            className={`${jakarta.className} lg:hidden bg-[#3650A2] fixed top-0 start-0 z-50 w-full border-b border-gray-200 overflow-y-auto max-h-screen`}
        >
            <div className="container max-w-screen-xl mx-auto flex items-center justify-between p-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 ml-4">
                    <Image
                        src="/Group 342.png"
                        className="h-8"
                        alt="Logo"
                        width={30}
                        height={50}
                    />
                    <span className="text-2xl font-semibold text-white ">
                        SiJaga
                    </span>
                </Link>

                <div className="flex items-center space-x-4">
                    {/* Login Button */}
                    <Link
                        href="/login"
                        className="px-4 py-2 text-sm font-medium text-blue bg-white rounded-lg hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Login
                    </Link>

                    {/* Hamburger Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="inline-flex items-center justify-center p-2 text-white rounded-md hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        aria-controls="mobile-menu"
                        aria-expanded={isOpen}
                    >
                        <svg
                            className={`w-6 h-6 transition-transform ${
                                isOpen ? "rotate-90" : ""
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            {isOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Navigation Links */}
            {isOpen && (
                <div id="mobile-menu" className="px-4 pb-4">
                    <ul className="flex flex-col mt-4 space-y-2 font-medium border border-white rounded-xl bg-white p-4">
                        <li>
                            <Link
                                href="/"
                                className="block px-3 py-2 rounded-lg text-blue hover:text-white hover:bg-blue-600 hover:bg-blue-700"
                                aria-current="page"
                            >
                                Beranda
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/fitur"
                                className="block px-3 py-2 rounded-lg text-blue hover:text-white hover:bg-blue-600 hover:bg-blue-700"
                            >
                                Fitur
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}
