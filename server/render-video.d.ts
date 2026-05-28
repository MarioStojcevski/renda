export type RenderVideoEvent = {
    type: string;
    message?: string;
    percent?: number;
    phase?: string;
    current?: number;
    total?: number;
    level?: string;
};
export type RenderVideoResult = {
    outputPath: string;
    fileName: string;
    relativePath: string;
};
/**
 * Renders the current timeline to an MP4 under /out using the Remotion CLI.
 * Requires FFmpeg on PATH (bundled with @remotion/renderer on most installs).
 */
export declare const renderVideoToFile: (timeline: unknown, onEvent?: (event: RenderVideoEvent) => void) => Promise<RenderVideoResult>;
