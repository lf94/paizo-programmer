# Technologies

An explanation of what and how our dependencies are used.

These are the technologies that Paizo Prolog must be restricted to:

* [React Beautiful DnD](https://github.com/atlassian/react-beautiful-dnd)
* [Bootstrap](https://github.com/twbs/bootstrap)
* [React](https://github.com/facebook/react)
* [TypeScript](https://github.com/microsoft/TypeScript)
* [Tau Prolog](https://github.com/tau-prolog/tau-prolog)

Boostrap must be used for all styling. This makes it much easier to create
a night/dark mode, or any number of custom themes. It also gives us mobile
friendly layouts for free if used properly.

Tau Prolog will be the interpreter that runs the Prolog code in the browser.

React for the UI. Leverages the current existing React components.

TypeScript to make changes with confidence.

React beautiful drag-and-drop is required for handling the complex world of
touch interfaces.
