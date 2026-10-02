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

// Serve static frontend assets from mockup-sandbox
app.use(express.static(path.resolve(__dirname, "../../../mockup-sandbox/dist")));

// Primary backend API routes
app.use("/api", router);

// Catch-all route to serve your actual visual website homepage
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../../mockup-sandbox/dist/index.html"));
});

export default app;
