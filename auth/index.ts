import { set } from '@/utils/persist'
import {
  getAuth,
  createUserWithEmailAndPassword,
  User,
  signInWithEmailAndPassword,
} from 'firebase/auth'

// List of routes a user is allowed to see unauthorized
export const unauthorizedRoutes = ['/auth/create-account', '/auth/login']

export const createUser = async (
  email: string,
  password: string,
): Promise<{
  user: User | null
  error: { code: string | null; message: string | null }
}> => {
  const auth = getAuth()
  try {
    const resp = await createUserWithEmailAndPassword(auth, email, password)
    set('user', resp.user)
    return { user: resp.user, error: { code: null, message: null } }
  } catch (error: any) {
    console.error(
      `Error creating user. Error code: ${error.code}. Error message: ${error.message}`,
    )
    return { user: null, error }
  }
}

export const loginUser = async (
  email: string,
  password: string,
): Promise<{
  user: User | null
  error: { code: string | null; message: string | null }
}> => {
  const auth = getAuth()
  try {
    const resp = await signInWithEmailAndPassword(auth, email, password)
    set('user', resp.user)
    return { user: resp.user, error: { code: null, message: null } }
  } catch (error: any) {
    console.error(
      `Error signing in user. Error code: ${error.code}. Error message: ${error.message}`,
    )
    return { user: null, error }
  }
}
