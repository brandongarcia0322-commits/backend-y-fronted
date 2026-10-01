import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refrescar y obtener el usuario actual
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const path = url.pathname

  // Helper para redirigir manteniendo las cookies de sesión activas
  const redirectWithCookies = (destination: string) => {
    url.pathname = destination
    const redirectResponse = NextResponse.redirect(url)
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  // 1. Protecciones de Rutas Privadas del Cliente
  // Soporta tanto rutas en español (/cuenta, /pedidos) como en inglés (/account, /orders)
  if (
    path.startsWith('/checkout') || 
    path.startsWith('/orders') || 
    path.startsWith('/pedidos') || 
    path.startsWith('/account') || 
    path.startsWith('/cuenta')
  ) {
    if (!user) {
      url.searchParams.set('redirectTo', path)
      return redirectWithCookies('/login')
    }
  }

  // 2. Si YA inició sesión, no permitir entrar a /login o /registro
  if (user && (path.startsWith('/login') || path.startsWith('/registro'))) {
    return redirectWithCookies('/cuenta')
  }

  // 3. Protección Estricta de Rutas Administrativas (RBAC)
  if (path.startsWith('/admin')) {
    if (!user) {
      return redirectWithCookies('/login')
    }

    // Consulta de rol con RLS activo
    const { data: roles } = await supabase
      .from('user_roles')
      .select('roles(name)')
      .eq('user_id', user.id)

    const isAdmin = roles?.some((r: any) => 
      r.roles?.name === 'ADMIN' || r.roles?.name === 'SUPER_ADMIN'
    )

    if (!isAdmin) {
      return redirectWithCookies('/unauthorized')
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}