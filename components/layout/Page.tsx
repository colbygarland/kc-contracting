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
    <main className="lg:mt-16">
      <Header title={title} />
      <div className="py-2 px-6 border-b border-b-slate-200 lg:hidden">
        <h1 className="text-lg text-slate-700 uppercase">{title}</h1>
      </div>

      <div className="lg:ml-64 p-6 lg:p-8">{children}</div>
    </main>
  )
}
