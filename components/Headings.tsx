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
