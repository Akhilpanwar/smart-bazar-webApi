import dotenv from "dotenv";
dotenv.config();

import { app } from "./app";

const PORT = Number(process.env.PORT) || 8080;

app.listen(PORT, () => {
  console.log(
    `[gateway] http://localhost:${PORT}  →  /api → product  |  /auth,/social-auth → auth`,
  );
});
