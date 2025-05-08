"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMongoDB = exports.makeDir = void 0;
const path_1 = __importDefault(require("path"));
const makeDir = (dir) => {
    return path_1.default.join(__dirname, "..", dir);
};
exports.makeDir = makeDir;
const getMongoDB = (server) => {
    if (!server.mongo?.db)
        throw new Error("MongoDB không sẵn sàng");
    return server.mongo.db;
};
exports.getMongoDB = getMongoDB;
