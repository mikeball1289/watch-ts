let fs = require("fs");
let browserify = require("browserify");
let watchify = require("watchify");
let tsify = require("tsify");
let path = require("path");
let optimist = require("optimist");

let inFile = optimist.argv._[0];

if (!inFile) {
    console.error("No compilation target specified");
    process.exit(1);
}
let outFile = optimist.argv.o;
if (!outFile) {
    outFile = inFile.replace(/\.tsx?$/, "") + ".js";
}

let b = browserify( {
    paths: [
        __dirname + "/node_modules"
    ],
    cache: {},
    packageCache: {},
    plugin: [ watchify ],
    debug: true,
} );

b.plugin(tsify, { project: "." } );
b.add(path.join(__dirname, inFile));

b.on("update", bundle);
bundle();

function currentTime() {
    let time = new Date();
    return `${("0" + time.getHours()).slice(-2)}:${("0" + time.getMinutes()).slice(-2)}:${("0" + time.getSeconds()).slice(-2)}`
}

function bundle() {
    let hadError = false;
    let time = new Date();
    console.log(`\x1b[32m[${currentTime()}]--- Beginning compilation\x1b[0m`);
    b.bundle()
        .on("error", (error) => { console.error(error.message); hadError = true; } )
        .pipe(fs.createWriteStream(outFile)
            .on("close", () => {
                if (hadError) {
                    console.log(`\x1b[31m[${currentTime()}]    Compilation ended with errors ---\x1b[0m`);
                } else {
                    console.log(`\x1b[32m[${currentTime()}]    Compilation complete ---\x1b[0m`);
                }
            } ) );
}