module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        impliedStrict: true,
        warnOnUnsupportedTypeScriptVersion: false
    },
    env: {
        node: true
    },
    plugins: ['@typescript-eslint', 'import', 'no-null', 'prefer-arrow', 'prettier', 'import'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:prettier/recommended',
        'prettier/prettier',
        'plugin:import/recommended',
        'plugin:import/typescript'
    ],
    noInlineConfig: false,
    reportUnusedDisableDirectives: true,
    rules: {
        '@typescript-eslint/array-type': ['error'],
        '@typescript-eslint/ban-types': ['error'],
        '@typescript-eslint/consistent-type-definitions': ['error'],
        '@typescript-eslint/explicit-function-return-type': [
            'error',
            {
                allowExpressions: true,
                allowTypedFunctionExpressions: true,
                allowHigherOrderFunctions: true
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
        '@typescript-eslint/no-empty-function': ['error'],
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/no-inferrable-types': ['off'],
        '@typescript-eslint/no-namespace': ['off'],
        '@typescript-eslint/no-parameter-properties': ['off'],
        '@typescript-eslint/no-shadow': [
            'error',
            {
                hoist: 'all'
            }
        ],
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                vars: 'all',
                args: 'none',
                ignoreRestSiblings: false
            }
        ],
        '@typescript-eslint/prefer-for-of': ['error'],
        '@typescript-eslint/prefer-function-type': ['error'],
        '@typescript-eslint/prefer-namespace-keyword': ['error'],
        '@typescript-eslint/triple-slash-reference': ['error'],
        '@typescript-eslint/unified-signatures': ['error'],

        'no-null/no-null': ['error'],

        'prettier/prettier': ['error'],

        'prefer-arrow/prefer-arrow-functions': [
            'error',
            {
                disallowPrototype: true,
                singleReturnOnly: true,
                classPropertiesAllowed: false
            }
        ],

        'import/no-unresolved': 'error',
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal', 'sibling', 'parent', 'index', 'unknown'],
                'newlines-between': 'always',
                alphabetize: {
                    /* sort in ascending order. Options: ["ignore", "asc", "desc"] */
                    order: 'asc',
                    /* ignore case. Options: [true, false] */
                    caseInsensitive: true
                }
            }
        ],

        'arrow-body-style': ['error'],
        camelcase: ['error'],
        'capitalized-comments': ['off'],
        'comma-dangle': [
            'error',
            {
                objects: 'never',
                arrays: 'never',
                functions: 'never'
            }
        ],
        complexity: ['off'],
        'default-case': ['error'],
        'dot-location': ['error', 'property'],
        eqeqeq: ['error', 'smart'],
        'max-len': [
            'error',
            {
                code: 120,
                ignoreUrls: true
            }
        ],
        'no-alert': ['error'],
        'no-bitwise': ['error'],
        'no-caller': ['error'],
        'no-console': ['error'],
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
        'no-shadow': ['off'],
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
                ignoreDeclarationSort: true, // don"t want to sort import lines, use eslint-plugin-import instead
                ignoreMemberSort: false,
                memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
                allowSeparatedGroups: true
            }
        ],
        'spaced-comment': ['error'],
        'use-isnan': ['error'],
        'valid-typeof': ['error'],
        yoda: ['error']
    }
};
