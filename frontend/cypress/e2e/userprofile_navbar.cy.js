/* eslint-disable no-undef */
describe('User Profile Navbar Navigation Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3001/userprofile/jane_doe');
    });
  
    it('should navigate to feeds page when Feed is clicked', () => {
      cy.contains('Feed').click();
      cy.url().should('include', 'http://localhost:3001/feeds');
    });

    it('should navigate to my profile when My Profile button is clicked', () => {
        cy.contains('My Profile').click();
        cy.url().should('include', 'http://localhost:3001/myprofile'); 
    });
    
    it('should log out and redirect to home page', () => {
      cy.contains('Logout').click();
      cy.url().should('include', 'http://localhost:3001/'); 
    });
  });
  