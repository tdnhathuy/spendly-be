import { FastifyInstance } from "fastify";
import { Collection, Document, ObjectId } from "mongodb";

/**
 * Lấy MongoDB database từ Fastify instance
 */
export const getMongoDB = (server: FastifyInstance) => {
  if (!server.mongo?.db) {
    throw new Error("MongoDB không sẵn sàng");
  }
  return server.mongo.db;
};

/**
 * Lấy collection với khả năng tự động xử lý createdAt và updatedAt
 */
export const getCollection = (server: FastifyInstance, collectionName: string): Collection => {
  const db = getMongoDB(server);
  return db.collection(collectionName);
};

/**
 * Thêm một document mới với các trường thời gian tự động
 */
export const insertDocument = async (
  server: FastifyInstance, 
  collectionName: string, 
  doc: any
) => {
  const collection = getCollection(server, collectionName);
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

/**
 * Cập nhật một document với updatedAt tự động
 */
export const updateDocument = async (
  server: FastifyInstance,
  collectionName: string,
  id: string,
  update: any
) => {
  const collection = getCollection(server, collectionName);
  const now = new Date();
  
  const updateDoc = {
    $set: {
      ...update,
      updatedAt: now
    }
  };
  
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    updateDoc,
    { returnDocument: "after" }
  );
  
  return result;
};

/**
 * Tìm một document theo ID
 */
export const findDocumentById = async (
  server: FastifyInstance,
  collectionName: string,
  id: string
) => {
  const collection = getCollection(server, collectionName);
  return await collection.findOne({ _id: new ObjectId(id) });
};

/**
 * Xóa một document theo ID
 */
export const deleteDocumentById = async (
  server: FastifyInstance,
  collectionName: string,
  id: string
) => {
  const collection = getCollection(server, collectionName);
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
};

/**
 * Lấy tất cả document từ collection
 */
export const findAllDocuments = async (
  server: FastifyInstance,
  collectionName: string
) => {
  const collection = getCollection(server, collectionName);
  return await collection.find().toArray();
}; 