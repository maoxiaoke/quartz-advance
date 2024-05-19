import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { isCancel, outro } from "@clack/prompts";
import chalk from "chalk";
import { contentCacheFolder } from "./constants.js";
import { spawnSync } from "child_process";
import fs from "fs";
export function escapePath(fp) {
    return fp.replace(/\\ /g, " ") // unescape spaces
    .replace(/\\/g, "") // escape \ to empty
    .replace(/^".*"$/, "$1").replace(/^'.*"$/, "$1").trim();
}
export function exitIfCancel(val) {
    if (isCancel(val)) {
        outro(chalk.red("Exiting"));
        process.exit(0);
    } else {
        return val;
    }
}
export function stashContentFolder(contentFolder) {
    return _stashContentFolder.apply(this, arguments);
}
function _stashContentFolder() {
    _stashContentFolder = _async_to_generator(function(contentFolder) {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fs.promises.rm(contentCacheFolder, {
                            force: true,
                            recursive: true
                        })
                    ];
                case 1:
                    _state.sent();
                    return [
                        4,
                        fs.promises.cp(contentFolder, contentCacheFolder, {
                            force: true,
                            recursive: true,
                            verbatimSymlinks: true,
                            preserveTimestamps: true
                        })
                    ];
                case 2:
                    _state.sent();
                    return [
                        4,
                        fs.promises.rm(contentFolder, {
                            force: true,
                            recursive: true
                        })
                    ];
                case 3:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return _stashContentFolder.apply(this, arguments);
}
export function gitPull(origin, branch) {
    var flags = [
        "--no-rebase",
        "--autostash",
        "-s",
        "recursive",
        "-X",
        "ours",
        "--no-edit"
    ];
    var out = spawnSync("git", [
        "pull"
    ].concat(_to_consumable_array(flags), [
        origin,
        branch
    ]), {
        stdio: "inherit"
    });
    if (out.stderr) {
        throw new Error(chalk.red("Error while pulling updates: ".concat(out.stderr)));
    } else if (out.status !== 0) {
        throw new Error(chalk.red("Error while pulling updates"));
    }
}
export function popContentFolder(contentFolder) {
    return _popContentFolder.apply(this, arguments);
}
function _popContentFolder() {
    _popContentFolder = _async_to_generator(function(contentFolder) {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fs.promises.rm(contentFolder, {
                            force: true,
                            recursive: true
                        })
                    ];
                case 1:
                    _state.sent();
                    return [
                        4,
                        fs.promises.cp(contentCacheFolder, contentFolder, {
                            force: true,
                            recursive: true,
                            verbatimSymlinks: true,
                            preserveTimestamps: true
                        })
                    ];
                case 2:
                    _state.sent();
                    return [
                        4,
                        fs.promises.rm(contentCacheFolder, {
                            force: true,
                            recursive: true
                        })
                    ];
                case 3:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return _popContentFolder.apply(this, arguments);
}

 //# sourceMappingURL=helpers.js.map