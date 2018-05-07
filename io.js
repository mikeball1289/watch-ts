"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var rl = require("readline");
function cls() {
    process.stdout.write('\x1B[2J\x1B[0f');
}
exports.cls = cls;
function stdout() {
    var out = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        out[_i] = arguments[_i];
    }
    process.stdout.write(out.map(function (e) { return e.toString(); }).join(""));
}
exports.stdout = stdout;
function nlout() {
    var out = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        out[_i] = arguments[_i];
    }
    stdout.apply(this, out);
    process.stdout.write("\n");
}
exports.nlout = nlout;
function nl(n) {
    if (n === void 0) { n = 1; }
    for (; n > 0; n--)
        process.stdout.write("\n");
}
exports.nl = nl;
function ack() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stdout("Press ENTER to continue...");
                    return [4 /*yield*/, getstdin()];
                case 1:
                    _a.sent();
                    rl.moveCursor(process.stdout, 0, -1);
                    rl.clearLine(process.stdout, 0);
                    nl();
                    return [2 /*return*/];
            }
        });
    });
}
exports.ack = ack;
function getstdin() {
    return new Promise(function (resolve, reject) {
        var data = "";
        var listener = function (e) {
            var chunks = e.toString().split("\r").join("").split("\n");
            data += chunks[0];
            if (chunks.length > 1) {
                process.stdin.removeListener("data", listener);
                process.stdin.removeListener("error", reject);
                resolve(data);
            }
        };
        process.stdin.on("data", listener);
        process.stdin.once("error", reject);
    });
}
function stdin(type, prompt) {
    if (type === void 0) { type = "string"; }
    if (prompt === void 0) { prompt = ">>> "; }
    return __awaiter(this, void 0, void 0, function () {
        var result, n, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 2];
                    if (prompt)
                        stdout(prompt);
                    return [4 /*yield*/, getstdin()];
                case 1:
                    result = _a.sent();
                    switch (type) {
                        case "number": {
                            n = parseInt(result);
                            if (!isNaN(n)) {
                                return [2 /*return*/, n];
                            }
                            nlout("Please input a number.");
                            break;
                        }
                        case "string": {
                            return [2 /*return*/, result];
                        }
                        case "bool": {
                            res = result.toLowerCase();
                            if (["y", "yes", "t", "true"].indexOf(res) >= 0)
                                return [2 /*return*/, true];
                            if (["n", "no", "f", "false"].indexOf(res) >= 0)
                                return [2 /*return*/, false];
                            nlout("Please answer 'yes' or 'no'.");
                            break;
                        }
                    }
                    return [3 /*break*/, 0];
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.stdin = stdin;
