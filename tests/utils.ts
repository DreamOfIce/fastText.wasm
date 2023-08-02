import { join } from "node:path";

export const root = join(__dirname, "..");
export const corePath = join(root, "dist", "core", "fasttext.mjs");
export const modelPath = join(root, "model", "lid.176.ftz");
