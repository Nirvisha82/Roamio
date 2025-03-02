/* eslint-disable no-undef */
describe('FullPost Page Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3001/post/1');
    });

    it('should navigate to feeds page when "Home" is clicked', () => {
      cy.get('a').contains('Home').click();
      cy.url().should('include', 'http://localhost:3001/feeds');
    });

    it('should navigate to profile page when "My Profile" is clicked', () => {
      cy.get('a').contains('My Profile').click();
      cy.url().should('include', 'http://localhost:3001/myprofile');
    });
  });
  
  