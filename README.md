# Bird Food 🦉

https://birdfood.app

A family grocery list app: plan like you're using a grocery delivery app; do the
shopping yourself.

## Logging In
Currently, you must provide an AWS access key and secret key to log in. They
must resolve to an AWS role with access to read/write the BirdFood database in
ca-central-1. 

Username: `household|AWS_ACCESS_KEY_ID`
Password: `AWS_SECRET_ACCESS_KEY`

Choose any household ID -- all your entries are scoped to that household. The
access role should be scoped to only access ddb entries with the household as
the partition key. Substitute your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.
Note that the household and the AWS_ACCESS_KEY_ID are separated by a pipe
character (`|`).

The credentials are stored in the Browser local storage until you log out. It's
your job to make sure those credentials are appropriate to store in a browser's
local storage:
 1. the AWS account contains only BirdFood data, and
 2. the role can only access the `BirdFoodItems` ddb table for its household

## Developer Notes
### Testing and Linting

Before pushing to mainline, ensure `npm run check` passes. (If it doesn't, then
the build will fail which prevents the deployment of your change.) Most common
linting errors can be resolved with `npm run lint -- --fix`.

#### UI Testing

There is no automated testing for the UI module; start the server, browse to
localhost, and manually run through the schedule, plan, shop, and history
workflows. You can use Demo Mode if you want prepopulated data, or Browser
Storage if you want to reload the page and keep the data. To reset your browser
storage, you can run `localStorage.clear()` from the terminal.

#### Integration Testing

To run the full `core` test suite against the real `core` and `data.dynamodb`
modules, run `npm run test:db-integ`. This is the same as the core unit testing,
except that instead of an in memory database it uses the real thing.

### File Structure

- public: static files to inlude in the published web directory
- src: source code
  - core: business logic. Does not depend on any concrete implementation of data or ui.
  - data: storage plumbing
    - static: canned data for demo and test.
  - ui: display logic
    - web: web client (Preact)

### Updating images

When you change favion.svg, you'll want to re-generate the progressive web app
assets. Run `npm run generate-pwa-assets`.
