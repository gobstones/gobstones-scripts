/**
 * This is the file that contains the CLI program.
 * One built, you may run this file from the command line.
 *
 * @module Internal.CLI
 * @author Your Name <yourname@company.com>
 *
 */
import { cli, readJSON } from '@gobstones/gobstones-core/cli';

import { MyClass } from './models/MyClass';
import { intl } from './translations';

const packageJSON = readJSON('../package.json');

interface CLIArguments {
    language: string;
    in: string;
    out: string;
}

// Read from the package.json in order to retrieve the name and version
const name = (packageJSON.name as string).split('/').slice(-1).pop() ?? 'gobstones-app';
const versionNumber = packageJSON.version as string;

cli({
    translator: intl,
    texts: {
        name,
        versionNumber,
        help: 'cli.descriptions.help',
        tool: 'cli.descriptions.tool',
        language: 'cli.descriptions.language',
        languageError: 'cli.errors.language',
        version: 'cli.descriptions.version'
    }
})
    .command('awesome [text] [text2]', 'cli.awesome.description', (cmd) => {
        cmd.input('cli.descriptions.in', 'cli.errors.file')
            .output('cli.descriptions.out')
            .action((app, _, opts: CLIArguments) => {
                app.outputHelpOnNoArgs();
                const input = app.read();
                const myclass = new MyClass();
                const output = myclass.awesome(input);
                app.write(output);
            });
    })
    .command('notCool [text]', 'cli.notCool.description', (cmd) => {
        cmd.input('cli.descriptions.in', 'cli.errors.file')
            .output('cli.descriptions.out')
            .action((app, _, opts: CLIArguments) => {
                app.outputHelpOnNoArgs();
                const input = app.read();
                const myclass = new MyClass();
                const output = myclass.notCool(input);
                app.write(output);
            });
    })
    .run();
