import { defineConfig } from 'cypress'
import path from 'path'

export default defineConfig({
  component: {
    specPattern: '**/*test.{js,jsx,ts,tsx}',
    devServer: {
      framework: 'next',
      bundler: 'webpack',
      webpackConfig() {
        return {
          resolve: {
            alias: {
              '@': path.resolve(__dirname),
            },
          },
        }
      },
    },
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
