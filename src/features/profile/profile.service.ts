import { FastifyInstance } from "fastify";
import { IProfile } from "./profile.type";
import { ObjectId } from "mongodb";
import { BaseService } from "../../services/base.service";

export class ProfileService extends BaseService {
  private readonly COLLECTION_NAME = 'profiles';

  constructor(fastify: FastifyInstance) {
    super(fastify);
  }

  async createProfile(profile: IProfile) {
    const collection = this.getCollection(this.COLLECTION_NAME);
    const document = {
      ...profile,
      createdAt: new Date()
    };
    const result = await collection.insertOne(document);
    return {
      success: true,
      message: "Profile created successfully",
      profileId: result.insertedId
    };
  }
  
  async getProfileById(id: string) {
    const collection = this.getCollection(this.COLLECTION_NAME);
    return collection.findOne({ _id: new ObjectId(id) });
  }
  
  async updateProfile(id: string, profile: Partial<IProfile>) {
    const collection = this.getCollection(this.COLLECTION_NAME);
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...profile, updatedAt: new Date() } }
    );
    return {
      success: result.modifiedCount > 0,
      message: result.modifiedCount > 0 
        ? "Profile updated successfully" 
        : "No changes were made"
    };
  }
  
  async deleteProfile(id: string) {
    const collection = this.getCollection(this.COLLECTION_NAME);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return {
      success: result.deletedCount > 0,
      message: result.deletedCount > 0
        ? "Profile deleted successfully"
        : "Profile not found"
    };
  }
} 