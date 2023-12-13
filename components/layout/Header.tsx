import { CONSTANTS } from '@/constants'
import { isAdmin } from '@/src/auth/roles'
import { store } from '@/src/store/store'
import { getInitials } from '@/src/utils/strings'
import {
  Box,
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaBars, FaGear } from 'react-icons/fa6'
import { H1 } from '../Headings'
import { signOut, useSession } from 'next-auth/react'

const AppMenuItem = ({
  to,
  icon,
  children,
}: {
  to: string
  icon?: React.ReactNode
  children: string
}) => {
  const router = useRouter()
  const isCurrentPage = router.pathname === to
  const styles = isCurrentPage
    ? 'text-sky-500 font-bold lg:text-lg'
    : 'text-slate-500 font-normal hover:text-sky-400 transition duration-100 lg:text-lg'

  return (
    <Text fontSize="lg" fontWeight="bold" mb={4}>
      <Link href={to}>
        <Flex alignItems="center" gap={2}>
          <span className={styles}>
            {icon && icon}
            {children}
          </span>
        </Flex>
      </Link>
    </Text>
  )
}

const MenuItems = () => {
  const session = useSession()
  const adminUser = isAdmin(session?.data?.user?.email)
  return (
    <>
      {adminUser && <AppMenuItem to="/">Home</AppMenuItem>}
      <AppMenuItem to="/daily-time-ticket">Create Ticket</AppMenuItem>
      <AppMenuItem to="/tickets">View Tickets</AppMenuItem>
      <AppMenuItem to="/safety-sheets">Safety Sheet</AppMenuItem>
      {adminUser && (
        <>
          <div className="bg-slate-100 h-1 mb-4" />
          <AppMenuItem to="/permits">Permits</AppMenuItem>
          <AppMenuItem to="/admin/enter-equipment">Equipment</AppMenuItem>
          <AppMenuItem to="/admin/enter-trucks">Truck</AppMenuItem>
          <AppMenuItem to="/admin/enter-company">Company</AppMenuItem>
          <AppMenuItem to="/admin/employees">Employees</AppMenuItem>
          <AppMenuItem to="/admin/quote">Quote</AppMenuItem>
        </>
      )}
    </>
  )
}

const AppMenu = ({ isOpen, onClose }: { isOpen: any; onClose: any }) => {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <span className="text-slate-300 text-sm">MENU</span>
        </DrawerHeader>
        <DrawerBody>
          <MenuItems />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

const UserButton = () => {
  return (
    <Menu>
      <MenuButton as={Button}>
        <FaGear />
      </MenuButton>
      <MenuList color="black">
        <MenuItem>
          <Link className="block" href="/employee-info">
            Employee Info
          </Link>
        </MenuItem>
        <MenuItem>
          <Button onClick={() => signOut()}>Logout</Button>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

const Mobile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div className="lg:hidden">
      <div className="py-4 border-b-slate-200 border-b">
        <Container>
          <Flex justifyContent="space-between" alignItems="center">
            {/* @ts-ignore */}
            <Button
              onClick={onOpen}
              variant="ghost"
              colorScheme="blue"
              _hover={{}}
            >
              <FaBars className="text-slate-600 text-2xl" />
            </Button>
            <Text fontWeight="bold">{CONSTANTS.APP_NAME}</Text>
            <UserButton />
          </Flex>
        </Container>
      </div>
      <AppMenu onClose={onClose} isOpen={isOpen} />
    </div>
  )
}

const Desktop = ({ title }: { title: string }) => {
  return (
    <div className="hidden lg:block">
      <div className="fixed top-0 left-0 h-screen w-64 z-50 bg-slate-50 border-r border-r-slate-200">
        <div className="w-md p-6">
          <p className="mb-6 font-bold">{CONSTANTS.APP_NAME}</p>
          <nav className="">
            <MenuItems />
          </nav>
        </div>
      </div>
      <div className="fixed top-0 left-64 z-50 bg-white border-b border-b-slate-200 h-16 desktop-header flex items-center px-8">
        <h1 className="text-lg font-bold text-slate-600 uppercase">{title}</h1>
        <div className="ml-auto">
          <UserButton />
        </div>
      </div>
    </div>
  )
}

export const Header = ({ title }: { title: string }) => {
  return (
    <>
      <Mobile />
      <Desktop title={title} />
    </>
  )
}
