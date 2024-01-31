/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import colors from 'ansi-colors';

/**
 * Returns the string for the bash command to run
 * an echo, showing a message.
 *
 * @param text The message to display
 * @param styles One or more styles to apply to the text.
 *
 * @example echo('print this', 'bgRed blue')
 *
 * @returns The bash command string.
 *
 * @group API: Functions
 */
export const echo = (text: string, styles?: string): string => {
    const parsedStyles = styles?.split(' ').map((e) => e.trim());
    const style = parsedStyles?.reduce((acc, e) => acc?.[e] as any, colors);

    return `echo "${style ? style(text) : text}"`;
};
