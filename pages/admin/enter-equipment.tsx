import { Alert } from '@/components/Alert'
import { H2 } from '@/components/Headings'
import { FormGroup } from '@/components/forms/FormGroup'
import { Page } from '@/components/layout/Page'
import {
  Equipment,
  createEquipment,
  deleteEquipment,
  getAllEquipment,
  getEquipment,
  updateEquipment,
} from '@/src/api/equipment'
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
  Link,
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
    message: 'Equipment has been created.',
  },
  edited: {
    type: 'success',
    title: 'Success!',
    message: 'Equipment has been edited.',
  },
  error: {
    type: 'danger',
    title: 'Something went wrong.',
    message: 'Refresh the page and try again.',
  },
}

export default function EnterEquipment() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()
  const [deleteEquipmentId, setDeleteEquipmentId] = useState('')
  const router = useRouter()
  const editingEquipment = router.query.id
  const [editingEquipmentName, setEditingEquipmentName] =
    useState<Equipment | null>(null)
  const formTitle = editingEquipment ? 'Edit Equipment' : 'Create New Equipment'
  const buttonText = editingEquipment ? 'Update Equipment' : 'Create Equipment'
  const [alert, setAlert] = useState({
    ...ALERT_STATES['success'],
    display: false,
  })

  const allEquipment = useData<Equipment>(getAllEquipment)
  const equipment = allEquipment.filter(e => !e.isTrailer && !e.isAttachment)
  const attachments = allEquipment.filter(e => e.isAttachment)
  const trailers = allEquipment.filter(e => e.isTrailer)

  useEffect(() => {
    if (editingEquipment) {
      getEquipment(editingEquipment as string).then(resp => {
        setEditingEquipmentName(resp)
      })
    }
  }, [editingEquipment])

  const onFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target
    const formJson = Object.fromEntries(new FormData(form).entries())
    const success = editingEquipment
      ? await updateEquipment(formJson)
      : await createEquipment(formJson)
    if (success) {
      setAlert({
        ...ALERT_STATES[editingEquipment ? 'edited' : 'created'],
        display: true,
      })
    } else {
      setAlert({
        ...ALERT_STATES['error'],
        display: true,
      })
    }
    if (editingEquipment) {
      router.replace('/admin/enter-equipment')
    }
    router.reload()
  }

  const onDelete = async () => {
    await deleteEquipment(deleteEquipmentId)
    router.reload()
  }

  return (
    <Page title="Equipment">
      <div className="lg:grid grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2 mb-12 lg:mb-0">
          <div className="mb-6 lg:mb-12">
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Equipment</Th>
                    <Th>Last Updated</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {equipment.map(equipment => (
                    <Tr
                      key={equipment.id}
                      {...(equipment.id === editingEquipment && {
                        background: 'blue.50',
                      })}
                    >
                      <Td>{equipment.name}</Td>
                      <Td>{fromTimestamp(equipment.updatedAt!)}</Td>
                      <Td>
                        <Link
                          href={`/admin/enter-equipment?id=${equipment.id}`}
                        >
                          <Button>
                            <MdEditDocument />
                          </Button>
                        </Link>
                        <Button
                          colorScheme="red"
                          ml={2}
                          onClick={() => {
                            setDeleteEquipmentId(equipment.id!)
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

          <div className="mb-6 lg:mb-12">
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Attachment</Th>
                    <Th>Last Updated</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {attachments.map(attachment => (
                    <Tr
                      key={attachment.id}
                      {...(attachment.id === editingEquipment && {
                        background: 'blue.50',
                      })}
                    >
                      <Td>{attachment.name}</Td>
                      <Td>{fromTimestamp(attachment.updatedAt!)}</Td>
                      <Td>
                        <Link
                          href={`/admin/enter-equipment?id=${attachment.id}`}
                        >
                          <Button>
                            <MdEditDocument />
                          </Button>
                        </Link>
                        <Button
                          colorScheme="red"
                          ml={2}
                          onClick={() => {
                            setDeleteEquipmentId(attachment.id!)
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

          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Trailer</Th>
                  <Th>Last Updated</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {trailers.map(equipment => (
                  <Tr
                    key={equipment.id}
                    {...(equipment.id === editingEquipment && {
                      background: 'blue.50',
                    })}
                  >
                    <Td>{equipment.name}</Td>
                    <Td>{fromTimestamp(equipment.updatedAt!)}</Td>
                    <Td>
                      <Link href={`/admin/enter-equipment?id=${equipment.id}`}>
                        <Button>
                          <MdEditDocument />
                        </Button>
                      </Link>
                      <Button
                        colorScheme="red"
                        ml={2}
                        onClick={() => {
                          setDeleteEquipmentId(equipment.id!)
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
            {editingEquipment && (
              <input type="hidden" name="id" value={editingEquipment} />
            )}
            <FormGroup label="Equipment name" required>
              <Input
                defaultValue={editingEquipmentName?.name}
                type="text"
                name="name"
                required
              />
            </FormGroup>
            <FormGroup label="Is this an attachment?">
              <Checkbox name="isAttachment" value="true">
                Yes
              </Checkbox>
            </FormGroup>
            <FormGroup label="Is this a trailer?">
              <Checkbox name="isTrailer" value="true">
                Yes
              </Checkbox>
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
              Delete Equipment
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
