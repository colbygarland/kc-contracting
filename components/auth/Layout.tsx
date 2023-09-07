import { Box, Button, Container, Stack } from '@chakra-ui/react'
import { H1 } from '../Headings'
import { Loader } from '../Loader'

interface LayoutProps {
  title: string
  handleSubmit: any
  submitButtonText: string
  footerLink: React.ReactNode
  loading: boolean
  children: React.ReactNode
}
export const Layout = ({
  title,
  handleSubmit,
  submitButtonText,
  footerLink,
  loading,
  children,
}: LayoutProps) => {
  return (
    <Box className="bg-slate-50 min-h-screen">
      <Container className="max-w-md py-12">
        <Stack spacing="8">
          <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
            <H1>{title}</H1>
          </Stack>
          <Box className="bg-white p-12 rounded-2xl shadow-md">
            <form onSubmit={handleSubmit}>
              <Stack spacing="6">
                <Stack spacing="5">{children}</Stack>
                <Stack spacing="6">
                  <Button type="submit" colorScheme="blue">
                    {submitButtonText}
                  </Button>
                  <Box className="text-center">{footerLink}</Box>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Container>
      {loading && <Loader />}
    </Box>
  )
}
