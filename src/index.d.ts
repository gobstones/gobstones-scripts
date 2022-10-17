export declare type gobstones_scripts = {
    create: (projectName: string) => void;
    init: () => void;
    update: (force: boolean) => string[];
    eject: (force: boolean) => string[];
    run: (userArgs: string[]) => void;
    version: string;
    config: {
        root: string;
        package: string;
        tsConfigFile: string;
        files: {
            ts: string;
            nps: string;
            jest: string;
            typedoc: string;
            rollup: string;
            webpack: string;
        };
    };
    tools: {
        nps: (action: string) => string;
        tsc: (options: { file: string }) => string;
        tsNode: (options: { file: string; watch?: string }) => string;
        rollup: (options: { watch?: string }) => string;
        jest: (options: { coverage: boolean; noThreshold: boolean; watch: boolean }) => string;
        typedoc: (options: { watch?: string }) => string;
        eslint: (options: { files: string; fix?: boolean }) => string;
        prettier: (options: { files: string }) => string;
        serve: (directory: string) => string;
        rename: (options: { src: string; dest: string }) => string;
        remove: (options: { files: string }) => string;
        copy: (options: { src: string; dest: string; isDir: boolean }) => string;
        chmod: (options: { files: string; mod: string }) => string;
        concurrent: (actions: Record<string, string>) => string;
        series: (actions: string[]) => string;
    };
};
declare const _default: gobstones_scripts;
export default _default;
