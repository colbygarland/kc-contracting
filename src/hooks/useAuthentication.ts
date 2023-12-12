import { unauthorizedRoutes } from '@/src/auth'
import { get } from '@/src/utils/persist'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { store } from '../store/store'
import { useSession } from 'next-auth/react'

// Handles redirecting the user to /auth/login if need be.
export const useAuthentication = () => {
  const router = useRouter()
  const { data: session } = useSession()

  if (!session) {
    router.replace(`/login?from=${router.asPath}`)
  }
  //

  // useEffect(() => {
  //   if (unauthorizedRoutes.includes(router.asPath)) {
  //     return
  //   }

  //   const user = get('user')
  //   if (!user) {
  //     router.replace('/auth/login')
  //   } else {
  //     if (store.user.get() === null) {
  //       store.user.set(user)
  //     }
  //   }
  // }, [router])
}
