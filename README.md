# Astronomy Semester Group Project - Orbital Simulation

![PhaserNPMWebpackTypeScriptStarterProject](https://scontent.fzty2-1.fna.fbcdn.net/v/t35.0-12/25286246_2485929048298002_477545884_o.png?oh=5cba7779a0337f8948eeee63d12cfb37&oe=5A30A69C)

# Setup:

## 0. Install Git (if you do not have Git Installed):

[GIT Installation Instructions and Links][git-scm]

## 1. Download or Clone this repo:

##### 1.1 Download:

Download the latest zip/tar.gz from [GitHub Releases][releases], extract it to where you want your project to be.

##### 1.2 Clone:

Navigate into your workspace directory.

Run:

```git clone https://github.com/dbenson24/wanderers-in-space-semester-proj.git```

## 2. Install node.js and npm (npm is included and installed with node.js):

[NodeJS Installation Instructions and Links][nodejs]

## 3. Install dependencies:

Navigate to the cloned repo’s directory.

Run:

```npm install```

## 4. Run the dev server:

```npm run server:dev```

This will run a server that serves our built game straight to the browser and will be built and reloaded automatically anytime a change is detected.

# Libraries Used:

- Phaser-CE 2.9.1 (npm module, no having to download the library separately...)
- TypeScript + TSLint
- Google Web Font loader
- Webpack

### Folder Structure:

- **src/** – This is where all the games code goes
- **assets/** – This is where we keep all of the raw data for audio, images, and spritesheets
- **assets_raw/** – This folder is NOT processed at all and is merely an organizational folder
- **dist/** – This is where the built game will go
- **node_modules/** – This is where the node modules required for the game will be put with npm install
- **scripts/** – This is where node scripts go
- **templates/** – This is where the html template that gets built by Webpack goes
- **.gitignore** – List of files and folders that are ignored by git
- **.npmrc** – List of some project wide npm settings
- **electron-main.js** – Entry point and application life controller for electron builds
- **package.json** – Node config for the project
- **README.md** – This is the README displayed ont he GitHub page
- **tsconfig.json** – List of some TypeScript settings
- **tslint.json** – List of some TypeScript Linting rules
- **webpack.dev.config.js** – Webpack config for the DEV build
- **webpack.dist.config.js** – Webpack config for the DIST build

### Game Controls
- W - Thrust Forward
- A - Turn Left
- D - Turn Right
- , - Slow Down Time
- . - Speed Up Time

