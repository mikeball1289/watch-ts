#!/usr/bin/env node
let fs = require("fs");
let browserify = require("browserify");
let watchify = require("watchify");
let tsify = require("tsify");
let path = require("path");
let optimist = require("optimist");

if (optimist.argv["init"]) {
    let react = optimist.argv["init"] === "react";
    try {
        fs.statSync("tsconfig.json");
        console.error("tsconfig.json already exists");
        process.exit(1);
    } catch(err) { /* pass */ }
    fs.writeFileSync("tsconfig.json",
`{
    "compilerOptions": {
        ${react ? `"jsx": "react",` : ""}
        "target": "es6",
        "module": "commonjs",
        "noImplicitAny": true,
        "strictNullChecks": true,
        "inlineSourceMap": true,
        "inlineSources": true
    },
    "include": [
        ${react ? `"src/**/*.tsx",` : ""}
        "src/**/*.ts"
    ]
}`
    );
    fs.mkdirSync("src");
    console.log("Your typescript project has been initialized.");
    process.exit(0);
}

// let inFile = optimist.argv._[0];

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
        plugin: [ watchify ],
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
            } ) );
        }
}