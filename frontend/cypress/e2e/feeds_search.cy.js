/* eslint-disable no-undef */
describe('Feed Search and Trending States Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3001/feeds');
    });
    
    it('should navigate to Create Post page when clicking on Create Post button', () => {
      cy.contains('button', 'Create Post').click();
      cy.url().should('include', '/post'); 
    });
  
    it('should navigate to selected state page when searching for a state', () => {
      cy.get("[class*=control]", { timeout: 10000 })
      .should("be.visible")
      .click();
      cy.get("[class*=menu]", { timeout: 5000 })
      .should("be.visible")
      .contains("New York")
      .click();
      cy.contains('button', 'Search').click();
      cy.url().should('include', '/state/NY');
    });

    it('should navigate to state itinerary post when clicking trending states', () => {
        cy.contains('95 followers').click();
        cy.url().should('include', '/state/NY');
      });
  });
  