import { H2 } from '@/components/Headings'
import { FormGroup } from '@/components/forms/FormGroup'
import { Page } from '@/components/layout/Page'
import { Company, getAllCompanies } from '@/src/api/companies'
import { Equipment as IEquipment, getAllEquipment } from '@/src/api/equipment'
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
import { MdRemoveCircle } from 'react-icons/md'

const CHARGE_TO = ['PO #', 'LSD', 'Job #']

const Location = ({ index, onRemove }: { index?: number; onRemove?: any }) => {
  let showRemoveButton = Boolean(index)

  const [chargeTo, setChargeTo] = useState(CHARGE_TO[0])
  const [chargeToRef, setInputFocus] = useFocus()

  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <FormGroup label="Charge to">
            <Select
              name="chargeType"
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
        <div className="col-span-2 flex items-center">
          <FormGroup>
            <InputGroup>
              <InputLeftAddon>{chargeTo}</InputLeftAddon>
              <Input type="text" name="location" required ref={chargeToRef} />
            </InputGroup>
          </FormGroup>
          {showRemoveButton && (
            <Button
              variant={'ghost'}
              p={0}
              className="mb-6 mt-8"
              onClick={() => onRemove(index)}
            >
              <MdRemoveCircle className="text-red-500" />
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

const Equipment = ({
  index,
  equipment,
  onRemove,
}: {
  index?: number
  equipment: Array<IEquipment>
  onRemove?: any
}) => {
  let showRemoveButton = Boolean(index)

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <FormGroup label="Equipment" required>
          <Select name="equipment" placeholder="Select equipment" required>
            {equipment.map(equipment => (
              <option value={equipment.id} key={equipment.id}>
                {equipment.name}
              </option>
            ))}
          </Select>
        </FormGroup>
      </div>
      <div className="col-span-1">
        <FormGroup label="Hours" required>
          <div className="flex items-center">
            <Input type="number" name="equipmentHours" required />
            {showRemoveButton && (
              <Button
                variant={'ghost'}
                p={0}
                className=""
                onClick={() => onRemove(index)}
              >
                <MdRemoveCircle className="text-red-500" />
              </Button>
            )}
          </div>
        </FormGroup>
      </div>
    </div>
  )
}

export default function EnterHours() {
  const { user } = store
  const [locations, setLocations] = useState([Location])
  const [equipment, setEquipment] = useState([Equipment])
  const today = getCurrentDate()
  const router = useRouter()
  const companies = useData<Company>(getAllCompanies)
  const allEquipment = useData<IEquipment>(getAllEquipment)
  const equipmentList = allEquipment.filter(e => !e.isTrailer)
  const trailers = allEquipment.filter(e => e.isTrailer)

  const updateTicket = 'id' in router.query
  const title = updateTicket ? 'Edit ticket' : 'Create ticket'
  const buttonText = updateTicket ? 'Update ticket' : 'Create ticket'

  const onFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target
    const formJson = Object.fromEntries(new FormData(form).entries())
    const locationValues: Array<string> = []
    const chargeTypeValues: Array<string> = []
    const equipmentValues: Array<string> = []
    const equipmentHoursValues: Array<number> = []
    document.querySelectorAll('input[name="location"]').forEach(i => {
      // @ts-expect-error
      locationValues.push(i.value)
    })
    document.querySelectorAll('select[name="chargeType"]').forEach(i => {
      // @ts-expect-error
      chargeTypeValues.push(i.value)
    })
    document.querySelectorAll('select[name="equipment"]').forEach(i => {
      // @ts-expect-error
      equipmentValues.push(i.value)
    })
    document.querySelectorAll('input[name="equipmentHours"]').forEach(i => {
      // @ts-expect-error
      equipmentHoursValues.push(i.value)
    })
    delete formJson['location']
    delete formJson['chargeType']
    const body = {
      ...formJson,
      locations: locationValues,
      chargeTypes: chargeTypeValues,
      equipment: equipmentValues,
      equipmentHours: equipmentHoursValues,
    }
    console.log(body)
  }

  const addLocation = () => {
    setLocations([...locations, Location])
  }
  const removeLocation = (index: number) => {
    const l = locations
    l.splice(index, 1)
    setLocations([...l])
  }

  const addEquipment = () => {
    setEquipment([...equipment, Equipment])
  }
  const removeEquipment = (index: number) => {
    const e = equipment
    e.splice(index, 1)
    setEquipment([...e])
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
        {locations.map((location, index) => (
          <Location key={index} index={index} onRemove={removeLocation} />
        ))}
        <div className="mb-4">
          <Button onClick={addLocation}>+ Add Location</Button>
        </div>
        {equipment.map((equipment, index) => (
          <Equipment
            equipment={equipmentList}
            key={index}
            index={index}
            onRemove={removeEquipment}
          />
        ))}
        <div className="mb-4">
          <Button onClick={addEquipment}>+ Add Equipment</Button>
        </div>
        <FormGroup label="Trailer">
          <Select name="trailer" placeholder="Select trailer">
            {trailers.map(trailer => (
              <option value={trailer.id} key={trailer.id}>
                {trailer.name}
              </option>
            ))}
          </Select>
        </FormGroup>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <FormGroup label="Labour Hours" required>
            <Input type="number" name="labour_hours" required />
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
