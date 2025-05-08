"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaProfile = exports.SchemaWallet = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.SchemaWallet = typebox_1.Type.Object({
    address: typebox_1.Type.String(),
    balance: typebox_1.Type.Number(),
    chain: typebox_1.Type.String(),
});
exports.SchemaProfile = typebox_1.Type.Object({
    _id: typebox_1.Type.String({ pattern: "^[0-9a-fA-F]{24}$" }),
    name: typebox_1.Type.String(),
    wallets: typebox_1.Type.Array(exports.SchemaWallet),
});
