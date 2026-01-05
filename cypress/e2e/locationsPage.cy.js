import LocationsPage from '../../Pages/LocationsPage';
import loginTest from '../../Pages/Login';
import { getLocationData } from '../support/testData/location.Data';

beforeEach(() => {
    cy.visit('/auth/login', { failOnStatusCode: false });
    cy.wait(10000);
    loginTest.login(Cypress.env('dev_username'), Cypress.env('dev_password'));
});

describe('Locations Page', () => {
    beforeEach(() => {
        cy.url().should('include', '/dashboard');
        cy.wait(10000);
        // URL encode the special characters in the URL
        cy.visit('https://dashboard.dev.transax.com/settings?section=Account/Workspace/Locations+&+Work+Hours', { 
            failOnStatusCode: false,
            timeout: 120000 // Increase timeout to 120 seconds
        });
        // Wait for the locations page to load - check for Add Location button or search field
        cy.get(LocationsPage.selector.AddLocationButton, { timeout: 120000 }).should('be.visible');
        cy.wait(5000); // Additional wait for page to fully render
    });

    it.only('#TC-01 - should add a location', () => {
        const location = getLocationData();
        LocationsPage.addLocation(
            location.locationName,
            location.phone,
            location.locationCode,
            location.zipCode
        );
        //LocationsPage.assertLocationAdded(location.locationName);
    });

    it('#TC-02 - should update a location', () => {
        // Wait for location list to load
        cy.get(LocationsPage.selector.LocationListTable).should('be.visible', { timeout: 10000 });
        
        // Generate new location data for the update
        const updatedLocation = getLocationData();
        
        // Update the location
        LocationsPage.updateLocation(
            updatedLocation.locationName,
            updatedLocation.phone,
            updatedLocation.locationCode,
            updatedLocation.zipCode
        );
        
        // Verify the location was updated
        LocationsPage.assertLocationUpdated(updatedLocation.locationName);
    });

    it('#TC-03 - should search for a location', () => {
        // First, create a location to search for
        const location = getLocationData();
        LocationsPage.addLocation(
            location.locationName,
            location.phone,
            location.locationCode,
            location.zipCode
        );
        
        // Wait for the modal to close and location list to be visible
        cy.get(LocationsPage.selector.LocationListTable).should('be.visible', { timeout: 10000 });
        cy.wait(2000);
        
        // Search for the location by name
        LocationsPage.searchLocation(location.locationName);
        
        // Verify the location is found in search results
        LocationsPage.assertLocationFound(location.locationName);
        
    
    });

    it('#TC-04 - should cancel adding a location', () => {
        const location = getLocationData();
        
        // Try to add a location but cancel it
        LocationsPage.cancelAddLocation(
            location.locationName,
            location.phone,
            location.locationCode,
            location.zipCode
        );
        
        // Verify modal is closed
        LocationsPage.assertModalClosed();
        
        // Verify the location was not added (should not be in the list)
        cy.get(LocationsPage.selector.LocationListTable).should('be.visible', { timeout: 10000 });
        cy.contains(location.locationName).should('not.exist');
    });

    it('#TC-05 - should cancel updating a location', () => {
        // Wait for location list to load
        cy.get(LocationsPage.selector.LocationListTable).should('be.visible', { timeout: 10000 });
        cy.wait(2000);
        
        // Get the first location name before update
        let originalLocationName = '';
        cy.get('tbody tr').first().should('be.visible').then(($row) => {
            // Get text from the first cell
            const firstCell = Cypress.$($row).find('td').first();
            originalLocationName = Cypress.$(firstCell).text().trim();
        });
        
        // Wait for the name to be captured, then proceed
        cy.then(() => {
            // Only proceed if we have a valid location name
            if (originalLocationName && originalLocationName.length > 0) {
                // Generate new location data for the update
                const updatedLocation = getLocationData();
                
                // Try to update the location but cancel it
                LocationsPage.cancelUpdateLocation(updatedLocation.locationName);
                
                // Verify modal is closed
                cy.get(LocationsPage.selector.EditLocationModal).should('not.exist', { timeout: 10000 });
                
                // Verify the location name was not changed (original name should still be visible)
                cy.wait(2000);
                cy.get(LocationsPage.selector.LocationListTable).should('be.visible', { timeout: 10000 });
                cy.contains(originalLocationName, { timeout: 10000 }).should('be.visible');
            } else {
                cy.log('Warning: Could not find a valid location name in the first row. Skipping verification.');
                // Still test that cancel works even if we can't verify the name
                const updatedLocation = getLocationData();
                LocationsPage.cancelUpdateLocation(updatedLocation.locationName);
                cy.get(LocationsPage.selector.EditLocationModal).should('not.exist', { timeout: 10000 });
            }
        });
    });
});

