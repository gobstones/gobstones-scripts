module.exports = {
    parserOptions: {
        ecmaVersion: 'latest'
    },
    env: {
        node: true,
        es2018: true
    },
    plugins: ['no-null', 'prettier'],
    extends: ['eslint:recommended', 'plugin:prettier/recommended', 'prettier/prettier'],
    noInlineConfig: false,
    reportUnusedDisableDirectives: true,
    rules: {
        'no-null/no-null': ['error'],

        'prettier/prettier': ['error'],

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
                code: 100
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
        'spaced-comment': ['error'],
        'use-isnan': ['error'],
        'valid-typeof': ['error'],
        yoda: ['error']
    }
};
