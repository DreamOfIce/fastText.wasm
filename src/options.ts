export interface FastTextOptions {
  corePath?: string;
  wasmPath?: string;
}

export const defaultOptions: Required<FastTextOptions> = {
  corePath: "./core/fasttext.mjs",
  wasmPath: "./core/fasttext.wasm",
};
