import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve API upload assets
app.use("/api/gallery/uploads", express.static(path.resolve(process.cwd(), "uploads")));

// Serve static frontend assets from mockup-sandbox
app.use(express.static(path.resolve(__dirname, "../../../mockup-sandbox/dist")));
// Serve static frontend assets from mockup-sandbox production build
app.use(express.static(path.resolve(__dirname, "../../../mockup-sandbox/dist")));

// Route the main root URL directly to your actual visual website layout
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../../mockup-sandbox/dist/index.html"));
});

// Primary backend API routes
app.use("/api", router);

export default app;
