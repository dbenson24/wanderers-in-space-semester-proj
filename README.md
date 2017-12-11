# Astronomy Semester Group Project - Orbital Simulation

![PhaserNPMWebpackTypeScriptStarterProject](https://www.facebook.com/messages/t/100006427923960)

##### Hit the ground running and make some great games!

# Features:

- Phaser-CE 2.9.1 (npm module, no having to download the library separately...)
- TypeScript + TSLint
- 3 States (Boot, Preloader, Title) showing transition between states and where some things should be done and how a TypeScript state looks
- Google Web Font loader
- Webpack
- Separate Development and Distribution builds
- Live server (builds and reloads the browser on changes)
- No hassle asset management requiring no code, on your part, to load and parse assets
  - Assets are required and hashed via webpack, you can now guarantee that when you push an update, everyone will get the new files and not cached ones
  - Assets class created automatically allowing you to access all the assets and their frames and sprites (in the case of Atlases and Audiosprites) in a compiler validating way!
- Setting up the game size and scaling through a script that does it all for you
  - Automatic template background
  - Sets up the size the game so that it is scaled only when absolutely necessary
  - Refer to src/utils/utils.ts for an explanation on the background_template and the sizing/scaling style


### Folder Structure:
- **assets/** – This is where your assets that are processed when building goes
- **assets_raw/** – This folder is NOT processed at all and is merely an organizational folder (I use it for things like my individual images that get compiled into a spritesheet, individual sounds that get compiled into an audiosprite, etc...)
- **dist/** – This is where the built game will go
- **node_modules/** – This is where the node modules required for the game will be put with npm install
- **scripts/** – This is where node scripts go
- **src/** – This is where all the games code goes
- **templates/** – This is where the html template that gets built by Webpack goes
- **.gitignore** – List of files and folders that are ignored by git
- **.npmrc** – List of some project wide npm settings
- **electron-main.js** – Entry point and application life controller for electron builds
- **package.json** – Node config for the project
- **README.md** – This is the README displayed ont he GitHub page
- **README_HEADER.png** – This is just the header image for the GitHub README
- **tsconfig.json** – List of some TypeScript settings
- **tslint.json** – List of some TypeScript Linting rules
- **webpack.dev.config.js** – Webpack config for the DEV build
- **webpack.dist.config.js** – Webpack config for the DIST build

# Setup:

## 0. Install Git:
[GIT Installation Instructions and Links][git-scm]

## 1. Download or Clone this repo:

##### 1.1 Download:

Download the latest zip/tar.gz from [GitHub Releases][releases], extract it to where you want your project to be.

##### 1.2 Clone:

Navigate into your workspace directory.

Run:

```git clone https://github.com/rroylance/phaser-npm-webpack-typescript-starter-project.git```

## 2. Install node.js and npm (npm is included and installed with node.js):

[NodeJS Installation Instructions and Links][nodejs]

## 3. Install dependencies:

Navigate to the cloned repo’s directory.

Run:

```npm install```

## 4. Run the dev server:

Run to use the dev build while developing:

```npm run server:dev```

Run to use the dist build while developing

```npm run server:dist```

###### The only real reason I can think of to use the dist server is if the minification process is breaking something in your game and you need to test using the minified version, or something you excluded with the DEBUG flag shouldn't have been excluded.

This will run a server that serves your built game straight to the browser and will be built and reloaded automatically anytime a change is detected.

## Build for testing/developing/debugging:

Run:

```npm run build:dev```

This will build the game with a few caveats;
- A compile time flag, DEBUG, set to true; allowing you to include or not include certain code depending on if it's DEBUG build or not.
- The resulting game.js will not be minified

## Build for release:

Run:

```npm run build:dist```

This will build the game with a few caveats;
- The compile time flag, DEBUG, set to false; allowing you to include or not include certain code depending on if it's DEBUG build or not.
- The resulting game.min.js will be minified

## Generate Assets Class:

This project will manage your assets for you! All you need to do is drop your assets in assets/ (subdirectories do not matter) and run (you need to run this manually if you change assets while the server is running, otherwise it's run automatically when running a build);

```npm run assets```

or (if your dev GOOGLE_WEB_FONTS is different from your dist);

```npm run assets:dev```

src/assets.ts will be generated which contains sections for all your asset types (the generator is smart enough to distinguish what assets are what !) and classes for every asset, it will also generate an enum containing every frame and sprite in Atlases and AudioSprites respectively!