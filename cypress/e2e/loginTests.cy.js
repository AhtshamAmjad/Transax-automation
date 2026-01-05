import loginTest from '../../Pages/Login';

describe('Login Tests', () => {
    beforeEach(() => {  
        cy.visit('https://dashboard.dev.transax.com/auth/login', { failOnStatusCode: false });
        // Wait until login page is truly ready
  cy.location('pathname', { timeout: 10000 }).should('include', '/auth/login');
    });
    
    it('#TC-01 - should login successfully', () => {
        const dev_username = Cypress.env('dev_username');
        const dev_password = Cypress.env('dev_password');
        
        // Verify environment variables are loaded
        expect(dev_username, 'Username should be defined').to.not.be.undefined;
        expect(dev_password, 'Password should be defined').to.not.be.undefined;
        
        loginTest.login(dev_username, dev_password);
    });

    it('#TC-02 - should show error message for invalid credentials', () => {
        const invalid_username = 'invalid@email.com';
        const invalid_password = 'WrongPassword123!';
        
        // Attempt to login with invalid credentials
        loginTest.loginWithInvalidCredentials(invalid_username, invalid_password);
        
        // Verify error message is displayed
        loginTest.assertErrorMessage();
        
        // Verify user is still on login page (not redirected to dashboard)
        cy.url().should('include', '/auth/login');
    });
});


