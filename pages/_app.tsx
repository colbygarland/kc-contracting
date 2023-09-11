import { initFirebase } from '@/firebase'
import { useAuthentication } from '@/src/hooks/useAuthentication'
import '@/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { enableReactUse } from '@legendapp/state/config/enableReactUse'
import Head from 'next/head'
import { CONSTANTS } from '@/constants'

const inter = Inter({ subsets: ['latin'] })

initFirebase()
enableReactUse()

export default function App({ Component, pageProps }: AppProps) {
  useAuthentication()

  return (
    <>
      <Head>
        <title>{CONSTANTS.APP_NAME}</title>
      </Head>
      <ChakraProvider>
        <div className={inter.className}>
          <Component {...pageProps} />
        </div>
      </ChakraProvider>
    </>
  )
}
