import {
  getAuth,
  createUserWithEmailAndPassword,
  User,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { signIn } from 'next-auth/react'
import { upsertUserMeta } from '../api/users'
import { initFirebase } from '@/firebase'

initFirebase()

export const createUser = async (
  email: string,
  password: string,
  name: string,
  phone: string,
): Promise<{
  user: User | null
  error: { code: string | null; message: string | null }
}> => {
  const auth = getAuth()
  try {
    const resp = await createUserWithEmailAndPassword(auth, email, password)
    await upsertUserMeta({
      email,
      name,
      phone,
    })
    await signIn('credentials', {
      username: email,
      password: password,
      callbackUrl: '/',
    })
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
    return { user: resp.user, error: { code: null, message: null } }
  } catch (error: any) {
    console.error(
      `Error signing in user. Error code: ${error.code}. Error message: ${error.message}`,
    )
    return { user: null, error }
  }
}

export const resetPassword = async (email: string) => {
  const auth = getAuth()
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error: any) {
    console.error(
      `Error resetting passsword. Error code: ${error.code}. Error message: ${error.message}`,
    )
  }
}
