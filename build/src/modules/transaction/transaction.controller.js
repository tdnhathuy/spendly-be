"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_service_1 = require("./transaction.service");
exports.default = {
    getAll: async (req, reply) => {
        return transaction_service_1.ServiceTransaction.getAll(req.server);
    },
    getById: async (req, reply) => {
        const data = await transaction_service_1.ServiceTransaction.getById(req.server, req.params.id);
        data ? reply.send(data) : reply.code(404).send({ message: "Transaction not found" });
    },
    create: async (req, reply) => {
        reply.code(201).send(await transaction_service_1.ServiceTransaction.create(req.server, req.body));
    },
    update: async (req, reply) => {
        const data = await transaction_service_1.ServiceTransaction.update(req.server, req.params.id, req.body);
        data ? reply.send(data) : reply.code(404).send({ message: "Transaction not found" });
    },
    delete: async (req, reply) => {
        const data = await transaction_service_1.ServiceTransaction.delete(req.server, req.params.id);
        data ? reply.send(data) : reply.code(404).send({ message: "Transaction not found" });
    },
};
