import { get } from '@/src/utils/persist'
import { User } from 'firebase/auth'
import { useEffect, useState } from 'react'

export const useUser = (): User | null => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const u = get('user')
    if (u) {
      setUser(u)
    }
  }, [])

  return user
}
