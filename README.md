[![MEAN.JS Logo](https://github.com/mrdav30/MEANcore/blob/master/client/assets/images/logo.png)](https://github.com/mrdav30/MEANcore)

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/MEANcore/community)
[![Dependencies Status](https://david-dm.org/mrdav30/MEANcore.svg)](https://david-dm.org/mrdav30/MEANcore)
[![Known Vulnerabilities](https://snyk.io/test/github/mrdav30/MEANcore/badge.svg?targetFile=package.json)](https://snyk.io/test/github/mrdav30/MEANcore?targetFile=package.json)

# Meancore Starter Kit

The MEANcore starter kit is a full-stack JavaScript open-source solution, which provides a solid starting point for [MongoDB](http://www.mongodb.org/), [Node.js](http://www.nodejs.org/), [Express](http://expressjs.com/), and [Angular](https://angular.io/) based applications. This project includes modern tools and workflow based on [angular-cli](https://github.com/angular/angular-cli), best practices from the community, a scalable base template and a good learning base.

### Benefits

- Quickstart a project in seconds and focus on features, not on frameworks or tools

- Industrial-grade tools, ready for usage in a continuous integration environment and DevOps

- Scalable architecture with base app template including example components, services and tests

## Before You Begin
Before you begin, it's recommend you read about the basic building blocks that assemble a MEAN application:
* MongoDB - Go through [MongoDB Official Website](http://mongodb.org/) and proceed to their [Official Manual](http://docs.mongodb.org/manual/), which should help you understand NoSQL and MongoDB better.
* Express - The best way to understand express is through its [Official Website](http://expressjs.com/), which has a [Getting Started](http://expressjs.com/starter/installing.html) guide, as well as an [ExpressJS](http://expressjs.com/en/guide/routing.html) guide for general express topics. You can also go through this [StackOverflow Thread](http://stackoverflow.com/questions/8144214/learning-express-for-node-js) for more resources.
* Angular - Angular's [Official Website](https://angular.io/) is a great starting point.
* Node.js - Start by going through [Node.js Official Website](http://nodejs.org/) and this [StackOverflow Thread](http://stackoverflow.com/questions/2353818/how-do-i-get-started-with-node-js), which should get you going with the Node.js platform in no time.

## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).

# Getting started

1. Go to project folder and install dependencies:
 ```bash
 npm install
 ```

2. Launch development server, and open `localhost:4200` in your browser:
 ```bash
 npm start
 ```

# Project structure

```
client/                      project source code for client
|- app/                      app components
|  |- app.component.*        app root component (shell)
|  |- app.module.ts          app root module definition
|  |- app-routing.module.ts  app routes
|- assets/                   app assets (images, fonts, sounds...)
|- environments/             values for various build environments
|  features/                 additional modules and components
|- theme/                    app global scss variables and theme
|- index.html                html entry point
|- main.scss                 global style entry point
|- main.ts                   app entry point
|- polyfills.ts              polyfills needed by Angular
+- test.ts                   unit tests entry point
config/                      configuration for express
dist/                        compiled client version
e2e/                         end-to-end tests
scripts/                     additional scripts for server
server/                      project source code for server
reports/                     test and coverage reports
proxy.conf.js                backend proxy configuration
```

# Main tasks

Task automation is based on [NPM scripts](https://docs.npmjs.com/misc/scripts).

Tasks                         | Description
------------------------------|---------------------------------------------------------------------------------------
npm start                     | Run development ng server on `http://localhost:4200/` using proxy config for express endpoints
npm run client                | Run development ng server on `http://localhost:4200/` only
npm run server                | Run development express server only 
npm run build                 | Lint code and build app for development in `dist/` folder
npm run build.prod            | Lint code and build app for production in `dist/` folder
npm test:client               | Run unit tests via [Karma](https://karma-runner.github.io) in watch mode
npm run test                  | Lint code and run unit tests once for continuous integration
npm run e2e                   | Run e2e tests using [Protractor](http://www.protractortest.org)
npm run lint:client           | Lint code
npm run postinstall           | Updates version information based on project's package.json

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change
any of the source files.
You should not use `ng serve` directly, as it does not use the backend express configuration.

## Code scaffolding

Run `npm run generate -- component <name>` to generate a new component. You can also use
`npm run generate -- directive|pipe|service|class|module`.

If you have installed [angular-cli](https://github.com/angular/angular-cli) globally with `npm install -g @angular/cli`,
you can also use the command `ng generate` directly.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

Tasks are mostly based on the `angular-cli` tool. Use `ng help` to get more help or go check out the
[Angular-CLI README](https://github.com/angular/angular-cli).

# What's in the box

The app template is based on [HTML5](http://whatwg.org/html), [TypeScript](http://www.typescriptlang.org) and
[Sass](http://sass-lang.com).

#### Tools

Development, build and quality processes are based on [angular-cli](https://github.com/angular/angular-cli) and
[NPM scripts](https://docs.npmjs.com/misc/scripts), which includes:

- Optimized build and bundling process with [Webpack](https://webpack.github.io)
- Cross-browser CSS with [autoprefixer](https://github.com/postcss/autoprefixer) and
  [browserslist](https://github.com/ai/browserslist)
- Asset revisioning for [better cache management](https://webpack.github.io/docs/long-term-caching.html)
- Unit tests using [Jasmine](http://jasmine.github.io) and [Karma](https://karma-runner.github.io)
- End-to-end tests using [Protractor](https://github.com/angular/protractor)
- Static code analysis: [TSLint](https://github.com/palantir/tslint), [Codelyzer](https://github.com/mgechev/codelyzer),
  [Stylelint](http://stylelint.io) and [HTMLHint](http://htmlhint.com/)

#### Libraries

- [Mongoose.js](https://mongoosejs.com/)
- [Express.js](https://expressjs.com/)
- [Angular](https://angular.io)
- [Node.js](https://nodejs.org/en/)
- [Ag-Grid](https://www.ag-grid.com/)
- [Bootstrap 4](https://getbootstrap.com)
- [Font Awesome](http://fontawesome.io)
- [RxJS](http://reactivex.io/rxjs)
- [ng-bootstrap](https://ng-bootstrap.github.io)
- [Moment.js](https://momentjs.com/)
- [Lodash](https://lodash.com)
- [Async](https://caolan.github.io/async/)

## Contributing
We welcome pull requests from the community! Just be sure to read the [contributing](https://github.com/mrdav30/MEANcore/blob/master/CONTRIBUTING.MD) doc to get started.

# Licence

[License](https://github.com/mrdav30/MEANcore/blob/master/LICENSE.MD) 
