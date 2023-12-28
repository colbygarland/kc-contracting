import { Container } from '@chakra-ui/react'
import { Header } from './Header'
import { H1 } from '../Headings'
import { useUser } from '@/src/hooks/useUser/useUser'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export const Page = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => {
  return (
    <main className="lg:mt-16">
      <Header title={title} />
      <div className="py-2 px-6 border-b border-b-slate-200 dark:border-b-slate-600 lg:hidden">
        <h1 className="text-lg text-slate-900 dark:text-slate-200 uppercase">
          {title}
        </h1>
      </div>

      <div className="lg:ml-64 p-6 lg:p-8">{children}</div>
    </main>
  )
}
