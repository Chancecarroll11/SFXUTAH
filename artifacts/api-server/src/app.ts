import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve API upload assets
app.use("/api/gallery/uploads", express.static(path.resolve(__dirname, "../uploads")));

// 1. Serve public visual assets from the mockup sandbox folder directly
app.use(express.static(path.resolve(process.cwd(), "artifacts/mockup-sandbox/dist")));

// 2. Mount your primary backend API data routes
app.use("/api", router);

// 3. Catch-all homepage route to serve the visual user interface
app.get("*", (req, res) => {
  res.sendFile(path.resolve(process.cwd(), "artifacts/mockup-sandbox/dist/index.html"));
});
export default app;

