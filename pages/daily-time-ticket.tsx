import { H2 } from '@/components/Headings'
import { FormGroup } from '@/components/forms/FormGroup'
import { Page } from '@/components/layout/Page'
import { Company, getAllCompanies } from '@/src/api/companies'
import { Equipment, getAllEquipment } from '@/src/api/equipment'
import { useData } from '@/src/hooks/useData'
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
  Textarea,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ChangeEvent, useState } from 'react'

const CHARGE_TO = ['PO #', 'LSD', 'Job #']

export default function EnterHours() {
  const { user } = store
  const today = getCurrentDate()
  const router = useRouter()
  const companies = useData<Company>(getAllCompanies)
  const allEquipment = useData<Equipment>(getAllEquipment)
  const equipment = allEquipment.filter(e => !e.isTrailer)
  const trailers = allEquipment.filter(e => e.isTrailer)

  const [chargeTo, setChargeTo] = useState(CHARGE_TO[0])
  const [chargeToRef, setInputFocus] = useFocus()

  const updateTicket = 'id' in router.query
  const title = updateTicket ? 'Edit ticket' : 'Create ticket'
  const buttonText = updateTicket ? 'Update ticket' : 'Create ticket'

  const onFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target
    const formJson = Object.fromEntries(new FormData(form).entries())
    console.log(formJson)
  }

  return (
    <Page title="Daily Time Ticket">
      <H2>{title}</H2>
      <form onSubmit={onFormSubmit}>
        <input type="hidden" name="email" value={user.email.get()} />
        <input type="hidden" name="name" value={user.displayName.get()} />
        <FormGroup label="Date" required>
          <Input type="date" name="date" defaultValue={today} required />
        </FormGroup>
        <FormGroup label="Company" required>
          <Select name="company" placeholder="Select company" required>
            {companies.map(company => (
              <option value={company.id} key={company.id}>
                {company.name}
              </option>
            ))}
          </Select>
        </FormGroup>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1">
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
          </div>
          <div className="col-span-2">
            <FormGroup>
              <InputGroup>
                <InputLeftAddon>{chargeTo}</InputLeftAddon>
                <Input type="text" name="location" required ref={chargeToRef} />
              </InputGroup>
            </FormGroup>
          </div>
        </div>
        <FormGroup label="Equipment" required>
          <Select name="equipment" placeholder="Select equipment" required>
            {equipment.map(equipment => (
              <option value={equipment.id} key={equipment.id}>
                {equipment.name}
              </option>
            ))}
          </Select>
        </FormGroup>
        <FormGroup label="Trailer">
          <Select name="trailer" placeholder="Select trailer">
            {trailers.map(trailer => (
              <option value={trailer.id} key={trailer.id}>
                {trailer.name}
              </option>
            ))}
          </Select>
        </FormGroup>
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          <FormGroup label="Labour Hours" required>
            <Input type="number" name="labour_hours" required />
          </FormGroup>
          <FormGroup label="Equipment Hours">
            <Input type="number" name="equipment_hours" />
          </FormGroup>
          <FormGroup label="Travel Time">
            <Input type="number" name="travel_time" />
          </FormGroup>
        </Grid>
        <FormGroup label="Description">
          <Textarea name="description" />
        </FormGroup>

        <Button colorScheme="cyan" type="submit">
          {buttonText}
        </Button>
      </form>
    </Page>
  )
}
