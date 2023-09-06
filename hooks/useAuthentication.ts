import { unauthorizedRoutes } from '@/auth'
import { get } from '@/utils/persist'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

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
    }
  }, [router])
}
