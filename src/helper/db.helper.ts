import { FastifyInstance } from "fastify";
import { Collection, Document, ObjectId } from "mongodb";

/**
 * Chuyển đổi _id thành id trong document MongoDB
 */
export const transformDocument = <T extends Document>(doc: T | null): (Omit<T, '_id'> & { id: string }) | null => {
  if (!doc) return null;
  
  const { _id, ...rest } = doc;
  
  return {
    ...rest,
    id: _id.toString(),
  } as Omit<T, '_id'> & { id: string };
};

/**
 * Chuyển đổi _id thành id trong mảng document MongoDB
 */
export const transformDocuments = <T extends Document>(docs: T[]): (Omit<T, '_id'> & { id: string })[] => {
  return docs.map(doc => transformDocument(doc)!).filter(Boolean);
};

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
  const insertedDoc = {
    _id: result.insertedId,
    ...documentToInsert
  };
  
  return transformDocument(insertedDoc);
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
  
  return transformDocument(result);
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
  const result = await collection.findOne({ _id: new ObjectId(id) });
  return transformDocument(result);
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
  const results = await collection.find().toArray();
  return transformDocuments(results);
}; 