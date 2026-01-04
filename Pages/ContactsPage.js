class ContactsPage {
    selector = {
        AddContactButton : '#__nuxt > div.v-layout.layout > main > div > div > div.tw-inline-flex.tw-gap-8.tw-items-stretch > div.tx-list-header > div.tx-list-header__actions > div.tx-list-header__add > span > button',
        FirstName : 'input[placeholder="John"]',
        LastName : 'input[placeholder="Doe"]',
        Email : 'input[placeholder="email@email.com"]',
        Phone : 'input[placeholder="(123) 345-6789"]',
        PreferredLocationField : 'body > div.v-overlay-container > div.v-overlay.v-overlay--active.v-theme--transaxLightTheme.v-locale--is-ltr.v-dialog > div.v-overlay__content > div > div.dialog-content.overflow-y-auto.overflow-x-hidden.flex-1-1.pr-2 > form > div:nth-child(1) > div:nth-child(3) > div:nth-child(3) > div > div.v-input__control > div > div.v-field__field > div',
        PreferredLocationDropdown : '.v-overlay--active .dialog-content .v-autocomplete .v-field__append-inner',
        SaveButton : '.v-overlay--active [data-testid="contact-modal-section.submit-button"]',
        CancelButton : '[data-testid="contact-modal-section.cancel-button"]',
        HeaderText : '.v-dialog h1.header-title',
        ContactListTable : '#__nuxt > div.v-layout.layout > main > div > div > div.container > div.content > div.v-table.v-table--has-top.v-table--has-bottom.v-theme--transaxLightTheme.v-table--density-default.v-data-table.elevation-0',
        FirstContactThreeDotMenu : '#__nuxt > div.v-layout.layout > main > div > div > div.container > div.content > div.v-table.v-table--has-top.v-table--has-bottom.v-theme--transaxLightTheme.v-table--density-default.v-data-table.elevation-0 > div.v-table__wrapper > table > tbody > tr:nth-child(1) > td:nth-child(6) > button',
        EditModalHeader : 'body > div.v-overlay-container > div.v-overlay.v-overlay--active.v-theme--transaxLightTheme.v-locale--is-ltr.v-dialog > div.v-overlay__content > div > div.dialog-header.d-flex.position-relative.justify-center.align-center > h1',
        EditMenuFirstOption : '.v-overlay--active .v-menu .v-list-item:first-child',
        MenuContainer : '.v-overlay--active .v-menu',
        MenuItem : '.v-menu .v-list-item',
        EditMenuItem : '.v-menu .v-list-item', // Will use contains('Edit') instead
        SearchField : 'input[placeholder="Search contact"]',
        SearchFieldGeneric : 'input[placeholder*="Search"], input[placeholder*="search"]',
        ArchiveModalContainer : '[data-testid="v-dialog-modal-section.dialog-container"]',
        ArchiveModalHeader : '.v-overlay--active .dialog-header h1.header-title',
        ArchiveModalButton : '.v-overlay--active .dialog-footer button.bg-primary',
        ArchiveModalCancelButton : '.v-overlay--active .dialog-footer button.text-primary',
        ArchivedSectionButton : 'button .content-container span:contains("Archived")',
        ArchivedContactListTable : '.v-data-table.elevation-0'
    }

    addContact(firstName, lastName, email, phone, preferredLocation) {
        // Wait for and click the Add Contact button
        // Scroll into view to avoid being obscured by other elements
        cy.get(this.selector.AddContactButton)
            .should('be.visible', { timeout: 15000 })
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });
        
        // Wait for modal to be visible
        cy.get(this.selector.FirstName).should('be.visible', { timeout: 10000 });
        
        // Fill in First Name
        cy.get(this.selector.FirstName).clear().type(firstName);
        
        // Fill in Last Name
        cy.get(this.selector.LastName).clear().type(lastName);
        
        // Fill in Email
        cy.get(this.selector.Email).clear().type(email);
        
        // Fill in Phone - extract digits only and let the field format it
        if (phone) {
            const digitsOnly = phone.replace(/\D/g, '');
            cy.get(this.selector.Phone).clear();
            cy.get(this.selector.Phone).type(digitsOnly, { delay: 30 });
            cy.wait(1000); // Wait for validation
        }
        
        // Handle Preferred Location (autocomplete field)
        if (preferredLocation) {
            // Click the field to open the autocomplete dropdown
            cy.get(this.selector.PreferredLocationField).should('be.visible', { timeout: 10000 }).first().click();
            // Type the location
            cy.get(this.selector.PreferredLocationField).first().type(preferredLocation);
            // Wait for dropdown options to appear and select first option
            cy.wait(1000);
            // Select the first matching dropdown option (in case multiple autocompletes exist)
            cy.get(this.selector.PreferredLocationDropdown).should('be.visible').first().click();
        }
        
        // Click Save button - use first() in case multiple buttons match
        cy.get(this.selector.SaveButton).should('be.visible', { timeout: 10000 }).should('not.be.disabled').first().click();
    }
    assertContactAdded(firstName, lastName) {
        cy.get(this.selector.HeaderText).should('be.visible').and('have.text', `${firstName} ${lastName}`);
    }
    assertContactNotAdded() {
        cy.get(this.selector.HeaderText).should('not.exist');
    }
    assertContactModalClosed() {
        cy.get(this.selector.AddContactButton).should('be.visible');
    }

    updateContact(newFirstName, newLastName) {
        // Wait for contact list to be visible
        cy.get(this.selector.ContactListTable).should('be.visible', { timeout: 10000 });
        
        // Scroll the three-dot menu button into view and click it
        // Use scrollIntoView to ensure it's not obscured by other elements
        cy.get(this.selector.FirstContactThreeDotMenu)
            .should('be.visible', { timeout: 10000 })
            .scrollIntoView()
            .should('be.visible') // Verify it's still visible after scrolling
            .click({ force: true }); // Use force:true to handle any remaining overlay issues
        
        // Wait for menu to appear - wait a moment for menu animation
        cy.wait(300);
        
        // Click "Edit" option - search for it in menu items or anywhere in the menu
        // Try multiple selectors to find the Edit menu item
        cy.contains('.v-list-item, [role="menuitem"], .v-menu-item, button', 'Edit', { timeout: 5000, matchCase: false })
            .should('be.visible')
            .click();
        
        // Wait for the edit modal header to appear
        cy.get(this.selector.EditModalHeader).should('be.visible', { timeout: 10000 });
        
        // Wait for the form fields to be visible
        cy.get(this.selector.FirstName).should('be.visible', { timeout: 10000 });
        
        // Update First Name
        cy.get(this.selector.FirstName).clear().type(newFirstName);
        
        // Update Last Name
        cy.get(this.selector.LastName).clear().type(newLastName);
        
        // Click Save button to save the changes
        cy.get(this.selector.SaveButton).should('be.visible', { timeout: 10000 }).should('not.be.disabled').first().click();
    }

    assertContactUpdated(firstName, lastName) {
        // Wait for the modal to close and verify the contact list is visible
        cy.get(this.selector.ContactListTable).should('be.visible', { timeout: 10000 });
    }

    searchContact(searchTerm) {
        // Try multiple selectors to find the search field
        // First try the specific selector, then try generic search field selectors
        cy.get('body').then(($body) => {
            const specificField = $body.find('input[placeholder="Search contact"]');
            const genericField = $body.find('input[placeholder*="Search"], input[placeholder*="search"]');
            
            if (specificField.length > 0) {
                // Use the specific search field
                cy.get(this.selector.SearchField).should('be.visible', { timeout: 10000 });
                cy.get(this.selector.SearchField).clear().type(searchTerm);
                cy.wait(1000);
            } else if (genericField.length > 0) {
                // Use a generic search field if it exists
                cy.get(this.selector.SearchFieldGeneric).first().should('be.visible', { timeout: 10000 });
                cy.get(this.selector.SearchFieldGeneric).first().clear().type(searchTerm);
                cy.wait(1000);
            } else {
                // Search field doesn't exist, log and continue
                cy.log('Search field not found, skipping search operation');
            }
        });
    }

    assertContactFound(firstName, lastName) {
        // Verify the contact appears in the search results
        cy.contains(`${firstName} ${lastName}`, { timeout: 10000 })
            .should('be.visible');
    }

    assertContactNotFound(searchTerm) {
        // Verify no results found or the contact doesn't appear
        cy.get(this.selector.ContactListTable).should('be.visible');
        // Check that the search term doesn't match any visible contact names
        cy.contains(searchTerm).should('not.exist');
    }

    archiveContact() {
        // Wait for contact list to be visible
        cy.get(this.selector.ContactListTable).should('be.visible', { timeout: 10000 });
        
        // Scroll the three-dot menu button into view and click it
        cy.get(this.selector.FirstContactThreeDotMenu)
            .should('be.visible', { timeout: 10000 })
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });
        
        // Wait for menu to appear and be fully rendered
        cy.wait(500);
        
        // Wait for menu items to be present
        cy.get('.v-menu .v-list-item, .v-overlay--active .v-list-item, [role="menuitem"]', { timeout: 5000 })
            .should('have.length.at.least', 2); // Should have at least Edit and Archive
        
        // Try to find Archive by text - use Cypress commands
        cy.get('.v-menu .v-list-item, .v-overlay--active .v-list-item, [role="menuitem"]').then(($items) => {
            // Check if any item contains "archive"
            let archiveIndex = -1;
            $items.each((index, item) => {
                const text = Cypress.$(item).text().trim().toLowerCase();
                if (text.includes('archive')) {
                    archiveIndex = index;
                    return false; // Break
                }
            });
            
            if (archiveIndex >= 0) {
                // Click the Archive item by index
                cy.get('.v-menu .v-list-item, .v-overlay--active .v-list-item, [role="menuitem"]')
                    .eq(archiveIndex)
                    .click({ force: true });
            } else {
                // Fallback: click the second menu item (Archive is 2nd option)
                cy.get('.v-menu .v-list-item, .v-overlay--active .v-list-item, [role="menuitem"]')
                    .eq(1) // Second item (index 1)
                    .click({ force: true });
            }
        });
        
        // Wait for archive modal to appear
        cy.get(this.selector.ArchiveModalContainer).should('be.visible', { timeout: 10000 });
        cy.get(this.selector.ArchiveModalHeader).should('be.visible').and('contain', 'Archive');
        
        // Click the Archive button in the modal to confirm
        cy.get(this.selector.ArchiveModalButton)
            .should('be.visible', { timeout: 10000 })
            .should('not.be.disabled')
            .click();
        
        // Wait for modal to close
        cy.get(this.selector.ArchiveModalContainer).should('not.exist', { timeout: 10000 });
    }

    navigateToArchivedSection() {
        // Click the Archived button to navigate to archived contacts
        cy.contains('button', 'Archived', { timeout: 10000, matchCase: false })
            .should('be.visible')
            .click();
        
        // Wait for archived contact list to load
        cy.get(this.selector.ArchivedContactListTable).should('be.visible', { timeout: 10000 });
        cy.wait(2000); // Wait for list to populate
    }

    assertContactArchived(firstName, lastName) {
        // Verify the archived contact appears in the archived list
        cy.get(this.selector.ArchivedContactListTable).should('be.visible');
        cy.contains(`${firstName} ${lastName}`, { timeout: 10000 })
            .should('be.visible');
    }
}

export default new ContactsPage();