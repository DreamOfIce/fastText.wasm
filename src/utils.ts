import type { Pair, Vector } from "./types";

declare const Deno:
  | { readFile: (url: string) => Promise<Uint8Array> }
  | undefined;

let readFile: typeof import("node:fs/promises").readFile;
let request: typeof import("node:http").request;
let fileURLToPath: typeof import("node:url").fileURLToPath;

/**
 * Convert std::vector to array
 * @param vector emscripten vector
 * @param deleteAferConvert free the vector after the conversion is complete
 */
export const vector2Array = <T>(
  vector: Vector<T>,
  deleteAferConvert: boolean = false,
): Array<T> => {
  const arr: Array<T> = [];
  for (let i = 0; i < vector.size(); i++) {
    arr.push(vector.get(i));
  }
  if (deleteAferConvert) vector.delete();
  return arr;
};

/**
 * Convert std::vector<std::pair<key, value>> to Map<key, value>>
 * @param vector emscripten vector
 * @param deleteAferConvert free the vector after the conversion is complete
 */
export const kvPairVector2Map = <K, V>(
  vector: Vector<Pair<K, V>>,
  deleteAferConvert: boolean = false,
): Map<K, V> => {
  const map: Map<K, V> = new Map();
  for (const [key, value] of vector2Array(vector, deleteAferConvert)) {
    map.set(key, value);
  }
  return map;
};

/**
 * convert std::vector<std::pair<value, key>> to Map<key, value>>
 * @param vector emscripten vector
 * @param deleteAferConvert free the vector after the conversion is complete
 */
export const vkPairVector2Map = <K, V>(
  vector: Vector<Pair<V, K>>,
  deleteAferConvert: boolean = false,
): Map<K, V> => {
  const map: Map<K, V> = new Map();
  for (const [value, key] of vector2Array(vector, deleteAferConvert)) {
    map.set(key, value);
  }
  return map;
};
export const buffer2Uin8Array = (buf: Buffer) =>
  new Uint8Array(buf.buffer, buf.byteOffset, buf.length);

export const fetchFile = async (url: string): Promise<ArrayBufferView> => {
  if (typeof global !== "undefined" && globalThis === global) {
    if (url.startsWith("file://")) {
      readFile ??= (await import("node:fs/promises")).readFile;
      fileURLToPath ??= (await import("node:url")).fileURLToPath;
      return buffer2Uin8Array(await readFile(fileURLToPath(url)));
    } else {
      request ??= (await import("node:http")).request;
      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        request(url, (res) =>
          res
            .on("close", () => resolve(buffer2Uin8Array(Buffer.concat(chunks))))
            .on("data", (chunk) => chunks.push(chunk as Buffer))
            .on("error", (err) => reject(err)),
        );
      });
    }
  } else if (typeof Deno !== "undefined" && url.startsWith("file://")) {
    return Deno.readFile(url);
  } else {
    return new Uint8Array(await (await fetch(url)).arrayBuffer());
  }
};
