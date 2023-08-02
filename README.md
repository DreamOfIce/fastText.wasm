# fastText.wasm

WebAssembly version of [fastText](https://github.com/facebookresearch/fastText/)

## Features

- [x] Out of the box
- [x] written in TypeScript
- [x] Browser & Node support
- [x] API wrapping of model loading and language detection
- [x] Direct access to WasmFS and fastText core
- [ ] Full Deno support(currently loadModel() with local path is not supported in deno）
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
import { FastText } from "fasttext.wasm"

const fastText = await FastText.create() // don't call new FastText() directly
await fastText.loadModel() // load default model(lid.176.ftz)
const result = fastText.detect("Hello, world!")
console.log(result) // 'en'
```

## License

MIT
