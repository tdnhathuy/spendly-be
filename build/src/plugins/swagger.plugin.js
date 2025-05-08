"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginSwagger = void 0;
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const config_1 = require("../config/config");
const pluginSwagger = async (fastify) => {
    await fastify.register(swagger_1.default, {
        openapi: {
            info: {
                title: "Spendly API",
                description: "API documentation for Spendly",
                version: "1.0.0",
            },
        },
    });
    await fastify.register(swagger_ui_1.default, {
        routePrefix: config_1.config.swagger.routePrefix,
        uiConfig: {
            docExpansion: "none",
        },
        transformSpecification: (swaggerObject) => swaggerObject,
        transformSpecificationClone: true,
    });
    return fastify;
};
exports.pluginSwagger = pluginSwagger;
