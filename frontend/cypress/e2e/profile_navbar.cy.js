/* eslint-disable no-undef */
describe('Navbar Navigation Test', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3001/myprofile');
    });
  
    it('should navigate to feeds page when "Home" is clicked', () => {
      cy.get('a').contains('Home').click();
      cy.url().should('include', 'http://localhost:3001/feeds');
    });
  });
  