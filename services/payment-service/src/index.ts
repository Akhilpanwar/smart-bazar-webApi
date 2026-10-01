import express from "express";

const app = express();
const port = Number(process.env.PORT) || 4004;

app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ service: "payment-service", status: "ok" });
});

app.listen(port, () => {
  console.log(`Payment service listening on http://localhost:${port}`);
});
