/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2018-2024
 * Gobstones (TM) is a trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3. Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.io/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
/**
 * @module Internal.CLI
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 **/
import path from 'path';

import { program as commanderProgram } from 'commander';

import * as cli from './cli-helpers';

import * as api from '../api';
import { config } from '../config';
import { LogLevel, logger } from '../helpers/Logger';

/**
 * The command line program definition
 *
 * @internal
 * @group Internal: Main
 */
export const program = commanderProgram;

/**
 * The general program options.
 *
 * @internal
 * @group Internal: Types
 */
interface GeneralOptions {
    type?: string;
    silent?: boolean;
    debug?: boolean;
}

/**
 * The options that expect a package manager
 *
 * @internal
 * @group Internal: Types
 */
interface PackageManagerBasedOption {
    packageManager?: string;
}

/**
 * The general program options with the "--test" option added.
 *
 * @internal
 * @group Internal: Types
 */
type GeneralOptionsWithTest = GeneralOptions & { test?: boolean };

/**
 * The options for command that expect a list of items.
 *
 * @internal
 * @group Internal: Types
 */
interface ItemBasedOptions {
    items?: string;
    force?: boolean;
}

// Initialize the configuration
config.init();

program
    .description(`${cli.banner()}\n\n${cli.welcome()}`)
    .addHelpText('before', `${cli.banner()}\n\n${cli.welcome()}`)
    .version(config.environment.toolVersion, '-v --version')
    .option('-c, --config', "display the tool's detected configuration")
    .action((options: { config?: boolean }) => {
        if (!options.config) {
            program.outputHelp();
            process.exit(0);
        }
        cli.printConfiguration();
        process.exit(0);
    });

program
    .command('create <project-name>')
    .description('create a new project with the given project name')
    .option(
        '-t, --type <project-type> The project type to create, one of "' +
            Object.keys(config.projectTypes).join('", "') +
            '"'
    )
    .option(
        '-p, --package-manager <package-manager> The project manager to use, one of "' +
            Object.keys(config.packageManagers).join('", "') +
            '"',
        'npm'
    )
    .option('-s, --silent', "Run silently, not displaying the tool's banner", false)
    .option('-D, --debug', "Run in debug mode, printing all the internal tool's processing", false)
    .option('-T, --test', 'Run using verdaccio as a registry', false)
    .action((projectName: string, options: PackageManagerBasedOption & GeneralOptionsWithTest) => {
        if (options.debug) {
            logger.level = LogLevel.Debug;
        }
        if (options.silent) {
            logger.off();
        }

        failIfOptionInvalid(options, 'type', Object.keys(config.projectTypes));
        failIfOptionInvalid(options, 'package-manager', Object.keys(config.packageManagers));

        config.init(options.type, options.packageManager, options.debug, options.test);

        cli.displayWelcomeForAction(
            `Creating a project by the name "${projectName}" of type ` +
                `"${config.executionEnvironment.projectType}" using package manager ` +
                `"${config.executionEnvironment.packageManager}".`
        );

        cli.runOrEnd(() => {
            api.create(projectName, options.type, options.packageManager, options.test);
        }, [
            {
                error: 'non empty folder',
                msg:
                    'Create expects that a folder with the project name ' +
                    'does not exists or if it does, it should be empty.'
            }
        ]);
    });

program
    .command('init')
    .description('initialize a project in the current folder')
    .option(
        '-t, --type <project-type> The project type to create, one of "' +
            Object.keys(config.projectTypes).join('", "') +
            '"'
    )
    .option(
        '-p, --package-manager <package-manager> The project manager to use, one of "' +
            Object.keys(config.packageManagers).join('", "') +
            '"',
        'npm'
    )
    .option('-s, --silent', "Run silently, not displaying the tool's banner", false)
    .option('-D, --debug', "Run in debug mode, printing all the internal tool's processing", false)
    .option('-T, --test', 'Run using verdaccio as a registry', false)
    .action((options: PackageManagerBasedOption & GeneralOptionsWithTest) => {
        if (options.debug) {
            logger.level = LogLevel.Debug;
        }
        if (options.silent) {
            logger.off();
        }

        failIfOptionInvalid(options, 'type', Object.keys(config.projectTypes));
        failIfOptionInvalid(options, 'package-manager', Object.keys(config.packageManagers));

        config.init(options.type, options.packageManager, options.debug, options.test);

        cli.displayWelcomeForAction(
            `Initializing a project in the current directory of type ` +
                `"${config.executionEnvironment.projectType}" using package manager ` +
                `"${config.executionEnvironment.packageManager}".`
        );

        cli.runOrEnd(() => {
            api.init(config.executionEnvironment.projectType, config.executionEnvironment.packageManager, options.test);
        }, [
            {
                error: 'non empty folder',
                msg:
                    'Init expects the current folder to be empty, but the ' +
                    'folder contains elements.\nEnsure that you are calling ' +
                    'init from an empty folder an try again.'
            }
        ]);
    });

