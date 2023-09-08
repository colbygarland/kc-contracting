import { Container } from '@chakra-ui/react'
import { Header } from './Header'
import { H1 } from '../Headings'
import { useUser } from '@/src/hooks/useUser/useUser'

export const Page = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => {
  const user = useUser()
  if (!user) {
    return null
  }

  return (
    <main>
      <Header />
      <Container py={6}>
        <H1>{title}</H1>
        {children}
      </Container>
    </main>
  )
}
