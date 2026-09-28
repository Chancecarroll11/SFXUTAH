import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../../../mockup-sandbox/dist")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../../mockup-sandbox/dist/index.html"));
});

  res.sendFile(path.resolve(process.cwd(), "../mockup-sandbox/dist/index.html"));
});


app.use("/api/gallery/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.use("/api", router);

export default app;
