import { initFirebase } from '@/firebase'
import '@/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { enableReactUse } from '@legendapp/state/config/enableReactUse'
import Head from 'next/head'
import { CONSTANTS } from '@/constants'
import { SessionProvider, useSession } from 'next-auth/react'
import { Loader } from '@/components/Loader'

const inter = Inter({ subsets: ['latin'] })

initFirebase()
enableReactUse()

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>{CONSTANTS.APP_NAME}</title>
      </Head>
      <ChakraProvider>
        <div className={inter.className}>
          {/* @ts-expect-error */}
          {Component.auth ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </div>
      </ChakraProvider>
    </SessionProvider>
  )
}

function Auth({ children }: { children: React.ReactNode }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession()

  if (status === 'loading') {
    return <Loader />
  }

  return children
}
