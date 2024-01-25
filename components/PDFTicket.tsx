import { Ticket } from '@/src/api/ticket'
import {
  Document,
  PDFViewer,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  normal: {
    fontSize: 12,
    marginBottom: 4,
  },
  biggerText: {
    fontSize: 16,
    marginBottom: 4,
  },
  section: {
    marginBottom: 10,
  },
})

const NormalText = ({ children }: { children: React.ReactNode }) => {
  return <Text style={styles.normal}>{children}</Text>
}

const BigText = ({ children }: { children: React.ReactNode }) => {
  return <Text style={styles.biggerText}>{children}</Text>
}

const Section = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.section}>{children}</View>
}

export function PDFTicket({ tickets }: { tickets: Array<Ticket> }) {
  return (
    <Document>
      {tickets.map(ticket => (
        <Page key={ticket.id} size="A4" style={styles.page}>
          <Section>
            <Text style={styles.title}>
              Kevin Crocker Contracting LTD. Time Slip
            </Text>
            <NormalText>PH: (780) 353-2616</NormalText>
            <NormalText>CELL: (780) 864-0916</NormalText>
            <NormalText>Box 122 Bonanza, Alberta T0H 0K0</NormalText>
          </Section>
          <Section>
            <BigText>Ticket #{ticket?.ticketNumber}</BigText>
            <NormalText>Name: {ticket?.name}</NormalText>
            <NormalText>Email: {ticket?.email}</NormalText>
            <NormalText>Date: {ticket?.ticketDate}</NormalText>
            <NormalText>Company: {ticket?.company}</NormalText>
            {ticket?.locations.map((location, index) => (
              <NormalText key={index}>
                {location.chargeType}: {location.location} for {location.hours}{' '}
                hours
              </NormalText>
            ))}
          </Section>
          <Section>
            <BigText>Equipment</BigText>
            {ticket?.equipment.map(equipment => (
              <NormalText key={equipment.id}>
                {equipment.name} for {equipment.hours} hours{' '}
                {equipment.attachment
                  ? `using ${equipment.attachment} attachment`
                  : ''}
              </NormalText>
            ))}
          </Section>
          <Section>
            <BigText>Truck Information</BigText>
            <NormalText>Truck: {ticket?.truck}</NormalText>
            <NormalText>Trailer: {ticket?.trailer}</NormalText>
          </Section>
          <Section>
            <BigText>Hours</BigText>
            <NormalText>Labour hours: {ticket?.labourHours}</NormalText>
            <NormalText>Travel hours: {ticket?.travelHours}</NormalText>
          </Section>
          <Section>
            <BigText>Ticket Description</BigText>
            <NormalText>{ticket?.description}</NormalText>
          </Section>
        </Page>
      ))}
    </Document>
  )
}
