import type { Metadata } from "next";
import "./globals.css";




export const metadata: Metadata = {
  title: "SiJaga",
  description: "SiJaga adalah kotak canggih dan dilengkapi teknologi yang dirancang untuk meningkatkan langkah-langkah keamanan untuk melindungi barang, dokumen, atau harta benda berharga. Perangkat inovatif ini mengintegrasikan teknologi trendi untuk menyediakan fitur keamanan yang komprehensif, memastikan bahwa isinya tetap terlindungi dari akses yang tidak sah, pencurian, dan perusakan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
