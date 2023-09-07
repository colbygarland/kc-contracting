import { useUser } from './useUser'
import { mount } from 'cypress/react18'

const TestComponent = () => {
  const user = useUser()
  if (user) {
    return <div id="test">{user.email}</div>
  }
  return <div id="test">{user}</div>
}

describe('useUser', () => {
  it("returns null if there isn't a user stored", () => {
    mount(<TestComponent />)
    cy.get('#test').should('be.empty')
  })
  it('returns the user if there is one', () => {
    localStorage.setItem('user', '{"email":"test@example.com"}')
    mount(<TestComponent />)
    cy.get('#test').should('contain', 'test@example.com')
  })
})
