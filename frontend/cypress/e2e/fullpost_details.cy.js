/* eslint-disable no-undef */
describe('FullPost Page Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001/post/1');
  });

  it('should display the correct post title and content', () => {
    cy.get('h1').should('contain', 'Amazing Trip to Paris');
    cy.get('p').should('contain', 'Visited all the major attractions in Paris and had an unforgettable experience!');
  });

  it('should show the "Follow +" button by default', () => {
    cy.get('button').contains('Follow +').should('exist');
  });

  it('should toggle follow/unfollow when clicked', () => {
    cy.get('button').contains('Follow +').click();
    cy.get('button').should('contain', 'Unfollow -');

    cy.get('button').contains('Unfollow -').click();
    cy.get('button').should('contain', 'Follow +');
  });

  it('should allow adding a comment', () => {
    cy.get('textarea').type('This is a new comment!');
    cy.get('button').contains('Add Comment').click();
    cy.get('.p-3').should('contain', 'This is a new comment!');
  });

  it('should display images in the slider', () => {
    cy.get('.slick-slider').should('exist');
    cy.get('.slick-slide img').should('have.length.at.least', 1);
  });
});
