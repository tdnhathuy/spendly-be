import Fastify from "fastify";

const app = Fastify();

app.get("/", (req, res) => {
  res.send("Hello World");
});

const start = async () => {
  try {
    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
