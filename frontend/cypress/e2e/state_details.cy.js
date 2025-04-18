/* eslint-disable no-undef */
describe('State Page Details Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3001/state/NY');
    });

    it("should display state itineraries", () => {
        cy.get("h1").should("contain", "New York Itineraries");
        cy.contains("A Weekend in NYC").should("be.visible");
        cy.contains("Upstate New York Escape").should("be.visible");
    });

    it('should show the "Follow" button by default', () => {
        cy.get('button').contains('Follow').should('exist');
      });
    
      it('should toggle follow/unfollow when clicked', () => {
        cy.get('button').contains('Follow').click();
        cy.get('button').should('contain', 'Unfollow');
    
        cy.get('button').contains('Unfollow').click();
        cy.get('button').should('contain', 'Follow');
      });

    it("should navigate to Create Post page", () => {
        cy.contains("Create Post").click();
        cy.url().should("include", "/post");
    });

    it("should navigate to different trending states", () => {
        cy.contains("California").click();
        cy.url().should("include", "/state/CA");
    });
});