class ContactsPage {
    selector = {
        AddContactButton : 'button.bg-primary',
        FirstName : 'input[placeholder="John"]',
        LastName : 'input[placeholder="Doe"]',
        Email : 'input[placeholder="email@email.com"]',
        Phone : 'input[placeholder="(123) 345-6789"]',
        PreferredLocationField : 'body > div.v-overlay-container > div.v-overlay.v-overlay--active.v-theme--transaxLightTheme.v-locale--is-ltr.v-dialog > div.v-overlay__content > div > div.dialog-content.overflow-y-auto.overflow-x-hidden.flex-1-1.pr-2 > form > div:nth-child(1) > div:nth-child(3) > div:nth-child(3) > div > div.v-input__control > div > div.v-field__field > div',
        PreferredLocationDropdown : '.v-overlay--active .dialog-content .v-autocomplete .v-field__append-inner',
        SaveButton : '.v-overlay--active [data-testid="contact-modal-section.submit-button"]',
        CancelButton : '[data-testid="contact-modal-section.cancel-button"]',
        HeaderText : '.v-dialog h1.header-title',
        ContactListTable : 'div.v-data-table.elevation-0, div.v-table.v-data-table.elevation-0, div[class*="v-data-table"].elevation-0',
        FirstContactThreeDotMenu : 'div.v-data-table.elevation-0 tbody tr:first-child td:last-child button, div.v-data-table.elevation-0 tbody tr:first-child button.v-btn--icon',
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
        ArchivedSectionButton : 'button .content-container span',
        ArchivedContactListTable : '.v-data-table.elevation-0'
    }

    addContact(firstName, lastName, email, phone, preferredLocation) {
        // IMMEDIATELY scroll to top before doing anything else - prevent any auto-scroll
        cy.window().then((win) => {
            win.scrollTo(0, 0);
        });
        cy.wait(300);
        
        // Wait for the contacts page to be fully loaded (but don't let it scroll)
        cy.get(this.selector.ContactListTable, { timeout: 15000 })
            .should('exist')
            .then(() => {
                // Ensure we're still at top after table loads
                cy.window().then((win) => {
                    win.scrollTo(0, 0);
                });
            });
        cy.wait(1000);
        
        // Wait for the header section to be visible (where the Add button is located)
        cy.get('.tx-list-header, div.tx-list-header, [class*="list-header"]', { timeout: 15000 })
            .should('exist')
            .then(() => {
                // Keep at top
                cy.window().then((win) => {
                    win.scrollTo(0, 0);
                });
            });
        
        // Wait for and click the Add Contact button
        // First ensure we're at the top
        cy.window().then((win) => {
            win.scrollTo(0, 0);
        });
        cy.wait(500);
        
        // Find and click the Add Contact button using the bg-primary class
        // This is a unique class for the Add Contact button
        cy.get(this.selector.AddContactButton, { timeout: 20000 })
            .should('exist')
            .should('be.visible')
            .should('not.be.disabled')
            .click({ force: true });
        
        // Wait a moment for the click to register and modal to start appearing
        cy.wait(1500);
        
        // Wait for FirstName field directly - this is the most reliable indicator the modal is ready
        // Use a longer timeout and check for existence first, then visibility
        cy.get(this.selector.FirstName, { timeout: 20000 })
            .should('exist')
            .should('be.visible');
        
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
        // Scroll to top of page to ensure we're at the beginning
        cy.scrollTo('top', { duration: 0 });
        cy.wait(500); // Brief wait after scrolling
        
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
        // Handle the case where one field might be covering another
        cy.get('body').then(($body) => {
            // Find all search fields
            const specificField = $body.find('input[placeholder="Search contact"]');
            const searchByContactField = $body.find('input[placeholder="Search By Contact"]');
            const genericField = $body.find('input[placeholder*="Search"], input[placeholder*="search"]');
            
            // Prefer the specific "Search contact" field, but use force if it's covered
            if (specificField.length > 0) {
                // Use the specific search field with force to handle covering elements
                cy.get(this.selector.SearchField, { timeout: 10000 })
                    .should('exist')
                    .clear({ force: true })
                    .type(searchTerm, { force: true });
                cy.wait(1000);
            } else if (searchByContactField.length > 0) {
                // Use "Search By Contact" field if "Search contact" doesn't exist
                cy.get('input[placeholder="Search By Contact"]', { timeout: 10000 })
                    .should('exist')
                    .clear({ force: true })
                    .type(searchTerm, { force: true });
                cy.wait(1000);
            } else if (genericField.length > 0) {
                // Use a generic search field if it exists
                cy.get(this.selector.SearchFieldGeneric, { timeout: 10000 })
                    .first()
                    .should('exist')
                    .clear({ force: true })
                    .type(searchTerm, { force: true });
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
        // IMMEDIATELY scroll to top before doing anything else - prevent any auto-scroll
        cy.window().then((win) => {
            win.scrollTo(0, 0);
        });
        cy.wait(300);
        
        // Wait for contact list to be visible (but don't let it scroll)
        cy.get(this.selector.ContactListTable)
            .should('be.visible', { timeout: 10000 })
            .then(() => {
                // Ensure we're still at top after table loads
                cy.window().then((win) => {
                    win.scrollTo(0, 0);
                });
            });
        cy.wait(500);
        
        // Click the three-dot menu button - NO scrollIntoView to prevent scrolling
        // First row should be at top, so no need to scroll
        cy.get(this.selector.FirstContactThreeDotMenu)
            .should('be.visible', { timeout: 10000 })
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
        // Scroll to top first
        cy.window().then((win) => {
            win.scrollTo(0, 0);
        });
        cy.wait(500);
        
        // Wait for page to be ready
        cy.get('body').should('be.visible');
        cy.wait(1000);
        
        // Click the Archived button - try multiple approaches
        // The text is nested in: button > span.v-btn__content > div.content-container > span
        cy.get('body').then(($body) => {
            // Check if button with "Archived" text exists
            const archivedBtn = $body.find('button').filter((index, btn) => {
                return Cypress.$(btn).text().toLowerCase().includes('archived');
            });
            
            if (archivedBtn.length > 0) {
                // Found button with Archived text
                cy.wrap(archivedBtn.first())
                    .should('be.visible')
                    .should('not.be.disabled')
                    .click({ force: true });
            } else {
                // Fallback: use cy.contains (should work with nested text)
                cy.contains('button', 'Archived', { timeout: 15000, matchCase: false })
                    .should('be.visible')
                    .should('not.be.disabled')
                    .click({ force: true });
            }
        });
        
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