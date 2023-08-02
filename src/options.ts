export interface FastTextOptions {
  corePath?: string;
  wasmPath?: string | undefined;
}

export const defaultOptions: Required<FastTextOptions> = {
  corePath: "./core/fasttext.mjs",
  wasmPath: undefined,
};
