import loginTest from '../../Pages/Login';

describe('Login Tests', () => {
    beforeEach(() => {  
        cy.visit('https://dashboard.dev.transax.com/auth/login', { failOnStatusCode: false });
        // Wait until login page is truly ready
  cy.location('pathname', { timeout: 10000 }).should('include', '/auth/login');
    });
    
    it('should login successfully', () => {
        const dev_username = Cypress.env('dev_username');
        const dev_password = Cypress.env('dev_password');
        
        // Verify environment variables are loaded
        expect(dev_username, 'Username should be defined').to.not.be.undefined;
        expect(dev_password, 'Password should be defined').to.not.be.undefined;
        
        loginTest.login(dev_username, dev_password);
    });
});


