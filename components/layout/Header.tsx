import { CONSTANTS } from '@/constants'
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
  Link,
  Text,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
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
  icon: React.ReactNode
  children: string
}) => {
  return (
    <Text fontSize="xl" fontWeight="bold" mb={6}>
      <Link href={to}>
        <Flex alignItems="center" gap={2}>
          {icon}
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
          <AppMenuItem to="/" icon={<FaHouseChimney />}>
            Home
          </AppMenuItem>
          <AppMenuItem to="/enter-hours" icon={<FaClock />}>
            Daily Time Ticket
          </AppMenuItem>
          <AppMenuItem to="/reports" icon={<FaNewspaper />}>
            Safety Sheets
          </AppMenuItem>
          <AppMenuItem to="/reports" icon={<FaNewspaper />}>
            Equipment List
          </AppMenuItem>
          <AppMenuItem to="/reports" icon={<FaNewspaper />}>
            Truck List
          </AppMenuItem>
          <AppMenuItem to="/reports" icon={<FaNewspaper />}>
            Permits
          </AppMenuItem>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

const UserButton = () => {
  const { user } = store
  const initials = getInitials(user.displayName.use())

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
