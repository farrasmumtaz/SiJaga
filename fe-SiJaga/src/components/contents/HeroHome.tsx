import { jakarta } from "../../../styles/fonts";
import Image from "next/image";
import ShiningButton from "../ui/button";
import Link from "next/link";

const Home = () => {
  return (
    <div className={`${jakarta.className} min-h-screen flex items-center justify-center bg-[url('/Element.png')] bg-cover bg-center`}>
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-6 lg:py-0 sm:px-8 md:px-20 grid grid-cols-1 lg:grid-cols-2 items-center gap-8 md:gap-16 md:mt-12">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-5xl 2xl:text-5xl  font-bold text-gray-800 leading-snug md:mt-12">
            Dokumen Makin Terjaga Bersama SiJaga
          </h1>
          <div className="flex justify-center md:justify-start md:mr-32 lg:ml-16">
            <Image
              src="/Vector2.png"
              alt="vector"
              width={372.5}
              height={30}
              className="w-[200px] sm:w-[250px] md:w-[300px] lg:w-[300px] xl:w-[372.5px] sm:ml-20  mr-32"
            />
          </div>
          <p className="mt-2 text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed text-justify lg:text-md xl:min-w-[700px] 2xl:min-w-[900px] ">
            SiJaga adalah kotak penyimpanan canggih dan dilengkapi teknologi yang dirancang untuk
            meningkatkan langkah-langkah keamanan untuk melindungi barang, dokumen,
            atau harta benda berharga. Perangkat inovatif ini mengintegrasikan teknologi
            trendi untuk menyediakan fitur keamanan yang komprehensif, memastikan bahwa
            isinya tetap terlindungi dari akses yang tidak sah, pencurian, dan perusakan.
          </p>
          <Link href={"/login"}>
          <div className="mt-6 md:mt-8">
            <ShiningButton />
          </div>
          </Link>
        </div>

        <div className="hidden lg:flex justify-center lg:justify-end  md:pr-6 lg:pr-2 mb-8 ">
          <Image
            src="/Group 342.png"
            alt="Icon"
            width={276.82}
            height={321.86}
            className="w-[150px] sm:w-[200px] md:w-[250px] lg:w-[276.82px] h-auto "
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
