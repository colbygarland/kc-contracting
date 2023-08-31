import { Container } from '@chakra-ui/react'
import { Header } from './Header'
import { H1 } from '../Headings'

export const Page = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => {
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
