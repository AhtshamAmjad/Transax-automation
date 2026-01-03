const { defineConfig } = require('cypress')
require('dotenv').config({ override: true })

module.exports = defineConfig({
  screenshotOnRunFailure: true,
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  video: true,
  videoUploadOnPasses: false,
  videoCompression: 32,
  videoUploadOnFailures: true,
  experimentalSessionAndOrigin: true,


  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // Load environment variables into Cypress config
      config.env = {
        ...config.env,
        dev_username: process.env.DEV_USERNAME,
        dev_password: process.env.DEV_PASSWORD,
        dev_AccessToken: process.env.DEV_ACCESS_TOKEN,
      }
      config.baseUrl = process.env.DEV_BASE_URL || config.baseUrl
      return config
    },
  },
})

