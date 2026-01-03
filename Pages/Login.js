

class login {

          //properties

          selector = {

            username : 'input[type="text"',

            password : 'input[type="password"',

            loginButton : '#__nuxt > div > main > div:nth-child(3) > form > button',
            
          }


//methods

login(dev_username, dev_password) {
    cy.get(this.selector.username).should('be.visible', {timeout: 10000}).type(dev_username);
    cy.get(this.selector.password).type(dev_password);
    cy.get(this.selector.loginButton).click();
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
    
}





}
const loginTest = new login();


export default loginTest;

// Export invalidLogin method
