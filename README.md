# gobstones-scripts

Gobstones Scripts is a CLI tool that helps in the creation of library projects for **GobstonesWeb2** by hiding away the configuration files for several building tools, such as Typescript, Rollup, Jest, nps and Typedoc, and providing configuration files in your project root for others.

It also allows to execute nps scripts using this hidden configuration. Configurations may be overwritten at any time to provide more functionality, but defaults tend to work on most cases.

You may thing of gobstones-script as some sort of create-react-app + react-scripts for the Gobstones Project libraries.

[![Licence](https://img.shields.io/github/license/gobstones/gobstones-scripts?style=plastic&label=License&logo=open-source-initiative&logoColor=white&color=olivegreen)](https://github.com/gobstones/gobstones-scripts/blob/main/LICENSE) [![Version](https://img.shields.io/github/package-json/v/gobstones/gobstones-scripts?style=plastic&label=Version&logo=git-lfs&logoColor=white&color=crimson)](https://www.npmjs.com/package/@gobstones/gobstones-scripts) [![API Docs](https://img.shields.io/github/package-json/homepage/gobstones/gobstones-scripts?color=blue&label=API%20Docs&logo=gitbook&logoColor=white&style=plastic)](https://gobstones.github.io/gobstones-scripts)

![GitHub Workflow Tests](https://img.shields.io/github/actions/workflow/status/gobstones/gobstones-scripts/on-commit-test.yml?style=plastic&label=Tests&logo=github-actions&logoColor=white) ![GitHub Workflow Build](https://img.shields.io/github/actions/workflow/status/gobstones/gobstones-scripts/on-commit-build.yml?style=plastic&label=Build&logo=github-actions&logoColor=white)

## Install

This library adds a binary file that can be executed as a CLI.

There are two ways in which you can install gobstones-scripts, globally or locally.

### Global install

e global install allows to execute the _gobstones-scripts_ command globally, by installing the CLI to your path.

The best thing about it is the ability to create new projects or to initialize a project in a specific folder. To install globally with **npm** run

```bash
npm install --global @gobstones/gobstones-scripts
```

You do not need the global installation in order to use _gobstones-scripts_ in a project, but it's useful if you are starting a project from scratch. If you are not planning to create new projects, we recommend to stick with the second method instead.

### Local install

To install locally to your already created project run the following with **npm**.

```bash
npm install --save-dev @gobstones/gobstones-scripts
```

This will add _gobstones-scripts_ as a dependency to your project. This is useful to use _gobtones-scripts_ as a wrapper for configuration files and executing nps commands in your project. Almost all projects in **GobstonesWeb2** use this method, and the project is already added as a dependency that will get installed when running `npm install` on it.

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

The CLI is divided into a main command and multiple sub-commands.

The main command is useful for getting usage help. Run the command without any flags to get information about the different options. Useful flags include:

-   `-h --help`: display help for command
-   `-v --version`: output the version number
-   `-c, --config`: display the tool's detected configuration

Utilities happen through sub-commands:

#### create and init sub-commands

The commands `create` an `init` are used to create or configure new projects. The `create` command is expected to be executed at any directory, and will create a new folder with the project name that will hold your project. On the other hand, `init` will initialize the project in the current directory, thus, expecting the same to be empty.

-   `create [options] <project-name>`: create a new project with the given project name.
-   `init [options]`: initialize a project in the current folder.

A `<project-name>` is any valid project identifier, that is, any string that i valid folder name and contains no spaces.

Valid options include:

-   `-t, --type <project-type>`: The project type to create, one of `library`, `cliLibrary`, `reactLibrary` or `webLibrary`. Defaults to `library`.
-   `-p, --package-manager <package-manager>`: The project manager to use, one of `npm`, `yarn` or `pnpm`. Defaults to `npm`.
-   `-s, --silent`: Run silently, not displaying the tool's banner.
-   `-D, --debug`: Run in debug mode, printing all the internal tool's processing.
-   `-T, --test`: Run using verdaccio as a registry.

A special mention is to be held for the `-T` flag, which is not self-explanatory. See the **Testing newer versions of the library** section in order to better understand what this flag does.

Some common examples may be:

```sh
gobstones-scripts create -t reactLibrary my-react-library
```

```sh
gobstones-scripts init -t cliLibrary
```

#### The update sub-command

The `update` sub-command is intended to update the project's configuration files that live at the root of the project. This command is intended to be executed inside an already created project.

-   `update [options]`: update the root files of the project.

The command has the following options.

-   `-i, --items <item> `: The items to update. One of `all`, `license`, `contributing`, `editorconfig`, `prettier`, `npm`, `eslint`, `git` or `commitlint`. Defaults to `all`.
-   `-t, --type <project-type>`: The project type to create, one of `library`, `cliLibrary`, `reactLibrary` or `webLibrary`. Defaults to `library`.
-   `-s, --silent`: Run silently, not displaying the tool's banner.
-   `-D, --debug`: Run in debug mode, printing all the internal tool's processing.
-   `-T, --test`: Run using verdaccio as a registry.

By default, all root files are updated, but through the `-i` flag a specific file can be updated. `-i` flag expects only one file at a time, that is, execute as:

```sh
gobstones-scripts update -i npm
gobstones-scripts update -i eslint
```

and do not execute as:

```sh
gobstones-scripts update -i npm, eslint
```

Although you can specify the type of the project using `-t`, if the project was created through gobstones-scripts, then the `package.json` will have a `config` section with the project configuration, including the type of the project that will be detected by the tool in case `-t` is not provided.

#### The eject sub-command

The `eject` sub-command allows you to eject the abstracted configuration files of the project.

Some tools, like **typescript**, **rollup**, **typedoc**, **jest** and **nps** have their configuration files abstracted away, that is, these files live inside the **gobstones-scripts** node_modules folder themselves, and not at the root of your project. Most of the time, you will be fine with the provided default configuration, but in occasions, you might need to set up a different configuration for one of these tools for the project. This is where `eject` comes in. By ejecting, the configuration files will be copied to the root of your project, and these files will be used instead of the ones in the gobstones-scripts folder. Note that usually you will not need to eject all files, but only the one of a specific tool, use `-i` flag for that.

-   `eject [options]`: eject the configuration files of the project.

This sub-command have the following options:

-   `-i, --items <item> `: The items to update. One of `all`, `nps`, `rollup`, `typescript`, `typedoc`, `jest`. Defaults to `all`.
-   `-t, --type <project-type>`: The project type to create, one of `library`, `cliLibrary`, `reactLibrary` or `webLibrary`. Defaults to `library`.
-   `-s, --silent`: Run silently, not displaying the tool's banner.
-   `-D, --debug`: Run in debug mode, printing all the internal tool's processing.

An example will be:

```sh
gobstones-scripts eject -i rollup
```

Although you can specify the type of the project using `-t`, if the project was created through gobstones-scripts, then the `package.json` will have a `config` section with the project configuration, including the type of the project that will be detected by the tool in case `-t` is not provided.

#### The run sub-command

The `run` sub-command is used to execute a particular `nps` command through the abstracted configuration provided by `gobstones-script` (except ejected files, in which cae, the ejected configuration will be used).

-   `run [options] [command] [...args]`: run a command with nps.

As you can see, you can call `run` with no options. In this case, the default `nps` command will be executed. Else, you can provide a particular command (one of the nps provided commands) and some arguments.

Available options include:

-   `-t, --type <project-type>`: The project type to create, one of `library`, `cliLibrary`, `reactLibrary` or `webLibrary`. Defaults to `library`.
-   `-p, --package-manager <package-manager>`: The project manager to use, one of `npm`, `yarn` or `pnpm`. Defaults to `npm`.
-   `-s, --silent`: Run silently, not displaying the tool's banner.
-   `-D, --debug`: Run in debug mode, printing all the internal tool's processing.

Available commands depend on project type, and can be found by executing the default action, as presenting the help is the default behavior for any project. Some common actions include

-   `dev`: run the project in development mode.
-   `build`: build the project and output it to `./dist`
-   `test`: run the project's tests, generating coverage reports at `./coverage`.
-   `test.serve`: run the project's tests, generating coverage reports at `./coverage`. and serve the generated folder in a local server.
-   `doc`: build the documentation and output it to `./docs`
-   `doc.serve`: build the documentation and output it to `./docs`, and serve the folder in a local server.
-   `lint`: lint the files in the project.
-   `lint.fix`: lint the files in the project and fix all auto-fixable errors.
-   `prettify`: run prettier with auto-fix in all project files.
-   `clear`: delete all auto-generated files.
-   `changelog`: append the latest tag information to the changelog.
-   `changelog.scratch`: generate the changelog based on tag information for the project.

See the **Running commands using gobstones-scripts** for more information.

## How to configure the tool

The tool provides several project types. When running locally in a project, the project type configuration and the package manager to be used is loaded from `package.json`, in the `config.gobstones-scripts` section. When creating a new project, this configuration is added by default. Be sure not to delete it on modifications to the `package.json` file.

When running a command using _gobstones-scripts_ the tool loads all configuration for the different tooling from one of two locations.

-   If a configuration file for a tool is present at the root of your project, that configuration is used. As an example, if you have a `rollup.config.js` file in the root of your project, then that file is used to load the Rollup configuration.
-   If a configuration file for a tool is not present at the root of your project, then the default configuration file from gobstones-scripts is used. This configuration files are at `./node_modules/@gobstones/gobstones-scripts/config`, and they should not be modified by the end user. If you need changes over a default configuration, you should eject that configuration file to the root of your project.

> A special mention is required for the typescript configuration file, **tsconfig.json**. You will see that this file is actually not present. We use **tsconfig.js** instead, and the corresponding JSON file is generated at runtime when running a command through gobstones-scripts. Using a js file for configuration provides the required flexibility for this project, that is not found in the JSON file, but a JSON file needs to be generated before running the Typescript compiler, as Typescript does not support javascript based configuration. Note that this is all handled automatically by gobstones-scripts, and you just need to remember to edit a tsconfig.js instead of json one if you need to override the default configuration.
> If a tsconfig.json file is actually present, gobstones-script will delete it and use a .js file in its place.

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
import gobstones_scripts from '@gobstones/gobstones-scripts';
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
**yarn** too. _gobstones-scripts_ relies on a flat _node_modules_,
in order to hide away packages, so **pnpm** will not work with this
tool.

Some internal commands relay on calling **npm install** or **npx**,
which are replace to their counterparts in other package managers if
_gobstones-scripts_ is called through them.

To detect which package manager has been used, we relay on
`npm_config_user_agent` environment variable, which is populated when
executing through a package manager.

So if you run, i.e. `yarn start` instead of `npm start` the tool detects **yarn** as your package manager, and replaces all internal usages of **npm install** to **yarn install**.

By default, **npm** is used, although you can configure this by the
**gobstones-scripts** key in your **package.json**.

Support may change in the future once [https://nodejs.org/dist/latest/docs/api/corepack.html](corepack) gets out of the experimental state.

## Underlying technologies

The underlying technologies in use include

-   **typescript** (tsc for building)
-   **rollup** (for bundling libraries and cli-libraries)
-   **vite** (for bundling web-libraries and react-libraries)
-   **eslint** (for linting)
-   **prettier** (for styling)
-   **typedoc** (for documentation generation)
-   **storybook** (for testing and documenting react-libraries)
-   **nps** (for orchestrating the tooling)
-   **husky** (for hooking into git actions)

Other files copied to your project will include

-   **.editorconfig** (for editor styling, matching prettier)
-   **.gitignore** (for git management)
-   **.npmignore** (for publishing configuration)

Also a **.github** folder will configure GitHub actions, and a **.vscode** folder will configure your Visual Studio Code environment on first run.

Finally, other files included do not require special technologies, but are important, such as **CHANGELOG.md**, **CONTRIBUTING.md**, **README.md** and LICENSE, together with **package.json**.

## Updating the version while coding the tool

The tool has a more complex system for updating the version than other libraries, as not only the package.json needs to be changed.
As the version needs to be updated in multiple places of the tool for this to work, an `update-version.js` script exists that does the job. This tool need to be called in the following way:

```sh
node update-version.js <version>
```

Where `<version>` is a specific version using major, minor and patch system. After calling the tool, the version will be updated everywhere for the tool.

## Testing newer versions of the library

This tool relies heavily on the packaging system. In that sense, the library need to be published in order to be tested, which constitutes a problem, as it cannot be tested without publishing. For that, we make use of [verdaccio](http://verdaccio.org). Verdaccio provides a private server, which can run locally. By running verdaccio locally, then the newer versions of the library can be tested using such server instead of having to publish to npm.

Firs, publish the script globally using `npm link`, so you have an easy way of calling the tool.

You can then run the verdaccio server and publish the library to it by running

```sh
npm start verdaccio
```

Also, the following command performs the same:

```sh
npm run build
```

While, on the other hand, `npm test` performs the same after running the linter.

While the server is still running, you can run the globally installed script, adding the testing flag to any command (`--test` or `-T`). This flag instructs the tool to search the library in the verdaccio server instead of npmjs registry.

Additionally, it may happen that you are required to configure verdaccio locally. In such case, run the following command:

```sh
npm start verdaccio.serve
```

This will run the verdaccio server, but it will not attempt to publish the library. You should then configure the user and publish the library manually. First create a user in the server by running:

```sh
npm adduser --registry http://localhost:4567
```

Then login to the registry:

```sh
npm login --registry http://localhost:4567
```

After that, you should be able to publish your library by doing:

```sh
npm publish --registry http://localhost:4567
```

Once the verdaccio server is configured for the first time, you should be able to stop it and the re-run and publish using the `npm start verdaccio` command.

## Contributing

See our [Contributions Guidelines](https://github.com/gobstones/gobstones-guidelines) to contribute.
