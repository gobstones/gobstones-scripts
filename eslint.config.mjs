import path from 'path';

import { includeIgnoreFile } from '@eslint/compat';
import eslintJs from '@eslint/js';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginNoNull from 'eslint-plugin-no-null';
import eslintPluginPreferArrow from 'eslint-plugin-prefer-arrow';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import eslintTs from 'typescript-eslint';

const unglob = (pattern) => {
    const matcher = /{([^}]+)}|[^{}]+/g;
    const listedParts =
        pattern.match(matcher).map((e) =>
            e.startsWith('{')
                ? e
                      .substring(1, e.length - 1)
                      .split(',')
                      .map((i) => i.trim())
                : e
        ) || [];

    const combine = (parts, prefix) => {
        if (parts.length === 0) return [prefix];

        const [first, ...rest] = parts;
        const combinations = [];

        if (Array.isArray(first)) {
            for (const item of first) {
                combinations.push(...combine(rest, prefix + item));
            }
        } else {
            // If the first part is a string, just add it to the prefix
            combinations.push(...combine(rest, prefix + first));
        }

        return combinations;
    };

    return combine(listedParts, '');
};

const withFilesOnly = (conf, files) =>
    Array.isArray(conf)
        ? conf.map((e) => {
              e.files = files;
              return e;
          })
        : Object.assign({ ...conf }, { files });

const tsConfigPath = path.resolve('./tsconfig.test.json');
const gitignorePath = path.resolve('./.gitignore');

const _jsFiles = unglob('{src,project-types}/**/*.{js,mjs,cjs,jsx}');
const _tsFiles = unglob('{src,project-types}/**/*.{ts,mts,cts,tsx}');
const _codeFiles = [..._jsFiles, ..._tsFiles];

