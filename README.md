# Butter 🧈

A family grocery list app: plan like you're using a grocery delivery app; do the
shopping yourself.

## Developer Notes
### File Structure

- public: static files to inlude in the published web directory
- src: source code
  - core: business logic. Does not depend on any concrete implementation of data or ui.
  - data: storage plumbing
    - static: canned data for demo and test.
  - ui: display logic
    - web: web client (Preact)

