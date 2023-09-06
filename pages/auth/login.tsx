import { loginUser } from '@/auth'
import { loginErrorCodes } from '@/auth/errorCodes'
import { Layout } from '@/components/auth/Layout'
import { FormGroup } from '@/components/forms/FormGroup'
import { CONSTANTS } from '@/constants'
import { Input } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    setError('')
    setLoading(true)
    const { user, error } = await loginUser(email, password)
    if (user) {
      router.replace('/')
      setLoading(false)
    } else {
      setLoading(false)
      console.log(error)
      if (error.code === loginErrorCodes.userNotFound) {
        setError('User not found. Try creating an account first.')
      } else {
        setError('Please double check your credentials and try again.')
      }
    }
  }

  return (
    <Layout
      title={CONSTANTS.APP_NAME}
      submitButtonText="Sign in"
      handleSubmit={handleSubmit}
      footerLink={<Link href="/auth/create-account">Create account</Link>}
      loading={loading}
    >
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded shadow">
          <p className="font-bold">Something went wrong.</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <FormGroup label="Email" required>
        <Input
          type="email"
          name="email"
          required
          onChange={e => setEmail(e.target.value)}
        />
      </FormGroup>
      <FormGroup label="Password" required>
        <Input
          type="password"
          name="password"
          required
          onChange={e => setPassword(e.target.value)}
        />
      </FormGroup>
    </Layout>
  )
}
