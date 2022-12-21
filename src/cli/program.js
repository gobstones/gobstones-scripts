/**
 * In this module the CLI program application is defined.
 * Besides from handling the basic I/O from CLI, and some
 * additional messages to print, this program just calls
 * the basic functions in the API.
 *
 * @namespace CLI.Program
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 **/

const commander = require('commander');
const path = require('path');

const cli = require('./cli_helpers');
const api = require('../api');
const validators = require('../api/validators');
const config = require('../config');

/**
 * The program
 *
 * @type {Command}
 *
 * @static
 * @memberof CLI.Program
 */
const program = commander.program;

program
    .description(`${cli.banner()}\n\n${cli.welcome()}`)
    .addHelpText('beforeAll', `${cli.banner()}\n\n${cli.welcome()}`)
    .version(config.version)
    .option('-c, --config')
    .action((options) => {
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
            config.projectTypes.join('", "') +
            '"'
    )
    .option(
        '-p, --package-manager <package-manager> The project manager to use, one of "' +
            config.packageManagers.join('", "') +
            '"',
        'pnpm'
    )
    .action((projectName, options) => {
        validators.failIfOptionInvalid(options, 'type', config.projectTypes);
        validators.failIfOptionInvalid(options, 'package-manager', config.packageManagers);
        cli.runOrEnd(() => {
            api.create(projectName, options.type, options.packageManager);
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
    .description('initialize a project in the current folder.')
    .option(
        '-t, --type <project-type> The project type to create, one of "' +
            config.projectTypes.join('", "') +
            '"'
    )
    .option(
        '-p, --package-manager <package-manager> The project manager to use, one of "' +
            config.packageManagers.join('", "') +
            '"',
        'pnpm'
    )
    .action((options) => {
        validators.failIfOptionInvalid(options, 'type', config.projectTypes);
        validators.failIfOptionInvalid(options, 'package-manager', config.packageManagers);

        cli.displayWelcomeForAction(
            `Initializing a project in the current directory of type ` +
                `"${options.type || config.loadedOptions.type}" using package manager ` +
                `"${options.packageManager || config.loadedOptions.manager}".`
        );

        cli.runOrEnd(() => {
            api.init(options.type, options.packageManager);
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
        '-p, --package-manager <package-manager> The project manager to use, one of "' +
            config.packageManagers.join('", "') +
            '"',
        'pnpm'
    )
    .action((options) => {
        cli.displayWelcomeForAction(
            `Updating files in current project of type ` +
                `"${options.type || config.loadedOptions.type}" using package manager ` +
                `"${options.packageManager || config.loadedOptions.manager}".\n\n` +
                `Files to update: ${options.items}`
        );

        validators.failIfOptionInvalid(options, 'package-manager', config.packageManagers);
        if (options.items !== 'all') {
            validators.failIfOptionInvalid(
                options,
                'items',
                config[config.loadedOptions.type].onUpdate
            );
        }

        cli.runOrEnd(() => {
            const files = api.update(options.force, options.items, options.packageManager);
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
        '-p, --package-manager <package-manager> The project manager to use, one of "' +
            config.packageManagers.join('", "') +
            '"',
        'pnpm'
    )
    .action((options) => {
        cli.displayWelcomeForAction(
            `Ejecting files in current project of type ` +
                `"${options.type || config.loadedOptions.type}" using package manager ` +
                `"${options.packageManager || config.loadedOptions.manager}".\n\n` +
                `Files to eject: ${options.items}`
        );

        validators.failIfOptionInvalid(options, 'package-manager', config.packageManagers);
        if (options.items !== 'all') {
            validators.failIfOptionInvalid(
                options,
                'items',
                config[config.loadedOptions.type].onEject
            );
        }

        cli.runOrEnd(() => {
            const files = api.eject(options.force, options.items, options.packageManager);
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
            config.packageManagers.join('", "') +
            '"',
        'pnpm'
    )
    .action((command, args, options) => {
        validators.failIfOptionInvalid(options, 'package-manager', config.packageManagers);

        cli.displayWelcomeForAction(
            (!command
                ? `Displaying all available commands on project of type `
                : `Running command "${command}" on project of type `) +
                `"${options.type || config.loadedOptions.type}" using package manager ` +
                `"${options.packageManager || config.loadedOptions.manager}".`
        );

        api.run(command, args, options.packageManager);
    });

module.exports = program;
