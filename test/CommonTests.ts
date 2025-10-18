/**
 * This test attempts to try out that the CLI of the gobstones-scripts works
 * properly, by running the commands to create a project of each type in a
 * temporary folder, and then running all common actions in each project.
 *
 * Note that this tests MUST be run either before changing the version of the
 * tool. Also note that it only runs locally, but not in CI.
 *
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import process from 'process';
import path from 'path';
import fs from 'fs';

import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import execa from 'execa';

// The main folder of the gobstones-script project
const gbsRoot = process.cwd();
// The location where the project is ought to be created.
const tempLocation = path.join(gbsRoot, 'test', '.temp');

// A helper function to execute command's through execa with the project location as cwd.
const run = (args: string[], cwd: string) => {
    try {
        return execa.sync(path.join(gbsRoot, 'dist/cli.mjs'), args, { cwd: cwd, shell: true });
    } catch {
        expect(`Failed when running:\n\tcommand: "${args.join(' ')}"\n\tat: "${cwd}"`).toBe('');
    }
};

export const testProjectCreation = (projectType: string, projectName: string) => {
    const projectLocation = projectName ? path.join(tempLocation, projectName) : tempLocation;

    beforeAll(() => {
        // Ensure the test temp project location directory exists and it's empty
        if (fs.existsSync(projectLocation)) {
            fs.rmSync(projectLocation, { recursive: true, force: true });
        }
        fs.mkdirSync(projectLocation, { recursive: true });
        process.chdir(projectLocation);
    });

    describe(`Project of type "${projectType}"`, () => {
        it('Can be created correctly', () => {
            process.chdir(tempLocation);
            const stdout = run(['create', '-T', '-t', projectType, projectName], tempLocation);
            expect(stdout && stdout.failed).toBeFalsy();

            // Update Gobstones Script dist folder in the project and package.json, with
            // The one in the root. That is, use the current code in the tests.
            const projectLocation = path.join(tempLocation, projectName);
            const projectGbsScriptsDir = path.join(projectLocation, 'node_modules', '@gobstones', 'gobstones-scripts');
            const projectGbsScriptsDistDir = path.join(projectGbsScriptsDir, 'dist');
            const projectGbsScriptsPackageJson = path.join(projectGbsScriptsDir, 'package.json');

            const rootDistDir = path.join(gbsRoot, 'dist');
            const rootPackageJson = path.join(gbsRoot, 'package.json');

            fs.rmSync(projectGbsScriptsDistDir, { recursive: true, force: true });
            fs.rmSync(projectGbsScriptsPackageJson);

            fs.cpSync(rootDistDir, projectGbsScriptsDistDir, { recursive: true });
            fs.copyFileSync(rootPackageJson, projectGbsScriptsPackageJson);
        });
    });
};

export const testCommonProjectActions = (projectType: string, projectName: string, avoid: string[] = []) => {
    const projectLocation = projectName ? path.join(tempLocation, projectName) : tempLocation;

    describe(`Running on project of type "${projectType}"`, () => {
        if (!avoid.includes('dev')) {
            it('Can run dev', () => {
                const stdout = run(['run', 'dev'], projectLocation);
                expect(stdout && stdout.failed).toBeFalsy();
            });
        }
        if (!avoid.includes('build')) {
            it('Can run build', () => {
                const stdout = run(['run', 'build'], projectLocation);
                expect(stdout && stdout.failed).toBeFalsy();
            });
        }
        if (!avoid.includes('test')) {
            it('Can run test', () => {
                const stdout = run(['run', 'test'], projectLocation);
                expect(stdout && stdout.failed).toBeFalsy();
            });
        }
        if (!avoid.includes('doc')) {
            it('Can run doc', () => {
                const stdout = run(['run', 'doc'], projectLocation);
                expect(stdout && stdout.failed).toBeFalsy();
            });
        }
    });
};
