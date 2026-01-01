const { defineConfig } = require('cypress')
require('dotenv').config({ override: true })

module.exports = defineConfig({
    e2e: {
        // This setupNodeEvents loads staging-specific env variables from your .env file
        // To use staging, run Cypress with this config file (e.g. --config-file cypress.staging.config.js)
        // No need to override dev variables unless you want to fall back to them if staging ones are missing

        setupNodeEvents(on, config) {
            config.env = {
                ...config.env,
                staging_username: process.env.STAGING_USERNAME,
                staging_password: process.env.STAGING_PASSWORD,
                staging_AccessToken: process.env.STAGING_ACCESS_TOKEN,
            }
            config.baseUrl = process.env.STAGING_BASE_URL || config.baseUrl
            return config
        }
    }
})