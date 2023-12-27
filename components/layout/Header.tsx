import { CONSTANTS } from '@/constants'
import { isAdmin } from '@/src/auth/roles'
import {
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
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaBars, FaGear, FaMoon, FaSun } from 'react-icons/fa6'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'

const AppMenuItem = ({ to, children }: { to: string; children: string }) => {
  const router = useRouter()
  const isCurrentPage = router.pathname === to
  const styles = isCurrentPage
    ? 'bg-gradient-to-r from-indigo-600 from-70% to-violet-600 text-white hover:text-white'
    : ''

  return (
    <div
      className={`${styles} transition duration-100 rounded-xl font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900`}
    >
      <Link href={to} className="block py-2 px-6">
        {children}
      </Link>
    </div>
  )
}

const MenuItems = () => {
  const session = useSession()
  const adminUser = isAdmin(session?.data?.user?.email)
  return (
    <>
      {adminUser && <AppMenuItem to="/">Dashboard</AppMenuItem>}
      {adminUser && (
        <div className="text-slate-300 dark:text-slate-600 uppercase text-xs font-bold pl-6 mt-6 mb-2">
          Tickets
        </div>
      )}
      <AppMenuItem to="/daily-time-ticket">Create Ticket</AppMenuItem>
      <AppMenuItem to="/practice-ticket">Practice Ticket</AppMenuItem>
      {adminUser && (
        <AppMenuItem to="/approve-tickets">Approve Tickets</AppMenuItem>
      )}
      {adminUser && (
        <AppMenuItem to="/export-tickets">Export Tickets</AppMenuItem>
      )}
      <AppMenuItem to="/tickets">View Tickets</AppMenuItem>
      <div className="text-slate-300 dark:text-slate-600 uppercase text-xs font-bold pl-6 mt-6 mb-2">
        Info
      </div>

      <AppMenuItem to="/safety-sheets">Safety Sheet</AppMenuItem>
      {adminUser && (
        <>
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
  const { colorMode, setColorMode } = useColorMode()

  return (
    <Menu>
      <div className="flex items-center">
        <button
          className="mr-2 p-3 rounded-full"
          onClick={() => {
            setColorMode(colorMode === 'dark' ? 'light' : 'dark')
          }}
        >
          {colorMode === 'dark' ? <FaSun /> : <FaMoon />}
        </button>
        <MenuButton
          as={Button}
          rounded="full"
          h={10}
          w={10}
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding={0}
        >
          <div className="h-10 w-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
            <FaGear />
          </div>
        </MenuButton>
        <MenuList>
          <MenuItem>
            <Link className="block" href="/employee-info">
              Employee Info
            </Link>
          </MenuItem>
          <MenuItem onClick={() => signOut()}>Logout</MenuItem>
        </MenuList>
      </div>
    </Menu>
  )
}

const Mobile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div className="lg:hidden">
      <div className="py-4 border-b-slate-200 dark:border-b-slate-600 border-b">
        <Container>
          <Flex justifyContent="space-between" alignItems="center">
            {/* @ts-ignore */}
            <Button
              onClick={onOpen}
              variant="ghost"
              colorScheme="blue"
              _hover={{}}
            >
              <FaBars className="text-slate-600 dark:text-slate-50 text-2xl" />
            </Button>
            <Link href="/">
              <Text fontWeight="bold">{CONSTANTS.APP_NAME}</Text>
            </Link>
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
      <div className="fixed top-0 left-0 h-screen w-64 z-50 dark:bg-chakra-dark border-r border-r-slate-200 dark:border-r-gray-700">
        <div className="w-md p-6">
          <div className="h-48 w-48 dark:bg-white rounded-full mb-12 mx-auto">
            <Image src="/logo.png" height={250} width={250} alt="logo" />
          </div>

          <nav className="">
            <MenuItems />
          </nav>
        </div>
      </div>
      <div className="fixed top-0 left-64 z-50 bg-white dark:bg-chakra-dark border-b border-b-slate-200 dark:border-b-gray-700 h-16 desktop-header flex items-center px-8">
        <h1 className="text-xl font-medium text-slate-900 dark:text-slate-100">
          {title}
        </h1>
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
