import express from "express";
import cors from "cors";
import { NotFound } from "./middleware/NotFound.middleware";
import { ErrorHandler } from "./middleware/ErrorHandler.middleware";
import productRoutes from "./routes/product.routes";

const app = express();

const clientOrigin = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/product-service", productRoutes);
app.use(NotFound);
app.use(ErrorHandler);

// test route

export default app;
