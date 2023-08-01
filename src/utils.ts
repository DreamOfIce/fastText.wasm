import type { Pair, Vector } from "./types";

let readFile: typeof import("node:fs/promises").readFile;
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

export const nodeBuffer2ArrayBuffer = (buf: Buffer) =>
  buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);

export const fetchFile = async (url: string): Promise<ArrayBufferView> =>
  new Uint8Array(
    typeof self !== "undefined" && globalThis === self
      ? await (await fetch(url)).arrayBuffer()
      : nodeBuffer2ArrayBuffer(
          await (readFile ??= (await import("node:fs/promises")).readFile)(
            (fileURLToPath ??= (await import("node:url")).fileURLToPath)(url),
          ),
        ),
  );
