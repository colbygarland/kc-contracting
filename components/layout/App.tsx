import { useColorMode } from '@chakra-ui/react'

export const App = ({ children }: { children: React.ReactNode }) => {
  const { colorMode } = useColorMode()

  return <div className={colorMode}>{children}</div>
}
