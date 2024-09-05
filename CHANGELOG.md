## <small>0.9.3 (2024-09-05)</small>

## <small>0.9.2 (2024-09-04)</small>

## <small>0.9.1 (2024-09-04)</small>

-   feat(project-types): updated project types to have latest eslint and typedoc configurations ([761676d](https://github.com/gobstones/gobstones-scripts/commit/761676d)), closes [#7](https://github.com/gobstones/gobstones-scripts/issues/7)
-   fix(cli): fix a bug preventing the use of package.json config when using CLI ([f07a82f](https://github.com/gobstones/gobstones-scripts/commit/f07a82f))

### BREAKING CHANGE

-   The task copy now has different arguments expected.

## <small>0.9.1 (2024-09-03)</small>

-   feat(project-types): updated project types to have latest eslint and typedoc configurations ([5e9e91f](https://github.com/gobstones/gobstones-scripts/commit/5e9e91f)), closes [#7](https://github.com/gobstones/gobstones-scripts/issues/7)
-   fix(cli): fix a bug preventing the use of package.json config when using CLI ([f07a82f](https://github.com/gobstones/gobstones-scripts/commit/f07a82f))

### BREAKING CHANGE

-   The task copy now has different arguments expected.

## <small>0.9.1 (2024-08-27)</small>

-   fix(cli): fix a bug preventing the use of package.json config when using CLI ([f07a82f](https://github.com/gobstones/gobstones-scripts/commit/f07a82f))

## <small>0.9.1 (2024-08-19)</small>

-   fix(cli): fix a bug preventing the use of package.json config when using CLI ([00698dd](https://github.com/gobstones/gobstones-scripts/commit/00698dd))

## <small>0.9.1 (2024-08-18)</small>

-   fix(cli): fix a bug preventing the use of package.json config when using CLI ([9b5a247](https://github.com/gobstones/gobstones-scripts/commit/9b5a247))

## <small>0.9.1 (2024-08-18)</small>

-   fix(cli): fix a bug preventing the use of package.json config when using CLI ([56a2d91](https://github.com/gobstones/gobstones-scripts/commit/56a2d91))

## 0.9.0 (2024-08-16)

-   feat: updated ESLint and other dependencies ([598d440](https://github.com/gobstones/gobstones-scripts/commit/598d440))

### BREAKING CHANGE

-   The configuration update is required

## 0.9.0 (2024-08-16)

-   feat: updated ESLint and other dependencies ([598d440](https://github.com/gobstones/gobstones-scripts/commit/598d440))

### BREAKING CHANGE

-   The configuration update is required

## 0.9.0 (2024-08-16)

-   feat: updated ESLint and other dependencies ([9b5870c](https://github.com/gobstones/gobstones-scripts/commit/9b5870c))

### BREAKING CHANGE

-   The configuration update is required

## 0.9.0 (2024-08-16)

## <small>0.8.8 (2024-08-12)</small>

## <small>0.8.7 (2024-05-06)</small>

-   fix: fix path for license header that stayed with lowercase ([0a0662c](https://github.com/gobstones/gobstones-scripts/commit/0a0662c))

## <small>0.8.6 (2024-05-05)</small>

-   fix: Project casing not correctly changed in origin ([075f063](https://github.com/gobstones/gobstones-scripts/commit/075f063))

## <small>0.8.5 (2024-05-05)</small>

-   fix: fix husky pre-push in new projects not obtaining parameters correctly ([0a4e131](https://github.com/gobstones/gobstones-scripts/commit/0a4e131))

## <small>0.8.4 (2024-05-05)</small>

-   style: change casing of submodules to be uppercase always ([c51d58c](https://github.com/gobstones/gobstones-scripts/commit/c51d58c))
-   fix: fix husky scripts not being POSIX compliant ([690f2ab](https://github.com/gobstones/gobstones-scripts/commit/690f2ab))

## <small>0.8.3 (2024-04-11)</small>

-   fix: fixed license badges and links to guidelines ([57b72bc](https://github.com/gobstones/gobstones-scripts/commit/57b72bc))

## <small>0.8.2 (2024-04-05)</small>

-   fix: wrap LICENSE text to 80 columns ([79f45dc](https://github.com/gobstones/gobstones-scripts/commit/79f45dc))

## <small>0.8.1 (2024-04-05)</small>

-   fix: fix license header ([c0f59aa](https://github.com/gobstones/gobstones-scripts/commit/c0f59aa))

## 0.8.0 (2024-04-05)

-   feat: added license text support ([3c6d238](https://github.com/gobstones/gobstones-scripts/commit/3c6d238))

### BREAKING CHANGE

-   Uppon commit, every file will end up with a license header

## <small>0.7.2 (2024-02-02)</small>

-   fix(nocode): noCode projects had a problem when trying to run certain tasks ([651fca5](https://github.com/gobstones/gobstones-scripts/commit/651fca5))

## <small>0.7.1 (2024-02-02)</small>

-   feat: added new type of project - noCode ([cadf5f1](https://github.com/gobstones/gobstones-scripts/commit/cadf5f1))

## 0.7.0 (2024-01-24)

-   chore: update the version to 0.7.0 ([3593caf](https://github.com/gobstones/gobstones-scripts/commit/3593caf)), closes [#14](https://github.com/gobstones/gobstones-scripts/issues/14) [#16](https://github.com/gobstones/gobstones-scripts/issues/16)
-   refactor: major refactor of configuration system ([3cdc7c0](https://github.com/gobstones/gobstones-scripts/commit/3cdc7c0))
-   build(husky): change the way the scripts are run in bash ([36476d7](https://github.com/gobstones/gobstones-scripts/commit/36476d7))

### BREAKING CHANGE

-   API changes in regards of names of project types.
-   The API of the configuration was completely changed. The name of the typedoc
    configuration file, typedoc.js, was changed to typedoc.config.js to properly support windows
    consoles.

## 0.6.0 (2023-12-28)

-   fix: bump version to 0.6.0 and fix minimal errors in husky ([ee3c04e](https://github.com/gobstones/gobstones-scripts/commit/ee3c04e))

## <small>0.5.6 (2023-12-28)</small>

-   fix: make calls in husky pass through scripts ([4bd640c](https://github.com/gobstones/gobstones-scripts/commit/4bd640c)), closes [#12](https://github.com/gobstones/gobstones-scripts/issues/12) [#13](https://github.com/gobstones/gobstones-scripts/issues/13)

## <small>0.5.5 (2023-12-28)</small>

-   build: improve build system to build doc on a separate branch ([fc10438](https://github.com/gobstones/gobstones-scripts/commit/fc10438)), closes [#11](https://github.com/gobstones/gobstones-scripts/issues/11)

## <small>0.5.4 (2023-11-23)</small>

-   feat: new generated package.json files for all projects ([324170b](https://github.com/gobstones/gobstones-scripts/commit/324170b)), closes [#8](https://github.com/gobstones/gobstones-scripts/issues/8) [#9](https://github.com/gobstones/gobstones-scripts/issues/9) [#10](https://github.com/gobstones/gobstones-scripts/issues/10)

## <small>0.5.3 (2023-11-21)</small>

-   fix: fix Binary package not being recognized as CommonJS in 0.5.2 ([ffa7489](https://github.com/gobstones/gobstones-scripts/commit/ffa7489)), closes [#7](https://github.com/gobstones/gobstones-scripts/issues/7)

## <small>0.5.2 (2023-11-21)</small>

-   fix: fix Binary package not being recognized in 0.5.1 ([1418bb6](https://github.com/gobstones/gobstones-scripts/commit/1418bb6)), closes [#7](https://github.com/gobstones/gobstones-scripts/issues/7) [#5](https://github.com/gobstones/gobstones-scripts/issues/5)

## <small>0.5.1 (2023-11-20)</small>

-   feat: move code to typescript ([d5c6007](https://github.com/gobstones/gobstones-scripts/commit/d5c6007)), closes [#5](https://github.com/gobstones/gobstones-scripts/issues/5)

## 0.5.0 (2023-11-10)

-   feat: change configuration location for the tooling ([720f3cb](https://github.com/gobstones/gobstones-scripts/commit/720f3cb))

### BREAKING CHANGE

-   All projects now are required to change their package.json to adapt to the new
    configuration location

## <small>0.4.7 (2023-11-10)</small>

-   fix: fix publishing on github releases not naming releases properly ([81a5ed5](https://github.com/gobstones/gobstones-scripts/commit/81a5ed5))

## <small>0.4.6 (2023-11-10)</small>

-   feat: add conventional commits support ([5855c75](https://github.com/gobstones/gobstones-scripts/commit/5855c75)), closes [#4](https://github.com/gobstones/gobstones-scripts/issues/4)
-   Change on-tag-release deprecated dependency ([ce97583](https://github.com/gobstones/gobstones-scripts/commit/ce97583))

### BREAKING CHANGE

-   Now commiting to a project requires to use conventional commits

## <small>0.4.5 (2023-11-10)</small>

-   Updated github actions to latest versions ([0fac13e](https://github.com/gobstones/gobstones-scripts/commit/0fac13e))

## <small>0.4.4 (2023-11-10)</small>

-   Set no-underscore-dangle as off both in project and new projects ([7f82906](https://github.com/gobstones/gobstones-scripts/commit/7f82906))

## <small>0.4.3 (2023-10-17)</small>

-   Fix LICENSE and test problem for simple library ([e17d28a](https://github.com/gobstones/gobstones-scripts/commit/e17d28a))

## <small>0.4.2 (2023-10-17)</small>

-   Fix bug preventing test to run properly ([5dc9afc](https://github.com/gobstones/gobstones-scripts/commit/5dc9afc))
-   Updated readme correcting typos ([9fcd9c5](https://github.com/gobstones/gobstones-scripts/commit/9fcd9c5))

## <small>0.4.1 (2023-10-12)</small>

-   Updated github workflows ([1a4c6a1](https://github.com/gobstones/gobstones-scripts/commit/1a4c6a1))

## 0.4.0 (2023-10-12)

-   Ready for version 0.4.0 ([4b9afc7](https://github.com/gobstones/gobstones-scripts/commit/4b9afc7))
-   Updated all dependencies to latest ([99e2c33](https://github.com/gobstones/gobstones-scripts/commit/99e2c33))
-   Updated dependencies and finished library and cli ([17b9694](https://github.com/gobstones/gobstones-scripts/commit/17b9694))

## 0.4.0-alpha7 (2022-12-27)

-   Prettier now fixes all files in project ([6b4890b](https://github.com/gobstones/gobstones-scripts/commit/6b4890b))
-   Updated to version 0.4.0-alpha7 ([54eb4b8](https://github.com/gobstones/gobstones-scripts/commit/54eb4b8))

## 0.4.0-alpha6 (2022-12-27)

-   Add docs generated to commit ([2a7feee](https://github.com/gobstones/gobstones-scripts/commit/2a7feee))
-   Added web-library as module type ([14f244c](https://github.com/gobstones/gobstones-scripts/commit/14f244c))
-   Update docs ([a017676](https://github.com/gobstones/gobstones-scripts/commit/a017676))
-   Updated github actions to v3 ([5ddac55](https://github.com/gobstones/gobstones-scripts/commit/5ddac55))
-   Updated prettier configuration ([cac9ed5](https://github.com/gobstones/gobstones-scripts/commit/cac9ed5))

## 0.4.0-alpha4 (2022-12-23)

-   Add VSCode support and Husky ([4147504](https://github.com/gobstones/gobstones-scripts/commit/4147504))
-   Set common run configurations for projects ([9548034](https://github.com/gobstones/gobstones-scripts/commit/9548034))
-   Set npm as default instead of pnpm ([b8f90fd](https://github.com/gobstones/gobstones-scripts/commit/b8f90fd))

## 0.4.0-alpha3 (2022-12-23)

-   Fix multiple issues with the tool on react ([f5b5d34](https://github.com/gobstones/gobstones-scripts/commit/f5b5d34))

## 0.4.0-alpha2 (2022-12-21)

-   Fix react dependencies and project types ([561748e](https://github.com/gobstones/gobstones-scripts/commit/561748e))

## 0.4.0-alpha1 (2022-12-20)

-   Move dependencies from project to tool ([6a22797](https://github.com/gobstones/gobstones-scripts/commit/6a22797))

## <small>0.3.2 (2022-10-26)</small>

-   Fix CLI build not finding correct tsconfig ([2dcff06](https://github.com/gobstones/gobstones-scripts/commit/2dcff06))
-   Fix lintingin internal_api ([d3fa622](https://github.com/gobstones/gobstones-scripts/commit/d3fa622))
-   Updating version to 0.3.2 ([b52cec2](https://github.com/gobstones/gobstones-scripts/commit/b52cec2))

## <small>0.3.1 (2022-10-26)</small>

-   Re-add lint as part of test process ([91ea482](https://github.com/gobstones/gobstones-scripts/commit/91ea482))
-   Update links to contribution guidelines ([84d95cc](https://github.com/gobstones/gobstones-scripts/commit/84d95cc))
-   Update version of gobstones-core to 0.3.7 ([27dcebb](https://github.com/gobstones/gobstones-scripts/commit/27dcebb))

## 0.3.0 (2022-10-25)

-   v0.3.0 - Updated peer dependencies management ([5525774](https://github.com/gobstones/gobstones-scripts/commit/5525774))

## <small>0.2.6 (2022-10-25)</small>

-   Move stories to custom folder and update react-components ([c78a46b](https://github.com/gobstones/gobstones-scripts/commit/c78a46b))

## <small>0.2.5 (2022-10-25)</small>

-   Update react-library test scripts to pass ([11df088](https://github.com/gobstones/gobstones-scripts/commit/11df088))

## <small>0.2.4 (2022-10-18)</small>

-   Fix linting and added dependencies to react project for eslint ([b5c6085](https://github.com/gobstones/gobstones-scripts/commit/b5c6085))

## <small>0.2.3 (2022-10-17)</small>

-   Added missing dependencies for common-tags and fs-extra ([4d1f3ea](https://github.com/gobstones/gobstones-scripts/commit/4d1f3ea))

## <small>0.2.2 (2022-10-17)</small>

-   Added missing dependencies for tsconfig.js ([5c892f0](https://github.com/gobstones/gobstones-scripts/commit/5c892f0))

## <small>0.2.1 (2022-10-17)</small>

-   Added missing dependencies for figlet and ansi-colors ([51dd8dd](https://github.com/gobstones/gobstones-scripts/commit/51dd8dd))

## 0.2.0 (2022-10-17)

-   Support for multiple templates ([73f2cac](https://github.com/gobstones/gobstones-scripts/commit/73f2cac))

## <small>0.1.1 (2022-08-02)</small>

-   Fixed release-npm not publishing as public by default ([ea669c2](https://github.com/gobstones/gobstones-scripts/commit/ea669c2))

## 0.1.0 (2022-08-02)

-   Initial commit ([8b7bcb2](https://github.com/gobstones/gobstones-scripts/commit/8b7bcb2))
-   Initial Release ([e6df097](https://github.com/gobstones/gobstones-scripts/commit/e6df097))
