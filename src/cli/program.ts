/**
 * @module CLI
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 **/

import { api } from '../api';
import { cli } from './cli_helpers';
import { program as commanderProgram } from 'commander';
import { config } from '../config';
import { failIfOptionInvalid } from '../api/validators';
import path from 'path';

/**
 * The command line program definition
 *
 * @group Main API
 */
export const program = commanderProgram;

program
    .description(`${cli.banner()}\n\n${cli.welcome()}`)
    .addHelpText('beforeAll', `${cli.banner()}\n\n${cli.welcome()}`)
    .version(config.version)
    .option('-c, --config')
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
    .description('create a new project with the given project name.')
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
    .option('-T, --test', 'Run using verdaccio as a registry', false)
    .action(
        (
            projectName: string,
            options: { type?: string; packageManager?: string; test?: boolean }
        ) => {
            failIfOptionInvalid(options, 'type', Object.keys(config.projectTypes));
            failIfOptionInvalid(options, 'package-manager', Object.keys(config.packageManagers));

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
        }
    );

program
    .command('init')
    .description('initialize a project in the current folder.')
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
    .option('-T, --test', 'Run using verdaccio as a registry', false)
    .action((options: { type?: string; packageManager?: string; test?: boolean }) => {
        failIfOptionInvalid(options, 'type', Object.keys(config.projectTypes));
        failIfOptionInvalid(options, 'package-manager', Object.keys(config.packageManagers));

        cli.displayWelcomeForAction(
            `Initializing a project in the current directory of type ` +
                `"${options.type ?? config.loadedOptions.type}" using package manager ` +
                `"${options.packageManager ?? config.loadedOptions.manager}".`
        );

        cli.runOrEnd(() => {
            api.init(
                options.type ?? config.loadedOptions.type,
                options.packageManager ?? config.loadedOptions.manager,
                options.test
            );
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
    .description('update the root files of the project.')
    .option('-f, --force', 'Whether to override previous values', false)
    .option(
        '-i, --items <items>',
        'The items to update. One of "' +
            'all, ' +
            config[config.loadedOptions.type].onUpdate.join(', ') +
            '"',
        'all'
    )
    .option(
        '-t, --type <project-type> The project type to create, one of "' +
            Object.keys(config.projectTypes).join('", "') +
            '"'
    )
    .option('-T, --test', 'Run using verdaccio as a registry', false)
    .action((options: { items?: string; type?: string; force?: boolean; test?: boolean }) => {
        failIfOptionInvalid(options, 'type', Object.keys(config.loadedOptions.type));

        if (options.items !== 'all') {
            failIfOptionInvalid(options, 'items', config[config.loadedOptions.type].onUpdate);
        }

        cli.displayWelcomeForAction(
            `Updating files in current project of type ` +
                `"${options.type ?? config.loadedOptions.type}" using package manager ` +
                `"${config.loadedOptions.manager}".\n\n` +
                `Files to update: ${options.items}`
        );

        cli.runOrEnd(() => {
            const files = api.update(options.force, options.items, options.type, options.test);
            const useAbsolute = config.useAbsolutePaths;
            cli.display('Files updated:');
            files.forEach((file) => {
                const fileName = useAbsolute ? file : path.relative(config.projectRootPath, file);
                cli.display('\t' + fileName, 'blue');
            });
        }, [{ error: 'non root folder', msg: 'Update should be run on the root of a project.' }]);
    });

program
    .command('eject')
    .description('eject the configuration files of the project.')
    .option('-f, --force', 'Whether to override previous values', false)
    .option(
        '-i, --items <items>',
        'The items to update. One of "' +
            'all, ' +
            config[config.loadedOptions.type].onEject.join(', ') +
            '"',
        'all'
    )
    .option(
        '-t, --type <project-type> The project type to create, one of "' +
            Object.keys(config.projectTypes).join('", "') +
            '"'
    )
    .action((options: { items?: string; type?: string; force?: boolean }) => {
        failIfOptionInvalid(options, 'type', Object.keys(config.loadedOptions.type));

        if (options.items !== 'all') {
            failIfOptionInvalid(options, 'items', config[config.loadedOptions.type].onEject);
        }

        cli.displayWelcomeForAction(
            `Ejecting files in current project of type ` +
                `"${options.type ?? config.loadedOptions.type}" using package manager ` +
                `"${config.loadedOptions.manager}".\n\n` +
                `Files to eject: ${options.items}`
        );

        cli.runOrEnd(() => {
            const files = api.eject(options.force, options.items, options.type);
            const useAbsolute = config.useAbsolutePaths;
            cli.display('Files ejected:');
            files.forEach((file) => {
                const fileName = useAbsolute ? file : path.relative(config.projectRootPath, file);
                cli.display('\t' + fileName, 'blue');
            });
        }, [{ error: 'non root folder', msg: 'Eject should be run on the root of a project.' }]);
    });

program
    .command('run [command] [...args]')
    .description('run a command with nps.')
    .option(
        '-p, --package-manager <package-manager> The project manager to use, one of "' +
            Object.keys(config.packageManagers).join('", "') +
            '"',
        'npm'
    )
    .action((command: string, args: string[], options: { packageManager: string }) => {
        failIfOptionInvalid(options, 'package-manager', Object.keys(config.packageManagers));

        cli.displayWelcomeForAction(
            (!command
                ? `Displaying all available commands on project of type `
                : `Running command "${command}" on project of type `) +
                `"${config.loadedOptions.type}" using package manager ` +
                `"${options.packageManager ?? config.loadedOptions.manager}".`
        );

        api.run(command, args, options.packageManager, undefined);
    });