const eslintConfig = eslintTs.config(
    // Add all .gitignore files to the ignore path
    includeIgnoreFile(gitignorePath),
    // Asure oackage-scripts as CJS, to avoid no-undef issues
    { files: ['**/*.cjs'], languageOptions: { globals: globals.node } },
    // Recommended settings from ESLint for JS
    eslintJs.configs.recommended,
    // Prettier plugin usage
    eslintPluginPrettierRecommended,
    // Import default settings. Import is not yet ESLint 9 compatible
    withFilesOnly(eslintPluginImport.flatConfigs.recommended, _codeFiles),
    withFilesOnly(eslintPluginImport.flatConfigs.errors, _codeFiles),
    withFilesOnly(eslintPluginImport.flatConfigs.warnings, _codeFiles),
    withFilesOnly(eslintPluginImport.flatConfigs.typescript, _tsFiles),
    // Custom settings and rules for all JS and TS files
    {
        files: _codeFiles,
        linterOptions: {
            reportUnusedDisableDirectives: true
        },
        languageOptions: {
            parser: eslintJs.parser,
            parserOptions: eslintJs.parserOptions,
            globals: {
                ...globals.node
            },
            ecmaVersion: 2022,
            sourceType: 'module'
        },
        plugins: {
            'no-null': eslintPluginNoNull,
            'prefer-arrow': eslintPluginPreferArrow
        },
        rules: {
            // Non plugin rules
            'no-console': ['error'],
            'arrow-body-style': ['error'],
            'no-shadow': ['off'],
            camelcase: ['error'],
            'capitalized-comments': ['off'],
            'default-case': ['error'],
            'dot-location': ['error', 'property'],
            eqeqeq: ['error', 'smart'],
            'no-alert': ['error'],
            'no-bitwise': ['error'],
            'no-caller': ['error'],
            'no-constructor-return': ['error'],
            'no-div-regex': ['error'],
            'no-empty': ['error'],

            'no-empty-function': [
                'error',
                {
                    allow: ['constructors']
                }
            ],

            'no-eval': ['error'],
            'no-extra-bind': ['error'],
            'no-import-assign': ['error'],
            'no-invalid-this': ['error'],
            'no-labels': ['error'],
            'no-multiple-empty-lines': ['error'],
            'no-new-wrappers': ['error'],
            'no-regex-spaces': ['error'],
            'no-return-assign': ['error'],
            'no-return-await': ['error'],
            'no-self-compare': ['error'],
            'no-throw-literal': ['error'],
            'no-undef-init': ['error'],
            'no-underscore-dangle': ['off'],
            'no-unused-expressions': ['error'],
            'no-useless-call': ['error'],
            'no-useless-concat': ['error'],
            'no-var': ['error'],
            'object-shorthand': ['error'],
            'one-var': ['error', 'never'],
            'prefer-const': ['error'],
            'prefer-regex-literals': ['error'],
            radix: ['error'],
            'require-await': ['error'],

            'sort-imports': [
                'error',
                {
                    ignoreCase: false,
                    ignoreDeclarationSort: true,
                    ignoreMemberSort: false,
                    memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
                    allowSeparatedGroups: true
                }
            ],

            'spaced-comment': ['error'],
            'use-isnan': ['error'],
            'valid-typeof': ['error'],
            yoda: ['error'],

            // No Null plugin
            'no-null/no-null': ['error'],

            // Prefer arrow Plugin
            'prefer-arrow/prefer-arrow-functions': [
                'error',
                {
                    disallowPrototype: true,
                    singleReturnOnly: false,
                    classPropertiesAllowed: false
                }
            ],

            'import/no-named-as-default-member': ['off']

            /*
            // Helpful warnings
            'import/no-empty-named-blocks': ['error'],
            'import/no-extraneous-dependencies': ['error'],
            'import/no-mutable-exports': ['off'],
            'import/no-named-as-default': ['off'],
            'import/no-named-as-default-member': ['off'],
            // Module systems
            'import/no-import-module-exports': ['error'],
            // Static Analysis
            'import/default': ['off'],
            'import/namespace': ['off'],
            'import/no-absolute-path': ['error'],
            'import/no-dynamic-require': ['error'],
            'import/no-self-import': ['error'],
            'import/no-unresolved': ['off'],
            'import/no-useless-path-segments': ['error'],
            'import/no-webpack-loader-syntax': ['error'],
            // Style guide
            'import/no-duplicates': ['error'],
            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', 'sibling', 'parent', 'index', 'unknown'],
                    'newlines-between': 'always',

                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true
                    }
                }
            ]
            */
        }
    },
    // This rules applies only for TS files, recommended typescript-eslint settings.
    ...withFilesOnly(eslintTs.configs.strict, _tsFiles),
    ...withFilesOnly(eslintTs.configs.stylistic, _tsFiles),
    ...withFilesOnly(eslintTs.configs.strictTypeChecked, _tsFiles),
    ...withFilesOnly(eslintTs.configs.stylisticTypeChecked, _tsFiles),
    // Custom typescript-eslint configuration
    {
        files: _tsFiles,
        languageOptions: {
            parser: eslintTs.parser,
            parserOptions: {
                project: [tsConfigPath],
                impliedStrict: true,
                warnOnUnsupportedTypeScriptVersion: false
            }
        },
        rules: {
            '@typescript-eslint/prefer-nullish-coalescing': ['off'],
            '@typescript-eslint/no-unnecessary-type-parameters': ['off'],
            '@typescript-eslint/no-unnecessary-condition': ['off'],
            '@typescript-eslint/no-inferrable-types': ['off'],
            '@typescript-eslint/no-namespace': ['off'],
            '@typescript-eslint/prefer-regexp-exec': ['off'],
            '@typescript-eslint/no-shadow': ['error'],
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                {
                    allowNumber: true
                }
            ],
            '@typescript-eslint/explicit-member-accessibility': [
                'error',
                {
                    accessibility: 'explicit'
                }
            ],
            '@typescript-eslint/member-ordering': [
                'error',
                {
                    default: ['signature', 'field', 'constructor', ['get', 'set'], 'method']
                }
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_'
                }
            ],
            '@typescript-eslint/explicit-function-return-type': [
                'error',
                {
                    allowExpressions: true,
                    allowTypedFunctionExpressions: true,
                    allowHigherOrderFunctions: true
                }
            ]
        }
    },
    {
        files: unglob('{project-types}/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'),
        settings: {
            'import/ignore': [
                '^@gobstones/gobstones-scripts$',
                '^@gobstones/gobstones-core$',
                'react',
                '.(scss|less|css)$'
            ]
        },
        rules: {
            'import/no-unresolved': [
                'error',
                {
                    ignore: [
                        '@gobstones/gobstones-scripts',
                        '@gobstones/gobstones-core',
                        'react',
                        'typescript-eslint',
                        '.(scss|less|css)$'
                    ]
                }
            ]
        }
    },
    {
        files: [
            'project-types/Common/scripts/**/*.ts',
            'project-types/Common/husky/**/*.ts',
            'project-types/CLILibrary/src/cli.ts',
            'project-types/ReactLibrary/test/Components/Counter/Counter.test.tsx'
        ],
        rules: {
            '@typescript-eslint/no-unsafe-call': ['off'],
            '@typescript-eslint/no-unsafe-argument': ['off'],
            '@typescript-eslint/no-unsafe-member-access': ['off'],
            '@typescript-eslint/no-unsafe-assignment': ['off'],
            'import/no-unresolved': [
                'error',
                {
                    ignore: [
                        '@gobstones/gobstones-scripts',
                        '@gobstones/gobstones-core',
                        '../.scripts/_helpers.ts',
                        'react',
                        'typescript-eslint',
                        '.(scss|less|css)$'
                    ]
                }
            ]
        }
    }
);

export default eslintConfig;
