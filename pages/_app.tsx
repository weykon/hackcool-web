import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useState } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { MyUserContextProvider } from '@/utils/useUser'
import RealTimeContextProvider from '@/utils/realtime'
import { ReactFlowProvider } from 'reactflow'
export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <MyUserContextProvider>
        <ReactFlowProvider>
          <RealTimeContextProvider>
            <Component {...pageProps} />
          </RealTimeContextProvider>
        </ReactFlowProvider>
      </MyUserContextProvider>
    </SessionContextProvider>
  )
}
