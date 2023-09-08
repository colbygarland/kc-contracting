import { observable } from '@legendapp/state'
import { User } from 'firebase/auth'

interface Store {
  user: User | null
}

export const store = observable<Store>({ user: null })
