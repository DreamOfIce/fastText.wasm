# fastText.wasm

WebAssembly version of [fastText](https://github.com/facebookresearch/fastText/) with compressed `lid.176.ftz` model (~900KB) and a typescript wrapper
This project focuses on cross-platform, zero-dependency and out-of-the-box

## Compare

### fastText.js

[fastText.js](https://github.com/loretoparisi/fasttext.js) uses pre-built binaries, which theoretically has a higher performance ceiling, but only supports Node.js on most common systems and archs
Also, it is written in JavaScript and does not provide type definitions, so it is not easy to use for TypeScript projects

### LanguageDetect

[languagedetect](https://github.com/FGRibreau/node-language-detect) is a popular node language detection library, its size (~300KB) is smaller than fastText.wasm (~1.4MB)
But it's slower and less accuracy than fastText.wasm, and does not support some common languages like Chinese

## Features

- [x] Out of the box
- [x] Written in TypeScript
- [x] Browser, Node and Deno support
- [x] API wrapping of model loading and language detection
- [x] Direct access to WasmFS and fastText core
- [ ] API wrapping of model training and saving

## Usage

### Install

```sh
# Using npm
npm install fasttext.wasm
# Using pnpm
pnpm add fasttext.wasm
```

### Quick start

```ts
import { FastText } from "fasttext.wasm";

const fastText = await FastText.create(); // don't call new FastText() directly
await fastText.loadModel(); // load default model(lid.176.ftz)
const result = fastText.detect("Hello, world!");
console.log(result); // 'en'
```

## License

MIT
