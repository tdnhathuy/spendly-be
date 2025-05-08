"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function app(instance, opts, done) {
    instance.get("/", async (req, res) => {
        res.status(200).send({
            message: "hello World",
        });
    });
    instance.get("/hello", async (req, res) => {
        res.status(200).send({
            message: "hello World",
        });
    });
    // instance.register(routes, { prefix: "/api/v1" });
    done();
}
exports.default = app;
