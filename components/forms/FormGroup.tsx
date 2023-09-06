import { Box, FormLabel } from '@chakra-ui/react'
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
      <FormLabel>
        {label}
        {required && <Required />}
      </FormLabel>
      {children}
    </Box>
  )
}
