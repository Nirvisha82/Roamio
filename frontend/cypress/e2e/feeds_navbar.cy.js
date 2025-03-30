/* eslint-disable no-undef */
describe('Navigation Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3001/feeds');
    });
  
    it('should navigate to My Profile page when clicking on My Profile link', () => {
      cy.contains('My Profile').click();
      cy.url().should('include', 'http://localhost:3001/myprofile'); 
    });
  
    it('should navigate to Create Post page when clicking on Create Post button', () => {
      cy.contains('Create Post').click();
      cy.url().should('include', 'http://localhost:3001/post'); 
    });
  });
  