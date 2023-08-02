import { expect, test } from "vitest";
import { FastText } from "../src";
import { corePath, modelPath } from "./utils";

const tests: Record<string, string> = {
  "你好, 世界！": "zh",
  "Hello, world!": "en",
  "Webassembly version of fastText": "en",
  "乆乆乆, 一定是miHoYo干的": "zh",
  可爱い: "ja",
  "В день уныния смирись": "ru",
};

test("language detects", async () => {
  const fastText = await FastText.create({
    corePath,
  });
  await fastText.loadModel(modelPath);
  for (const [text, lang] of Object.entries(tests)) {
    expect(fastText.detect(text)).toBe(lang);
  }
});
