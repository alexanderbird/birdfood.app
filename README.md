# Butter 🧈

A family grocery list app: plan like you're using a grocery delivery app; do the
shopping yourself.

## Developer Notes
### Testing and Linting

Before pushing to mainline, ensure `npm run check` passes. (If it doesn't, then
the build will fail which prevents the deployment of your change.) Most common
linting errors can be resolved with `npm run lint -- --fix`.

### File Structure

- public: static files to inlude in the published web directory
- src: source code
  - core: business logic. Does not depend on any concrete implementation of data or ui.
  - data: storage plumbing
    - static: canned data for demo and test.
  - ui: display logic
    - web: web client (Preact)

