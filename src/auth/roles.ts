import { store } from '../store/store'

export const ROLES = {
  employee: 'employee',
  admin: 'admin',
}

// TODO: find a better way to do this
export const ADMIN_USERS = ['colbygarland@gmail.com', 'kyla.crocker@gmail.com']

export const isAdmin = (email?: string | undefined | null) => {
  if (!email) {
    return false
  }
  return ADMIN_USERS.includes(email)
}
