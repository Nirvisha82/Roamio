/* eslint-disable no-undef */
describe('Form Submission Test', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3001/post');
    });
  
    it('should fill the form and submit it', () => {
      // Fill the itinerary title
      cy.get('input[placeholder="Itinerary Title"]').type('California Trip');
  
      // Fill the description
      cy.get('textarea[placeholder="Description"]').type('A 7-day road trip in California.');
  
      // Fill the number of days and nights
      cy.get('input[placeholder="Number of Days"]').type('7');
      cy.get('input[placeholder="Number of Nights"]').type('6');
  
      // Fill the group size and estimated budget
      cy.get('input[placeholder="Group Size"]').type('4');
      cy.get('input[placeholder="Estimated Budget"]').type('$1000');
  
      // Fill trip highlights and stay suggestions
      cy.get('textarea[placeholder="Trip Highlights (e.g., must-see spots, experiences)"]')
        .type('Golden Gate Bridge, Yosemite');
      cy.get('textarea[placeholder="Stay Suggestions (e.g., hotels, hostels, Airbnbs)"]')
        .type('Airbnb, Hotel California');

      cy.get('button[type="submit"]').click();
      cy.url().should('include', 'http://localhost:3001/feeds');
    });
  });
  