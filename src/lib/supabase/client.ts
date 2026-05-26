import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton pattern — ensures only one Supabase client instance exists.
// This prevents race conditions where multiple instances read/write sessions
// to different cookie locations, which breaks persistence across tabs.
let client: ReturnType<typeof createBrowserClient> | undefined

export function createClient() {
  if (client) return client

  client = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        if (typeof document === 'undefined') return []
        return document.cookie.split(';').map((c) => {
          const [name, ...rest] = c.trim().split('=')
          return { name, value: rest.join('=') }
        })
      },
      setAll(cookiesToSet) {
        if (typeof document === 'undefined') return
        cookiesToSet.forEach(({ name, value, options }) => {
          let cookieString = `${name}=${value}`
          if (options.path) cookieString += `; path=${options.path}`
          if (options.maxAge !== undefined) cookieString += `; max-age=${options.maxAge}`
          if (options.domain) cookieString += `; domain=${options.domain}`
          if (options.sameSite) cookieString += `; samesite=${options.sameSite}`
          if (options.secure) cookieString += '; secure'
          if (options.httpOnly) cookieString += '; httponly'
          document.cookie = cookieString
        })
      },
    },
  })

  return client
}
