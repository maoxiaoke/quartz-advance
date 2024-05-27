import path from "path"
import { readFileSync } from "fs"

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * All constants relating to helpers or handlers
 */
export const ORIGIN_NAME = "origin"
export const UPSTREAM_NAME = "upstream"
export const QUARTZ_SOURCE_BRANCH = "v4"
export const cwd = path.join(__dirname, '../..') ??  process.cwd()
export const cacheDir = path.join(cwd, ".quartz-cache")
export const cacheFile = path.join(cwd, "./quartz/.quartz-cache/transpiled-build.mjs")
export const fp = path.join(cwd, "./quartz/build.ts")
export const { version } = JSON.parse(readFileSync(path.join(cwd, "./package.json")).toString())
export const contentCacheFolder = path.join(cacheDir, "content-cache")
