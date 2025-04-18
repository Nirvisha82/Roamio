/* eslint-disable no-undef */
describe('Profile Details Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3001/userprofile/jane_doe');
    });

    it('should display user full name', () => {
        cy.get('p').contains('Full Name: Jane Doe');
    });

    it('should display user email', () => {
        cy.get('p').contains('Email: jane@example.com');
    });

    it('should display user username', () => {
        cy.get('p').contains('Username: jane_doe');
    });

    it('should display user location', () => {
        cy.get('p').contains('Location: Los Angeles, USA');
    });

    it('should show correct followers count and open followers list', () => {
        cy.contains('Followers').click();
        cy.get('div').contains('Followers');
        cy.get('div').contains('jane_doe');
    });

    it('should show correct following count and open following list', () => {
        cy.contains('Following').click();
        cy.get('div').contains('Following');
        cy.get('div').contains('travelpage');
    });

    it('should navigate when clicking on follower username', () => {
        cy.contains('Followers').click();
        cy.get('div').contains('jane_doe').click();
        cy.url().should('include', '/userprofile/jane_doe');
    });

    it('should navigate when clicking on following page', () => {
        cy.contains('Following').click();
        cy.get('div').contains('travelpage').click();
        cy.url().should('include', '/state/NY');
    });

    it('should toggle follow/unfollow button', () => {
        cy.get('button').contains('Unfollow -').click();
        cy.get('button').contains('Follow +').should('exist');

        cy.get('button').contains('Follow +').click();
        cy.get('button').contains('Unfollow -').should('exist');
    });
    
    it('should display itinerary titles and descriptions', () => {
        cy.get('.text-xl').should('contain', 'A Weekend in NYC');
        cy.get('p').should('contain', 'Explore Times Square, Central Park, and Broadway!');
    });
});
