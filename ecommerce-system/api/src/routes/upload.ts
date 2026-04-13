import { randomUUID } from 'crypto';
import { Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const UPLOAD_ROOT = path.join(here, '../../uploads');

function ensureUploadDir(): void {
  if (!fs.existsSync(UPLOAD_ROOT)) {
    fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureUploadDir();
    cb(null, UPLOAD_ROOT);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    cb(null, `${randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 80 * 1024 * 1024 },
});

const router = Router();

/**
 * Multipart: fields `images` (0–20 files), `video` (0–1 file).
 * Returns public URLs served from GET /uploads/*
 */
router.post(
  '/media',
  upload.fields([
    { name: 'images', maxCount: 20 },
    { name: 'video', maxCount: 1 },
  ]),
  (req, res) => {
    const base = `${req.protocol}://${req.get('host')}`;
    const files = req.files as
      | { images?: Express.Multer.File[]; video?: Express.Multer.File[] }
      | undefined;
    const imageUrls = (files?.images ?? []).map(
      (f) => `${base}/uploads/${f.filename}`,
    );
    const videoFile = files?.video?.[0];
    const videoUrl = videoFile ? `${base}/uploads/${videoFile.filename}` : null;
    res.json({ imageUrls, videoUrl });
  },
);

export const uploadRouter = router;
