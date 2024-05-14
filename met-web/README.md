# MET-WEB

React.js frontend application for The Modern Engagement Tool project.

## Getting Started

### Development Environment
* Install the following:
    - [Node.js](https://nodejs.org/en/)
* Install Dependencies
    - Set token for fontawesome by running `npm config set '//npm.fontawesome.com/:_authToken' "FONTAWESOME_PACKAGE_TOKEN"`
    - Run `npm install` in the root of the project (met-web)

## Environment Variables

The development scripts for this application allow customization via an environment file in the root directory called `.env`. See an example of the environment variables that can be overridden in `sample.env`.

## Commands

### Development

The following commands support various development scenarios and needs.

> `npm start`
>
> Runs the react.js application.  
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.<br/>
Note: you must be running the [API application](met-api) concurrently.
> The page will reload if you make edits.<br/>
> You will also see any lint errors in the console.

> `npm test`
>
> Runs the application unit tests<br>

> `npm run lintfix`
>
> Lints the application code and automatically apply fixes when possible.

### Support

These commands are here to support the continuous integration and other esoteric development concerns.  You should rarely need to run these commands.

> `npm build`
>
> Builds the app for production to the `build` folder.
> <br/> It bundles React in production mode and optimizes the build for the best performance.
> <br/> The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

## Debugging in the Editor

### Visual Studio Code

Ensure the latest version of [VS Code](https://code.visualstudio.com) and VS Code [Chrome Debugger Extension](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) is installed.

The [`launch.json`](.vscode/launch.json) is already configured with a launch task (MET-WEB Launch) that allows you to launch chrome in a debugging capacity and debug through code within the editor. 