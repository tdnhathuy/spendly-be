"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceTransaction = void 0;
const db_helper_1 = require("../../helper/db.helper");
const COLLECTION_NAME = "transaction";
exports.ServiceTransaction = {
    getAll: async (server) => {
        return await (0, db_helper_1.findAllDocuments)(server, COLLECTION_NAME);
    },
    getById: async (server, id) => {
        return await (0, db_helper_1.findDocumentById)(server, COLLECTION_NAME, id);
    },
    create: async (server, body) => {
        // Thêm các trường mặc định nếu cần
        const data = { ...body };
        return await (0, db_helper_1.insertDocument)(server, COLLECTION_NAME, data);
    },
    update: async (server, id, body) => {
        return await (0, db_helper_1.updateDocument)(server, COLLECTION_NAME, id, body);
    },
    delete: async (server, id) => {
        return await (0, db_helper_1.deleteDocumentById)(server, COLLECTION_NAME, id);
    },
};
