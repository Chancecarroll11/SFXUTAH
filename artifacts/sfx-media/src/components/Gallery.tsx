import { useEffect, useRef, useState, useCallback } from "react";

interface GalleryImage {
  filename: string;
  url: string;
  uploadedAt: number;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [adminMode, setAdminMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setImages(data.images || []);
    } catch {
      console.error("Failed to load gallery");
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i! + 1) % images.length);
      if (e.key === "ArrowLeft") setLightbox((i) => (i! - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, images.length]);

  const uploadFiles = async (files: FileList | File[]) => {
    const fileArr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!fileArr.length) return;
    setUploading(true);
    setUploadMsg("Uploading...");
    const formData = new FormData();
    fileArr.forEach((f) => formData.append("images", f));
    try {
      const res = await fetch("/api/gallery/upload", { method: "POST", body: formData });
      if (res.ok) {
        setUploadMsg(`✓ ${fileArr.length} photo${fileArr.length > 1 ? "s" : ""} added!`);
        await fetchImages();
        setTimeout(() => setUploadMsg(""), 3000);
      }
    } catch {
      setUploadMsg("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (filename: string) => {
    await fetch(`/api/gallery/${filename}`, { method: "DELETE" });
    setLightbox(null);
    await fetchImages();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    uploadFiles(e.dataTransfer.files);
  };

  return (
    <>
      {/* Upload zone */}
      <div
        className={`gallery-upload-zone${dragging ? " drag-over" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
        <div className="gallery-upload-icon">📸</div>
        <div className="gallery-upload-text">
          {uploading ? "Uploading..." : uploadMsg || "Drop photos here or click to upload"}
        </div>
        <div className="gallery-upload-sub">JPG, PNG, WEBP · Up to 20MB each · Multiple files supported</div>
      </div>

      {/* Toggle admin mode */}
      {images.length > 0 && (
        <div style={{ textAlign: "right", marginBottom: "16px" }}>
          <button
            className="gallery-admin-toggle"
            onClick={() => setAdminMode((m) => !m)}
          >
            {adminMode ? "Done" : "Manage Photos"}
          </button>
        </div>
      )}

      {/* Grid */}
      {images.length === 0 ? (
        <div className="gallery-empty">
          <p>No photos yet — upload some above to get started.</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {images.map((img, i) => (
            <div key={img.filename} className="gallery-cell">
              <img
                src={img.url}
                alt={`Gallery photo ${i + 1}`}
                className="gallery-img"
                onClick={() => setLightbox(i)}
              />
              {adminMode && (
                <button
                  className="gallery-delete-btn"
                  onClick={(e) => { e.stopPropagation(); deleteImage(img.filename); }}
                  title="Remove photo"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && images[lightbox] && (
        <div className="gallery-lightbox" onClick={() => setLightbox(null)}>
          <button className="gallery-lb-close" onClick={() => setLightbox(null)}>✕</button>
          {images.length > 1 && (
            <button
              className="gallery-lb-arrow gallery-lb-prev"
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + images.length) % images.length); }}
            >
              ‹
            </button>
          )}
          <img
            src={images[lightbox].url}
            alt="Full size"
            className="gallery-lb-img"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <button
              className="gallery-lb-arrow gallery-lb-next"
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % images.length); }}
            >
              ›
            </button>
          )}
          <div className="gallery-lb-counter">{lightbox + 1} / {images.length}</div>
          {adminMode && (
            <button
              className="gallery-lb-delete"
              onClick={(e) => { e.stopPropagation(); deleteImage(images[lightbox].filename); }}
            >
              Delete Photo
            </button>
          )}
        </div>
      )}
    </>
  );
}
