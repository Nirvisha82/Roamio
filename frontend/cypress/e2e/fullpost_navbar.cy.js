/* eslint-disable no-undef */
describe('FullPost Navigation Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3001/post/1');
    });

    it('should navigate to feeds page when Feed is clicked', () => {
      cy.contains('Feed').click();
      cy.url().should('include', 'http://localhost:3001/feeds');
    });

    it('should navigate to profile page when My Profile is clicked', () => {
      cy.contains('My Profile').click();
      cy.url().should('include', 'http://localhost:3001/myprofile');
    });

    it('should log out and redirect to home page', () => {
      cy.contains('Logout').click();
      cy.url().should('include', 'http://localhost:3001/'); 
    });
  });
  
  