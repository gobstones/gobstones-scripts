#!/usr/bin/env node
/**
 * This is the main script that is run when gobstones-scripts is executed.
 *
 * In itself, the script first checks for files that define the project's
 * toolkit configurations, and creates environment variables for each of those
 * files. It loads the file in the user's project root folder, if present, or
 * loads the default file from the `config` folder.
 *
 * By loading on such files, the user gets sensible defaults for a project, having
 * to do little to no configuration when creating a library or module.
 *
 * The script provides 5 commands, 2 of which are meant to be executed with the
 * gobstones-scripts installed globally, and 3 to be run in a project.
 * - create - Globally. To create a new project with all the configuration.
 * - init   - Globally. To initialize a project in the current folder
 * - update - Locally. Update the configuration of the project file.
 * - eject  - Locally. Extract the configuration files to the project's folder.
 * - run    - Locally. Run an NPS command.
 *
 * It can also show the version information and the loaded configuration with the
 * `version` and `config` commands, and show the tool's help with the `help` command
 *
 *
 * @module CLI
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 **/

const api = require("./api/api");
const figlet = require("figlet");
const chalk = require("ansi-colors");
const process = require("process");

process.stdout.setEncoding("utf8");
process.stderr.setEncoding("utf8");

function newline(msg) {
    process.stdout.write("\n");
}

function display(msg) {
    process.stdout.write(msg + "\n");
}

function error(msg) {
    process.stderr.write(msg + "\n");
}

function errorAndExit(msg) {
    error(msg);
    process.exit(1);
}

function printBanner() {
    let text = figlet.textSync("gobstones-scripts", {
        font: "Standard",
        horizontalLayout: "fitted",
        verticalLayout: "default",
        width: 120,
        whitespaceBreak: true,
    });
    display(chalk.red(text));
}

function printWelcome() {
    display('Welcome to gobstones-scripts version '+ api.version);
}

function printConfig(configuration) {
    display(`
The current directory (project root) is:
        ${chalk.blue(configuration.root)}

The gobstones-script configuration is:
        ${chalk.blue(configuration.package)}

Current configuration files in use are:`);

    for (key in configuration.files) {
        display("\t" + key + ": " + chalk.blue(configuration.files[key]));
    }
    newline();
}

function printScriptHelp() {
    display(`
This is the command's help.

You may run:

    ${chalk.green(
        "help"
    )}      - Display this message, also displayed when no arguments are given.
    ${chalk.green(
        "version"
    )}      - Display the version information.
    ${chalk.green(
        "config"
    )}      - Show the configuration files being read [in project].
    ${chalk.green(
        "create [project-name]"
    )}      - Create a new library project with the given name in a subdirectory.
    ${chalk.green(
        "init"
    )}      - Initialize a new library in the current folder.
    ${chalk.green(
        "update [force]"
    )}      - Copy the project's initialization files to this project. Add force to overwrite the previous versions of your files.
    ${chalk.green(
        "eject [force]"
    )}      - Copy the default configuration files to this project, overriding the gobstones-scripts ones.
    ${chalk.green(
        "run"
    )}      - Run a NPS command form the nps configuration.
`);
}

function main() {
    // Get the first command of the script
    command = process.argv.length >= 3 ? process.argv[2] : null;
    if (!command || command == "help") {
        // Start by showing the welcome to the user
        printBanner();
        newline()
        printWelcome()
        newline()
        // And print the help
        printScriptHelp();
    } else if (command == "version") {
        // Print only the version number, so it can
        // be re-processed by other scripts
        display(api.version)
    } else if (command == "config") {
        // Start by showing the welcome to the user
        printBanner();
        newline();
        printWelcome();
        newline();

        printConfig(api.config);
    } else if (command == "create") {
        // Start by showing the welcome to the user
        printBanner();
        newline()
        printWelcome()
        newline()

        if (process.argv.length < 4) {
            errorAndExit(
                `${chalk.bgRed("CREATE EXPECTS A PROJECT NAME, BUT NONE WAS GIVEN.")}`
            );
        }

        try {
            projectName = process.argv[3];
            api.create(projectName);
        } catch (e) {
            if (e === "non empty folder") {
                errorAndExit(
                    `${chalk.bgRed("CREATE EXPECTS THAT A FOLDER WITH THE PROJECT NAME DOES NOT EXIST OR IF IT DOES, IT SHOULD BE EMPTY.")}`
                );
            } else {
                throw e;
            }
        }
    } else if (command == "init") {
        // Start by showing the welcome to the user
        printBanner();
        newline()
        printWelcome()
        newline()

        try {
            projectName = process.argv[3];
            api.init();
        } catch (e) {
            if (e === "non empty folder") {
                errorAndExit(
                    `${chalk.bgRed("INIT EXPECTS THE CURRENT FOLDER TO BE EMPTY.")}`
                );
            } else {
                throw e;
            }
        }
    } else if (command == "update") {
        // Start by showing the welcome to the user
        printBanner();
        newline()
        printWelcome()
        newline()

        try {
            let forced = (process.argv.length > 3 && process.argv[3] == "force")
            let copied = api.update(forced);
            if (copied.length == 0) {
                display("\tNo files updated");
            } else {
                for (const file of copied) {
                    display("\tUpdated " + chalk.blue(file));
                }
            }
        } catch (e) {
            if (e === "non root folder") {
                errorAndExit(
                    `${chalk.bgRed("UPDATE SHOULD BE RUN ON THE ROOT OF A PROJECT.")}`
                );
            } else {
                throw e;
            }
        }
    } else if (command == "eject") {
        // Start by showing the welcome to the user
        printBanner();
        newline()
        printWelcome()
        newline()

        try {
            let forced = (process.argv.length > 3 && process.argv[3] == "force")
            let ejected = api.eject(forced);
            if (ejected.length == 0) {
                display("\tNo files ejected");
            } else {
                for (const file of ejected) {
                    display("\tEjected " + chalk.blue(file));
                }
            }
        } catch (e) {
            if (e === "non root folder") {
                errorAndExit(
                    `${chalk.bgRed("EJECT SHOULD BE RUN ON THE ROOT OF A PROJECT.")}`
                );
            } else {
                throw e;
            }
        }
    } else if (command == "run") {
        // Start by showing the welcome to the user
        printBanner();
        newline()
        printWelcome()
        newline()

        api.run(process.argv.length > 3 ? process.argv.slice(3) : []);
    } else {
        printBanner();
        error(`
    ${chalk.bgRed("UNKNOWN COMMAND GIVEN: " + command)}

    Please read the help to get started.

    `);
        printScriptHelp();
    }
}


main();
