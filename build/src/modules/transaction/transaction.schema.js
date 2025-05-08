"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaTransaction = void 0;
// transaction/schema.ts
const typebox_1 = require("@sinclair/typebox");
exports.SchemaTransaction = typebox_1.Type.Object({
    _id: typebox_1.Type.String({ pattern: "^[0-9a-fA-F]{24}$" }),
    name: typebox_1.Type.String(),
    // Thêm các trường khác ở đây
});
