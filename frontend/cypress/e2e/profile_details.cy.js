/* eslint-disable no-undef */
describe('Profile Details Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3001/myprofile');
    });

    it('should display user full name', () => {
        cy.get('p').contains('Full Name: John Doe');
    });

    it('should display user email', () => {
        cy.get('p').contains('Email: johndoe@example.com');
    });

    it('should display user username', () => {
        cy.get('p').contains('Username: johndoe123');
    });

    it('should display user location', () => {
        cy.get('p').contains('Location: New York, USA');
    });

    it('should display user bio', () => {
        cy.get('p').contains('Bio: Traveler | Photographer | Adventure Enthusiast');
    });

    it('should display itinerary titles and descriptions', () => {
        cy.get('.text-xl').should('contain', 'Exploring Paris');
        cy.get('p').should('contain', 'A 5-day trip to explore the beauty of Paris.');

        cy.get('.text-xl').should('contain', 'Japan Adventure');
        cy.get('p').should('contain', 'A 10-day cultural and food adventure in Japan.');
    });
});
