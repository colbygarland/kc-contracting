import { loginUser } from '@/src/auth'
import { loginErrorCodes } from '@/src/auth/errorCodes'
import { Layout } from '@/components/auth/Layout'
import { FormGroup } from '@/components/forms/FormGroup'
import { get } from '@/src/utils/persist'
import { Grid, Input } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import { Alert } from '@/components/Alert'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const user = get('user')
    if (user) {
      router.replace('/')
    }
  }, [router])

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
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
      title="Log In"
      submitButtonText="Sign in"
      handleSubmit={handleSubmit}
      footerLink={
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <Link href="/auth/reset-password">Reset password</Link>
          <Link href="/auth/create-account">Create account</Link>
        </Grid>
      }
      loading={loading}
    >
      {error && (
        <Alert title="Something went wrong." message={error} type="danger" />
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
