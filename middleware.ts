import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT,OPTIONS',
        'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Cookie',
        'Access-Control-Expose-Headers': 'Set-Cookie',
      },
    })
  }

  const response = NextResponse.next()

  // Add CORS headers for all responses
  if (origin) {
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Cookie')
    response.headers.set('Access-Control-Expose-Headers', 'Set-Cookie')
  }

  // Configurar la cookie para SameSite=None
  const requestCookies = request.headers.get('cookie')
  if (requestCookies && requestCookies.includes('_vercel_sso_nonce')) {
    const nonceCookie = requestCookies.split(';').find(c => c.trim().startsWith('_vercel_sso_nonce='))
    if (nonceCookie) {
      const value = nonceCookie.split('=')[1]
      response.headers.append('Set-Cookie', `_vercel_sso_nonce=${value}; Path=/; Secure; SameSite=None`)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/api/auth/get-session'
  ]
}

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/api/auth/:path*'
  ]
}