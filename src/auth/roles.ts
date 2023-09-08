import { store } from '../store/store'

export const ROLES = {
  employee: 'employee',
  admin: 'admin',
}

// TODO: find a better way to do this
export const ADMIN_USERS = ['colbygarland@gmail.com', 'kyla.crocker@gmail.com']

export const isAdmin = () => {
  const { user } = store
  return ADMIN_USERS.includes(user.email.get())
}
