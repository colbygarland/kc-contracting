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
import { FaBars } from 'react-icons/fa6'

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
  const isCurrentPage = router.asPath === to
  const styles = isCurrentPage
    ? 'text-sky-500 font-normal'
    : 'text-slate-500 font-normal hover:text-sky-400 transition duration-100'

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
          <AppMenuItem to="/">Home</AppMenuItem>
          <AppMenuItem to="/daily-time-ticket">Daily Time Ticket</AppMenuItem>
          <AppMenuItem to="#">Safety Sheet</AppMenuItem>
          <AppMenuItem to="#">Equipment List</AppMenuItem>
          <AppMenuItem to="#">Truck List</AppMenuItem>
          <AppMenuItem to="#">Permits</AppMenuItem>
          <AppMenuItem to="/profile">Employee Info</AppMenuItem>
          {isAdmin() && (
            <>
              <div className="bg-slate-100 h-1 mb-4" />
              <AppMenuItem to="/enter-equipment">Enter Equipment</AppMenuItem>
              <AppMenuItem to="#">Enter Company</AppMenuItem>
              <AppMenuItem to="#">Employees</AppMenuItem>
            </>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

const UserButton = () => {
  const { user } = store
  const initials = getInitials(user.displayName.get())

  return (
    <Menu>
      <MenuButton as={Button}>{initials}</MenuButton>
      <MenuList color="black">
        <MenuItem>
          <Link className="block" href="/profile">
            Employee Info
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/auth/logout">Logout</Link>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

const MobileMenu = () => {
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

const DesktopMenu = () => {
  return (
    <div className="hidden lg:block fixed top-0 left-0 h-screen w-64 bg-slate-50 border-r border-r-slate-200">
      <div className="w-md "></div>
    </div>
  )
}

export const Header = () => {
  return (
    <>
      <MobileMenu />
      <DesktopMenu />
    </>
  )
}
