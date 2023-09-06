import { initFirebase } from '@/firebase'
import { useAuthentication } from '@/hooks/useAuthentication'
import '@/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

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
