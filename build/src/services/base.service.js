"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    constructor(fastify) {
        this.fastify = fastify;
    }
    getCollection(collectionName) {
        if (!this.fastify.mongo || !this.fastify.mongo.db) {
            throw new Error("Database connection error");
        }
        return this.fastify.mongo.db.collection(collectionName);
    }
}
exports.BaseService = BaseService;
