/* eslint-disable no-undef */
describe('Profile Details Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3001/myprofile');
    });

    it('should display user full name', () => {
        cy.get('p').contains('Full Name: John Doe');
    });

    it('should display user email', () => {
        cy.get('p').contains('Email: john.doe@example.com');
    });

    it('should display user username', () => {
        cy.get('p').contains('Username: john_doe');
    });

    it('should display user location', () => {
        cy.get('p').contains('Location: New York, USA');
    });

    it('should display user bio', () => {
        cy.get('p').contains('Bio: Traveler. Explorer. Photographer.');
    });

    it('should display followers count and list', () => {
        cy.contains('Followers').click();
        cy.get('.absolute').should('contain', 'Followers');
        cy.get('.absolute').should('contain', 'john_doe');
        cy.get('.absolute').should('contain', 'jane_doe');
    });

    it('should display followings count and list', () => {
        cy.contains('Following').click();
        cy.get('.absolute').should('contain', 'Following');
        cy.get('.absolute').should('contain', 'john_doe');
        cy.get('.absolute').should('contain', 'jane_doe');
        cy.get('.absolute').should('contain', 'New York');
    });

    it('should unfollow a user from the following list', () => {
        cy.contains('Following').click();
        cy.get('.absolute')
            .contains('jane_doe')
            .parent()
            .parent()
            .within(() => {
                cy.contains('Unfollow').click();
            });
        cy.contains('Following').click();
        cy.get('.absolute').should('not.contain', 'jane_doe');
    });

    it('should display itinerary titles and descriptions', () => {
        cy.get('.text-xl').should('contain', 'Trip to Italy');
        cy.get('p').should('contain', 'Exploring the best of Italy in 10 days.');
    });
});
