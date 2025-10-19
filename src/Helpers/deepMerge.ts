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

// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-null/no-null
const isObject = (item: any): boolean => item !== null && typeof item === 'object' && !Array.isArray(item);

/**
 * Deeply merge objects.
 *
 * @template T The generic type of the target
 * @param target The target object in which to merge
 * @param sources The object to merge in the target
 * @returns The merged object
 */
export const deepMerge = <T extends object>(target: T, ...sources: Partial<T>[]): T => {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                const sourceValue = source[key];
                if (isObject(sourceValue) && isObject(target[key])) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
                    target[key] = deepMerge(target[key] as any, sourceValue as any);
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
                    (target as any)[key] = sourceValue;
                }
            }
        }
    }
    return deepMerge(target, ...sources);
};
