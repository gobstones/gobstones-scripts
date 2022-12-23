/**
 * This is the the definition for the English language.
 *
 * @module Translation
 * @author Your Name <yourname@company.com>
 */
import { Locale } from './Locale';

/* Define the language translations here */
export const en: Locale = {
    program: {
        running: 'Running in development mode'
    },
    cli: {
        descriptions: {
            language: 'The tool`s running language',
            in: 'The input file',
            out: 'The output file',
            tool: 'The most awesome tool',
            version: 'Display the version',
            help: 'Display the help'
        },
        awesome: {
            description: 'Run the awesome command'
        },
        notCool: {
            description: 'Run the notCool command'
        },
        errors: {
            file: 'File does not exist',
            language: 'Locale does not exist'
        }
    }
};
