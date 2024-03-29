import { Alert } from '@/components/Alert'
import { H2 } from '@/components/Headings'
import { Loader } from '@/components/Loader'
import { FormGroup } from '@/components/forms/FormGroup'
import { Page } from '@/components/layout/Page'
import { Company, getAllCompanies } from '@/src/api/companies'
import { Equipment as IEquipment, getAllEquipment } from '@/src/api/equipment'
import {
  ChargeType,
  Ticket,
  createTicket,
  getLastTicketCreated,
  getTicket,
} from '@/src/api/ticket'
import { Truck, getAllTrucks } from '@/src/api/trucks'
import { UserMeta, upsertUserMeta } from '@/src/api/users'
import { useData } from '@/src/hooks/useData'
import { useFocus } from '@/src/hooks/useFocus'
import { getCurrentDate } from '@/src/utils/date'
import { get } from '@/src/utils/persist'
import {
  Button,
  ButtonGroup,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import { MdRemoveCircle } from 'react-icons/md'
import { toast } from 'sonner'

const CHARGE_TO: Array<ChargeType> = ['PO #', 'LSD', 'Job #']

const TOASTS = {
  success: {
    title: 'Ticket created',
    message: 'The ticket has been successfully saved.',
    status: 'success' as 'success',
    duration: 4000,
    isCloseable: true,
  },
  error: {
    title: 'Something went wrong',
    message: 'Your ticket has not been saved.',
    status: 'error' as 'error',
    duration: 4000,
    isCloseable: true,
  },
}

const Location = ({
  index,
  onRemove,
  editTicket,
}: {
  index?: number
  onRemove?: any
  editTicket?: Ticket
}) => {
  let showRemoveButton = Boolean(index)
  const [chargeToRef, setInputFocus] = useFocus()

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <FormGroup label="Location" required>
          <InputGroup>
            <InputLeftAddon p={0}>
              <Select
                name="chargeType"
                onChange={e => {
                  // @ts-ignore
                  setInputFocus()
                }}
              >
                {CHARGE_TO.map((chargeTo, index) => (
                  <option
                    key={chargeTo}
                    selected={
                      editTicket?.locations[index]?.chargeType === chargeTo
                    }
                  >
                    {chargeTo}
                  </option>
                ))}
              </Select>
            </InputLeftAddon>
            <Input type="text" name="location" required ref={chargeToRef} />
          </InputGroup>
        </FormGroup>
      </div>
      <div className="col-span-1 flex items-center">
        <FormGroup label="Hours" required>
          <Input type="number" name="hoursAtLocation" required />
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
  )
}

const Equipment = ({
  index,
  equipment,
  attachments,
  onRemove,
  editTicket,
}: {
  index?: number
  equipment: Array<IEquipment>
  attachments: Array<IEquipment>
  onRemove?: any
  editTicket?: Ticket
}) => {
  let showRemoveButton = Boolean(index)

  return (
    <div className="grid md:grid-cols-3 md:gap-6">
      <FormGroup label="Equipment" required>
        <Select name="equipment" placeholder="Select equipment" required>
          {equipment.map(equipment => (
            <option value={equipment.id} key={equipment.id}>
              {equipment.name}
            </option>
          ))}
        </Select>
      </FormGroup>
      <FormGroup label="Attachment">
        <Select name="attachment" placeholder="Select attachment">
          {attachments.map(attachment => (
            <option value={attachment.id} key={attachment.id}>
              {attachment.name}
            </option>
          ))}
        </Select>
      </FormGroup>
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
  )
}

