import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Pass through for now - D1 will be bound through environment
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};