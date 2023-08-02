import type {
  Emscripten,
  FastTextCore,
  FastTextModule,
  FastTextModuleConstructor,
} from "./types";
import type { FastTextOptions } from "./options";
import { defaultOptions } from "./options";
import { fetchFile, vkPairVector2Map } from "./utils";

const TEMP_MODEL_PATH = "/_tmp_model.ftz";

export class FastText {
  /** Emscripten module */
  public core: FastTextModule;
  /** Emscripten filesystem */
  public fs: Emscripten.FileSystem.FS;
  private ft: FastTextCore;
  private constructor(core: FastTextModule) {
    this.core = core;
    this.fs = core.FS;
    this.ft = new core.FastText();
  }

  /**
   * Create a new FastText instance
   * @param [options] init options
   * @returns promise with a FastText instance
   */
  public static async create(options: FastTextOptions) {
    const opt = { ...defaultOptions, ...options };
    const coreCtor = (
      (await import(opt.corePath)) as { default: FastTextModuleConstructor }
    ).default;
    const core = await coreCtor({
      locateFile: (url, prefix) =>
        opt.wasmPath && url.endsWith(".wasm")
          ? opt.wasmPath
          : `${prefix}${url}`,
      print: () => {
        /* empty */
      },
      printErr: () => {
        /* empty */
      },
    });
    return new FastText(core);
  }

  /**
   * Load a fastText model
   * @param [model] ArrayBuffer of model
   */
  public loadModel(model: ArrayBufferView): void;
  public loadModel(model?: string): Promise<void>;
  public loadModel(model: ArrayBufferView | string = "./model/lid.176.ftz") {
    if (typeof model === "string")
      return fetchFile(new URL(model, import.meta.url).href).then((data) =>
        this._loadModel(data),
      );
    else return this._loadModel(model);
  }

  private _loadModel(model: ArrayBufferView): void {
    this.fs.writeFile(TEMP_MODEL_PATH, model);
    this.ft.loadModel(TEMP_MODEL_PATH);
    this.fs.unlink(TEMP_MODEL_PATH);
  }

  /** Detect the most probable language
   * @param text text to detect
   * @returns two or three letter language code
   */
  public detect(text: string) {
    return Array.from(this.predict(text, -1, 0))
      .sort((lang1, lang2) => lang2[1] - lang1[1])[0]![0]
      .slice(9);
  }

  /** Same as predict method of fastText, return a Map of probability
   *  @param text text to predict
   *  @param [k] max number of return entries, use -1 to return all
   *  @param [thresold] min possibility of return entries(0~1)
   *  @returns Map of __lable__$(lang) => probability
   */
  public predict(
    text: string,
    k: number = -1,
    thresold: number = 0,
  ): Map<string, number> {
    return vkPairVector2Map(this.ft.predict(text, k, thresold), true);
  }
}

export * from "./types";
export * from "./utils";
