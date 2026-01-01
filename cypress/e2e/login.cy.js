

class login {

          //properties

          selector = {

            username : '#input-v-0-1',
            password : '#input-v-0-4',
            loginButton : '#__nuxt > div > main > div:nth-child(3) > form > button',
            
          }


//methods

login(username, password) {
    cy.get(this.selector.username).should('be.visible', {timeout: 10000}).type(username);
    cy.get(this.selector.password).type(password);
    cy.get(this.selector.loginButton).click();
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
    
}





}
const loginTest = new login();


export default loginTest;

// Export invalidLogin method
