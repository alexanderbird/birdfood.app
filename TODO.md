# TODO

## MVP
- storage -- multi-device
  - implement a dynamodb data adapter
      - create AWS account; CFN resource for creating the table. Create a dev
        and prod table. Maybe use a different region for dev and prod to keep
        them separated.
      - make sure cloudtrail is enabled
  - create a household-specific access role that can only access the ddb records
    for their own household. Do some security testing to make sure there can be
    no unauthorized access (create data for two households; using the role for
    one attempt to access the records from the other). A simple bash script
    exercising the AWS CLI may be enough for this test.
  - implement login with Cognito to authenticate to dynamodb in the web app
      - if the household ID cannot be saved in Cognito, come up with an
        appropriate mechanism to map user ids to households and roles
      - clearly document the procedure for creating new households and accounts in a
        household
  - in the UI, add a third data option -- login -- which uses cognito and the dynamodb
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
- logging or other operating concerns? Honeycomb.io? https://www.honeycomb.io/blog/observable-frontends-opentelemetry-browser
   - if we add any logging or tracing, we need to address privacy. I don't want
     to see the item names in any logs, for example. Ideally, there's no way in
     the logs to trace back to an account -- although since there would be so
     little traffic, from the prod account cloudtrail logs one could correlate
     the login/auth with subsequent calls. 🤔
