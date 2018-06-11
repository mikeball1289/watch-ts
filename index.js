#!/usr/bin/env node
let fs = require("fs");
let browserify = require("browserify");
let watchify = require("watchify");
let tsify = require("tsify");
let path = require("path");
let optimist = require("optimist");

(async function() {

try {
    await require("./versionCheck").checkVersion();
} catch(err) {}

let version = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "ascii")).version;

if (optimist.argv["help"] || optimist.argv.h) {
    console.log(
`browser-ts v${version}
  usage: browser-ts [opts]
    broswer-ts <file1.ts> [file2.ts ...] -o <outDir> [-w|--watch]
    browser-ts --init [react]

  flags:
    -o <outDir>: send compiled files to outDir
    --init: initialize a new typescript project
    --init react: initialze a new react project
    -v, --version: show the version number
    -h, --help: show this help
`
    );
    process.exit();
}

if (optimist.argv["version"] || optimist.argv.v) {
    console.log(`browser-ts v${version}`);
    process.exit();
}

if (optimist.argv["init"]) {

    function fileExists(filename) {
        try {
            fs.statSync(file);
            return true;
        } catch(err) {
            return false;
        }
    }

    if (optimist.argv["init"] === "react") {
        let io = require("./io");
        let response = await io.stdin("bool", "Install react? (y/n) ");

        if (response) {
            let child_process = require("child_process");
            async function installReact() {
                return new Promise( (resolve, reject) => {
                    console.log("Installing react...");
                    child_process.exec("npm i --save react @types/react react-dom @types/react-dom", (err, stdout, stderr) => {
                        if (err) return reject(err);
                        console.log(stdout);
                        console.log(stderr);
                        resolve();
                    } );
                } );
            }
            await installReact();
        }

        if (!fileExists("tsconfig.json")) {
            fs.writeFileSync("tsconfig.json",
`{
    "compilerOptions": {
        "jsx": "react",
        "target": "es6",
        "module": "commonjs",
        "noImplicitAny": true,
        "strictNullChecks": true,
        "inlineSourceMap": true,
        "inlineSources": true
    },
    "include": [
        "src/**/*.tsx",
        "src/**/*.ts"
    ]
}`
            );
        }
        try {
            fs.mkdirSync("src");
            fs.mkdirSync("dist");
        } catch(err) { /* pass */ }

        if (!fileExists("src/main.tsx")) {
            fs.writeFileSync("src/main.tsx",
`import * as React from "react";
import * as ReactDOM from "react-dom";

window.addEventListener("load", () => {
    console.log("Hello world");
    ReactDOM.render(<p>Hello world</p>, document.getElementById("container"));
} );`
                );
            }
            if (!fileExists("dist/index.html")) {
                fs.writeFileSync("dist/index.html",
`<!DOCTYPE html>
<head>
    <title>My React App</title>
    <script type="text/javascript" src="/main.js"></script>
</head>
<body>
    <div id="container"></div>
</body>`
            );
        }
        console.log("Your react project has been initialized.");
        console.log("Run the build process with");
        console.log(" watch-ts src/main.tsx -o dist");
        process.exit(0);
    } else if (optimist.argv["init"] === "node") {
        if (!fileExists("tsconfig.json")) {
            fs.writeFileSync("tsconfig.json",
`{
    "compilerOptions": {
        "target": "es6",
        "module": "commonjs",
        "noImplicitAny": true,
        "strictNullChecks": true,
        "inlineSourceMap": true,
        "inlineSources": true,
        "outDir": "bin"
    },
    "include": [
        "src/**/*.ts"
    ]
}`
            );
        }
        try {
            fs.mkdirSync("src");
        } catch(err) { /* pass */ }
        try {
            fs.mkdirSync("bin");
        } catch(err) { /* pass */ }

        if (!fileExists("src/main.ts")) {
            fs.writeFileSync("src/main.ts",
`console.log("Hello world");`
            );
        }
        console.log("Your typescript project has been initialized.");
    } else if (optimist.argv["init"]) {
        if (!fileExists("tsconfig.json")) {
            fs.writeFileSync("tsconfig.json",
`{
    "compilerOptions": {
        "target": "es6",
        "module": "commonjs",
        "noImplicitAny": true,
        "strictNullChecks": true,
        "inlineSourceMap": true,
        "inlineSources": true
    },
    "include": [
        "src/**/*.ts"
    ]
}`
            );
        }
        try {
            fs.mkdirSync("src");
        } catch(err) { /* pass */ }
        try {
            fs.mkdirSync("dist");
        } catch(err) { /* pass */ }

        if (!fileExists("src/main.ts")) {
            fs.writeFileSync("src/main.ts",
`window.addEventListener("load", () => {
    console.log("Hello world");
} );`
            );
        }
        if (!fileExists("dist/index.html")) {
            fs.writeFileSync("dist/index.html",
`<!DOCTYPE html>
<head>
    <title>My Typescript App</title>
    <script type="text/javascript" src="/main.js"></script>
</head>
<body>
    <span>Hello world</span>
</body>`
            );
        }
        console.log("Your typescript project has been initialized.");
        console.log("Run the build process with");
        console.log(" watch-ts src/main.ts -o dist");
        process.exit(0);
    }
} else {
    if (!optimist.argv._.length) {
        console.error("No compilation target specified");
        process.exit(1);
    }
    let outPath = optimist.argv.o;
    if (!outPath) {
        // outFile = inFile.replace(/\.tsx?$/, "") + ".js";
        outPath = "";
    }
    
    for (let inFile of optimist.argv._) {
        let outFile = path.basename(inFile).replace(/\.tsx?$/, "") + ".js";

        let b = browserify( {
            paths: [
                "./node_modules"
            ],
            cache: {},
            packageCache: {},
            plugin: optimist.argv["watch"] || optimist.argv.w ? [ watchify ] : [],
            debug: true,
        } );
        b.plugin(tsify, { project: "." } );
        b.add(inFile);
        
        b.on("update", bundle);
        bundle();
        
        function currentTime() {
            let time = new Date();
            return `${("0" + time.getHours()).slice(-2)}:${("0" + time.getMinutes()).slice(-2)}:${("0" + time.getSeconds()).slice(-2)}`
        }
        
        function bundle() {
            let hadError = false;
            let time = new Date();
            console.log(`\x1b[32m[${currentTime()}]--- Beginning compilation of ${path.basename(inFile)}\x1b[0m`);
            b.bundle()
            .on("error", (error) => { console.error(error.message); hadError = true; } )
            .pipe(fs.createWriteStream(path.join(outPath, outFile))
            .on("close", () => {
                if (hadError) {
                    console.log(`\x1b[31m[${currentTime()}]    Compiling ${path.basename(inFile)} ended with errors ---\x1b[0m`);
                } else {
                    console.log(`\x1b[32m[${currentTime()}]    Compiling ${path.basename(inFile)} complete ---\x1b[0m`);
                }
            } ) )
            .on("error", () => console.error(`\x1b[31m[${currentTime()}]    An unexpected error occurred in ${path.basename(inFile)} ---\x1b[0m`) );
        }
    }
}
})();