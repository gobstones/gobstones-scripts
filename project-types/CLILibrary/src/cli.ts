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
 * This is the file that contains the CLI program.
 * One built, you may run this file from the command line.
 *
 * @module Internal.CLI
 * @author Your Name <yourname@company.com>
 *
 */
import { cli, readJSON } from '@gobstones/gobstones-core/cli';

import { t } from './@i18n';
import { MyClass } from './Models/MyClass';

const packageJSON = readJSON('../package.json') as { name: string; version: string };

interface CLIArguments {
    language: string;
    in: string;
    out: string;
}

// Read from the package.json in order to retrieve the name and version
const name = packageJSON.name.split('/').slice(-1).pop() ?? 'gobstones-app';
const versionNumber = packageJSON.version;

cli({
    texts: {
        name,
        versionNumber,
        help: t('cli:descriptions.help'),
        tool: t('cli:descriptions.tool'),
        language: t('cli:descriptions.language'),
        languageError: t('cli:errors.language'),
        version: t('cli:descriptions.version')
    }
})
    .command('awesome [text] [text2]', t('application:class.awesome'), (cmd) => {
        cmd.input(t('cli:descriptions.in'), t('cli:errors.file'))
            .output('cli:descriptions.out')
            .action((app, _, _opts: CLIArguments) => {
                app.outputHelpOnNoArgs();
                const input = app.read();
                const myclass = new MyClass();
                const output = myclass.awesome(input);
                app.write(output);
            });
    })
    .command('notCool [text]', t('application:class.notCool'), (cmd) => {
        cmd.input(t('cli:descriptions.in'), t('cli:errors.file'))
            .output(t('cli:descriptions.out'))
            .action((app, _, _opts: CLIArguments) => {
                app.outputHelpOnNoArgs();
                const input = app.read();
                const myclass = new MyClass();
                const output = myclass.notCool(input);
                app.write(output);
            });
    })
    .run();
