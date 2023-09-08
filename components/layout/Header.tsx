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
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import Link from 'next/link'
import {
  FaBars,
  FaChevronDown,
  FaClock,
  FaHouseChimney,
  FaNewspaper,
} from 'react-icons/fa6'

const AppMenuItem = ({
  to,
  icon,
  children,
}: {
  to: string
  icon?: React.ReactNode
  children: string
}) => {
  return (
    <Text fontSize="lg" fontWeight="bold" mb={4}>
      <Link href={to}>
        <Flex alignItems="center" gap={2}>
          {icon && icon}
          {children}
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
        <DrawerHeader fontSize="3xl">Menu</DrawerHeader>
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
      <MenuButton as={Button} rightIcon={<FaChevronDown />}>
        {initials}
      </MenuButton>
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

export const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Box bg="cyan.600" color="white" py={4}>
        <Container>
          <Flex justifyContent="space-between" alignItems="center">
            {/* @ts-ignore */}
            <Button
              onClick={onOpen}
              variant="ghost"
              colorScheme="blue"
              _hover={{}}
            >
              <FaBars className="text-white text-2xl" />
            </Button>
            <Text fontWeight="bold">{CONSTANTS.APP_NAME}</Text>
            <UserButton />
          </Flex>
        </Container>
      </Box>
      <AppMenu onClose={onClose} isOpen={isOpen} />
    </>
  )
}
