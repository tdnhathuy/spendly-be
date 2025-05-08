"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllDocuments = exports.deleteDocumentById = exports.findDocumentById = exports.updateDocument = exports.insertDocument = exports.getCollection = exports.getMongoDB = void 0;
const mongodb_1 = require("mongodb");
/**
 * Lấy MongoDB database từ Fastify instance
 */
const getMongoDB = (server) => {
    if (!server.mongo?.db) {
        throw new Error("MongoDB không sẵn sàng");
    }
    return server.mongo.db;
};
exports.getMongoDB = getMongoDB;
/**
 * Lấy collection với khả năng tự động xử lý createdAt và updatedAt
 */
const getCollection = (server, collectionName) => {
    const db = (0, exports.getMongoDB)(server);
    return db.collection(collectionName);
};
exports.getCollection = getCollection;
/**
 * Thêm một document mới với các trường thời gian tự động
 */
const insertDocument = async (server, collectionName, doc) => {
    const collection = (0, exports.getCollection)(server, collectionName);
    const now = new Date();
    const documentToInsert = {
        ...doc,
        createdAt: now,
        updatedAt: now
    };
    const result = await collection.insertOne(documentToInsert);
    return {
        _id: result.insertedId.toString(),
        ...documentToInsert
    };
};
exports.insertDocument = insertDocument;
/**
 * Cập nhật một document với updatedAt tự động
 */
const updateDocument = async (server, collectionName, id, update) => {
    const collection = (0, exports.getCollection)(server, collectionName);
    const now = new Date();
    const updateDoc = {
        $set: {
            ...update,
            updatedAt: now
        }
    };
    const result = await collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, updateDoc, { returnDocument: "after" });
    return result;
};
exports.updateDocument = updateDocument;
/**
 * Tìm một document theo ID
 */
const findDocumentById = async (server, collectionName, id) => {
    const collection = (0, exports.getCollection)(server, collectionName);
    return await collection.findOne({ _id: new mongodb_1.ObjectId(id) });
};
exports.findDocumentById = findDocumentById;
/**
 * Xóa một document theo ID
 */
const deleteDocumentById = async (server, collectionName, id) => {
    const collection = (0, exports.getCollection)(server, collectionName);
    const result = await collection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
    return result.deletedCount > 0;
};
exports.deleteDocumentById = deleteDocumentById;
/**
 * Lấy tất cả document từ collection
 */
const findAllDocuments = async (server, collectionName) => {
    const collection = (0, exports.getCollection)(server, collectionName);
    return await collection.find().toArray();
};
exports.findAllDocuments = findAllDocuments;
