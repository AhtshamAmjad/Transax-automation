import loginTest from './login.cy';


describe('Login Tests', () => {
    beforeEach(() => {  
        cy.visit('https://dashboard.dev.transax.com/auth/login', { 
            failOnStatusCode: false 
        });
    });
    
    it('should login successfully', () => {
        loginTest.login('jacksmith4@transax.com', 'Qatest111!');
    });

    it('should show error message for invalid login credentials', () => {
        loginTest.invalidLogin('invaliduser', 'invalidpass');
    });
});


