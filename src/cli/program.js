/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @namespace CLI.Program
 **/

const commander = require('commander');
const path = require('path');

const cli = require('./cli_helpers');

const api = require('../api');
const validators = require('../api/validators');
const { files, project } = require('../config');

/**
 * The program
 *
 * @type {Command}
 * @static
 * @memberof CLI.Program
 */
const program = commander.program;

program
    .description(`${cli.banner()}\n\n${cli.welcome()}`)
    .addHelpText('beforeAll', `${cli.banner()}\n\n${cli.welcome()}`)
    .version(cli.version)
    .option('-c, --config [projectType]')
    .action((options) => {
        if (options.config && typeof options.config === 'string') {
            validators.failIfOptionInvalid(options, 'config', project.types);
        }
        cli.printConfigurationIfOptionGiven(
            options,
            api.config(typeof options.config === 'string' ? options.config : undefined),
            typeof options.config === 'string' ? options.config : undefined
        );
    });

program
    .command('create <project-name>')
    .description('create a new project with the given project name.')
    .option(
        '-t, --type <project-type> The project type to create, one of "' +
            project.types.join('", "') +
            '"'
    )
    .option(
        '-p, --package-manager <package-manager> The project manager to use, one of "' +
            project.managers.join('", "') +
            '"'
    )
    .action((projectName, options) => {
        validators.failIfOptionInvalid(options, 'type', project.types);
        validators.failIfOptionInvalid(options, 'package-manager', project.managers);
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
    .option('-t, --type <project-type>')
    .option('-p, --package-manager <package-manager>')
    .action((options) => {
        validators.failIfOptionInvalid(options, 'type', project.types);
        validators.failIfOptionInvalid(options, 'package-manager', project.managers);
        cli.runOrEnd(() => {
            api.init(options.type, options.packageManager);
        }, [{ error: 'non empty folder', msg: 'Init expects the current folder to be empty.' }]);
    });

program
    .command('update')
    .description('update the root files of the project.')
    .option('-f, --force')
    .option('-i, --items <items>')
    .option('-p, --package-manager <package-manager>')
    .action((options) => {
        validators.failIfOptionInvalid(options, 'items', Object.keys(files.update));
        validators.failIfOptionInvalid(options, 'package-manager', project.managers);
        cli.runOrEnd(() => {
            const files = api.update(options.force, options.items, options.packageManager);
            const useAbsolute = api.config().options['absolutePaths'];
            cli.display('Files updated:');
            files.forEach((file) => {
                const fileName = useAbsolute ? file : path.relative(api.config().root, file);
                cli.display('\t' + fileName, 'blue');
            });
        }, [{ error: 'non root folder', msg: 'Update should be run on the root of a project.' }]);
    });

program
    .command('eject')
    .description('eject the configuration files of the project.')
    .option('-f, --force')
    .option('-i, --items <items>')
    .option('-p, --package-manager <package-manager>')
    .action((options) => {
        validators.failIfOptionInvalid(options, 'items', Object.keys(files.eject));
        validators.failIfOptionInvalid(options, 'package-manager', project.managers);
        cli.runOrEnd(() => {
            const files = api.eject(options.force, options.items, options.packageManager);
            const useAbsolute = api.config().options['absolutePaths'];
            cli.display('Files ejected:');
            files.forEach((file) => {
                const fileName = useAbsolute ? file : path.relative(api.config().root, file);
                cli.display('\t' + fileName, 'blue');
            });
        }, [{ error: 'non root folder', msg: 'Eject should be run on the root of a project.' }]);
    });

program
    .command('run [command] [...args]')
    .description('run a command with nps.')
    .option('-p, --package-manager <package-manager>')
    .action((command, args, options) => {
        validators.failIfOptionInvalid(options, 'package-manager', project.managers);
        api.run(command, args, options.packageManager);
    });

module.exports = program;
