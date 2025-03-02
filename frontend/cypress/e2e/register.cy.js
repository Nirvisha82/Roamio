/* eslint-disable no-undef */
describe('Register Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001');
    cy.contains('Join Us').click();
  });

  it('should register a new user successfully', () => {
    cy.get('input[placeholder="Full Name"]').type('Test User');
    cy.get('input[placeholder="User Name"]').type('testuser');
    cy.get('input[placeholder="Email"]').type('testuser@example.com');
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('input[placeholder="Birthdate"]').type('1995-06-15');
    cy.get("[class*=control]", { timeout: 10000 }) // Looks for any class containing "control"
      .should("be.visible")
      .click();

    // Ensure menu appears and select city
    cy.get("[class*=menu]", { timeout: 5000 }) // Looks for dropdown menu
      .should("be.visible")
      .contains("East New York, NY") // Update with actual city format
      .click();

    // Verify city selection
    cy.get("[class*=singleValue]") // Looks for selected value
      .should("contain.text", "East New York");
    cy.contains('Register').click();

    cy.on('window:alert', (text) => {
      expect(text).to.contains('Registration successful!');
    });
  });
});
