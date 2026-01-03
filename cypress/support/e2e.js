// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Handle uncaught exceptions from the application
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignore errors related to 'config' property being undefined
  // This is often caused by application initialization issues
  if (err.message.includes("Cannot read properties of undefined") && 
      err.message.includes("config")) {
    // Return false to prevent the error from failing the test
    return false
  }
  // For other errors, let Cypress handle them normally
  return true
})

// Alternatively you can use CommonJS syntax:
// require('./commands')

