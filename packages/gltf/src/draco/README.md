# Draco Scripts

These scripts are modified from the [Draco repository](https://github.com/google/draco/tree/master/javascript/example) to actually work in a modern js library.

## Changes

- `js` files are now `ts` files (with typechecking disabled)
- `js` files export functions instead of adding them to the global scope
- `wasm` files are loaded using `import.meta.url` instead of fetching from the root
