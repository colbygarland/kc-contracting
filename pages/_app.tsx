import { initFirebase } from '@/firebase'
import { useAuthentication } from '@/src/hooks/useAuthentication'
import '@/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { enableReactUse } from '@legendapp/state/config/enableReactUse'
import { useEffect } from 'react'
import { get } from '@/src/utils/persist'
import { store } from '@/src/store/store'

const inter = Inter({ subsets: ['latin'] })

enableReactUse()
initFirebase()

export default function App({ Component, pageProps }: AppProps) {
  useAuthentication()

  return (
    <ChakraProvider>
      <div className={inter.className}>
        <Component {...pageProps} />
      </div>
    </ChakraProvider>
  )
}
