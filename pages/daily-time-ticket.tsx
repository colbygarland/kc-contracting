import { FormGroup } from '@/components/forms/FormGroup'
import { Required } from '@/components/forms/Required'
import { Page } from '@/components/layout/Page'
import { useFocus } from '@/src/hooks/useFocus'
import { store } from '@/src/store/store'
import { getCurrentDate } from '@/src/utils/date'
import {
  Button,
  Grid,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Text,
  Textarea,
} from '@chakra-ui/react'
import { ChangeEvent, useRef, useState } from 'react'

const COMPANIES_TO_REPLACE_BY_API_CALL = [
  {
    id: 'ewrewrewr',
    name: 'Birchcliff',
  },
  {
    id: 'fdghyghj',
    name: 'CNRL',
  },
]

const EQUIPMENT_TO_REPLACE_BY_API_CALL = [
  {
    id: 'dfsdfdsf',
    name: 'Hoe',
  },
  {
    id: 'dfghghg',
    name: 'Dozer',
  },
]

const CHARGE_TO = ['PO #', 'LSD', 'Job #']

export default function EnterHours() {
  const { user } = store
  const today = getCurrentDate()

  const [chargeTo, setChargeTo] = useState(CHARGE_TO[0])
  const [chargeToRef, setInputFocus] = useFocus()

  const onFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target
    const formJson = Object.fromEntries(new FormData(form).entries())
    console.log(formJson)
  }

  return (
    <Page title="Daily Time Ticket">
      <Text mb={6}>
        <Required /> indicates required fields.
      </Text>
      <form onSubmit={onFormSubmit}>
        <input type="hidden" name="email" value={user.email.get()} />
        <input type="hidden" name="name" value={user.displayName.get()} />
        <FormGroup label="Date" required>
          <Input type="date" name="date" defaultValue={today} required />
        </FormGroup>
        <FormGroup label="Company" required>
          <Select name="company" placeholder="Select company" required>
            {COMPANIES_TO_REPLACE_BY_API_CALL.map(company => (
              <option value={company.id} key={company.id}>
                {company.name}
              </option>
            ))}
          </Select>
        </FormGroup>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <FormGroup label="Charge to">
            <Select
              name="charge_type"
              onChange={e => {
                setChargeTo(e.target.value)
                // @ts-ignore
                setInputFocus()
              }}
            >
              {CHARGE_TO.map(chargeTo => (
                <option key={chargeTo}>{chargeTo}</option>
              ))}
            </Select>
          </FormGroup>
          <FormGroup>
            <InputGroup>
              <InputLeftAddon>{chargeTo}</InputLeftAddon>
              <Input type="text" name="location" required ref={chargeToRef} />
            </InputGroup>
          </FormGroup>
        </Grid>
        <FormGroup label="Equipment" required>
          <Select name="equipment" placeholder="Select equipment" required>
            {EQUIPMENT_TO_REPLACE_BY_API_CALL.map(equipment => (
              <option value={equipment.id} key={equipment.id}>
                {equipment.name}
              </option>
            ))}
          </Select>
        </FormGroup>
        <FormGroup label="Description">
          <Textarea name="description" />
        </FormGroup>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <FormGroup label="Hours Worked" required>
            <Input type="number" name="hours_worked" required />
          </FormGroup>
          <FormGroup label="Travel Hours">
            <Input type="number" name="travel_hours" />
          </FormGroup>
          <Button colorScheme="cyan" type="submit">
            Submit Ticket
          </Button>
        </Grid>
      </form>
    </Page>
  )
}
