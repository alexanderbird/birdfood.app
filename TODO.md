# TODO

## MVP
- storage -- multi-device
  - spike: cognito
     - https://aws.amazon.com/blogs/mobile/accessing-your-user-pools-using-the-amazon-cognito-identity-sdk-for-javascript/
     - part 1: javascript implementation that exchanges username&password for aws
       credentials which can be used to invoke the AWS API via JavaScript SDK
     - part 2: user-specific role tied to a household (ensure multiple users can
       access one household, and no user can access a household other than their
       own)
       - each household can have its own access role to access only their ddb records
  - in the UI, add a third data option -- login -- which uses cognito and the dynamodb
    adapter
      - if the household ID cannot be saved in Cognito, come up with an
        appropriate mechanism to map user ids to households and roles
  - create an automated process (e.g. local invocation of JavaScript) for user
    management
      - cover:
        - creating a new household
        - creating a new user
        - resetting a user password
      - clearly document the procedure
- production deploy:
  - prod account
  - deploy table and role resources to prod
  - make sure cloudtrail is enabled
  - make sure this process is documented in the README
- is there any db-related documentation missing in the README?

## Improvements
- scaling
  - handle ddb pagination and batching (i.e. lists longer than 100 items) -- or
    at least prevent creating more than 100 items
- nitpicks
  - planning
    - show item price on the planning page
  - shopping
    - if the background update operation fails, show a banner warning the user
      that their recent change was not saved
    - show items remaining for each group (as a badge on the type icon?)
- add loading spinners throughout the app
- logging or other operating concerns? Honeycomb.io? https://www.honeycomb.io/blog/observable-frontends-opentelemetry-browser
   - if we add any logging or tracing, we need to address privacy. I don't want
     to see the item names in any logs, for example. Ideally, there's no way in
     the logs to trace back to an account -- although since there would be so
     little traffic, from the prod account cloudtrail logs one could correlate
     the login/auth with subsequent calls. 🤔
