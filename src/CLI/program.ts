/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2018-2024
 * Gobstones (TM) is a trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3.
 * Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.io/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */

/**
 * ----------------------------------------------------
 * @module CLI
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 *
 * @internal
 * ----------------------------------------------------
 */

import path from 'path';

import { program as commanderProgram } from 'commander';

import * as cli from './cli-helpers';

import { t } from '../@i18n';
import * as api from '../API';
import { config } from '../Config';
import { LogLevel, logger } from '../Helpers/Logger';

/**
 * The command line program definition
 */
export const program = commanderProgram;

/**
 * The general program options.
 *
 * @internal
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
 */
interface PackageManagerBasedOption {
    packageManager?: string;
}

/**
 * The general program options with the "--test" option added.
 *
 * @internal
 */
type GeneralOptionsWithTest = GeneralOptions & { test?: boolean };

/**
 * The options for command that expect a list of items.
 *
 * @internal
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
    .option('-c, --config', t('cli:descriptions.args.config'))
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
    .description(t('descriptions.commands.create'))
    .option(
        '-t, --type <project-type>',
        t('cli:descriptions.args.type', { options: `"${Object.keys(config.projectTypes).join('", "')}"` }),
        'Library'
    )
    .option(
        '-p, --package-manager <package-manager>',
        t('cli:descriptions.args.packageManager', { options: `"${Object.keys(config.packageManagers).join('", "')}"` }),
        'npm'
    )
    .option('-s, --silent', t('cli:descriptions.args.silent'), false)
    .option('-D, --debug', t('cli:descriptions.args.debug'), false)
    .option('-T, --test', t('cli:descriptions.args.test'), false)
    .action((projectName: string, options: PackageManagerBasedOption & GeneralOptionsWithTest) => {
        if (options.debug) {
            logger.level = LogLevel.Debug;
        }
        if (options.silent) {
            logger.off();
        }

        failIfOptionInvalid(options, 'type', Object.keys(config.projectTypes));
        failIfOptionInvalid(options, 'package-manager', Object.keys(config.packageManagers));

        config.init(options.type, options.packageManager, options.debug, options.test, undefined);

        cli.displayWelcomeForAction(
            t('cli:messages.creatingProject', {
                projectName,
                projectType: config.executionEnvironment.projectType,
                packageManager: config.executionEnvironment.packageManager
            })
        );

        cli.runOrEnd(() => {
            api.create(projectName, options.type, options.packageManager, options.test);
        });
    });

program
    .command('init')
    .description(t('descriptions.commands.init'))
    .option(
        '-t, --type <project-type>',
        t('cli:descriptions.args.type', { options: `"${Object.keys(config.projectTypes).join('", "')}"` }),
        'Library'
    )
    .option(
        '-p, --package-manager <package-manager>',
        t('cli:descriptions.args.packageManager', { options: `"${Object.keys(config.packageManagers).join('", "')}"` }),
        'npm'
    )
    .option('-s, --silent', t('cli:descriptions.args.silent'), false)
    .option('-D, --debug', t('cli:descriptions.args.debug'), false)
    .option('-T, --test', t('cli:descriptions.args.test'), false)
    .action((options: PackageManagerBasedOption & GeneralOptionsWithTest) => {
        if (options.debug) {
            logger.level = LogLevel.Debug;
        }
        if (options.silent) {
            logger.off();
        }

        failIfOptionInvalid(options, 'type', Object.keys(config.projectTypes));
        failIfOptionInvalid(options, 'package-manager', Object.keys(config.packageManagers));

        config.init(options.type, options.packageManager, options.debug, options.test, undefined);

        cli.displayWelcomeForAction(
            t('cli:messages.initializingProject', {
                projectType: config.executionEnvironment.projectType,
                packageManager: config.executionEnvironment.packageManager
            })
        );

        cli.runOrEnd(() => {
            api.init(config.executionEnvironment.projectType, config.executionEnvironment.packageManager, options.test);
        });
    });

program
    .command('update')
    .description(t('descriptions.commands.update'))
    .option('-f, --force', 'whether to override previous values', false)
    .option(
        '-i, --items <item>',
        `the items to update. One of "all", "${config.projectTypeFilteredFiles.copiedOnUpdate.join('", "')}"`,
        'all'
    )
    .option(
        '-t, --type <project-type> the project type to create, one of "'
        + Object.keys(config.projectTypes).join('", "')
        + '"'
    )
    .option('-s, --silent', t('cli:descriptions.args.silent'), false)
    .option('-D, --debug', t('cli:descriptions.args.debug'), false)
    .option('-T, --test', t('cli:descriptions.args.test'), false)
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

        config.init(options.type, undefined, options.debug, options.test, undefined);

        cli.displayWelcomeForAction(
            t('cli:messages.updatingFiles', {
                projectType: config.executionEnvironment.projectType,
                packageManager: config.executionEnvironment.packageManager,
                files: options.items ?? ''
            })
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
        });
    });

program
    .command('eject')
    .description(t('descriptions.commands.eject'))
    .option('-f, --force', 'whether to override previous values', false)
    .option(
        '-i, --items <item>',
        `the items to update. One of "all", "${config.projectTypeFilteredFiles.copiedOnEject.join('", "')}"`,
        'all'
    )
    .option(
        '-t, --type <project-type>',
        t('cli:descriptions.args.type', { options: `"${Object.keys(config.projectTypes).join('", "')}"` })
    )
    .option('-s, --silent', t('cli:descriptions.args.silent'), false)
    .option('-D, --debug', t('cli:descriptions.args.debug'), false)
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

        config.init(options.type, undefined, options.debug, undefined, undefined);

        cli.displayWelcomeForAction(
            t('cli:messages.ejectingFiles', {
                projectType: config.executionEnvironment.projectType,
                packageManager: config.executionEnvironment.packageManager,
                files: options.items ?? ''
            })
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
        });
    });

program
    .command('run [command] [...args]')
    .description(t('descriptions.commands.run'))
    .option(
        '-t, --type <project-type>',
        t('cli:descriptions.args.type', { options: `"${Object.keys(config.projectTypes).join('", "')}"` })
    )
    .option(
        '-p, --package-manager <package-manager>',
        t('cli:descriptions.args.packageManager', { options: `"${Object.keys(config.packageManagers).join('", "')}"` }),
        'npm'
    )
    .option('-s, --silent', t('cli:descriptions.args.silent'), false)
    .option('-D, --debug', t('cli:descriptions.args.debug'), false)
    .option('-j, --use-local-tsconfig-json', t('cli:descriptions.args.useLocalTsconfigJson'), false)
    .action(
        (
            command: string,
            args: string[],
            options: PackageManagerBasedOption & GeneralOptions & { useLocalTsconfigJson: boolean }
        ) => {
            if (options.debug) {
                logger.level = LogLevel.Debug;
            }
            if (options.silent) {
                logger.off();
            }

            failIfOptionInvalid(options, 'package-manager', Object.keys(config.packageManagers));
            failIfOptionInvalid(options, 'type', Object.keys(config.projectTypes));

            config.init(options.type, options.packageManager, options.debug, undefined, options.useLocalTsconfigJson);

            cli.displayWelcomeForAction(
                !command
                    ? t('cli:messages.presentingCommands', {
                        projectType: config.executionEnvironment.projectType,
                        packageManager: config.executionEnvironment.packageManager
                    })
                    : t('cli:messages.executingCommands', {
                        command,
                        projectType: config.executionEnvironment.projectType,
                        packageManager: config.executionEnvironment.packageManager
                    })
            );

            cli.runOrEnd(() => {
                api.run(command, args, undefined, options.packageManager, options.useLocalTsconfigJson);
            });
        }
    );

/**
 * Throw an error if the given value at the options object (if any) is not a valid
 * option for the given option name, if the possible values is one of the given
 * possible values.
 *
 * @param options - The object containing all options.
 * @param optionName - The option name to verify.
 * @param possibleValues - The possible values the option can take.
 *
 * @throws if there is an option given and the value is not one of the possible values.
 */
export function failIfOptionInvalid(options: unknown, optionName: string, possibleValues: string[]): void {
    const optionNameCamelCased = optionName.replace(/-(.)/g, (_, group1) => (group1 as string).toUpperCase());
    const optionValue = (options as Record<string, string>)[optionNameCamelCased];

    if (optionValue && !possibleValues.includes(optionValue)) {
        const message = t('cli:errors.invalidOption', {
            optionValue,
            optionName,
            options: `"${possibleValues.join('", "')}"`
        });
        logger.on();
        logger.error(message, 'bgRed');
        process.exit(1);
    }
}
