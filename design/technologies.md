# Technologies

An explanation of what and how our dependencies are used.

These are the technologies that Paizo Prolog must be restricted to:

* [Bootstrap](https://github.com/twbs/bootstrap)
* [Tau Prolog](https://github.com/tau-prolog/tau-prolog)
* [Pug templating](https://github.com/pugjs/pug)

No other technologies must be used outside of this set to keep complexity
to a minimum.

Boostrap must be used for all styling. This makes it much easier to create
a night/dark mode, or any number of custom themes. It also gives us mobile
friendly layouts for free if used properly.

Tau Prolog will be the interpreter that runs the Prolog code in the browser.

Pug templating will tie the two above together. With templating the dependencies
can be included together and the template engine can spit out a massive file
as the result.

Templates make it easy to break the application up into pieces and combine
them all at a later stage.

