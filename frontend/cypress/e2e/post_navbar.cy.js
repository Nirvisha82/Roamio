/* eslint-disable no-undef */
describe('Navbar Navigation Test', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3001/post');
    });
  
    it('should navigate to feeds when Home button is clicked', () => {
      cy.get('a').contains('Home').click();
      cy.url().should('include', 'http://localhost:3001/feeds'); // Adjust the URL based on routing
    });
  
    it('should navigate to my profile when My Profile button is clicked', () => {
      cy.get('a').contains('My Profile').click();
      cy.url().should('include', 'http://localhost:3001/myprofile'); // Adjust the URL based on routing
    });
  });
  