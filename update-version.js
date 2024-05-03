#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/explicit-function-return-type */
const { readFileSync, writeFileSync } = require('fs');
const process = require('process');

function replaceInTextFile(filename, textPresent, newText) {
    const contents = readFileSync(filename, 'utf-8');
    const replaced = contents.replace(textPresent, newText);
    writeFileSync(filename, replaced);
}

function replaceVersionInPackageJson(newVersion) {
    replaceInTextFile('./package.json', /"version": ".*"/g, `"version": "${newVersion}"`);
}

function replaceVersionInConfig(newVersion) {
    replaceInTextFile('./src/config/about.ts', /const version = '.*'/g, `const version = '${newVersion}'`);
}

function replaceVersionInProjectPackageJson(projectName, newVersion) {
    replaceInTextFile(
        `./project-types/${projectName}/package-definition.json`,
        /"@gobstones\/gobstones-scripts": ".*"/g,
        `"@gobstones/gobstones-scripts": "^${newVersion}"`
    );
}

function updateToVersion(newVersion) {
    replaceVersionInPackageJson(newVersion);
    replaceVersionInConfig(newVersion);
    replaceVersionInProjectPackageJson('Library', newVersion);
    replaceVersionInProjectPackageJson('CLILibrary', newVersion);
    replaceVersionInProjectPackageJson('ReactLibrary', newVersion);
    replaceVersionInProjectPackageJson('NonCode', newVersion);
}

updateToVersion(process.argv[2]);
