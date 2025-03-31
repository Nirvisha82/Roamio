/* eslint-disable no-undef */
describe('State Page Details Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3001/state/NY');
    });

    it("should display state itineraries", () => {
        cy.get("h1").should("contain", "New York Itineraries");
        cy.contains("NYC Adventure").should("be.visible");
        cy.contains("Best places in NYC").should("be.visible");
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