import { observable } from '@legendapp/state'
import { User } from 'firebase/auth'
import { get } from '../utils/persist'

let user = null
if (typeof window !== 'undefined') {
  user = get('user')
}

export const store = observable<{ user: User | null }>({ user: user })
