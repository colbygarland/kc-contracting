import { Loader } from '@/components/Loader'
import { Page } from '@/components/layout/Page'
import { useUser } from '@/src/hooks/useUser/useUser'

export default function Index() {
  const user = useUser()

  if (!user) {
    return <Loader />
  }

  return <Page title="Dashboard">Welcome, {user.displayName}</Page>
}
