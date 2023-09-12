import { mount } from 'cypress/react18'
import DailyTimeTicket from '../../pages/daily-time-ticket'

describe('daily time ticket', () => {
  it('can create a ticket', () => {
    mount(<DailyTimeTicket />)
    // todo: mock out api call, fill in inputs and submit
  })
})
