import { Alert } from '@/components/Alert'
import { Layout } from '@/components/auth/Layout'
import { FormGroup } from '@/components/forms/FormGroup'
import { resetPassword } from '@/src/auth'
import { Input } from '@chakra-ui/react'
import Link from 'next/link'
import { ChangeEvent, useState } from 'react'

export default function ResetPassword() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    await resetPassword(email)
    setLoading(false)
    setShowSuccessMessage(true)
  }

  return (
    <Layout
      title="Reset Password"
      submitButtonText="Send email"
      handleSubmit={handleSubmit}
      loading={loading}
      footerLink={<Link href="/auth/login">Log in</Link>}
    >
      {showSuccessMessage && (
        <Alert
          title="Email successfully sent."
          message="Check your inbox for the email. Be sure to check spam just in case."
          type="success"
        />
      )}
      <FormGroup label="Email" required>
        <Input
          type="email"
          name="email"
          required
          onChange={e => setEmail(e.target.value)}
        />
      </FormGroup>
    </Layout>
  )
}
