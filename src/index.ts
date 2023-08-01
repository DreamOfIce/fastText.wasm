import type {
  Emscripten,
  FastTextCore,
  FastTextModule,
  FastTextModuleConstructor,
} from "./types";
import type { FastTextOptions } from "./options";
import { defaultOptions } from "./options";
import { vkPairVector2Map } from "./utils";

export class FastText {
  public core: FastTextModule;
  private ft: FastTextCore;
  public fs: Emscripten.FileSystem.FS;
  private constructor(core: FastTextModule) {
    this.core = core;
    this.fs = core.FS;
    this.ft = new core.FastText();
  }

  public static async create(options: FastTextOptions) {
    const opt = { ...defaultOptions, ...options };
    const coreCtor = (
      (await import(opt.corePath)) as { default: FastTextModuleConstructor }
    ).default;
    const core = await coreCtor({
      print: () => {
        /* empty */
      },
      printErr: () => {
        /* empty */
      },
    });
    return new FastText(core);
  }

  public loadModel(model: Uint8Array) {
    const tmpModelPath = "/tmp_module.bin";
    this.fs.writeFile(tmpModelPath, model);
    this.ft.loadModel(tmpModelPath);
    this.fs.unlink(tmpModelPath);
  }

  public detect(text: string) {
    return Array.from(this.predict(text, -1, 0))
      .sort((lang1, lang2) => lang2[1] - lang1[1])[0]![0]
      .slice(9);
  }
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
