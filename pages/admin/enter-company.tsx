import { Alert } from '@/components/Alert'
import { H2 } from '@/components/Headings'
import { FormGroup } from '@/components/forms/FormGroup'
import { Page } from '@/components/layout/Page'
import {
  Company,
  createCompany,
  deleteCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
} from '@/src/api/companies'
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
    message: 'Company has been created.',
  },
  edited: {
    type: 'success',
    title: 'Success!',
    message: 'Company has been edited.',
  },
  error: {
    type: 'danger',
    title: 'Something went wrong.',
    message: 'Refresh the page and try again.',
  },
}

export default function EnterCompany() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()
  const [deleteCompanyId, setDeleteCompanyId] = useState('')
  const router = useRouter()
  const editingCompany = router.query.id
  const [editingCompanyName, setEditingCompanyName] = useState<Company | null>(
    null,
  )
  const formTitle = editingCompany ? 'Edit Company' : 'Create New Company'
  const buttonText = editingCompany ? 'Update Company' : 'Create Company'
  const [alert, setAlert] = useState({
    ...ALERT_STATES['success'],
    display: false,
  })

  const companies = useData<Company>(getAllCompanies)

  useEffect(() => {
    if (editingCompany) {
      getCompany(editingCompany as string).then(resp => {
        setEditingCompanyName(resp)
      })
    }
  }, [editingCompany])

  const onFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target
    const formJson = Object.fromEntries(new FormData(form).entries())
    const success = editingCompany
      ? await updateCompany(formJson)
      : await createCompany(formJson)
    if (success) {
      setAlert({
        ...ALERT_STATES[editingCompany ? 'edited' : 'created'],
        display: true,
      })
    } else {
      setAlert({
        ...ALERT_STATES['error'],
        display: true,
      })
    }
    if (editingCompany) {
      router.replace('/admin/enter-company')
    }
    router.reload()
  }

  const onDelete = async () => {
    await deleteCompany(deleteCompanyId)
    router.reload()
  }

  return (
    <Page title="Companies">
      <div className="lg:grid grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2 mb-12 lg:mb-0">
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Company</Th>
                  <Th>Multiple Locations</Th>
                  <Th>Last Updated</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {companies.map(company => (
                  <Tr
                    key={company.id}
                    {...(company.id === editingCompany && {
                      background: 'blue.50',
                    })}
                  >
                    <Td>{company.name}</Td>
                    <Td>{company.allowMultipleLocations ? '✅' : '-'}</Td>
                    <Td>{fromTimestamp(company.updatedAt!)}</Td>
                    <Td>
                      <Link href={`/admin/enter-company?id=${company.id}`}>
                        <Button>
                          <MdEditDocument />
                        </Button>
                      </Link>
                      <Button
                        colorScheme="red"
                        ml={2}
                        onClick={() => {
                          setDeleteCompanyId(company.id!)
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
            {editingCompany && (
              <input type="hidden" name="id" value={editingCompany} />
            )}
            <FormGroup label="Company name" required>
              <Input
                defaultValue={editingCompanyName?.name}
                type="text"
                name="name"
                required
              />
            </FormGroup>
            <FormGroup label="Allow multiple locations?">
              <Checkbox
                name="allowMultipleLocations"
                value="true"
                defaultChecked={editingCompanyName?.allowMultipleLocations}
                defaultValue={
                  editingCompanyName?.allowMultipleLocations ? 'true' : 'false'
                }
              >
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
              Delete Company
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
