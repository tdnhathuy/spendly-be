"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = profileRoutes;
const profile_controller_1 = __importDefault(require("./profile.controller"));
async function profileRoutes(app) {
    const server = app.withTypeProvider();
    server.get("/", {}, profile_controller_1.default.getAll);
    server.post("/", {}, profile_controller_1.default.create);
    server.put("/:id", {}, profile_controller_1.default.update);
    server.delete("/:id", {}, profile_controller_1.default.delete);
}
