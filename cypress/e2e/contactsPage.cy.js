import ContactsPage from '../../Pages/ContactsPage';
import loginTest from '../../Pages/Login';  
import { getConversationUser } from '../support/testData/conversation.Data';

beforeEach(() => {
    cy.visit('/auth/login', { failOnStatusCode: false });
    cy.wait(10000);
    loginTest.login(Cypress.env('dev_username'), Cypress.env('dev_password'));
    
});

describe('Contacts Page', () => {
    beforeEach(() => {
        cy.url().should('include', '/dashboard');
        cy.wait(10000);
        cy.visit('https://dashboard.dev.transax.com/contacts', {failOnStatusCode: false});
        cy.wait(10000);
    });

    it('should add a contact', () => {
        const user = getConversationUser();
        ContactsPage.addContact(user.firstName, user.lastName, user.email, user.phone, 'Chicago');
        //ContactsPage.assertContactAdded(user.firstName, user.lastName);
        //ContactsPage.assertContactModalClosed();
    });

    it('should update a contact', () => {
        // Wait for contact list to load
        cy.get('#__nuxt > div.v-layout.layout > main > div > div > div.container > div.content > div.v-table.v-table--has-top.v-table--has-bottom.v-theme--transaxLightTheme.v-table--density-default.v-data-table.elevation-0').should('be.visible', { timeout: 10000 });
        
        // Generate new name for the update
        const updatedUser = getConversationUser();
        
        // Update the contact with new first and last name
        ContactsPage.updateContact(updatedUser.firstName, updatedUser.lastName);
        
        // Verify the contact was updated
        ContactsPage.assertContactUpdated(updatedUser.firstName, updatedUser.lastName);
    });

    it('should search for a contact', () => {
        // First, create a contact to search for
        const user = getConversationUser();
        ContactsPage.addContact(user.firstName, user.lastName, user.email, user.phone, 'Chicago');
        
        // Wait for the modal to close and contact list to be visible
        cy.get('#__nuxt > div.v-layout.layout > main > div > div > div.container > div.content > div.v-table.v-table--has-top.v-table--has-bottom.v-theme--transaxLightTheme.v-table--density-default.v-data-table.elevation-0').should('be.visible', { timeout: 10000 });
        cy.wait(2000); // Wait for the new contact to appear in the list
        
        // Search for the contact by first name
        ContactsPage.searchContact(user.firstName);
        
        // Verify the contact is found in search results
        ContactsPage.assertContactFound(user.firstName, user.lastName);
        
        // Clear search and search by last name
        ContactsPage.searchContact(user.lastName);
        
        // Verify the contact is still found
        ContactsPage.assertContactFound(user.firstName, user.lastName);
        
        // Test searching by full name
        ContactsPage.searchContact(`${user.firstName} ${user.lastName}`);
        
        // Verify the contact is found
        ContactsPage.assertContactFound(user.firstName, user.lastName);
    });

    it('should archive a contact', () => {
        // First, create a contact to archive
        const user = getConversationUser();
        ContactsPage.addContact(user.firstName, user.lastName, user.email, user.phone, 'Chicago');
        
        // Wait for the modal to close and contact list to be visible
        cy.get('#__nuxt > div.v-layout.layout > main > div > div > div.container > div.content > div.v-table.v-table--has-top.v-table--has-bottom.v-theme--transaxLightTheme.v-table--density-default.v-data-table.elevation-0').should('be.visible', { timeout: 10000 });
        cy.wait(10000); // Wait for the new contact to appear in the list
        
        // Archive the contact
        ContactsPage.archiveContact();
        
        // Verify the contact list is still visible (modal closed)
        cy.get('#__nuxt > div.v-layout.layout > main > div > div > div.container > div.content > div.v-table.v-table--has-top.v-table--has-bottom.v-theme--transaxLightTheme.v-table--density-default.v-data-table.elevation-0').should('be.visible', { timeout: 10000 });
    });

    it('should navigate to archived section and verify archived contact', () => {
        // Navigate to the Archived section
        ContactsPage.navigateToArchivedSection();
        
        // Wait for archived contact list to be visible
        cy.get('.v-data-table.elevation-0').should('be.visible', { timeout: 10000 });
        cy.wait(2000); // Wait for list to fully load
        
        // Get the first archived contact name from the list
        let contactFullName = '';
        cy.get('.v-data-table__tbody tr').first().should('be.visible').within(() => {
            cy.get('td').first().invoke('text').then((contactName) => {
                contactFullName = contactName.trim();
            });
        });
        
        // Wait a moment for the name to be captured, then search and verify
        cy.then(() => {
            const nameParts = contactFullName.split(/\s+/);
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            // Try to use search field if it exists
            cy.get('body').then(($body) => {
                const searchField = $body.find('input[placeholder="Search contact"], input[placeholder*="Search"], input[placeholder*="search"]');
                if (searchField.length > 0 && searchField.is(':visible')) {
                    // Search field exists and is visible, use it to search
                    ContactsPage.searchContact(firstName);
                }
            });
            
            // Verify the archived contact is visible in the archived list
            if (lastName) {
                ContactsPage.assertContactArchived(firstName, lastName);
            } else {
                // If only one name, just verify it's visible
                cy.contains(contactFullName, { timeout: 10000 }).should('be.visible');
            }
        });
    });
});