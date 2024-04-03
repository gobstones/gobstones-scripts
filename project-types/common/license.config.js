/* eslint-disable @typescript-eslint/no-var-requires */
const { config } = require('@gobstones/gobstones-scripts');

config.init();
const licenseHeader = config.projectType.licenseHeader.toolingFile;

module.exports = {
    license: `${licenseHeader}`,
    ignore: ['dist/', 'docs/', '**/!(*.ts|*.tsx)'],
    defaultFormat: {
        prepend: '/*',
        append: '*/'
    },
    licenseFormats: {
        ts: {
            prepend: '/*',
            append: ' */',
            eachLine: {
                prepend: ' * '
            }
        },
        tsx: {
            prepend: '/*',
            append: ' */',
            eachLine: {
                prepend: ' * '
            }
        }
    },
    trailingWhitespace: 'TRIM'
};
