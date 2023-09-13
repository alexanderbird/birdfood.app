# TODO

## MVP
- storage -- multi-device
  - implement a dynamodb data adapter (you can integ test this by passing that
    data into the existing test suite)
      - preparation: extract the data source in the tests to a single factory
        that can switch based on an environment variable. Then we can run
        `DATA=dynamodb npm run test` to run the tests against a real ddb
      - create AWS account; CFN resource for creating the table. Create a dev
        and prod table. Maybe use a different region for dev and prod to keep
        them separated.
  - implement login with Cognito to authenticate to dynamodb in the web app
  - add a third data option -- login -- which uses cognito and the dynamodb
    adapter

## Improvements
- nitpicks
  - planning
    - show item price on the planning page
  - shopping
    - if the background update operation fails, show a banner warning the user
      that their recent change was not saved
    - show items remaining for each group (as a badge on the type icon?)
- add loading spinners throughout the app
