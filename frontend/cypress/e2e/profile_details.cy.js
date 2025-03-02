/* eslint-disable no-undef */
describe('Profile Details Test', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3001/myprofile');
    });

    it('should display user name', () => {
        cy.get('p').contains('Name: John Doe');
    });

    it('should display user email', () => {
        cy.get('p').contains('Email: johndoe@example.com');
    });

    it('should display user location', () => {
        cy.get('p').contains('Location: New York, USA');
    });

    it('should display user bio', () => {
        cy.get('p').contains('Bio: Wanderlust traveler and adventure seeker');
    });

    it('should display itinerary titles and descriptions', () => {
        cy.get('.text-xl').should('contain', 'Exploring California');
        cy.get('p').should('contain', 'A 5-day road trip covering San Francisco, LA, and Yosemite.');

        cy.get('.text-xl').should('contain', 'Magical Paris');
        cy.get('p').should('contain', 'A romantic getaway exploring the Eiffel Tower, Louvre, and more.');
    });
});
