/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2018-2024
 * Gobstones (TM) is a trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3. Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.io/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
/**
 * This is the the definition for the Spanish language.
 *
 * @module Internal.Translation
 * @author Your Name <yourname@company.com>
 */
import { Locale } from './Locale';

/**
 * The language translations for the spanish language.
 *
 * @group Internal: Objects
 */
export const es: Locale = {
    program: {
        running: 'Corriendo en modo desarrollo'
    },
    cli: {
        descriptions: {
            language: 'El lenguaje en el que corre la herramienta',
            in: 'El archivo de entrada',
            out: 'El archivo de salida',
            tool: 'La herramienta más copada',
            version: 'Mostrar la información de version',
            help: 'Mostrar la ayuda'
        },
        awesome: {
            description: 'Correr el comando awesome'
        },
        notCool: {
            description: 'Correr el comando notCool'
        },
        errors: {
            file: 'El archivo no existe',
            language: 'El idioma no existe'
        }
    }
};
