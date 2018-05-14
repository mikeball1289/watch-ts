let fs = require("fs");
let path = require("path");
let https = require("https");

module.exports.checkVersion = async function() {
    return new Promise( (resolve, reject) => {

        let localPackage = fs.readFileSync(path.join(__dirname, "package.json"));
        https.get("https://raw.githubusercontent.com/mikeball1289/watch-ts/master/package.json", (res) => {
            let content = "";
            res.on("data", (d) => content += d.toString() );
            res.on("end", () => {
                let myVersion = JSON.parse(localPackage).version;
                let remoteVersion = JSON.parse(content).version;
                if (myVersion !== remoteVersion) {
                    let paddedLocal = (myVersion + "   ").substr(0, 8);
                    let paddedRemote = (remoteVersion + "   ").substr(0, 8);
                    console.log(
`   ╔═════════════════════════════╗
   ‖ A new version is available! ‖
   ‖      watch-ts v${paddedRemote}     ‖
   ‖     \x1b[31m${paddedLocal}\x1b[0m => \x1b[32m${paddedRemote}\x1b[0m    ‖
   ╚═════════════════════════════╝`
                    );
                    console.log("Install with:");
                    console.log(" npm i -g https://github.com/mikeball1289/watch-ts");
                    console.log();
                }
                resolve();
            } );
            res.on("error", reject);
        } );
    } );
}