

class login {

          //properties

          selector = {

            username : 'input[type="text"',

            password : 'input[type="password"',

            loginButton : '#__nuxt > div > main > div:nth-child(3) > form > button',
            
            errorMessage : '[data-testid="login-error-message"]',
            
          }


//methods

login(dev_username, dev_password) {
    cy.get(this.selector.username).should('be.visible', {timeout: 10000}).type(dev_username);
    cy.get(this.selector.password).type(dev_password);
    cy.get(this.selector.loginButton).click();
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
}

// Method to test invalid login credentials
loginWithInvalidCredentials(invalid_username, invalid_password) {
    cy.get(this.selector.username).should('be.visible', {timeout: 10000}).clear().type(invalid_username);
    cy.get(this.selector.password).clear().type(invalid_password);
    cy.get(this.selector.loginButton).click();
}

// Method to assert error message for invalid credentials
assertErrorMessage() {
    cy.get(this.selector.errorMessage)
        .should('be.visible', { timeout: 10000 })
        .should('contain', 'The provided credentials do not match our records.');
}





}
const loginTest = new login();


export default loginTest;

// Export invalidLogin method
