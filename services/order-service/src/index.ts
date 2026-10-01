import express from "express";

const app = express();
const port = Number(process.env.PORT) || 4003;

app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ service: "order-service", status: "ok" });
});

app.listen(port, () => {
  console.log(`Order service listening on http://localhost:${port}`);
});
