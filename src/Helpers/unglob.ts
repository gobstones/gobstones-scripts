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
 * @module Helpers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 *
 * @internal
 */
export const unglob = (pattern: string): string[] => {
    const matcher = /{([^}]+)}|[^{}]+/g;
    const listedParts =
        pattern.match(matcher)?.map((e) =>
            e.startsWith('{')
                ? e
                      .substring(1, e.length - 1)
                      .split(',')
                      .map((i) => i.trim())
                : e
        ) ?? [];

    const combine = (parts: (string | string[])[], prefix: string): string[] => {
        if (parts.length === 0) return [prefix];

        const [first, ...rest] = parts;
        const combinations: string[] = [];

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
