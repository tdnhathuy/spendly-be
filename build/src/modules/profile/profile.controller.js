"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profile_service_1 = require("./profile.service");
exports.default = {
    getAll: async (req, reply) => {
        return profile_service_1.ServiceProfile.getAll(req.server);
    },
    getById: async (req, reply) => {
        const data = await profile_service_1.ServiceProfile.getById(req.server, req.params.id);
        data ? reply.send(data) : reply.code(404).send({ message: "Profile not found" });
    },
    create: async (req, reply) => {
        reply.code(201).send(await profile_service_1.ServiceProfile.create(req.server, req.body));
    },
    update: async (req, reply) => {
        const data = await profile_service_1.ServiceProfile.update(req.server, req.params.id, req.body);
        data ? reply.send(data) : reply.code(404).send({ message: "Profile not found" });
    },
    delete: async (req, reply) => {
        const data = await profile_service_1.ServiceProfile.delete(req.server, req.params.id);
        data ? reply.send(data) : reply.code(404).send({ message: "Profile not found" });
    },
};
