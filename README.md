# gobstones-scripts

Gobstones Scripts is a CLI tool that helps in the creation of libraries for the Gobstones Project by hiding away the configuration files for several building tools, such as Typescript, Rollup, Webpack, Jest, nps and Typedoc. It also provides some pre-defined files for styling and linting, such as .editorconfig, prettier and ESLint support files, that are automatically copied to the root of your project during initialization.

You may thing of gobstones-script as some sort of create-react-app + react-scripts for the Gobstones Project libraries.

Configurations may be overwritten at any time to provide more functionality, but defaults tend to work on most cases.

[![Licence](https://img.shields.io/github/license/gobstones/gobstones-scripts?style=plastic&label=License&logo=open-source-initiative&logoColor=white&color=olivegreen)](https://github.com/gobstones/gobstones-scripts/blob/main/LICENSE) [![Version](https://img.shields.io/github/package-json/v/gobstones/gobstones-scripts?style=plastic&label=Version&logo=git-lfs&logoColor=white&color=crimson)](https://www.npmjs.com/package/@gobstones/gobstones-scripts) [![API Docs](https://img.shields.io/github/package-json/homepage/gobstones/gobstones-scripts?color=blue&label=API%20Docs&logo=gitbook&logoColor=white&style=plastic)](https://gobstones.github.io/gobstones-scripts)

![GitHub Workflow Tests](https://img.shields.io/github/workflow/status/gobstones/gobstones-scripts/test-on-commit?style=plastic&label=Tests&logo=github-actions&logoColor=white) ![GitHub Workflow Build](https://img.shields.io/github/workflow/status/gobstones/gobstones-scripts/build-on-commit?style=plastic&label=Build&logo=github-actions&logoColor=white)

## Install

This library adds a binary file that can be executed as a CLI. There are two ways in which you can install gobstones-scripts, globally or locally.

### Global install

The global install allows to execute the _gobstones-scripts_ command globally, by installing the CLI to your path. The best thing about it
is the ability to create new projects or to initialize a project in a specific folder. To install globally with **npm** run

```bash
npm install --global @gobstones/gobstones-scripts
```

You do not need the global installation in order to use _gobstones-scripts_ in a project, but it's useful if you are starting a project from scratch.

### Local install

To install locally to your already created project run the following with **npm**.

```bash
npm install --save-dev @gobstones/gobstones-scripts
```

This will add _gobstones-scripts_ as a dependency to your project.
Remember to install all peer dependencies too, as this are needed to run all tooling that _gobstones-scripts_ require.

## Running through CLI

The common usage is to run _gobstones-scripts_ as a CLI tool, by running directly in the following way if you installed globally

```bash
gobstones-scripts
```

or through **npx** if installed locally.

```bash
npx gobstones-scripts
```

If you have created a project through this tool, you already have a script in your `package.json` file to run the tool, `gbs`. Just run the script via your package manager:

```bash
npm run gbs
```

Run the command always from the root of your project in order to execute local commands.

### CLI usage

The CLI provides you with the following commands:

* **help**: Prints the tool help description. Also, the help is printed if no command is given
* **version**: Prints the tool version information.
* **config**: Prints the tool's configuration, such as, what is the identified root folder, the package folder and the files in use.
* **create <projectName>**: Create a new library project in a subfolder with the given name. This includes creating all the required and recommended style files, define a package.json, git configuration files, visual studio code files, NPM configuration files, contribution guidelines, a readme, a license (MIT by default), install all dependencies, and initialize a git repository. This command is expected to be used when _gobstones-scripts_ is installed globally.
* **init**: The same as create, but runs on the local folder as a project. That is, initialize a project in the current folder. Note that the folder must be empty in order to initialize a project in the folder. This command is expected to be used when _gobstones-scripts_ is installed globally.
* **update [force]**: Override the missing configuration files that are created on an **init** or **create** command on the local project. This is intended to be run locally, on an already created project, to update the configuration. By appending **force** as a subcommand, all files are updated to their latest version.
* **eject [force]**: Eject all the general configuration files to the root project. This includes configuration files for Typescript, Typedoc, JEST, Rollup, and nps. This command is intended to be run locally. If **force** is added, all previously created local files are updated to their latest version. If not, only missing files are copied.
* **run [command]**: Run a command using **nps**. nps allows to run different scripts configured, such as scripts for linting, prettyfing, testing, generating documentation, running in development mode, and others.

## How to configure the tool

When running a command using _gobstones-scripts_ the tool loads all configuration from one of two locations.
* If a configuration file for a tool is present at the root of your project, that configuration is used. As an example, if you have a `rollup.config.js` file in the root of your project, then that file is used to load the Rollup configuration.
* If a configuration file for a tool is not present at the root of your project, then the default configuration file from gobstones-scripts is used. This configuration files are at `./node_modules/@gobstones/gobstones-scripts/config`, and they should not be modified by the end user. If you need changes over a default configuration, you should eject that configuration file to the root of your project.

> A special mention is required for the typescript configuration file, **tsconfig.json**. You will see that this file is actually not present. We use **tsconfig.js** instead, and the corresponding JSON file is generated at runtime when running a command through gobstones-scripts. Using a js file for configuration provides the required flexibility for this project, that is not found in the JSON file, but a JSON file needs to be generated before running the Typescript compiler, as Typescript does not support javascript based configuration. Note that this is all handled automatically by gobstones-scripts, and you just need to remember to edit a tsconfig.js instead of json one if you need to override the default configuration.

## Running commands using gobstones-scripts

Command are run using **nps**. By default, the available command that you can run are located in the default `package-scripts.js` file at the package configuration folder, although you may override it with your own.
If you have created a project from scratch with _gobstones-scripts_ then you can run command by just calling:

```bash
npm start <command>
```

The default command (no command provided) prints all the available commands and help. So in example, if you want to run the tests, you may run:

```bash
npm start test
```

Or if you want to run the linter:

```bash
npm start lint
```

On a newly created project, there are also some additional scripts in your package json that are useful when building and automating, but that can be quite handy when running, such as `test` or `build`, so you can run directly by:

```bash
npm test
```

or

```bash
npm run build
```

You may add additional nps commands by overriding the tools `package-scripts.js` file. But there are a few gotchas.

### Gotchas of overriding nps configuration

When running using _gobstones-scripts_ the configuration files for the building and running tools, such as Typescript compiler configuration, may live in your projects root or be default's, that live in the _gobstones-script_ configuration folder in `node_modules`. The tool first checks what configuration files are to be used, and then calls the appropriate commands with that configuration file as an option. So it's not just as easy as calling `jest` or `rollup`, as an argument to indicate which configuration file is going to be used needs to be included.

The default `package-scripts.js` handles this by importing `tools` from the _gobstones-scripts_ source (see usage as a module for more information), and calling some functions that the tooling provide. Some functions include i.e. the `jest` or the `rollup` function, that call the underlying tool with the appropriate configuration file as an argument. This is achieved by using the configuration that the API exposes.

## API

You can access the API by importing the module

```ts
import gobstones_scripts from '@gobstones/gobstones-scripts'
```

Typings are exported so it can be used in TypeScript without additional packages.

The API exposes the `create`, `init`, `update`, `eject` and `run` functions that are explained in the CLI. It also provides access to the version and the configuration through the `version` and `config` attributes.

Additionally, it provides a ser of functions that are useful for extending the `package-scripts.js` with custom actions, without having to worry about calling the tooling system with the corresponding configuration files. This are exposed at the `tools` object. The `tools` object provides functions such as `jest`, `rollup`, `tsc` and other handy actions such as `rename`, `concurrently` and `series`, that act as expected.

You may read their documentation in the source code.

## Usage with other package managers

By default _gobstones-scripts_ it's intended to be used by **npm**
as the package manager, which is included by default on your node
installation.

Nonetheless, _gobstones-scripts_ has been tested to work with
**pnpm** too. Although not testedm it is expected to work with
**yarn** too.

Some internal commands relay on calling **npm install** or **npx**,
which are replace to their counterparts in other package managers if
_gobstones-scripts_ is called through them.

To detect which package manager has been used, we relay on
`npm_config_user_agent` environment variable, which is populated when
executing through a package manager.

So if you run, i.e. `pnpm start` instead of `npm start` the tool detects **pnpm** as your package manager, and replaces all internal usages of **npm install** to **pnpm install** and **npx** to **pnpm exec**. The same goes for yarn.

By default, **npm** is used, and there is no way to configure this as a forced option to do otherwise just yet.

## Contributing

See the [Gobstones Platform Contributions Guidelines](https://github.com/gobstones/gobstones-guidelines) to contribute.
