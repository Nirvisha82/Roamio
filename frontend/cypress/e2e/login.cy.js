/* eslint-disable no-undef */
describe('Roamio Login Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001'); // Update with your app URL if different
  });

  it('should switch to login form when clicking "Login" button', () => {
    cy.contains('Login').click();
    cy.get('h3').should('contain', 'Login');
  });

  it('should login successfully with valid credentials', () => {
    cy.contains('Login').click();
    cy.get('input[placeholder="Email"]').type('testuser@example.com');
    cy.get('input[placeholder="Password"]').type('Test@1234');
    cy.get('#login-button').click();

    // Verify successful login (adjust based on actual behavior)
    cy.url().should('include', '/feeds');
    cy.contains('Filters').should('be.visible');
  });
});
