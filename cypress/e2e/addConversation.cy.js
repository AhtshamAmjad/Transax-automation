import AddConversationPage from '../../Pages/AddConversation';
import loginTest from '../../Pages/Login';
import { getConversationUser } from '../support/testData/conversation.Data';

beforeEach(() => {
    cy.visit('/auth/login', { failOnStatusCode: false });
    cy.wait(10000);
    loginTest.login(Cypress.env('dev_username'), Cypress.env('dev_password'));
});

describe('Add Conversation', () => {
  beforeEach(() => {
    // Wait for dashboard to be fully loaded
    cy.url().should('include', '/dashboard');
    cy.wait(10000); // Give the page time to render
  });

  //creates conversation with phone number
  it('creates conversation with phone number', () => {
    const user = getConversationUser();

    AddConversationPage.addConversation(
      user.firstName,
      user.lastName,
      undefined, // email not provided
      user.phone
    );

    AddConversationPage.assertModalClosed();

    AddConversationPage.assertConversationVisible(
      user.firstName,
      user.lastName
    );
  });

  //creates conversation with email
  it('creates conversation with email', () => {
    const user = getConversationUser();

    AddConversationPage.addConversation(
      user.firstName,
      user.lastName,
      user.email,
      undefined // phone not provided
    );

    AddConversationPage.assertModalClosed();

    AddConversationPage.assertConversationVisible(
      user.firstName,
      user.lastName
    );
  });

  //creates conversation with both phone number and email
  it('creates conversation with both phone number and email', () => {
    const user = getConversationUser();

    AddConversationPage.addConversation(
      user.firstName,
      user.lastName,
      user.email,
      user.phone
    );

    AddConversationPage.assertModalClosed();

    AddConversationPage.assertConversationVisible(
      user.firstName,
      user.lastName
    );
   


  });

  afterEach(() => {
    Cypress.session.clearAllSavedSessions();
  });

});
