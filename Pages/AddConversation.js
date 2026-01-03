
  
  class AddConversationPage {

    selector = {

      addConversationButton : 'button.v-btn.add-conversation-btn',
      FirstName : 'body > div.v-overlay-container > div.v-overlay.v-overlay--active.v-theme--transaxLightTheme.v-locale--is-ltr.v-dialog > div.v-overlay__content > div > div.dialog-content.overflow-y-auto.overflow-x-hidden.flex-1-1.pr-2 > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div > div.v-input__control > div > div.v-field__field > div',
      LastName : 'body > div.v-overlay-container > div.v-overlay.v-overlay--active.v-theme--transaxLightTheme.v-locale--is-ltr.v-dialog > div.v-overlay__content > div > div.dialog-content.overflow-y-auto.overflow-x-hidden.flex-1-1.pr-2 > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div > div.v-input__control > div > div.v-field__field > div',
      Email : 'input[placeholder="email@email.com"]',
      Phone : 'input[placeholder="(111) 111-1111"]',
      AddButton: '.dialog-footer button.bg-primary .v-btn__content',
      CancelButton : '.dialog-footer button.text-primary',
      addConversationModal : 'body > div.v-overlay-container > div.v-overlay.v-overlay--active.v-theme--transaxLightTheme.v-locale--is-ltr.v-dialog > div.v-overlay__content > div',
      

    }

    //waitForModal() {
        //cy.click ('button.v-btn.add-conversation-btn')
        //cy.get('body > div.v-overlay-container > div.v-overlay.v-overlay--active.v-theme--transaxLightTheme.v-locale--is-ltr.v-dialog > div.v-overlay__content > div', { timeout: 10000 }).should('be.visible');
      //}
    
      addConversation(firstName, lastName, email, phone) {
        // Wait for the page to load and the button to be visible
        cy.get(this.selector.addConversationButton, { timeout: 10000 }).should('be.visible');
        cy.get(this.selector.addConversationButton).click();
        cy.get(this.selector.addConversationModal, { timeout: 10000 }).should('be.visible');
        cy.get(this.selector.FirstName).should('be.visible' ,{timeout: 10000}).clear().type(firstName);
        cy.get(this.selector.LastName).should('be.visible' ,{timeout: 10000}).clear().type(lastName).type('{esc}');
        
        // Handle phone number if provided
        if (phone) {
          // Type phone number - extract digits only in case field auto-formats
          const digitsOnly = phone.replace(/\D/g, '');
          cy.get(this.selector.Phone).should('be.visible' ,{timeout: 15000}).clear();
          // Type digits only - let the input field format it
          cy.get(this.selector.Phone).type(digitsOnly, { delay: 30 });
          // Wait for validation to complete
          cy.wait(1000);
          // Verify the field has the formatted value
          cy.get(this.selector.Phone).should('have.value', phone);
        }
        
        // Handle email if provided
        if (email) {
          cy.get(this.selector.Email).should('be.visible' ,{timeout: 10000}).clear().type(email);
        }
    
        cy.get(this.selector.AddButton)
          .should('not.be.disabled')
          .click();
      }
    
      assertModalClosed() {
        cy.get('body > div.v-overlay-container > div.v-overlay.v-overlay--active.v-theme--transaxLightTheme.v-locale--is-ltr.v-dialog > div.v-overlay__content > div').should('not.exist');
      }
    
      assertConversationVisible(firstName, lastName) {
        cy.contains(`${firstName} ${lastName}`, { timeout: 10000 })
          .should('be.visible');
      }
    }
    
    export default new AddConversationPage();