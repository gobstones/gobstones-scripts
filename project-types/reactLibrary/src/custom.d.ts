/**
 * Declaration file for all the different image type, so they can be
 * used as modules in react components.
 *
 * @ignore
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
declare module '*.svg' {
    const content: string;
    export default content;
}

declare module '*.png' {
    const value: string;
    export default value;
}

declare module '*.jpg' {
    const value: string;
    export default value;
}

declare module '*.jpg2' {
    const value: string;
    export default value;
}

declare module '*.gif' {
    const value: string;
    export default value;
}

declare module '*.webp' {
    const value: string;
    export default value;
}
