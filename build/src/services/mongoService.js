"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoService = void 0;
const config_1 = require("../config/config");
class MongoService {
    constructor(client) {
        this.client = client;
    }
    getDatabase() {
        return this.client.db(config_1.config.mongodb.dbName);
    }
    getCollection(name) {
        return this.getDatabase().collection(name);
    }
    async findUsers() {
        const collection = this.getCollection("users");
        return await collection.find({}).toArray();
    }
}
exports.MongoService = MongoService;
