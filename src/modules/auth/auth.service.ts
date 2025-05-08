import { FastifyInstance } from "fastify";
import {
  findAllDocuments,
  findDocumentById,
  insertDocument,
  updateDocument,
  getCollection,
  transformDocument,
} from "../../helper/db.helper";
import { LoginResponse, User } from "./auth.schema";
import { ObjectId } from "mongodb";
import { config } from "../../config/config";

const COLLECTION_NAME = "users";

export const ServiceAuth = {
  findOrCreateGoogleUser: async (
    server: FastifyInstance,
    userData: {
      id: string;
      name: string;
      email: string;
      picture?: string;
    }
  ): Promise<LoginResponse> => {
    const collection = getCollection(server, COLLECTION_NAME);
    
    // Kiểm tra xem user đã tồn tại chưa
    const existingUser = await collection.findOne({
      email: userData.email,
      provider: "google",
    });

    let user;
    
    if (existingUser) {
      // Cập nhật thông tin user nếu cần
      const updateData: Partial<User> = {
        name: userData.name,
        picture: userData.picture,
        updatedAt: new Date(),
      };
      
      await collection.updateOne(
        { _id: existingUser._id },
        { $set: updateData }
      );
      
      const updatedUser = await collection.findOne({ _id: existingUser._id });
      user = transformDocument(updatedUser);
    } else {
      // Tạo user mới
      const newUser: User = {
        name: userData.name,
        email: userData.email,
        picture: userData.picture,
        provider: "google",
        providerId: userData.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const result = await insertDocument(server, COLLECTION_NAME, newUser);
      user = result;
    }

    if (!user) {
      throw new Error("Không thể tạo hoặc cập nhật người dùng");
    }

    // Tạo JWT token
    console.log('Đang tạo JWT token...');
    try {
      // Sử dụng any để tránh lỗi kiểu dữ liệu
      const jwtInstance = (server as any).jwt;
      if (!jwtInstance || typeof jwtInstance.sign !== 'function') {
        console.error('JWT không được khởi tạo đúng cách');
        throw new Error('Lỗi cấu hình: JWT không được khởi tạo');
      }
      
      // Đảm bảo sử dụng secret đúng như trong file cấu hình
      // Tạo payload đơn giản để tránh lỗi
      const payload = {
        id: user.id,
        email: user.email,
        iat: Math.floor(Date.now() / 1000), // Thời gian tạo token
        sub: user.id, // Đối tượng token (subject)
      };
      
      console.log('Tạo token với payload:', payload);
      
      // Cấu hình mặc định để đảm bảo nhất quán
      const token = jwtInstance.sign(payload, {
        expiresIn: '7d',
      });
      
      console.log('Đã tạo token JWT thành công, secret key:', config.auth.jwtSecret.substring(0, 5) + '...');
      
      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          provider: user.provider,
          providerId: user.providerId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    } catch (jwtError) {
      console.error('Lỗi khi tạo JWT token:', jwtError);
      throw new Error('Lỗi xác thực: Không thể tạo token');
    }
  },

  getUserById: async (server: FastifyInstance, id: string) => {
    return await findDocumentById(server, COLLECTION_NAME, id);
  },

  getUserByEmail: async (server: FastifyInstance, email: string) => {
    const collection = getCollection(server, COLLECTION_NAME);
    const user = await collection.findOne({ email });
    return transformDocument(user);
  },
};
