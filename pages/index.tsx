import { Loader } from '@/components/Loader'
import { Page } from '@/components/layout/Page'
import { useUser } from '@/hooks/useUser'

export default function Index() {
  const user = useUser()

  if (!user) {
    return <Loader />
  }

  return <Page title="Dashboard">todo</Page>
}
