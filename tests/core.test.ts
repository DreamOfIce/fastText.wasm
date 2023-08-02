import { test, expect } from "vitest";
import { FastText } from "../src";
import { corePath } from "./utils";

const { core, fs } = await FastText.create({ corePath });

test("file system", () => {
  const data = new Uint8Array([11, 45, 14, 19, 19, 81, 0]);
  fs.writeFile("/test.bin", data);
  expect(fs.readFile("/test.bin")).toStrictEqual(data);
  fs.unlink("/test.bin");
});

test("memory alloc", () => {
  const ptr = core._malloc(64);
  core._free(ptr);
});
