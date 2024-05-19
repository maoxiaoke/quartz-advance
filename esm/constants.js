import path from "path";
import { readFileSync } from "fs";
/**
 * All constants relating to helpers or handlers
 */ export var ORIGIN_NAME = "origin";
export var UPSTREAM_NAME = "upstream";
export var QUARTZ_SOURCE_BRANCH = "v4";
export var cwd = process.cwd();
export var cacheDir = path.join(cwd, ".quartz-cache");
export var cacheFile = "./quartz/.quartz-cache/transpiled-build.mjs";
export var fp = "./quartz/build.ts";
export var version = JSON.parse(readFileSync("./package.json").toString()).version;
export var contentCacheFolder = path.join(cacheDir, "content-cache");

 //# sourceMappingURL=constants.js.map