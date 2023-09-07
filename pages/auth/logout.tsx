import { H1 } from '@/components/Headings'
import { set } from '@/src/utils/persist'
import { useEffect } from 'react'

export default function Logout() {
  useEffect(() => {
    set('user', null)
  }, [])
}
