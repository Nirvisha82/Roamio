/* eslint-disable no-undef */
describe('Feeds Navigation Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3001/feeds');
    });
  
    it('should navigate to My Profile page when clicking on My Profile link', () => {
      cy.contains('My Profile').click();
      cy.url().should('include', 'http://localhost:3001/myprofile'); 
    });

    it('should log out and redirect to home page', () => {
      cy.contains('Logout').click();
      cy.url().should('include', 'http://localhost:3001/'); 
    });
  });
  