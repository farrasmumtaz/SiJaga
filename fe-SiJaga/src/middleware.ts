import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Ambil token dari cookies
  const token = req.cookies.get('token');

  if (!token) {
    // Jika tidak ada token, redirect ke halaman login
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Jika token ada, lanjutkan request
  return NextResponse.next();
}

// Tentukan rute mana saja yang dilindungi middleware ini
export const config = {
  matcher: [
    "/dashboard",
    "/riwayat",
    "/setting",
  ],
};
