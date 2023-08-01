import { copyFile, mkdir, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "tsup";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm", "iife"],
  dts: true,
  minifySyntax: true,
  // copy models
  onSuccess: async () => {
    await mkdir(join(__dirname, "dist", "model"), { recursive: true });
    for (const filename of await readdir(join(__dirname, "model"))) {
      await copyFile(
        join(__dirname, "model", filename),
        join(__dirname, "dist", "model", filename),
      );
    }
  },
  target: "node14",
});
