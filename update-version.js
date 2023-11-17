#!/usr/bin/env node
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
    replaceInTextFile(
        './src/config/tool.ts',
        /const version = '.*'/g,
        `const version = '${newVersion}'`
    );
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
    replaceVersionInProjectPackageJson('library', newVersion);
    replaceVersionInProjectPackageJson('cli-library', newVersion);
    replaceVersionInProjectPackageJson('react-library', newVersion);
    replaceVersionInProjectPackageJson('web-library', newVersion);
}

updateToVersion(process.argv[2]);
