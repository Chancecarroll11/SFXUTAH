import { Router, type IRouter } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, "../../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

const router: IRouter = Router();

router.get("/gallery", (_req, res) => {
  const files = fs.readdirSync(uploadsDir).filter((f) => /\.(jpe?g|png|gif|webp|avif)$/i.test(f));
  const images = files.map((filename) => ({
    filename,
    url: `/api/gallery/uploads/${filename}`,
    uploadedAt: fs.statSync(path.join(uploadsDir, filename)).mtimeMs,
  }));
  images.sort((a, b) => b.uploadedAt - a.uploadedAt);
  res.json({ images });
});

router.post("/gallery/upload", upload.array("images", 20), (req, res) => {
  const files = req.files as Express.Multer.File[];
  const uploaded = files.map((f) => ({
    filename: f.filename,
    url: `/api/gallery/uploads/${f.filename}`,
  }));
  res.json({ uploaded });
});

router.delete("/gallery/:filename", (req, res) => {
  const { filename } = req.params;
  const safe = path.basename(filename);
  const filepath = path.join(uploadsDir, safe);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

export default router;
