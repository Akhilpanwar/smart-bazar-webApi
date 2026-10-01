import express from "express";
import cartRoutes from "./routes/cart.routes";
const app = express();
const port = Number(process.env.PORT) || 4005;

app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ service: "cart-service", status: "ok" });
});
app.use("/api/cart", cartRoutes);
app.listen(port, () => {
  console.log(`Cart service listening on http://localhost:${port}`);
});
