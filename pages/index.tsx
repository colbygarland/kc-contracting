import { Loader } from '@/components/Loader'
import { Page } from '@/components/layout/Page'
import { store } from '@/src/store/store'

export default function Index() {
  const { user } = store

  if (!user.get()) {
    return <Loader />
  }

  return <Page title="Dashboard">Welcome, {user.displayName.use()}</Page>
}
