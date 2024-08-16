#!/usr/bin/env node
const { readFileSync, writeFileSync } = require('fs');
const process = require('process');

const replaceInTextFile = (filename, textPresent, newText) => {
    const contents = readFileSync(filename, 'utf-8');
    const replaced = contents.replace(textPresent, newText);
    writeFileSync(filename, replaced);
};

const replaceVersionInPackageJson = (newVersion) => {
    replaceInTextFile('./package.json', /"version": ".*"/g, `"version": "${newVersion}"`);
};

const replaceVersionInConfig = (newVersion) => {
    replaceInTextFile('./src/config/about.ts', /const version = '.*'/g, `const version = '${newVersion}'`);
};

const replaceVersionInProjectPackageJson = (projectName, newVersion) => {
    replaceInTextFile(
        `./project-types/${projectName}/package-definition.json`,
        /"@gobstones\/gobstones-scripts": ".*"/g,
        `"@gobstones/gobstones-scripts": "^${newVersion}"`
    );
};

const updateToVersion = (newVersion) => {
    replaceVersionInPackageJson(newVersion);
    replaceVersionInConfig(newVersion);
    replaceVersionInProjectPackageJson('Library', newVersion);
    replaceVersionInProjectPackageJson('CLILibrary', newVersion);
    replaceVersionInProjectPackageJson('ReactLibrary', newVersion);
    replaceVersionInProjectPackageJson('NonCode', newVersion);
};

updateToVersion(process.argv[2]);
