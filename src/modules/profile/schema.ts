// profile/schema.ts
import { Type, Static } from '@sinclair/typebox';
import { Document, WithId } from 'mongodb';

export const ObjectIdStr = Type.String({ pattern: "^[0-9a-fA-F]{24}$" });

// Định nghĩa tất cả các trường có thể có trong Profile
export const ProfileFields = {
  _id: ObjectIdStr,
  name: Type.String(),
  createdAt: Type.Optional(Type.String({ format: 'date-time' })),
  updatedAt: Type.Optional(Type.String({ format: 'date-time' })),
  // Thêm các trường mới ở đây, tất cả ở một nơi duy nhất
};

// Các trường tùy chọn, sẽ không bắt buộc trong schema CREATE
export const OptionalFields = ['createdAt', 'updatedAt'];
// Các trường tự động, sẽ không được yêu cầu trong schema CREATE
export const AutoFields = ['_id'];

// Tạo Profile Schema từ các trường
const Profile = Type.Object(ProfileFields);

// Xác định trường nào sẽ được yêu cầu khi tạo mới (trừ _id và các trường tự động/tùy chọn)
const createFields = Object.entries(ProfileFields)
  .filter(([key]) => !AutoFields.includes(key) && !OptionalFields.includes(key))
  .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

export const ParamsId = Type.Object({ id: ObjectIdStr });
export const CreateReq = Type.Object(createFields);
export const UpdateReq = Type.Partial(CreateReq);

export type ProfileType = Static<typeof Profile>;
export type ParamsIdType = Static<typeof ParamsId>;
export type CreateType = Static<typeof CreateReq>;
export type UpdateType = Static<typeof UpdateReq>;

// Tạo hàm tiện ích để map document MongoDB sang kiểu dữ liệu TypeScript
export function createDocumentMapper<T extends Record<string, any>>(fieldsList: string[]) {
  return (doc: WithId<Document>): T => {
    const result: Record<string, any> = {};
    
    // Chuyển đổi _id thành chuỗi hex
    if (doc._id) {
      result._id = doc._id.toHexString();
    }
    
    // Sao chép tất cả các trường còn lại
    fieldsList.forEach(field => {
      if (field !== '_id' && field in doc) {
        result[field] = doc[field];
      }
    });
    
    return result as T;
  };
}

// Tạo hàm mapper cho Profile
export const createProfileMapper = () => 
  createDocumentMapper<ProfileType>(Object.keys(ProfileFields));

export default {
  getAll : { response: { 200: Type.Array(Profile) }, tags: ["Profile"] },

  getById: {
    params: ParamsId,
    response: { 200: Profile, 404: error() },
    tags: ["Profile"]
  },

  create : {
    body: CreateReq,
    response: { 201: Profile },
    tags: ["Profile"]
  },

  update : {
    params: ParamsId,
    body: UpdateReq,
    response: { 200: Profile, 404: error() },
    tags: ["Profile"]
  },

  del: {
    params: ParamsId,
    response: { 200: Type.Object({ success: Type.Boolean() }), 404: error() },
    tags: ["Profile"]
  }
};

function error() { return Type.Object({ message: Type.String() }); }
