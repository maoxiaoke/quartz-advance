import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { promises } from "fs";
import path from "path";
import esbuild from "esbuild";
import chalk from "chalk";
import { sassPlugin } from "esbuild-sass-plugin";
import fs from "fs";
import { intro, outro, select, text } from "@clack/prompts";
import { rimraf } from "rimraf";
import chokidar from "chokidar";
import prettyBytes from "pretty-bytes";
import { execSync, spawnSync } from "child_process";
import http from "http";
import serveHandler from "serve-handler";
import { WebSocketServer } from "ws";
import { randomUUID } from "crypto";
import { Mutex } from "async-mutex";
import { CreateArgv } from "./args.js";
import { exitIfCancel, escapePath, gitPull, popContentFolder, stashContentFolder } from "./helpers.js";
import { UPSTREAM_NAME, QUARTZ_SOURCE_BRANCH, ORIGIN_NAME, version, fp, cacheFile, cwd } from "./constants.js";
/**
 * Handles `npx quartz create`
 * @param {*} argv arguments for `create`
 */ export function handleCreate(argv) {
    return _handleCreate.apply(this, arguments);
}
function _handleCreate() {
    _handleCreate = _async_to_generator(function(argv) {
        var _argv_strategy, _argv_links, contentFolder, setupStrategy, linkResolutionStrategy, sourceDirectory, gitkeepPath, originalFolder, configFilePath, configContent;
        function rmContentFolder() {
            return _rmContentFolder.apply(this, arguments);
        }
        function _rmContentFolder() {
            _rmContentFolder = _async_to_generator(function() {
                var contentStat;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                fs.promises.lstat(contentFolder)
                            ];
                        case 1:
                            contentStat = _state.sent();
                            if (!contentStat.isSymbolicLink()) return [
                                3,
                                3
                            ];
                            return [
                                4,
                                fs.promises.unlink(contentFolder)
                            ];
                        case 2:
                            _state.sent();
                            return [
                                3,
                                5
                            ];
                        case 3:
                            return [
                                4,
                                rimraf(contentFolder)
                            ];
                        case 4:
                            _state.sent();
                            _state.label = 5;
                        case 5:
                            return [
                                2
                            ];
                    }
                });
            });
            return _rmContentFolder.apply(this, arguments);
        }
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    console.log();
                    intro(chalk.bgGreen.black(" Quartz v".concat(version, " ")));
                    contentFolder = path.join(cwd, argv.directory);
                    setupStrategy = (_argv_strategy = argv.strategy) === null || _argv_strategy === void 0 ? void 0 : _argv_strategy.toLowerCase();
                    linkResolutionStrategy = (_argv_links = argv.links) === null || _argv_links === void 0 ? void 0 : _argv_links.toLowerCase();
                    sourceDirectory = argv.source;
                    // If all cmd arguments were provided, check if theyre valid
                    if (setupStrategy && linkResolutionStrategy) {
                        // If setup isn't, "new", source argument is required
                        if (setupStrategy !== "new") {
                            // Error handling
                            if (!sourceDirectory) {
                                outro(chalk.red("Setup strategies (arg '".concat(chalk.yellow("-".concat(CreateArgv.strategy.alias[0])), "') other than '").concat(chalk.yellow("new"), "' require content folder argument ('").concat(chalk.yellow("-".concat(CreateArgv.source.alias[0])), "') to be set")));
                                process.exit(1);
                            } else {
                                if (!fs.existsSync(sourceDirectory)) {
                                    outro(chalk.red("Input directory to copy/symlink 'content' from not found ('".concat(chalk.yellow(sourceDirectory), "', invalid argument \"").concat(chalk.yellow("-".concat(CreateArgv.source.alias[0])), ")")));
                                    process.exit(1);
                                } else if (!fs.lstatSync(sourceDirectory).isDirectory()) {
                                    outro(chalk.red("Source directory to copy/symlink 'content' from is not a directory (found file at '".concat(chalk.yellow(sourceDirectory), "', invalid argument ").concat(chalk.yellow("-".concat(CreateArgv.source.alias[0])), '")')));
                                    process.exit(1);
                                }
                            }
                        }
                    }
                    if (!!setupStrategy) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        select({
                            message: "Choose how to initialize the content in `".concat(contentFolder, "`"),
                            options: [
                                {
                                    value: "new",
                                    label: "Empty Quartz"
                                },
                                {
                                    value: "copy",
                                    label: "Copy an existing folder",
                                    hint: "overwrites `content`"
                                },
                                {
                                    value: "symlink",
                                    label: "Symlink an existing folder",
                                    hint: "don't select this unless you know what you are doing!"
                                }
                            ]
                        })
                    ];
                case 1:
                    setupStrategy = exitIfCancel.apply(void 0, [
                        _state.sent()
                    ]);
                    _state.label = 2;
                case 2:
                    gitkeepPath = path.join(contentFolder, ".gitkeep");
                    if (!fs.existsSync(gitkeepPath)) return [
                        3,
                        4
                    ];
                    return [
                        4,
                        fs.promises.unlink(gitkeepPath)
                    ];
                case 3:
                    _state.sent();
                    _state.label = 4;
                case 4:
                    if (!(setupStrategy === "copy" || setupStrategy === "symlink")) return [
                        3,
                        12
                    ];
                    originalFolder = sourceDirectory;
                    if (!!sourceDirectory) return [
                        3,
                        6
                    ];
                    return [
                        4,
                        text({
                            message: "Enter the full path to existing content folder",
                            placeholder: "On most terminal emulators, you can drag and drop a folder into the window and it will paste the full path",
                            validate: function validate(fp) {
                                var fullPath = escapePath(fp);
                                if (!fs.existsSync(fullPath)) {
                                    return "The given path doesn't exist";
                                } else if (!fs.lstatSync(fullPath).isDirectory()) {
                                    return "The given path is not a folder";
                                }
                            }
                        })
                    ];
                case 5:
                    originalFolder = escapePath.apply(void 0, [
                        exitIfCancel.apply(void 0, [
                            _state.sent()
                        ])
                    ]);
                    _state.label = 6;
                case 6:
                    return [
                        4,
                        rmContentFolder()
                    ];
                case 7:
                    _state.sent();
                    if (!(setupStrategy === "copy")) return [
                        3,
                        9
                    ];
                    return [
                        4,
                        fs.promises.cp(originalFolder, contentFolder, {
                            recursive: true,
                            preserveTimestamps: true
                        })
                    ];
                case 8:
                    _state.sent();
                    return [
                        3,
                        11
                    ];
                case 9:
                    if (!(setupStrategy === "symlink")) return [
                        3,
                        11
                    ];
                    return [
                        4,
                        fs.promises.symlink(originalFolder, contentFolder, "dir")
                    ];
                case 10:
                    _state.sent();
                    _state.label = 11;
                case 11:
                    return [
                        3,
                        14
                    ];
                case 12:
                    if (!(setupStrategy === "new")) return [
                        3,
                        14
                    ];
                    return [
                        4,
                        fs.promises.writeFile(path.join(contentFolder, "index.md"), "---\ntitle: Welcome to Quartz\n---\n\nThis is a blank Quartz installation.\nSee the [documentation](https://quartz.jzhao.xyz) for how to get started.\n")
                    ];
                case 13:
                    _state.sent();
                    _state.label = 14;
                case 14:
                    if (!!linkResolutionStrategy) return [
                        3,
                        16
                    ];
                    return [
                        4,
                        select({
                            message: "Choose how Quartz should resolve links in your content. This should match Obsidian's link format. You can change this later in `quartz.config.ts`.",
                            options: [
                                {
                                    value: "shortest",
                                    label: "Treat links as shortest path",
                                    hint: "(default)"
                                },
                                {
                                    value: "absolute",
                                    label: "Treat links as absolute path"
                                },
                                {
                                    value: "relative",
                                    label: "Treat links as relative paths"
                                }
                            ]
                        })
                    ];
                case 15:
                    // get a preferred link resolution strategy
                    linkResolutionStrategy = exitIfCancel.apply(void 0, [
                        _state.sent()
                    ]);
                    _state.label = 16;
                case 16:
                    configFilePath = path.join(cwd, "quartz.config.ts");
                    return [
                        4,
                        fs.promises.readFile(configFilePath, {
                            encoding: "utf-8"
                        })
                    ];
                case 17:
                    configContent = _state.sent();
                    configContent = configContent.replace(/markdownLinkResolution: '(.+)'/, "markdownLinkResolution: '".concat(linkResolutionStrategy, "'"));
                    return [
                        4,
                        fs.promises.writeFile(configFilePath, configContent)
                    ];
                case 18:
                    _state.sent();
                    // setup remote
                    execSync("git remote show upstream || git remote add upstream https://github.com/jackyzha0/quartz.git", {
                        stdio: "ignore"
                    });
                    outro("You're all set! Not sure what to do next? Try:\n  • Customizing Quartz a bit more by editing `quartz.config.ts`\n  • Running `npx quartz build --serve` to preview your Quartz locally\n  • Hosting your Quartz online (see: https://quartz.jzhao.xyz/hosting)\n");
                    return [
                        2
                    ];
            }
        });
    });
    return _handleCreate.apply(this, arguments);
}
/**
 * Handles `npx quartz build`
 * @param {*} argv arguments for `build`
 */ export function handleBuild(argv) {
    return _handleBuild.apply(this, arguments);
}
function _handleBuild() {
    _handleBuild = _async_to_generator(function(argv) {
        var ctx, buildMutex, lastBuildMs, cleanupBuild, build, connections, clientRefresh, server, wss;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    console.log(chalk.bgGreen.black("\n Quartz v".concat(version, " \n")));
                    return [
                        4,
                        esbuild.context({
                            entryPoints: [
                                fp
                            ],
                            outfile: cacheFile,
                            bundle: true,
                            keepNames: true,
                            minifyWhitespace: true,
                            minifySyntax: true,
                            platform: "node",
                            format: "esm",
                            jsx: "automatic",
                            jsxImportSource: "preact",
                            packages: "external",
                            metafile: true,
                            sourcemap: true,
                            sourcesContent: false,
                            plugins: [
                                sassPlugin({
                                    type: "css-text",
                                    cssImports: true
                                }),
                                {
                                    name: "inline-script-loader",
                                    setup: function setup(build) {
                                        build.onLoad({
                                            filter: /\.inline\.(ts|js)$/
                                        }, function() {
                                            var _ref = _async_to_generator(function(args) {
                                                var text, sourcefile, resolveDir, transpiled, rawMod;
                                                return _ts_generator(this, function(_state) {
                                                    switch(_state.label){
                                                        case 0:
                                                            return [
                                                                4,
                                                                promises.readFile(args.path, "utf8")
                                                            ];
                                                        case 1:
                                                            text = _state.sent();
                                                            // remove default exports that we manually inserted
                                                            text = text.replace("export default", "");
                                                            text = text.replace("export", "");
                                                            sourcefile = path.relative(path.resolve("."), args.path);
                                                            resolveDir = path.dirname(sourcefile);
                                                            return [
                                                                4,
                                                                esbuild.build({
                                                                    stdin: {
                                                                        contents: text,
                                                                        loader: "ts",
                                                                        resolveDir: resolveDir,
                                                                        sourcefile: sourcefile
                                                                    },
                                                                    write: false,
                                                                    bundle: true,
                                                                    minify: true,
                                                                    platform: "browser",
                                                                    format: "esm"
                                                                })
                                                            ];
                                                        case 2:
                                                            transpiled = _state.sent();
                                                            rawMod = transpiled.outputFiles[0].text;
                                                            return [
                                                                2,
                                                                {
                                                                    contents: rawMod,
                                                                    loader: "text"
                                                                }
                                                            ];
                                                    }
                                                });
                                            });
                                            return function(args) {
                                                return _ref.apply(this, arguments);
                                            };
                                        }());
                                    }
                                }
                            ]
                        })
                    ];
                case 1:
                    ctx = _state.sent();
                    buildMutex = new Mutex();
                    lastBuildMs = 0;
                    cleanupBuild = null;
                    build = function() {
                        var _ref = _async_to_generator(function(clientRefresh) {
                            var buildStart, release, result, outputFileName, meta, _, _ref, buildQuartz;
                            return _ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        buildStart = new Date().getTime();
                                        lastBuildMs = buildStart;
                                        return [
                                            4,
                                            buildMutex.acquire()
                                        ];
                                    case 1:
                                        release = _state.sent();
                                        if (lastBuildMs > buildStart) {
                                            release();
                                            return [
                                                2
                                            ];
                                        }
                                        if (!cleanupBuild) return [
                                            3,
                                            3
                                        ];
                                        return [
                                            4,
                                            cleanupBuild()
                                        ];
                                    case 2:
                                        _state.sent();
                                        console.log(chalk.yellow("Detected a source code change, doing a hard rebuild..."));
                                        _state.label = 3;
                                    case 3:
                                        return [
                                            4,
                                            ctx.rebuild().catch(function(err) {
                                                console.error("".concat(chalk.red("Couldn't parse Quartz configuration:"), " ").concat(fp));
                                                console.log("Reason: ".concat(chalk.grey(err)));
                                                process.exit(1);
                                            })
                                        ];
                                    case 4:
                                        result = _state.sent();
                                        release();
                                        if (!argv.bundleInfo) return [
                                            3,
                                            6
                                        ];
                                        outputFileName = "quartz/.quartz-cache/transpiled-build.mjs";
                                        meta = result.metafile.outputs[outputFileName];
                                        console.log("Successfully transpiled ".concat(Object.keys(meta.inputs).length, " files (").concat(prettyBytes(meta.bytes), ")"));
                                        _ = console.log;
                                        return [
                                            4,
                                            esbuild.analyzeMetafile(result.metafile, {
                                                color: true
                                            })
                                        ];
                                    case 5:
                                        _.apply(console, [
                                            _state.sent()
                                        ]);
                                        _state.label = 6;
                                    case 6:
                                        return [
                                            4,
                                            import("../../".concat(cacheFile, "?update=").concat(randomUUID()))
                                        ];
                                    case 7:
                                        _ref = _state.sent(), buildQuartz = _ref.default;
                                        return [
                                            4,
                                            buildQuartz(argv, buildMutex, clientRefresh)
                                        ];
                                    case 8:
                                        // ^ this import is relative, so base "cacheFile" path can't be used
                                        cleanupBuild = _state.sent();
                                        clientRefresh();
                                        return [
                                            2
                                        ];
                                }
                            });
                        });
                        return function build(clientRefresh) {
                            return _ref.apply(this, arguments);
                        };
                    }();
                    if (!argv.serve) return [
                        3,
                        3
                    ];
                    connections = [];
                    clientRefresh = function() {
                        return connections.forEach(function(conn) {
                            return conn.send("rebuild");
                        });
                    };
                    if (argv.baseDir !== "" && !argv.baseDir.startsWith("/")) {
                        argv.baseDir = "/" + argv.baseDir;
                    }
                    return [
                        4,
                        build(clientRefresh)
                    ];
                case 2:
                    _state.sent();
                    server = http.createServer(function() {
                        var _ref = _async_to_generator(function(req, res) {
                            var _req_url, _req_url1, _req_url2, serve, redirect, _req_url_split_, _$fp, indexFp, base, base1, indexFp1;
                            return _ts_generator(this, function(_state) {
                                if (argv.baseDir && !((_req_url = req.url) === null || _req_url === void 0 ? void 0 : _req_url.startsWith(argv.baseDir))) {
                                    console.log(chalk.red("[404] ".concat(req.url, " (warning: link outside of site, this is likely a Quartz bug)")));
                                    res.writeHead(404);
                                    res.end();
                                    return [
                                        2
                                    ];
                                }
                                // strip baseDir prefix
                                req.url = (_req_url1 = req.url) === null || _req_url1 === void 0 ? void 0 : _req_url1.slice(argv.baseDir.length);
                                serve = function() {
                                    var _ref = _async_to_generator(function() {
                                        var release, status, statusString;
                                        return _ts_generator(this, function(_state) {
                                            switch(_state.label){
                                                case 0:
                                                    return [
                                                        4,
                                                        buildMutex.acquire()
                                                    ];
                                                case 1:
                                                    release = _state.sent();
                                                    return [
                                                        4,
                                                        serveHandler(req, res, {
                                                            public: argv.output,
                                                            directoryListing: false,
                                                            headers: [
                                                                {
                                                                    source: "**/*.*",
                                                                    headers: [
                                                                        {
                                                                            key: "Content-Disposition",
                                                                            value: "inline"
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        })
                                                    ];
                                                case 2:
                                                    _state.sent();
                                                    status = res.statusCode;
                                                    statusString = status >= 200 && status < 300 ? chalk.green("[".concat(status, "]")) : chalk.red("[".concat(status, "]"));
                                                    console.log(statusString + chalk.grey(" ".concat(argv.baseDir).concat(req.url)));
                                                    release();
                                                    return [
                                                        2
                                                    ];
                                            }
                                        });
                                    });
                                    return function serve() {
                                        return _ref.apply(this, arguments);
                                    };
                                }();
                                redirect = function(newFp) {
                                    newFp = argv.baseDir + newFp;
                                    res.writeHead(302, {
                                        Location: newFp
                                    });
                                    console.log(chalk.yellow("[302]") + chalk.grey(" ".concat(argv.baseDir).concat(req.url, " -> ").concat(newFp)));
                                    res.end();
                                };
                                _$fp = (_req_url_split_ = (_req_url2 = req.url) === null || _req_url2 === void 0 ? void 0 : _req_url2.split("?")[0]) !== null && _req_url_split_ !== void 0 ? _req_url_split_ : "/";
                                // handle redirects
                                if (_$fp.endsWith("/")) {
                                    indexFp = path.posix.join(_$fp, "index.html");
                                    if (fs.existsSync(path.posix.join(argv.output, indexFp))) {
                                        req.url = _$fp;
                                        return [
                                            2,
                                            serve()
                                        ];
                                    }
                                    base = _$fp.slice(0, -1);
                                    if (path.extname(base) === "") {
                                        base += ".html";
                                    }
                                    if (fs.existsSync(path.posix.join(argv.output, base))) {
                                        return [
                                            2,
                                            redirect(_$fp.slice(0, -1))
                                        ];
                                    }
                                } else {
                                    base1 = _$fp;
                                    if (path.extname(base1) === "") {
                                        base1 += ".html";
                                    }
                                    if (fs.existsSync(path.posix.join(argv.output, base1))) {
                                        req.url = _$fp;
                                        return [
                                            2,
                                            serve()
                                        ];
                                    }
                                    indexFp1 = path.posix.join(_$fp, "index.html");
                                    if (fs.existsSync(path.posix.join(argv.output, indexFp1))) {
                                        return [
                                            2,
                                            redirect(_$fp + "/")
                                        ];
                                    }
                                }
                                return [
                                    2,
                                    serve()
                                ];
                            });
                        });
                        return function(req, res) {
                            return _ref.apply(this, arguments);
                        };
                    }());
                    server.listen(argv.port);
                    wss = new WebSocketServer({
                        port: argv.wsPort
                    });
                    wss.on("connection", function(ws) {
                        return connections.push(ws);
                    });
                    console.log(chalk.cyan("Started a Quartz server listening at http://localhost:".concat(argv.port).concat(argv.baseDir)));
                    console.log("hint: exit with ctrl+c");
                    chokidar.watch([
                        "**/*.ts",
                        "**/*.tsx",
                        "**/*.scss",
                        "package.json"
                    ], {
                        ignoreInitial: true
                    }).on("all", /*#__PURE__*/ _async_to_generator(function() {
                        return _ts_generator(this, function(_state) {
                            build(clientRefresh);
                            return [
                                2
                            ];
                        });
                    }));
                    return [
                        3,
                        5
                    ];
                case 3:
                    return [
                        4,
                        build(function() {})
                    ];
                case 4:
                    _state.sent();
                    ctx.dispose();
                    _state.label = 5;
                case 5:
                    return [
                        2
                    ];
            }
        });
    });
    return _handleBuild.apply(this, arguments);
}
/**
 * Handles `npx quartz update`
 * @param {*} argv arguments for `update`
 */ export function handleUpdate(argv) {
    return _handleUpdate.apply(this, arguments);
}
function _handleUpdate() {
    _handleUpdate = _async_to_generator(function(argv) {
        var contentFolder, e, res;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    contentFolder = path.join(cwd, argv.directory);
                    console.log(chalk.bgGreen.black("\n Quartz v".concat(version, " \n")));
                    console.log("Backing up your content");
                    execSync("git remote show upstream || git remote add upstream https://github.com/jackyzha0/quartz.git");
                    return [
                        4,
                        stashContentFolder(contentFolder)
                    ];
                case 1:
                    _state.sent();
                    console.log("Pulling updates... you may need to resolve some `git` conflicts if you've made changes to components or plugins.");
                    _state.label = 2;
                case 2:
                    _state.trys.push([
                        2,
                        3,
                        ,
                        5
                    ]);
                    gitPull(UPSTREAM_NAME, QUARTZ_SOURCE_BRANCH);
                    return [
                        3,
                        5
                    ];
                case 3:
                    e = _state.sent();
                    console.log(chalk.red("An error occurred above while pulling updates."));
                    return [
                        4,
                        popContentFolder(contentFolder)
                    ];
                case 4:
                    _state.sent();
                    return [
                        2
                    ];
                case 5:
                    return [
                        4,
                        popContentFolder(contentFolder)
                    ];
                case 6:
                    _state.sent();
                    console.log("Ensuring dependencies are up to date");
                    res = spawnSync("npm", [
                        "i"
                    ], {
                        stdio: "inherit"
                    });
                    if (res.status === 0) {
                        console.log(chalk.green("Done!"));
                    } else {
                        console.log(chalk.red("An error occurred above while installing dependencies."));
                    }
                    return [
                        2
                    ];
            }
        });
    });
    return _handleUpdate.apply(this, arguments);
}
/**
 * Handles `npx quartz restore`
 * @param {*} argv arguments for `restore`
 */ export function handleRestore(argv) {
    return _handleRestore.apply(this, arguments);
}
function _handleRestore() {
    _handleRestore = _async_to_generator(function(argv) {
        var contentFolder;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    contentFolder = path.join(cwd, argv.directory);
                    return [
                        4,
                        popContentFolder(contentFolder)
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return _handleRestore.apply(this, arguments);
}
/**
 * Handles `npx quartz sync`
 * @param {*} argv arguments for `sync`
 */ export function handleSync(argv) {
    return _handleSync.apply(this, arguments);
}
function _handleSync() {
    _handleSync = _async_to_generator(function(argv) {
        var contentFolder, contentStat, linkTarg, currentTimestamp, _argv_message, commitMessage, e, res;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    contentFolder = path.join(cwd, argv.directory);
                    console.log(chalk.bgGreen.black("\n Quartz v".concat(version, " \n")));
                    console.log("Backing up your content");
                    if (!argv.commit) return [
                        3,
                        7
                    ];
                    return [
                        4,
                        fs.promises.lstat(contentFolder)
                    ];
                case 1:
                    contentStat = _state.sent();
                    if (!contentStat.isSymbolicLink()) return [
                        3,
                        5
                    ];
                    return [
                        4,
                        fs.promises.readlink(contentFolder)
                    ];
                case 2:
                    linkTarg = _state.sent();
                    console.log(chalk.yellow("Detected symlink, trying to dereference before committing"));
                    // stash symlink file
                    return [
                        4,
                        stashContentFolder(contentFolder)
                    ];
                case 3:
                    _state.sent();
                    // follow symlink and copy content
                    return [
                        4,
                        fs.promises.cp(linkTarg, contentFolder, {
                            recursive: true,
                            preserveTimestamps: true
                        })
                    ];
                case 4:
                    _state.sent();
                    _state.label = 5;
                case 5:
                    currentTimestamp = new Date().toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short"
                    });
                    commitMessage = (_argv_message = argv.message) !== null && _argv_message !== void 0 ? _argv_message : "Quartz sync: ".concat(currentTimestamp);
                    spawnSync("git", [
                        "add",
                        "."
                    ], {
                        stdio: "inherit"
                    });
                    spawnSync("git", [
                        "commit",
                        "-m",
                        commitMessage
                    ], {
                        stdio: "inherit"
                    });
                    if (!contentStat.isSymbolicLink()) return [
                        3,
                        7
                    ];
                    // put symlink back
                    return [
                        4,
                        popContentFolder(contentFolder)
                    ];
                case 6:
                    _state.sent();
                    _state.label = 7;
                case 7:
                    return [
                        4,
                        stashContentFolder(contentFolder)
                    ];
                case 8:
                    _state.sent();
                    if (!argv.pull) return [
                        3,
                        12
                    ];
                    console.log("Pulling updates from your repository. You may need to resolve some `git` conflicts if you've made changes to components or plugins.");
                    _state.label = 9;
                case 9:
                    _state.trys.push([
                        9,
                        10,
                        ,
                        12
                    ]);
                    gitPull(ORIGIN_NAME, QUARTZ_SOURCE_BRANCH);
                    return [
                        3,
                        12
                    ];
                case 10:
                    e = _state.sent();
                    console.log(chalk.red("An error occurred above while pulling updates."));
                    return [
                        4,
                        popContentFolder(contentFolder)
                    ];
                case 11:
                    _state.sent();
                    return [
                        2
                    ];
                case 12:
                    return [
                        4,
                        popContentFolder(contentFolder)
                    ];
                case 13:
                    _state.sent();
                    if (argv.push) {
                        console.log("Pushing your changes");
                        res = spawnSync("git", [
                            "push",
                            "-uf",
                            ORIGIN_NAME,
                            QUARTZ_SOURCE_BRANCH
                        ], {
                            stdio: "inherit"
                        });
                        if (res.status !== 0) {
                            console.log(chalk.red("An error occurred above while pushing to remote ".concat(ORIGIN_NAME, ".")));
                            return [
                                2
                            ];
                        }
                    }
                    console.log(chalk.green("Done!"));
                    return [
                        2
                    ];
            }
        });
    });
    return _handleSync.apply(this, arguments);
}
export default {
    handleCreate: handleCreate,
    handleBuild: handleBuild,
    handleUpdate: handleUpdate,
    handleRestore: handleRestore,
    handleSync: handleSync
};

 //# sourceMappingURL=handlers.js.map