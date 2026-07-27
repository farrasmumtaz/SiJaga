import Image from "next/image";
import { jakarta } from "@/styles/fonts";

export default function CaraKerja() {
    return (
        <section className={`${jakarta.className} lg:min-h-screen md:pt-20 pt-20 flex items-center justify-center px-8 pb-12 bg-[url('/bg-string2.png')]`}>
            <div className="relative flex items-center justify-center w-1/2">
    
                <div className="relative rounded-full p-4">
                    <Image
                        src="/Work Together Image.png"
                        alt="Work-Together"
                        width={585}
                        height={545}
                        className=""
                    />
                </div>
            </div>

            {/* Bagian Kanan: Teks */}
            <div className="w-1/2 pl-10">
                <h1 className="relative font-semibold text-gray-800 mb-4 lg:text-6xl xl:text-6xl md:text-4xl sm:text-3xl text-2xl font-bold text-gray-800 leading-snug z-10">
                    Bagaimana cara <br/> kerjanya?
                </h1>
                <div className="relative mt-4 z-0">
                <Image
                    src="/Vector2.png"
                    alt="vector"
                    width={372.5}
                    height={30}
                    className="absolute left-4 lg:left-0 bottom-1 md:left-8 md:bottom-0"
                    />
                </div>
                <ul className="text-sm sm:text-base text-gray-600 space-y-2 mt-8 md:text-md list-image-[url('/.png')]">
                    <li>Tempel kartu akses pada pemindai untuk membuka loker.</li>
                    <li>
                        Masukkan barang yang ingin disimpan ke dalam loker.
                    </li>
                    <li>
                        Tutup loker dan tempel kembali kartu akses pada pemindai
                        untuk mengunci loker.
                    </li>
                    <li>
                        Buka dashboard website untuk melihat riwayat penggunaan
                        loker.
                    </li>
                </ul>
            </div>
        </section>
    );
}
