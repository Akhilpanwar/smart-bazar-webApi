import connectDB from "./config/db";
import app from "./app";

app.get("/", (_req, res) => res.send("SmartBazar product API — use /api/products"));

async function start() {
  await connectDB();
  const PORT = Number(process.env.PORT) || 4000;
  app.listen(PORT, () => {
    console.log(`Product API http://localhost:${PORT} (catalog at /api/products)`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

export default app;
