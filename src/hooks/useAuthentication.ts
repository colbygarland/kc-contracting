import { unauthorizedRoutes } from '@/src/auth'
import { get } from '@/src/utils/persist'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { store } from '../store/store'

// Handles redirecting the user to /auth/login if need be.
export const useAuthentication = () => {
  const router = useRouter()

  useEffect(() => {
    if (unauthorizedRoutes.includes(router.asPath)) {
      return
    }

    const user = get('user')
    if (!user) {
      router.replace('/auth/login')
    } else {
      if (store.user.get() === null) {
        console.log('setting the store')
        store.user.set(user)
      }
    }
  }, [router])
}
