# TODO

- better shopping experience
  - group and sort
  - edit the amount
- statistics/details on the shopping history page
  - store
  - actual total at the end
  - estimate before the start
- store dropdown when starting a shop
- provide browser storage data in addition to the static data
- on landing, prompt to either use the demo data or the browser data
- implement a dynamodb data adapter (you can integ test this by passing that
  data into the existing test suite)
- implement login with Cognito to authenticate to dynamodb in the web app
- add a third data option -- login -- which uses cognito and the dynamodb
  adapter
