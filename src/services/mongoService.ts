import { Collection, Db, MongoClient } from "mongodb";
import { config } from "../config/config";

export class MongoService {
  private client: MongoClient;
  
  constructor(client: MongoClient) {
    this.client = client;
  }
  
  getDatabase(): Db {
    return this.client.db(config.mongodb.dbName);
  }
  
  getCollection(name: string): Collection {
    return this.getDatabase().collection(name);
  }
  
  async findUsers() {
    const collection = this.getCollection("users");
    return await collection.find({}).toArray();
  }
} 