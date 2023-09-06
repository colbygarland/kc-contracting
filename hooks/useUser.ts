import { get } from '@/utils/persist'
import { useEffect, useState } from 'react'

export const useUser = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const u = get('user')
    if (u) {
      setUser(u)
    }
  }, [])

  return user
}