program
    .command('update')
    .description('update the root files of the project')
    .option('-f, --force', 'Whether to override previous values', false)
    .option(
        '-i, --items <item>',
        `The items to update. One of "all", ${config.projectTypeFilteredFiles.copiedOnUpdate.join('", "')}`,
        'all'
    )
    .option(
        '-t, --type <project-type> The project type to create, one of "' +
            Object.keys(config.projectTypes).join('", "') +
            '"'
    )
    .option('-s, --silent', "Run silently, not displaying the tool's banner", false)
    .option('-D, --debug', "Run in debug mode, printing all the internal tool's processing", false)
    .option('-T, --test', 'Run using verdaccio as a registry', false)
    .action((options: GeneralOptionsWithTest & ItemBasedOptions) => {
        if (options.debug) {
            logger.level = LogLevel.Debug;
        }
        if (options.silent) {
            logger.off();
        }

        failIfOptionInvalid(options, 'type', Object.keys(config.projectTypes));

        logger.log(JSON.stringify(config.projectTypeFilteredFiles));

        if (options.items !== 'all') {
            failIfOptionInvalid(options, 'items', config.projectTypeFilteredFiles.copiedOnUpdate);
        }

        config.init(options.type, undefined, options.debug, options.test);

        cli.displayWelcomeForAction(
            `Updating files in current project of type ` +
                `"${config.executionEnvironment.projectType}" using package manager ` +
                `"${config.executionEnvironment.packageManager}".\n\n` +
                `Files to update: ${options.items}`
        );

        cli.runOrEnd(() => {
            const files = api.update(options.items, options.force, options.type, options.test);
            const useAbsolute = config.executionEnvironment.useFullPaths;

            logger.on();
            logger.log('Files updated:');
            files.forEach((file) => {
                const fileName = useAbsolute ? file : path.relative(config.locations.projectRoot, file);
                logger.log(`\t${fileName}`, 'blue');
            });
        }, [{ error: 'non root folder', msg: 'Update should be run on the root of a project.' }]);
    });

program
    .command('eject')
    .description('eject the configuration files of the project')
    .option('-f, --force', 'Whether to override previous values', false)
    .option(
        '-i, --items <item>',
        `The items to update. One of "all", ${config.projectTypeFilteredFiles.copiedOnEject.join('", "')}`,
        'all'
    )
    .option(
        '-t, --type <project-type> The project type to create, one of "' +
            Object.keys(config.projectTypes).join('", "') +
            '"'
    )
    .option('-s, --silent', "Run silently, not displaying the tool's banner", false)
    .option('-D, --debug', "Run in debug mode, printing all the internal tool's processing", false)
    .action((options: GeneralOptions & ItemBasedOptions) => {
        if (options.debug) {
            logger.level = LogLevel.Debug;
        }
        if (options.silent) {
            logger.off();
        }

        failIfOptionInvalid(options, 'type', Object.keys(config.projectTypes));

        if (options.items !== 'all') {
            failIfOptionInvalid(options, 'items', config.projectTypeFilteredFiles.copiedOnEject);
        }

        config.init(options.type, undefined, options.debug, false);

        cli.displayWelcomeForAction(
            `Ejecting files in current project of type ` +
                `"${config.executionEnvironment.projectType}" using package manager ` +
                `"${config.executionEnvironment.packageManager}".\n\n` +
                `Files to update: ${options.items}`
        );

        cli.runOrEnd(() => {
            const files = api.eject(options.items, options.force, options.type);
            const useAbsolute = config.executionEnvironment.useFullPaths;
            logger.on();
            logger.log('Files ejected:');
            files.forEach((file) => {
                const fileName = useAbsolute ? file : path.relative(config.locations.projectRoot, file);
                logger.log(`\t${fileName}`, 'blue');
            });
        }, [{ error: 'non root folder', msg: 'Eject should be run on the root of a project.' }]);
    });

program
    .command('run [command] [...args]')
    .description('run a command with nps')
    .option(
        '-t, --type <project-type> The project type to create, one of "' +
            Object.keys(config.projectTypes).join('", "') +
            '"'
    )
    .option(
        '-p, --package-manager <package-manager> The project manager to use, one of "' +
            Object.keys(config.packageManagers).join('", "') +
            '"',
        'npm'
    )
    .option('-s, --silent', "Run silently, not displaying the tool's banner", false)
    .option('-D, --debug', "Run in debug mode, printing all the internal tool's processing", false)
    .action((command: string, args: string[], options: PackageManagerBasedOption & GeneralOptions) => {
        if (options.debug) {
            logger.level = LogLevel.Debug;
        }
        if (options.silent) {
            logger.off();
        }

        failIfOptionInvalid(options, 'package-manager', Object.keys(config.packageManagers));
        failIfOptionInvalid(options, 'type', Object.keys(config.projectTypes));

        config.init(options.type, options.packageManager, options.debug, false);

        cli.displayWelcomeForAction(
            (!command
                ? `Displaying all available commands on project of type `
                : `Running command "${command}" on project of type `) +
                `"${config.executionEnvironment.projectType}" using package manager ` +
                `"${config.executionEnvironment.packageManager}".`
        );

        api.run(command, args, undefined, options.packageManager);
    });

/**
 * Throw an error if the given value at the options object (if any) is not a valid
 * option for the given option name, if the possible values is one of the given
 * possible values.
 *
 * @param options The object containing all options.
 * @param optionName The option name to verify.
 * @param possibleValues The possible values the option can take.
 *
 * @throws if there is an option given and the value is not one of the possible values.
 *
 * @group Internal: Functions
 */
export function failIfOptionInvalid(options: any, optionName: string, possibleValues: string[]): void {
    const optionNameCamelCased = optionName.replace(/-(.)/g, (_, group1) => group1.toUpperCase());
    const optionValue = options[optionNameCamelCased];

    if (optionValue && !possibleValues.includes(optionValue)) {
        const message =
            `The value "${optionValue}" is not a valid option for the argument "${optionName}"\n` +
            `Please, select one of the following: "${possibleValues.join('", "')}"`;

        logger.on();
        logger.error(message, 'bgRed');
        process.exit(1);
    }
}
