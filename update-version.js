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
    replaceInTextFile('./src/config/tool.js', /const version = '.*'/g, `const version = '${newVersion}'`);
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

/*
Libraries for react only
"@babel/core": "^7.20.5",
"@babel/preset-env": "^7.20.2",
"@babel/preset-react": "^7.18.6",
"@babel/preset-typescript": "^7.18.6",
"@mdx-js/react": "^2.2.1",
"@storybook/addon-actions": "^6.5.14",
"@storybook/addon-essentials": "^6.5.14",
"@storybook/addon-links": "^6.5.14",
"@storybook/builder-webpack5": "^6.5.14",
"@storybook/manager-webpack5": "^6.5.14",
"@storybook/preset-scss": "^1.0.3",
"@storybook/react": "^6.5.14",
"@testing-library/jest-dom": "^5.16.5",
"@testing-library/react": "^13.4.0",
"@types/react": "^18.0.26",
"@types/testing-library__jest-dom": "^5.14.5",
"babel-jest": "^29.3.1",
"babel-loader": "^9.1.0",
"css-loader": "^6.7.3",
"html-webpack-plugin": "^5.5.0",
"identity-obj-proxy": "^3.0.0",
"jest-environment-jsdom": "^29.3.1",
"react": "^18.2.0",
"react-dom": "^18.2.0",
"rollup-plugin-dts": "^5.0.0",
"rollup-plugin-postcss": "^4.0.2",
"sass": "^1.56.2",
"sass-loader": "^13.2.0",
"style-loader": "^3.3.1",
*/
