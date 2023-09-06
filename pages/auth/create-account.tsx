import { createUser } from '@/auth'
import { Layout } from '@/components/auth/Layout'
import { FormGroup } from '@/components/forms/FormGroup'
import { Input } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function CreateAccount() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setError('')

    // ensure the passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const { user, error } = await createUser(email, password)
    setLoading(false)
    if (user) {
      router.replace('/')
    } else {
      console.log(error)
      setError('Please double check your credentials and try again.')
    }
  }

  return (
    <Layout
      title="Create Account"
      submitButtonText="Create Account"
      handleSubmit={handleSubmit}
      footerLink={<Link href="/auth/login">Login</Link>}
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
      <FormGroup label="Confirm Password" required>
        <Input
          type="password"
          name="confirm_password"
          required
          onChange={e => setConfirmPassword(e.target.value)}
        />
      </FormGroup>
    </Layout>
  )
}
