import { jakarta } from "@/styles/fonts";
import { FaEnvelope, FaInstagram, FaLinkedin} from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className={`${jakarta.className} bg-[#3650A2] text-white`}>
            {/* Full-width background */}
            <div className="w-full py-12">
                {/* Kontainer konten */}
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-start gap-16 px-20">
                    <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/iconfig.png"
                                alt="iconfig"
                                width={20}
                                height={20}
                                className="w-[20px] h-[20px]"
                            />
                            <h1 className="text-xl font-bold">SiJaga</h1>
                        </div>
                        <p className="text-sm max-w-[350px] text-justify mt-4">
                            SiJaga adalah kotak penyimpanan untuk melindungi barang dan dokumen
                            berharga dari akses tidak sah, pencurian, dan perusakan.
                        </p>
                    </div>

                    {/* Bagian kedua */}
                    <div className="flex flex-col max-w-[400px]">
                        <h2 className="text-lg font-bold mb-2">Kantor Desa Sukapura</h2>
                        <a href="https://sukapura.digital/" className="text-sm underline">
                            https://sukapura.digital/
                        </a>
                        <p className="text-sm">
                        </p>
                        <p className="text-sm">(022) 87523248</p>
                    </div>

                    {/* Bagian ketiga */}
                    <div className="flex flex-col">
                        <h2 className="text-lg font-bold mb-2">Butuh Bantuan?</h2>
                        <p className="text-sm mb-4">
                            Untuk informasi lebih lanjut atau bantuan terkait SiJaga
                        </p>
                        <div className="flex gap-8">
                            <a 
                            href="https://www.instagram.com/cpslaboratory"
                            target="_blank"
                            rel="noopener noreferrer" 
                            aria-label="Instagram"
                            className="text-white hover:text-blue-300 hover:scale-110 cursor-pointer transition-all">
                                <FaInstagram size={24} />
                            </a>
                            <a 
                            href="#" 
                            aria-label="Email"
                            className="text-white hover:text-blue-300 hover:scale-110 cursor-pointer transition-all">
                                <FaEnvelope size={24} />
                            </a>
                            <a 
                            href="https://www.linkedin.com/company/cpslaboratory/mycompany/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="text-white hover:text-blue-300 hover:scale-110 cursor-pointer transition-all">
                                <FaLinkedin size={24} />
                            </a>
                        </div>
                    </div>
                    
                </div>

                <div className="container mx-auto px-20">
                    <hr className="my-6 border-gray-300 opacity-50" />
                </div>
                <div className="flex justify-center mt-8">
                    <p>&copy; 2024 Cyber Physical System</p>
                </div>
            </div>
        </footer>
    );
}
