"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transactionRoutes;
const transaction_controller_1 = __importDefault(require("./transaction.controller"));
async function transactionRoutes(app) {
    const server = app.withTypeProvider();
    server.get("/", {}, transaction_controller_1.default.getAll);
    server.get("/:id", {}, transaction_controller_1.default.getById);
    server.post("/", {}, transaction_controller_1.default.create);
    server.put("/:id", {}, transaction_controller_1.default.update);
    server.delete("/:id", {}, transaction_controller_1.default.delete);
}
