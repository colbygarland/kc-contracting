import { Alert } from '@/components/Alert'
import { H2 } from '@/components/Headings'
import { FormGroup } from '@/components/forms/FormGroup'
import { Page } from '@/components/layout/Page'
import {
  Truck,
  getAllTrucks,
  getTruck,
  updateTruck,
  createTruck,
  deleteTruck,
} from '@/src/api/trucks'

import { useData } from '@/src/hooks/useData'
import { fromTimestamp } from '@/src/utils/date'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Checkbox,
  Input,
  InputGroup,
  InputLeftAddon,
  Link,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ChangeEvent, ComponentProps, useEffect, useRef, useState } from 'react'
import { MdDelete, MdEditDocument } from 'react-icons/md'

const ALERT_STATES: { [key: string]: ComponentProps<typeof Alert> } = {
  created: {
    type: 'success',
    title: 'Success!',
    message: 'Truck has been created.',
  },
  edited: {
    type: 'success',
    title: 'Success!',
    message: 'Truck has been edited.',
  },
  error: {
    type: 'danger',
    title: 'Something went wrong.',
    message: 'Refresh the page and try again.',
  },
}

export default function EnterTrucks() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()
  const [deleteTruckId, setDeleteTruckId] = useState('')
  const router = useRouter()
  const editingTruck = router.query.id
  const [editingTruckName, setEditingTruckName] = useState<Truck | null>(null)
  const formTitle = editingTruck ? 'Edit Truck' : 'Create New Truck'
  const buttonText = editingTruck ? 'Update Truck' : 'Create Truck'
  const [alert, setAlert] = useState({
    ...ALERT_STATES['success'],
    display: false,
  })

  const allTrucks = useData<Truck>(getAllTrucks)

  useEffect(() => {
    if (editingTruck) {
      getTruck(editingTruck as string).then(resp => {
        setEditingTruckName(resp)
      })
    }
  }, [editingTruck])

  const onFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target
    const formJson = Object.fromEntries(new FormData(form).entries())
    const success = editingTruck
      ? await updateTruck(formJson)
      : await createTruck(formJson)
    if (success) {
      setAlert({
        ...ALERT_STATES[editingTruck ? 'edited' : 'created'],
        display: true,
      })
    } else {
      setAlert({
        ...ALERT_STATES['error'],
        display: true,
      })
    }
    if (editingTruck) {
      router.replace('/admin/enter-truck')
    }
    router.reload()
  }

  const onDelete = async () => {
    await deleteTruck(deleteTruckId)
    router.reload()
  }

  return (
    <Page title="Truck">
      <div className="lg:grid grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2 mb-12 lg:mb-0">
          <div className="mb-6 lg:mb-12">
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Truck</Th>
                    <Th>Rate</Th>
                    <Th>Last Updated</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {allTrucks.map(truck => (
                    <Tr
                      key={truck.id}
                      {...(truck.id === editingTruck && {
                        background: 'blue.50',
                      })}
                    >
                      <Td>{truck.name}</Td>
                      <Td>
                        ${truck.rate} ({truck.rateType})
                      </Td>
                      <Td>{fromTimestamp(truck.updatedAt!)}</Td>
                      <Td>
                        <Link href={`/admin/enter-truck?id=${truck.id}`}>
                          <Button>
                            <MdEditDocument />
                          </Button>
                        </Link>
                        <Button
                          colorScheme="red"
                          ml={2}
                          onClick={() => {
                            setDeleteTruckId(truck.id!)
                            onOpen()
                          }}
                        >
                          <MdDelete />
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </div>
        </div>
        <div className="lg:col-span-1">
          <H2>{formTitle}</H2>
          <div className="mb-2">
            {alert.display && (
              <Alert
                type={alert.type}
                title={alert.title}
                message={alert.message}
              />
            )}
          </div>
          <form onSubmit={onFormSubmit}>
            {editingTruck && (
              <input type="hidden" name="id" value={editingTruck} />
            )}
            <FormGroup label="Truck name" required>
              <Input
                defaultValue={editingTruckName?.name}
                type="text"
                name="name"
                required
              />
            </FormGroup>
            <FormGroup label="Rate type">
              <Select name="rateType" placeholder="Select rate">
                <option
                  value="hourly"
                  selected={editingTruckName?.rateType === 'hourly'}
                >
                  Hourly
                </option>
                <option
                  value="daily"
                  selected={editingTruckName?.rateType === 'daily'}
                >
                  Daily
                </option>
              </Select>
            </FormGroup>
            <FormGroup label="Rate">
              <InputGroup>
                <InputLeftAddon>$</InputLeftAddon>
                <Input
                  defaultValue={editingTruckName?.rate}
                  type="number"
                  name="rate"
                />
              </InputGroup>
            </FormGroup>
            <Button type="submit">{buttonText}</Button>
          </form>
        </div>
      </div>
      <AlertDialog
        isOpen={isOpen}
        // @ts-expect-error
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Truck
            </AlertDialogHeader>

            <AlertDialogBody>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              {/* @ts-expect-error */}
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Page>
  )
}
