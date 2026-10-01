import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.config";
import mainRoutes from "./routes/main.routes";

dotenv.config();
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
app.use(cookieParser());

connectDB();

app.use("/api/auth", mainRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Auth service listening on http://localhost:${PORT}`);
});
