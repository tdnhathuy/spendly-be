"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginMongodb = void 0;
const mongodb_1 = __importDefault(require("@fastify/mongodb"));
const config_1 = require("../config/config");
const pluginMongodb = async (fastify) => {
    return await fastify.register(mongodb_1.default, {
        url: config_1.config.mongodb.url,
        database: config_1.config.mongodb.dbName,
        forceClose: true,
    });
};
exports.pluginMongodb = pluginMongodb;
