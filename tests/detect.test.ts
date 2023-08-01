import { join } from "node:path";
import { expect, test } from "vitest";
import { FastText } from "../src";

const root = join(__dirname, "..");
const tests: Record<string, string> = {
  "你好, 世界！": "zh",
  "Hello, world!": "en",
  "Webassembly version of fastText": "en",
  "乆乆乆, 一定是米哈游干的": "zh",
};

test("language detects", async () => {
  const fastText = await FastText.create({
    corePath: join(root, "dist", "core", "fasttext.mjs"),
  });
  await fastText.loadModel(join(root, "model", "lid.176.ftz"));
  for (const [text, lang] of Object.entries(tests)) {
    expect(fastText.detect(text)).toBe(lang);
  }
});
