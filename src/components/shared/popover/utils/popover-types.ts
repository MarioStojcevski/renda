/** Built-in renda media types (shown in Media panel). */
export const rendaMediaTypes = ["Text", "Shape", "Gif"] as const;

export type RendaMediaType = (typeof rendaMediaTypes)[number];
