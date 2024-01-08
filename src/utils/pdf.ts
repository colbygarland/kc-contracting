import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { Ticket } from '../api/ticket'

const COLORS = {
  black: rgb(0, 0, 0),
}

const FONT_SIZE = {
  title: 30,
  subTitle: 25,
  normal: 16,
  small: 12,
}

export const createPDF = async (
  tickets: Array<Ticket>,
  startDate: string,
  endDate: string,
) => {
  const pdfDoc = await PDFDocument.create()
  pdfDoc.setTitle(`Tickets from ${startDate} to ${endDate}`, {
    showInWindowTitleBar: true,
  })
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

  tickets.map(ticket => {
    const page = pdfDoc.addPage()
    const { width, height } = page.getSize()
    page.drawText(`Ticket #${ticket.ticketNumber}`, {
      x: 50,
      y: height - 4 * FONT_SIZE.title,
      size: FONT_SIZE.title,
      font: timesRomanFont,
      color: COLORS.black,
    })
  })

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}
