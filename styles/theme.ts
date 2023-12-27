import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
}

const theme = extendTheme({ config })

export default theme

export const THEME = {
  primary: 'emerald-400',
  hover: 'emerald-700',
  background: 'emerald-50',
}
