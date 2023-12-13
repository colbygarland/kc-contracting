import { FormGroup } from '@/components/forms/FormGroup'
import { Page } from '@/components/layout/Page'
import { store } from '@/src/store/store'
import { Button, Input } from '@chakra-ui/react'

export default function EmployeeInfo() {
  const { user } = store

  return (
    <Page title="Employee Info">
      <div className="max-w-md">
        <form>
          <FormGroup label="Full name">
            <Input
              type="text"
              name="name"
              defaultValue={user.displayName.get()}
            />
          </FormGroup>
          <FormGroup label="Email address">
            <Input type="email" name="email" defaultValue={user.email.get()} />
          </FormGroup>
          <FormGroup label="Phone number">
            <Input type="tel" name="phone" />
          </FormGroup>
          <FormGroup label="Address">
            <Input type="text" name="address" />
          </FormGroup>
          <Button type="submit">Save Info</Button>
        </form>
      </div>
    </Page>
  )
}
