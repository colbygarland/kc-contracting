import { H1 } from '@/components/Headings'
import { FormGroup } from '@/components/forms/FormGroup'
import { Label } from '@/components/forms/Label'
import { Required } from '@/components/forms/Required'
import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react'

const user = {
  name: 'Cosmo Kramer',
  id: 12323,
}

export default function Home() {
  return (
    <Container className="py-6">
      <Box className="mb-6">
        <H1>Daily Time Ticket</H1>
        <Text>
          <Required /> indicates required fields.
        </Text>
      </Box>
      <form>
        <FormGroup label="Name">
          <Input type="text" name="name" value={user.name} readOnly />
        </FormGroup>
        <FormGroup label="Date" required>
          <Input type="date" name="date" required />
        </FormGroup>
        <FormGroup label="Location" required>
          <Input type="text" name="location" required />
        </FormGroup>
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          <FormGroup label="Job No.">
            <Input type="number" name="job_number" />
          </FormGroup>
          <FormGroup label="Equip No.">
            <Input type="number" name="equipment_number" />
          </FormGroup>
          <FormGroup label="Truck No.">
            <Input type="number" name="truck_number" />
          </FormGroup>
        </Grid>
        <FormGroup label="Equipment Used">
          <Input type="text" name="equipment_used" />
        </FormGroup>
        <FormGroup label="Description">
          <Textarea name="description" />
        </FormGroup>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <FormGroup label="Hours Worked" required>
            <Input type="number" name="hours_worked" required />
          </FormGroup>
          <FormGroup label="Travel Hours">
            <Input type="number" name="travel_hours" />
          </FormGroup>
          <Button colorScheme="blue" type="submit">
            Submit Ticket
          </Button>
        </Grid>
      </form>
    </Container>
  )
}
