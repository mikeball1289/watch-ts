import * as rl from "readline";

export function cls() {
    process.stdout.write('\x1B[2J\x1B[0f');
}

export function stdout(...out: any[]) {
    process.stdout.write(out.map( e => e.toString() ).join(""));
}

export function nlout(...out: any[]) {
    stdout.apply(this, out);
    process.stdout.write("\n");
}

export function nl(n = 1) {
    for (; n > 0; n --) process.stdout.write("\n");
}

export async function ack() {
    stdout("Press ENTER to continue...");
    await getstdin();
    rl.moveCursor(process.stdout, 0, -1);
    rl.clearLine(process.stdout, 0);
    nl();
}

function getstdin() {
    return new Promise<string>( (resolve, reject) => {
        let data = "";
        let listener = (e: Buffer) => {
            let chunks = e.toString().split("\r").join("").split("\n");
            data += chunks[0];
            if (chunks.length > 1) {
                process.stdin.removeListener("data", listener);
                process.stdin.removeListener("error", reject);
                resolve(data);
            }
        }
        process.stdin.on("data", listener);
        process.stdin.once("error", reject);
    } );
}

export function stdin(): Promise<string>;
export function stdin(type: "number", prompt?: string): Promise<number>;
export function stdin(type: "string", prompt?: string): Promise<string>;
export function stdin(type: "bool", prompt?: string): Promise<boolean>;
export async function stdin(type: "number" | "string" | "bool" = "string", prompt = ">>> "): Promise<number | string | boolean> {
    while(true) {
        if (prompt) stdout(prompt);
        let result = await getstdin();
        switch(type) {
            case "number": {
                let n = parseInt(result);
                if (!isNaN(n)) {
                    return n;
                }
                nlout("Please input a number.");
                break;
            }
            case "string": {
                return result;
            }
            case "bool": {
                let res = result.toLowerCase();
                if (["y", "yes", "t", "true"].indexOf(res) >= 0) return true;
                if (["n", "no", "f", "false"].indexOf(res) >= 0) return false;
                nlout("Please answer 'yes' or 'no'.");
                break;
            }
        }
    }
}