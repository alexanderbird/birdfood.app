# TODO

## MVP
- storage -- preparation
  - fix any performance issues
    - don't call a full listItems to re-fetch the shopping list. Actually, since
      the request succeeded and you know what you just changed, there's no need
      at all to update that list. We can merge the updated value into the state
      and trust the HTTP 200 that the update was made. See Appendix A.
        - we can assume the request succeeds, and on failure show a banner.
          (Replace `await` with a "fire and forget" + error banner on failure.)
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
- add loading spinners throughout the app
- set it up as a proper progressive web app (so when I add it to the home screen
  I get the app icon, and when I press on the home screen button it doesn't take
  me back to the root url but leaves me on whatever page I was on

## Appendix
### Appendix A

When checking a checkbox in the shopping list.
```
[178ms] data.getItem("se-202309092340-5yr2zzxm") (called from buyItem < updateItem < handleItemClick < onClick < j )
[66ms] data.putItem({"Id":"sei#se-202309092340-5yr2zzxm#i-747cdce5","ItemId":"i-747cdce5","Quantity":2}) (called from buyItem < async*updateItem < handleItemClick < onClick < j )
[184ms] data.getItem("se-202309092340-5yr2zzxm") (called from getShoppingEvent < getShoppingEvent < useUpdatingState/< < w < b )
[96ms] data.listItems("sei#se-202309092340-5yr2zzxm#i-") (called from _getItemsForInProgressShoppingEvent < getShoppingEvent < async*getShoppingEvent < useUpdatingState/< < w )
[193ms] data.listItems("i-") (called from _getItemsForInProgressShoppingEvent < async*getShoppingEvent < async*getShoppingEvent < useUpdatingState/< < w )
```
