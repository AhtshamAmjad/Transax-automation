const { defineConfig } = require('cypress')
require('dotenv').config({ override: true })

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // Load environment variables into Cypress config
      config.env = {
        ...config.env,
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        AccessToken: process.env.ACCESS_TOKEN,
      }
      config.baseUrl = process.env.BASE_URL || config.baseUrl
      return config
    },
  },
})

