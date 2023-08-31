import { CONSTANTS } from '@/constants'
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
  Link,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { FaBars, FaClock, FaHouseChimney, FaNewspaper } from 'react-icons/fa6'

const MenuItem = ({
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

const Menu = ({ isOpen, onClose }: { isOpen: any; onClose: any }) => {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader fontSize="3xl">Menu</DrawerHeader>
        <DrawerBody>
          <MenuItem to="/" icon={<FaHouseChimney />}>
            Home
          </MenuItem>
          <MenuItem to="/enter-hours" icon={<FaClock />}>
            Hours
          </MenuItem>
          <MenuItem to="/reports" icon={<FaNewspaper />}>
            Reports
          </MenuItem>
        </DrawerBody>
        <DrawerFooter>
          <Button as="a" href="/logout" colorScheme="cyan">
            Logout
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Box bg="cyan.600" color="white" py={4}>
        <Container>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontWeight="bold">{CONSTANTS.APP_NAME}</Text>
            {/* @ts-ignore */}
            <Button
              onClick={onOpen}
              variant="ghost"
              colorScheme="blue"
              _hover={{}}
            >
              <FaBars className="text-white text-2xl" />
            </Button>
          </Flex>
        </Container>
      </Box>
      <Menu onClose={onClose} isOpen={isOpen} />
    </>
  )
}
