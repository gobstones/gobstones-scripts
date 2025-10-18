#!/usr/bin/env node
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
import { argv, fs, spinner } from 'zx';

/**
 * Update the version of the gobstones-script application, and the
 * imported library in all templates.
 */

const replaceInTextFile = (filename, textPresent, newText) => {
    const contents = fs.readFileSync(filename, 'utf-8');
    const replaced = contents.replace(textPresent, newText);
    fs.writeFileSync(filename, replaced);
};

const replaceVersionInPackageJson = (newVersion: string) => {
    replaceInTextFile('./package.json', /"version": ".*"/g, `"version": "${newVersion}"`);
};

const replaceVersionInConfig = (newVersion: string) => {
    replaceInTextFile('./src/config/about.ts', /const version = '.*'/g, `const version = '${newVersion}'`);
};

const replaceVersionInProjectPackageJson = (projectName: string, newVersion: string) => {
    replaceInTextFile(
        `./project-types/${projectName}/package-definition.json`,
        /"@gobstones\/gobstones-scripts": ".*"/g,
        `"@gobstones/gobstones-scripts": "^${newVersion}"`
    );
};

const updateToVersion = (newVersion: string) => {
    replaceVersionInPackageJson(newVersion);
    replaceVersionInConfig(newVersion);
    replaceVersionInProjectPackageJson('Library', newVersion);
    replaceVersionInProjectPackageJson('CLILibrary', newVersion);
    replaceVersionInProjectPackageJson('ReactLibrary', newVersion);
    replaceVersionInProjectPackageJson('NonCode', newVersion);
};

await spinner('Updating...', () => updateToVersion(argv._[0]));
