import { useEffect, useState } from 'react'

export const useUser = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {}, [])

  return user
}
