/* eslint-disable no-undef */
describe('Post Submission Test', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3001/post');
    });
  
    it('should fill the form and submit it', () => {
      cy.get('input#title').type('California Trip');
      cy.get('textarea#description').type('A 7-day road trip in California.');
      cy.get("[class*=control]", { timeout: 10000 })
      .should("be.visible")
      .click();
      cy.get("[class*=menu]", { timeout: 5000 })
      .should("be.visible")
      .contains("California (CA)")
      .click();
      cy.get('input#numdays').type('7');
      cy.get('input#numnights').type('6');
      cy.get('input#size').type('4');
      cy.get('input#budget').type('1000');
      cy.get('textarea#highlights').type('Golden Gate Bridge, Yosemite');
      cy.get('textarea#suggestions').type('Airbnb, Hotel California');
  
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/feeds');
    });
  });