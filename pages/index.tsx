import { Page } from '@/components/layout/Page'
import { store } from '@/src/store/store'

export default function Index() {
  const { user } = store
  console.log(user.use())

  return <Page title="Dashboard">Welcome, {user?.displayName}</Page>
}
