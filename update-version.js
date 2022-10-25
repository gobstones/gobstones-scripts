#!/usr/bin/env node
const {readFileSync, writeFileSync, promises: fsPromises} = require('fs');
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
    replaceInTextFile('./src/config/project.js', /const version = '.*';/g, `const version = '${newVersion}'`);
}

function replaceVersionInProjectPackageJson(projectName, newVersion) {
    replaceInTextFile(`./project-types/${projectName}/package.json`, /"@gobstones\/gobstones-scripts": ".*"/g, `"@gobstones/gobstones-scripts": "^${newVersion}"`);
}

function updateToVersion(newVersion) {
    replaceVersionInPackageJson(newVersion);
    replaceVersionInConfig(newVersion);
    replaceVersionInProjectPackageJson('library', newVersion);
    replaceVersionInProjectPackageJson('cli-library', newVersion);
    replaceVersionInProjectPackageJson('react-library', newVersion);
}

updateToVersion(process.argv[2]);
