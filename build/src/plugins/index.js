"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPlugins = void 0;
const mongodb_plugin_1 = require("./mongodb.plugin");
const swagger_plugin_1 = require("./swagger.plugin");
const setupPlugins = async (fastify) => {
    await (0, mongodb_plugin_1.pluginMongodb)(fastify);
    await (0, swagger_plugin_1.pluginSwagger)(fastify);
};
exports.setupPlugins = setupPlugins;
