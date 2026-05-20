  import Image from "next/image";
  import { jakarta } from "@/styles/fonts";


  export default function FiturHero() {
      return (
          <div className={`${jakarta.className} lg:min-h-screen md:pt-10 pt-10 flex items-center justify-center bg-[url('/Element.png')] bg-cover bg-center`}>
        <div className="container mx-auto px-6 sm:px-8 md:px-32 grid grid-cols-2 md:grid-cols-2 items-center gap-8 md:gap-16">
          <div>
            <h1 className="realtive text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-6xl font-bold text-gray-800 leading-snug z-10">
              Perlindungan <br/>adalah Fitur kami 
            </h1>
            <div className="relative flex justify-start lg:justify-center md:justify-start md:mr-8 lg:ml-2 z-0">
              <Image
                src="/Vector2.png"
                alt="vector"
                width={372.5}
                height={30}
                className="w-[100px] sm:w-[250px] md:w-[300px] lg:w-[372.5px] xl:w-[372.5px] xl:ml-60 "
              />
            </div>
            <ul className="mt-2 text-gray-600 text-sm sm:text-base md:text-md leading-relaxed text-justify max-w-[700px] md:max-w-[900px] lg:min-w-[900px] ">
              <li>• Sensor Canggih untuk Memantau Isi Loker</li>
              <li>• Sistem Penguncian Otomatis yang Aman</li>
              <li>• Akses Modern dengan Pemindai Kartu RFID</li>
              <li>• Lampu LED yang intuitif</li>
            </ul>
          </div>

          <div className="flex justify-center md:justify-end md:ml-32 lg:pr-2 xl:pr-32 ">
            <Image
              src="/gembok-sijaga.png"
              alt="Icon"
              width={276.82}
              height={321.86}
              className="w-[100px] sm:w-[250px] md:w-[276px] lg:w-[276.82px] h-auto "
            />
          </div>
        </div>
      </div>
      );
  }
