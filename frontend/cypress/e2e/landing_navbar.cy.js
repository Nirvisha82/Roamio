/* eslint-disable no-undef */
describe('Landing Page Navbar Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001');
  });

  it('should display the navigation bar', () => {
    cy.get('nav').should('be.visible');
  });

  it('should contain navigation links', () => {
    cy.get('nav').within(() => {
      cy.contains('Join Us').should('be.visible');
      cy.contains('Our Features').should('be.visible');
      cy.contains('Our Team').should('be.visible');
    });
  });

  it('should navigate to Features section on click', () => {
    cy.contains('Our Features').click();
    cy.url().should('include', '#features');
  });
});
