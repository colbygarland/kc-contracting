import { Page } from '@/components/layout/Page'
import { isAdmin } from '@/src/auth/roles'
import { getServerSession } from 'next-auth'

export default function Index() {
  return (
    <Page title="Dashboard">
      <div className="">What kind of stats would you like to see here?</div>
    </Page>
  )
}

// @ts-ignore
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, {})
  const adminUser = isAdmin(session?.user?.email)

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }
  }

  if (!adminUser) {
    return {
      redirect: {
        destination: '/daily-time-ticket',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

Index.auth = true
