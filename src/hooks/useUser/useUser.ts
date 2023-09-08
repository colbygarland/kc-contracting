import { get } from '@/src/utils/persist'
import { User } from 'firebase/auth'
import { useEffect, useState } from 'react'

let cachedUser: User | null = null
export const useUser = (): User | null => {
  const [user, setUser] = useState(cachedUser)

  useEffect(() => {
    if (!cachedUser) {
      const u = get('user')
      if (u) {
        setUser(u)
        cachedUser = u
      }
    }
  }, [])

  return user
}
