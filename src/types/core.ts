import type { Emscripten } from "./emscripten";
import type { Pair, Vector } from "./misc";

export interface FastTextCoreConstructor {
  new (): FastTextCore;
  loadModel(path: string): void;
  getNN(word: string, k: number): Vector<Pair<number, string>>;
  getAnalogies(
    k: number,
    wordA: string,
    wordB: string,
    wordC: string,
  ): Vector<Pair<number, string>>;
  getWordId(word: string): number;
  getSubwordId(subword: string): number;
  getInputMatrix(): unknown;
  getOutputMatrix(): unknown;
  getWords(): Pair<Vector<string>, Vector<number>>;
  getLabels(): Pair<Vector<string>, Vector<number>>;
  getLine(text: string): Pair<Vector<string>, Vector<string>>;
  test(filename: string, k: number, thresold: number): void;
  predict(
    text: string,
    k: number,
    thresold: number,
  ): Vector<Pair<number, string>>;
  getWordVector(vecFloat: Float32ArrayBridge, word: string): void;
  getSentenceVector(vecFloat: Float32ArrayBridge, text: string): void;
  getInputVector(vecFloat: Float32ArrayBridge, ind: number): void;
  train(
    args: unknown,
    jsCallback: (
      progress: number,
      loss: number,
      wst: number,
      lr: number,
      eta: number,
    ) => void,
  ): void;
  saveModel(filename: string): void;
  isQuant(): boolean;
}
export type FastTextCore = FastTextCoreConstructor;

export interface Float32ArrayBridge {
  ptr: number;
  size: number;
}

export interface FastTextModule extends Emscripten.Module {
  FS: Emscripten.FileSystem.FS;
  FastText: FastTextCoreConstructor;
}

export type FastTextModuleConstructor =
  Emscripten.ModuleFactory<FastTextModule>;
