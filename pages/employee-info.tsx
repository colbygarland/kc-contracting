import { Loader } from '@/components/Loader'
import { FormGroup } from '@/components/forms/FormGroup'
import { Page } from '@/components/layout/Page'
import { UserMeta, getUserMeta, upsertUserMeta } from '@/src/api/users'
import { Button, Input, useToast } from '@chakra-ui/react'
import { getServerSession } from 'next-auth'
import { ChangeEvent, useState } from 'react'

const TOASTS = {
  success: {
    title: 'Info Saved',
    message: 'The data has been successfully saved.',
    status: 'success' as 'success',
    duration: 4000,
    isCloseable: true,
  },
  error: {
    title: 'Something went wrong',
    message: 'Your data has not been saved.',
    status: 'error' as 'error',
    duration: 4000,
    isCloseable: true,
  },
}

export default function EmployeeInfo({ userMeta }: { userMeta: UserMeta }) {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<UserMeta>(userMeta)
  const toast = useToast()

  const onFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = e.target
    const formJson = Object.fromEntries(new FormData(form).entries())

    const body: UserMeta = {
      email: formJson['email'] as string,
      name: formJson['name'] as string,
      phone: formJson['phone'] as string,
      address: formJson['address'] as string,
    }

    const userMetaCreated = await upsertUserMeta(body)
    if (userMetaCreated) {
      toast(TOASTS.success)
      setUser(body)
      e.target.reset()
    } else {
      toast(TOASTS.error)
    }

    setLoading(false)
  }

  return (
    <Page title="Employee Info">
      {loading && <Loader />}
      <div className="max-w-md">
        <form onSubmit={onFormSubmit}>
          <FormGroup label="Full name">
            <Input
              type="text"
              name="name"
              value={user?.name}
              defaultValue={user?.name}
            />
          </FormGroup>
          <FormGroup label="Email address">
            <Input type="email" name="email" defaultValue={user?.email} />
          </FormGroup>
          <FormGroup label="Phone number">
            <Input type="tel" name="phone" defaultValue={user?.phone} />
          </FormGroup>
          <FormGroup label="Address">
            <Input type="text" name="address" defaultValue={user?.address} />
          </FormGroup>
          <Button type="submit">Save Info</Button>
        </form>
      </div>
    </Page>
  )
}

// @ts-ignore
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, {})
  const userMeta = await getUserMeta(session?.user?.email!)
  return {
    props: {
      userMeta,
    },
  }
}
