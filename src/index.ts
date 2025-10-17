import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { api } from "./Routes/index.js"; 

export const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

app.use("/api/v1", api);

const PORT = parseInt(process.env.PORT || "3000", 10);
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`API on :${PORT}`));
}
