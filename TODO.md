# TODO

## MVP
- storage -- preparation
  - inject 50ms to 200ms in every call to data, see if the app is still usable
  - fix any performance issues
- storage -- one device
  - provide browser storage data in addition to the static data
  - on landing, prompt to either use the demo data or the browser data
- storage -- multi-device
  - implement a dynamodb data adapter (you can integ test this by passing that
    data into the existing test suite)
  - implement login with Cognito to authenticate to dynamodb in the web app
  - add a third data option -- login -- which uses cognito and the dynamodb
    adapter

## Improvements
- nitpicks
  - planning
    - show item price on the planning page
  - shopping
    - use the real unit price while shopping once it's set
    - show items remaining for each group (as a badge on the type icon?)
