import { Box } from '@chakra-ui/react'
import { Label } from './Label'
import { Required } from './Required'

export const FormGroup = ({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) => {
  return (
    <Box className="mb-6">
      <Label>{label}</Label>
      {required && <Required />}
      {children}
    </Box>
  )
}
