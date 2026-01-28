import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Next.js 16+ proxy - simplified routing
// Auth is handled client-side in each page

export default function proxy(request: NextRequest) {
  // Just pass through all requests
  // Auth is handled client-side in each page
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icon-.*\\.png).*)',
  ],
}