export default function EnterHours({
  ticketNumber,
  editTicket,
}: {
  ticketNumber: number
  editTicket?: Ticket
}) {
  const session = useSession()
  const [loading, setLoading] = useState(false)
  const [locations, setLocations] = useState([Location])
  const [equipment, setEquipment] = useState([Equipment])
  const today = getCurrentDate()
  const router = useRouter()
  const companies = useData<Company>(getAllCompanies)
  const allEquipment = useData<IEquipment>(getAllEquipment)
  const trucks = useData<Truck>(getAllTrucks)
  const equipmentList = allEquipment.filter(
    e => !e.isTrailer && !e.isAttachment,
  )
  const trailers = allEquipment.filter(e => e.isTrailer)
  const attachmentsList = allEquipment.filter(e => e.isAttachment)

  const updateTicket = 'id' in router.query
  const title = updateTicket
    ? `Edit ticket #${editTicket?.ticketNumber}`
    : 'Create ticket'
  const buttonText = updateTicket ? 'Update ticket' : 'Create ticket'

  // todo: think of a better way to do this
  useEffect(() => {
    const userMeta = get('userMeta')
    if (userMeta) {
      upsertUserMeta(userMeta as UserMeta)
    }
  }, [])

  const onFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = e.target
    const formJson = Object.fromEntries(new FormData(form).entries())
    const locationValues: Array<string> = []
    const hoursAtLocationValues: Array<number> = []
    const chargeTypeValues: Array<string> = []
    const equipmentValues: Array<string> = []
    const attachmentValues: Array<string> = []
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
    document.querySelectorAll('select[name="attachment"]').forEach(i => {
      // @ts-expect-error
      attachmentValues.push(i.value)
    })
    document.querySelectorAll('input[name="equipmentHours"]').forEach(i => {
      // @ts-expect-error
      equipmentHoursValues.push(i.value)
    })
    document.querySelectorAll('input[name="hoursAtLocation"]').forEach(i => {
      // @ts-expect-error
      hoursAtLocationValues.push(i.value)
    })

    delete formJson['location']
    delete formJson['chargeType']
    delete formJson['attachment']
    delete formJson['equipmentHours']

    const locations = locationValues.map((location, index) => {
      return {
        location,
        chargeType: chargeTypeValues[index] as ChargeType,
        hours: Number(hoursAtLocationValues[index]),
      }
    })
    const equipment = equipmentValues.map((equipment, index) => {
      return {
        id: equipment,
        hours: Number(equipmentHoursValues[index]),
        attachment: attachmentValues[index],
      }
    })

    const body: Ticket = {
      uid: 'todo',
      email: session?.data?.user?.email as string,
      ticketDate: formJson['ticketDate'].toString(),
      company: formJson['company'].toString(),
      labourHours: Number(formJson['labourHours']),
      truck: formJson['truck'].toString(),
      trailer: formJson['trailer'].toString(),
      description: formJson['description'].toString(),
      travelHours: Number(formJson['travelHours']),
      locations,
      equipment,
      approvedAt: '',
      ticketNumber,
      rejectedAt: '',
      rejectionReason: '',
    }

    toast.promise(createTicket(body), {
      loading: 'Loading...',
      success: 'Ticket created!',
      error: 'Something went wrong.',
    })

    setLoading(false)
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

  if (session.status !== 'authenticated') {
    return <Loader />
  }

  return (
    <Page title="Daily Time Ticket">
      {editTicket?.rejectedAt && (
        <div className="mb-4">
          <Alert
            title="Ticket Rejected"
            message={`Reason: ${editTicket.rejectionReason}`}
            type="danger"
          />
        </div>
      )}
      <form onSubmit={onFormSubmit}>
        <input type="hidden" name="email" value={session.data!.user!.email!} />
        <input type="hidden" name="uid" value={'todo'} />
        <FormGroup label="Date" required>
          <Input
            type="date"
            name="ticketDate"
            defaultValue={editTicket?.ticketDate ?? today}
            required
          />
        </FormGroup>
        <FormGroup label="Company" required>
          <Select name="company" placeholder="Select company" required>
            {companies.map(company => (
              <option
                value={company.id}
                key={company.id}
                selected={editTicket?.company === company.name}
              >
                {company.name}
              </option>
            ))}
          </Select>
        </FormGroup>
        {locations.map((location, index) => (
          <Location
            key={index}
            index={index}
            onRemove={removeLocation}
            editTicket={editTicket}
          />
        ))}
        <div className="mb-4 pb-6 border-b border-b-slate-200 dark:border-b-slate-600">
          <Button onClick={addLocation}>+ Add Location</Button>
        </div>
        {equipment.map((equipment, index) => (
          <Equipment
            attachments={attachmentsList}
            equipment={equipmentList}
            key={index}
            index={index}
            onRemove={removeEquipment}
            editTicket={editTicket}
          />
        ))}
        <div className="mb-4 pb-6 border-b border-b-slate-200 dark:border-b-slate-600">
          <Button onClick={addEquipment}>+ Add Equipment</Button>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <FormGroup label="Truck">
            <Select name="truck" placeholder="Select truck">
              {trucks.map(truck => (
                <option value={truck.id} key={truck.id}>
                  {truck.name}
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
        </div>
        <div className="grid grid-cols-2 gap-6">
          <FormGroup label="Labour Hours" required>
            <Input type="number" name="labourHours" min={0} required />
          </FormGroup>
          <FormGroup label="Travel Hours">
            <Input type="number" name="travelHours" min={0} />
          </FormGroup>
        </div>
        <FormGroup label="Description">
          <Textarea name="description" />
        </FormGroup>

        <Button type="submit" colorScheme="green">
          {buttonText}
        </Button>
      </form>
      {loading && <Loader />}
    </Page>
  )
}

// @ts-ignore
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, {})
  const editTicket = context.query.id
    ? // @ts-ignore
      await getTicket({
        id: context.query.id,
        // @ts-ignore
        email: session!.user!.email,
      })
    : null
  const ticket = await getLastTicketCreated()
  const ticketNumber = ticket ? ticket.ticketNumber + 1 : 1

  return {
    props: {
      ticketNumber,
      editTicket,
    },
  }
}
