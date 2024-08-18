/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2018-2024
 * Gobstones (TM) is a trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3.
 * Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.io/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */

/**
 * ----------------------------------------------------
 * @module Tasks
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * ----------------------------------------------------
 */

import colors from 'ansi-colors';

/**
 * Returns the string for the bash command to run
 * an echo, showing a message.
 *
 * @param text - The message to display
 * @param styles - One or more styles to apply to the text.
 *
 * @example echo('print this', 'bgRed blue')
 *
 * @returns The bash command string.
 */
export const echo = (text: string, styles?: string): string => {
    const parsedStyles = styles ? styles.split(' ').map((e) => e.trim()) : [];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const style: (t: string) => string = parsedStyles.reduce(
        (acc: unknown, e: string) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            acc?.[e],
        colors
    );

    return `echo "${styles ? style(text) : text}"`;
};
