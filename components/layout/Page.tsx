import { Container } from '@chakra-ui/react'
import { Header } from './Header'
import { H1 } from '../Headings'
import { store } from '@/src/store/store'
import { Loader } from '../Loader'

export const Page = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => {
  const { user } = store
  if (!user.get()) {
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
