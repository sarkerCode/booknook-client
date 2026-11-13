import { NextResponse, type NextRequest } from 'next/server'
import { auth } from './lib/auth'
import { headers } from 'next/headers'

export async function proxy(request: NextRequest) {
     const session = await auth.api.getSession({
    headers: await headers()
   })

   const user = session?.user
   if(!user) {
     return NextResponse.redirect(new URL('/login', request.url))
   }
}



export const config = {
  matcher: ['/add-book', '/my-books', '/my-borrows', '/my-borrows/:path*', '/my-books/:path*'],
}