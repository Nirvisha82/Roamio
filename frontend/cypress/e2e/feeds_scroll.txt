/* eslint-disable no-undef */
describe('Scroll Button Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3001/feeds'); // Ensure the app is running before each test
    });
  
    it('should display the scroll-to-top button when scrolled', () => {
      cy.scrollTo(0, 1000); // Scroll down to trigger the scroll button
      cy.get('button').contains('↑').should('be.visible');
    });
  
    it('should scroll back to the top when clicking the scroll-to-top button', () => {
      cy.scrollTo(0, 1000); // Scroll down to trigger the scroll button
      cy.get('button').contains('↑').click();
      cy.window().its('scrollY').should('equal', 0); // Verify that we are at the top
    });
  });
  