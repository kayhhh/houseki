// Helper script to add a new package to the monorepo
// Will create a new package directory, package.json, etc.
// As well as update reddo to include the new package

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const packageName = process.argv[2];

if (!packageName) {
  console.error("Please provide a package name as a command line argument");
  process.exit(1);
}

// Enter packages directory
process.chdir(path.join(__dirname, "../packages"));

console.info(`Creating package ${packageName}`);
const packageDir = path.join(__dirname, `../packages/${packageName}`);
fs.mkdirSync(packageDir);

console.info("Creating package.json");
const packageJsonPath = path.join(packageDir, "package.json");
fs.writeFileSync(
  packageJsonPath,
  JSON.stringify({
    devDependencies: {
      "@thyseus/transformer-rollup": "^0.13.0",
      "rollup-plugin-peer-deps-external": "^2.2.4",
      typescript: "~5.1.6",
      vite: "^4.4.2",
      "vite-plugin-dts": "^3.2.0",
    },
    files: ["dist"],
    license: "GPL-3.0-or-later",
    main: "./dist/index.js",
    name: `@reddo/${packageName}`,
    peerDependencies: {
      thyseus: "^0.13.2",
    },
    publishConfig: {
      access: "public",
    },
    repository: {
      directory: `packages/${packageName}`,
      type: "git",
      url: "https://github.com/reddo/reddo",
    },
    scripts: {
      build: "vite build --emptyOutDir",
      dev: "vite build --watch",
    },
    type: "module",
    types: "./dist/index.d.ts",
    version: "0.0.0",
  })
);

console.info("Creating src");
const srcDir = path.join(packageDir, "src");
fs.mkdirSync(srcDir);

console.info("Creating index.ts");
const indexFilePath = path.join(srcDir, "index.ts");
fs.writeFileSync(
  indexFilePath,
  `export const ${packageName} = "Hello from ${packageName}";`
);

console.info("Creating vite.config.mjs");
const viteConfigPath = path.join(packageDir, "vite.config.mjs");
fs.writeFileSync(
  viteConfigPath,
  `import { thyseus } from "@thyseus/transformer-rollup";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: "src/index.ts",
      fileName: "index",
      formats: ["es"],
    },
    minify: false,
    target: "esnext",
  },
  plugins: [dts(), peerDepsExternal(), thyseus()],
});
`
);

console.info("Creating tsconfig.json");
const tsconfigPath = path.join(packageDir, "tsconfig.json");
fs.writeFileSync(
  tsconfigPath,
  `{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "extends": "../../tsconfig.json",
  "include": ["src"]
}
`
);

console.info("Creating README.md");
const readmePath = path.join(packageDir, "README.md");
fs.writeFileSync(
  readmePath,
  `# @reddo/${packageName}
`
);

// Enter reddo directory
const reddoDir = path.join(__dirname, "../packages/reddo");

console.info(`Creating src/${packageName}.ts`);
const srcFilePath = path.join(reddoDir, "src", `${packageName}.ts`);
fs.writeFileSync(srcFilePath, `export * from "@reddo/${packageName}";`);

console.info(`Creating ${packageName}.d.ts`);
const dtsPath = path.join(reddoDir, `${packageName}.d.ts`);
fs.writeFileSync(dtsPath, `export * from "./dist/${packageName}";`);

console.info(`Appending reference to index.d.ts`);
const indexDtsPath = path.join(reddoDir, "index.d.ts");
fs.appendFileSync(
  indexDtsPath,
  `/// <reference path="./${packageName}.d.ts" />`
);

// Sort the references
const indexDts = fs.readFileSync(indexDtsPath, "utf-8");
const sortedIndexDts = indexDts.split("\n").sort().join("\n");
fs.writeFileSync(indexDtsPath, sortedIndexDts);

console.info(`Updating package.json`);
const reddoPackageJsonPath = path.join(reddoDir, "package.json");
const packageJson = JSON.parse(fs.readFileSync(reddoPackageJsonPath));

packageJson.dependencies[`@reddo/${packageName}`] = "workspace:^";
packageJson.files.push(`${packageName}.d.ts`);
packageJson.exports[`./${packageName}`] = {
  import: `./dist/${packageName}.js`,
};

// Sort the exports object
const sortedExports = Object.keys(packageJson.exports)
  .sort()
  .reduce((acc, key) => {
    // @ts-expect-error
    acc[key] = packageJson.exports[key];
    return acc;
  }, {});
packageJson.exports = sortedExports;

// Sort the files array
packageJson.files.sort();

fs.writeFileSync(reddoPackageJsonPath, JSON.stringify(packageJson, null, 2));

console.info(`Updating vite.config.mjs`);
const reddoViteConfigPath = path.join(reddoDir, "vite.config.mjs");
const viteConfig = fs.readFileSync(reddoViteConfigPath, "utf-8");

// Add the new package to entries object
const entries = viteConfig.match(/entry: {([\s\S]*?)},/)[1];
const updatedEntries = `${entries}${packageName}: "./src/${packageName}.ts",`;

// Replace the old entries object with the new one
const updatedViteConfig = viteConfig.replace(
  /entry: {([\s\S]*?)},/,
  `entry: {${updatedEntries}
},`
);

// Write the updated config back to the file
fs.writeFileSync(reddoViteConfigPath, updatedViteConfig);

// Return to root directory
process.chdir(path.join(__dirname, ".."));

console.info("Installing dependencies");
execSync("pnpm i");

console.info("Formatting files");
execSync("pnpm run format");

console.info("Building files");
execSync("pnpm run build");

console.info("Linting files");
execSync("pnpm run lint");
