import loginTest from './login.cy';

describe('Login Tests', () => {
    beforeEach(() => {  
        cy.visit('https://dashboard.dev.transax.com/auth/login', { failOnStatusCode: false });
    });
    
    it('should login successfully', () => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        
        // Verify environment variables are loaded
        expect(username, 'Username should be defined').to.not.be.undefined;
        expect(password, 'Password should be defined').to.not.be.undefined;
        
        loginTest.login(username, password);
    });

   
});


