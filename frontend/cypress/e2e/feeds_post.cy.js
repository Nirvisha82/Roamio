/* eslint-disable no-undef */
describe('Posts Display and Navigation Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3001/feeds');
    });

    it('should display the search and create post buttons', () => {
      cy.contains('Search your destination').should('be.visible');
      cy.contains('Create Post').should('be.visible');
    });
  
    it('should display itineraries correctly', () => {
      cy.contains('All Itineraries').should('be.visible');
      cy.contains('Trip to Love City Paris').should('be.visible');
      cy.contains('New York Adventure').should('be.visible');
      cy.contains('Texas Road Trip').should('be.visible');
    });
  
    it('should navigate to individual itinerary when clicked', () => {
      cy.contains('Trip to Love City Paris').click();
      cy.url().should('include', '/post/1'); 
    });
  
    it('should display the correct itinerary content', () => {
      cy.contains('Trip to Love City Paris').click();
      cy.contains('Amazing Trip to Paris').should('be.visible');
      cy.contains('Eiffel Tower, Louvre Museum').should('be.visible');
    });
});