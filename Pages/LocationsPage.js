class LocationsPage {

    selector = {
        AddLocationButton : '#__nuxt > div.v-layout.layout > main > div > div > div.content-container > div.tw-flex.tw-flex-col.tw-gap-4 > div:nth-child(1) > div.tx-panel__header > div.tx-panel__header-right > div > button',
        AddLocationMdal : '[data-testid="v-dialog-modal-section.dialog-container"]',
        AddLocationModalHeader : '[data-testid="v-dialog-modal-section.dialog-container"] h1.header-title',
        LocationName : 'input[placeholder="Happy Valley"]',
        PhoneNumber : 'input[placeholder="(123) 345-6789"]',
        LoactionCode : 'input[placeholder="BAC"]',
        LocationZip : 'input[placeholder="12345"]',
        SaveButton : '[data-testid="location-modal-section.submit-button"]',
        CancelButton : '[data-testid="v-dialog-modal-section.footer-section"] button.cancel-button',
        FirstLocationThreeDotMenu : 'td button.v-btn--icon:has(i.mdi-dots-horizontal)',
        EditLocationModal : '[data-testid="v-dialog-modal-section.dialog-container"]',
        EditLocationModalHeader : '[data-testid="v-dialog-modal-section.dialog-container"] h1.header-title',
        EditSaveButton : '[data-testid="location-modal-section.submit-button"]',
        EditCancelButton : '[data-testid="v-dialog-modal-section.footer-section"] button.cancel-button',
        SearchField : 'input[placeholder="Search locations..."]',
        LocationListTable : '.v-data-table, .v-table, table'
    }

    // Method to add a new location
    addLocation(locationName, phoneNumber, locationCode, zipCode) {
        // Click the Add Location button
        cy.get(this.selector.AddLocationButton)
            .should('be.visible', { timeout: 10000 })
            .scrollIntoView()
            .click({ force: true });
        
        // Wait for modal to be visible
        cy.get(this.selector.AddLocationMdal).should('be.visible', { timeout: 10000 });
        
        // Fill in Location Name
        cy.get(this.selector.LocationName)
            .should('be.visible', { timeout: 10000 })
            .clear()
            .type(locationName);
        
        // Fill in Phone Number - extract digits only and let the field format it
        if (phoneNumber) {
            const digitsOnly = phoneNumber.replace(/\D/g, '');
            cy.get(this.selector.PhoneNumber)
                .should('be.visible', { timeout: 10000 })
                .clear()
                .type(digitsOnly, { delay: 30 });
            cy.wait(1000); // Wait for validation
        }
        
        // Fill in Location Code
        if (locationCode) {
            cy.get(this.selector.LoactionCode)
                .should('be.visible', { timeout: 10000 })
                .clear()
                .type(locationCode);
        }
        
        // Fill in Zip Code
        if (zipCode) {
            cy.get(this.selector.LocationZip)
                .should('be.visible', { timeout: 10000 })
                .clear()
                .type(zipCode);
        }
        
        // Click Save button
        cy.get(this.selector.SaveButton)
            .should('be.visible', { timeout: 10000 })
            .should('not.be.disabled')
            .click();
        
        // Wait for modal to close
        cy.get(this.selector.AddLocationMdal).should('not.exist', { timeout: 10000 });
        
        // Wait for table to refresh/reload
        cy.wait(2000);
        cy.get(this.selector.LocationListTable).should('be.visible', { timeout: 10000 });
    }

    // Method to cancel adding a location
    cancelAddLocation(locationName, phoneNumber, locationCode, zipCode) {
        // Click the Add Location button
        cy.get(this.selector.AddLocationButton)
            .should('be.visible', { timeout: 10000 })
            .scrollIntoView()
            .click({ force: true });
        
        // Wait for modal to be visible
        cy.get(this.selector.AddLocationMdal).should('be.visible', { timeout: 10000 });
        
        // Fill in some fields to verify cancel works even with data entered
        cy.get(this.selector.LocationName)
            .should('be.visible', { timeout: 10000 })
            .clear()
            .type(locationName);
        
        if (phoneNumber) {
            const digitsOnly = phoneNumber.replace(/\D/g, '');
            cy.get(this.selector.PhoneNumber)
                .should('be.visible', { timeout: 10000 })
                .clear()
                .type(digitsOnly, { delay: 30 });
        }
        
        // Click Cancel button instead of Save
        cy.get(this.selector.CancelButton)
            .should('be.visible', { timeout: 10000 })
            .click();
        
        // Verify modal is closed
        cy.get(this.selector.AddLocationMdal).should('not.exist', { timeout: 10000 });
    }

    // Method to update a location
    updateLocation(newLocationName, newPhoneNumber, newLocationCode, newZipCode) {
        // Wait for location list to be visible
        cy.get(this.selector.LocationListTable).should('be.visible', { timeout: 10000 });
        
        // Click the three-dot menu button for the first location
        cy.get(this.selector.FirstLocationThreeDotMenu)
            .first() // Select only the first element
            .should('be.visible', { timeout: 10000 })
            .scrollIntoView()
            .click({ force: true });
        
        // Wait for menu to appear
        cy.wait(500);
        
        // Click "Edit" option from the menu
        cy.contains('.v-list-item, [role="menuitem"], .v-menu-item, button', 'Edit', { timeout: 5000, matchCase: false })
            .should('be.visible')
            .click({ force: true });
        
        // Wait for edit modal to appear
        cy.get(this.selector.EditLocationModalHeader).should('be.visible', { timeout: 10000 });
        
        // Update Location Name
        if (newLocationName) {
            cy.get(this.selector.LocationName)
                .should('be.visible', { timeout: 10000 })
                .clear()
                .type(newLocationName);
        }
        
        // Update Phone Number
        if (newPhoneNumber) {
            const digitsOnly = newPhoneNumber.replace(/\D/g, '');
            cy.get(this.selector.PhoneNumber)
                .should('be.visible', { timeout: 10000 })
                .clear()
                .type(digitsOnly, { delay: 30 });
            cy.wait(1000);
        }
        
        // Update Location Code
        if (newLocationCode) {
            cy.get(this.selector.LoactionCode)
                .should('be.visible', { timeout: 10000 })
                .clear()
                .type(newLocationCode);
        }
        
        // Update Zip Code
        if (newZipCode) {
            cy.get(this.selector.LocationZip)
                .should('be.visible', { timeout: 10000 })
                .clear()
                .type(newZipCode);
        }
        
        // Click Save button
        cy.get(this.selector.EditSaveButton)
            .should('be.visible', { timeout: 10000 })
            .should('not.be.disabled')
            .click();
    }

    // Method to cancel updating a location
    cancelUpdateLocation(newLocationName) {
        // Wait for location list to be visible
        cy.get(this.selector.LocationListTable).should('be.visible', { timeout: 10000 });
        
        // Click the three-dot menu button for the first location
        cy.get(this.selector.FirstLocationThreeDotMenu)
            .first() // Select only the first element
            .should('be.visible', { timeout: 10000 })
            .scrollIntoView()
            .click({ force: true });
        
        // Wait for menu to appear
        cy.wait(500);
        
        // Click "Edit" option from the menu
        cy.contains('.v-list-item, [role="menuitem"], .v-menu-item, button', 'Edit', { timeout: 5000, matchCase: false })
            .should('be.visible')
            .click({ force: true });
        
        // Wait for edit modal to appear
        cy.get(this.selector.EditLocationModalHeader).should('be.visible', { timeout: 10000 });
        
        // Update Location Name to verify cancel works even with changes
        cy.get(this.selector.LocationName)
            .should('be.visible', { timeout: 10000 })
            .clear()
            .type(newLocationName);
        
        // Click Cancel button instead of Save
        cy.get(this.selector.EditCancelButton)
            .should('be.visible', { timeout: 10000 })
            .click();
        
        // Verify modal is closed
        cy.get(this.selector.EditLocationModal).should('not.exist', { timeout: 10000 });
    }

    // Method to search for a location
    searchLocation(searchTerm) {
        cy.get(this.selector.SearchField)
            .should('be.visible', { timeout: 10000 })
            .clear()
            .type(searchTerm);
        cy.wait(1000); // Wait for search results to load
    }

    // Assertion method to verify location was added
    assertLocationAdded(locationName) {
        // Wait for table to be visible
        cy.get(this.selector.LocationListTable).should('be.visible', { timeout: 10000 });
        cy.wait(2000); // Additional wait for table to fully render
        
        // Search for the location name - check if it exists
        // Note: Element might be clipped by parent overflow, so we check existence rather than visibility
        cy.contains(locationName, { timeout: 15000 }).should('exist');
    }

    // Assertion method to verify location was updated
    assertLocationUpdated(locationName) {
        cy.get(this.selector.LocationListTable).should('be.visible', { timeout: 10000 });
        cy.contains(locationName, { timeout: 10000 }).should('be.visible');
    }

    // Assertion method to verify location was found in search
    assertLocationFound(locationName) {
        cy.get(this.selector.LocationListTable).should('be.visible', { timeout: 10000 });
        cy.contains(locationName, { timeout: 10000 }).should('be.visible');
    }

    // Assertion method to verify modal is closed
    assertModalClosed() {
        cy.get(this.selector.AddLocationMdal).should('not.exist', { timeout: 10000 });
    }
}

export default new LocationsPage();