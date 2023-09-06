import { Heading } from '@chakra-ui/react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const H1 = ({ children, ...rest }: { children: string }) => {
  return (
    <Heading
      {...rest}
      as="h1"
      size="xl"
      fontWeight="extrabold"
      className={inter.className}
    >
      {children}
    </Heading>
  )
}

export const H2 = ({ children, ...rest }: { children: string }) => {
  return (
    <Heading
      {...rest}
      as="h2"
      size="lg"
      fontWeight="extrabold"
      className={inter.className}
    >
      {children}
    </Heading>
  )
}
