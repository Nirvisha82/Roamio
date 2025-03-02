/* eslint-disable no-undef */
describe('Posts Display and Navigation', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3001/feeds'); // Ensure the app is running before each test
    });
  
    it('should display the posts section', () => {
      cy.contains('Filters').should('be.visible');
      cy.contains('Create Post').should('be.visible');
      cy.contains('Post 1').should('be.visible');
      cy.contains('Post 2').should('be.visible');
    });
  
    it('should navigate to individual post page when clicking on a post', () => {
      cy.contains('Post 1').click();
      cy.url().should('include', '/post/1'); // Check if URL changes to the post ID
    });
  
    it('should display post content correctly', () => {
      cy.contains('Post 1').click();
      cy.contains('Post 1').should('be.visible');
    });
  });
  