import { Router } from 'express';
import type { PoolClient } from 'pg';

import { requirePool } from '../db/pool.js';
import type { ProductDto, ProductInput } from '../types/product.js';

const router = Router();

interface ProductRow {
  id: string;
  name: string;
  description: string;
  selling_price: string;
  cost_price: string;
  unit_of_measurement: string;
  discount_percent: string | null;
  discount_amount: string | null;
  sku: string | null;
  video_url: string | null;
  rating: string;
  category_id: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
}

function toDto(row: ProductRow, imageUrls: string[]): ProductDto {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    sellingPrice: Number(row.selling_price),
    costPrice: Number(row.cost_price),
    unitOfMeasurement: row.unit_of_measurement,
    discountPercent:
      row.discount_percent === null ? null : Number(row.discount_percent),
    discountAmount:
      row.discount_amount === null ? null : Number(row.discount_amount),
    sku: row.sku,
    imageUrls,
    videoUrl: row.video_url,
    rating: Number(row.rating),
    categoryId: row.category_id,
    status: row.status as ProductDto['status'],
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

async function loadImageUrls(
  client: PoolClient,
  productId: string,
): Promise<string[]> {
  const r = await client.query<{ image_url: string }>(
    `SELECT image_url FROM product_images WHERE product_id = $1 ORDER BY sort_order ASC, id ASC`,
    [productId],
  );
  return r.rows.map((x) => x.image_url);
}

async function replaceImages(
  client: PoolClient,
  productId: string,
  urls: string[],
): Promise<void> {
  await client.query(`DELETE FROM product_images WHERE product_id = $1`, [
    productId,
  ]);
  let order = 0;
  for (const url of urls) {
    const trimmed = url.trim();
    if (!trimmed) {
      continue;
    }
    await client.query(
      `INSERT INTO product_images (product_id, image_url, sort_order) VALUES ($1, $2, $3)`,
      [productId, trimmed, order++],
    );
  }
}

router.get('/', async (_req, res) => {
  try {
    const p = requirePool();
    const { rows } = await p.query<ProductRow>(
      `SELECT * FROM products ORDER BY created_at DESC`,
    );
    const out: ProductDto[] = [];
    const client = await p.connect();
    try {
      for (const row of rows) {
        const imgs = await loadImageUrls(client, row.id);
        out.push(toDto(row, imgs));
      }
    } finally {
      client.release();
    }
    res.json(out);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const p = requirePool();
    const { rows } = await p.query<ProductRow>(
      `SELECT * FROM products WHERE id = $1`,
      [req.params.id],
    );
    const row = rows[0];
    if (!row) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    const client = await p.connect();
    try {
      const imgs = await loadImageUrls(client, row.id);
      res.json(toDto(row, imgs));
    } finally {
      client.release();
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: message });
  }
});

router.post('/', async (req, res) => {
  const body = req.body as ProductInput;
  if (!body?.name || typeof body.name !== 'string') {
    res.status(400).json({ error: 'name is required' });
    return;
  }
  if (body.sellingPrice === undefined || Number.isNaN(Number(body.sellingPrice))) {
    res.status(400).json({ error: 'sellingPrice is required' });
    return;
  }

  const sellingPrice = Number(body.sellingPrice);
  const costPrice = body.costPrice !== undefined ? Number(body.costPrice) : 0;
  const rating =
    body.rating !== undefined ? Number(body.rating) : 0;
  if (rating < 0 || rating > 5) {
    res.status(400).json({ error: 'rating must be between 0 and 5' });
    return;
  }

  const imageUrls = Array.isArray(body.imageUrls) ? body.imageUrls : [];
  const status = body.status ?? 'draft';

  const p = requirePool();
  const client = await p.connect();
  try {
    await client.query('BEGIN');
    const ins = await client.query<ProductRow>(
      `INSERT INTO products (
        name, description, selling_price, cost_price, unit_of_measurement,
        discount_percent, discount_amount, sku, video_url, rating, category_id, status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *`,
      [
        body.name.trim(),
        (body.description ?? '').trim(),
        sellingPrice,
        costPrice,
        (body.unitOfMeasurement ?? 'unit').trim() || 'unit',
        body.discountPercent === null || body.discountPercent === undefined
          ? null
          : Number(body.discountPercent),
        body.discountAmount === null || body.discountAmount === undefined
          ? null
          : Number(body.discountAmount),
        body.sku?.trim() || null,
        body.videoUrl?.trim() || null,
        rating,
        body.categoryId?.trim() || null,
        status,
      ],
    );
    const row = ins.rows[0];
    await replaceImages(client, row.id, imageUrls);
    await client.query('COMMIT');
    const imgs = await loadImageUrls(client, row.id);
    res.status(201).json(toDto(row, imgs));
  } catch (e) {
    await client.query('ROLLBACK').catch(() => undefined);
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: message });
  } finally {
    client.release();
  }
});

router.patch('/:id', async (req, res) => {
  const body = req.body as ProductInput;
  const p = requirePool();
  const client = await p.connect();
  try {
    const cur = await client.query<ProductRow>(
      `SELECT * FROM products WHERE id = $1`,
      [req.params.id],
    );
    const existing = cur.rows[0];
    if (!existing) {
      res.status(404).json({ error: 'Not found' });
      return;
    }

    const name =
      body.name !== undefined ? String(body.name).trim() : existing.name;
    const description =
      body.description !== undefined
        ? String(body.description).trim()
        : existing.description;
    const sellingPrice =
      body.sellingPrice !== undefined
        ? Number(body.sellingPrice)
        : Number(existing.selling_price);
    const costPrice =
      body.costPrice !== undefined
        ? Number(body.costPrice)
        : Number(existing.cost_price);
    const unitOfMeasurement =
      body.unitOfMeasurement !== undefined
        ? String(body.unitOfMeasurement).trim() || 'unit'
        : existing.unit_of_measurement;
    const discountPercent =
      body.discountPercent !== undefined
        ? body.discountPercent === null
          ? null
          : Number(body.discountPercent)
        : existing.discount_percent === null
          ? null
          : Number(existing.discount_percent);
    const discountAmount =
      body.discountAmount !== undefined
        ? body.discountAmount === null
          ? null
          : Number(body.discountAmount)
        : existing.discount_amount === null
          ? null
          : Number(existing.discount_amount);
    const sku =
      body.sku !== undefined
        ? body.sku?.trim() || null
        : existing.sku;
    const videoUrl =
      body.videoUrl !== undefined
        ? body.videoUrl?.trim() || null
        : existing.video_url;
    const rating =
      body.rating !== undefined ? Number(body.rating) : Number(existing.rating);
    if (rating < 0 || rating > 5) {
      res.status(400).json({ error: 'rating must be between 0 and 5' });
      return;
    }
    const categoryId =
      body.categoryId !== undefined
        ? body.categoryId?.trim() || null
        : existing.category_id;
    const status =
      body.status !== undefined ? body.status : (existing.status as ProductDto['status']);

    await client.query('BEGIN');
    const upd = await client.query<ProductRow>(
      `UPDATE products SET
        name = $1, description = $2, selling_price = $3, cost_price = $4,
        unit_of_measurement = $5, discount_percent = $6, discount_amount = $7,
        sku = $8, video_url = $9, rating = $10, category_id = $11, status = $12,
        updated_at = now()
      WHERE id = $13
      RETURNING *`,
      [
        name,
        description,
        sellingPrice,
        costPrice,
        unitOfMeasurement,
        discountPercent,
        discountAmount,
        sku,
        videoUrl,
        rating,
        categoryId,
        status,
        req.params.id,
      ],
    );
    const row = upd.rows[0];
    if (body.imageUrls !== undefined) {
      await replaceImages(client, row.id, body.imageUrls);
    }
    await client.query('COMMIT');
    const imgs = await loadImageUrls(client, row.id);
    res.json(toDto(row, imgs));
  } catch (e) {
    await client.query('ROLLBACK').catch(() => undefined);
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: message });
  } finally {
    client.release();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const p = requirePool();
    const r = await p.query(`DELETE FROM products WHERE id = $1`, [
      req.params.id,
    ]);
    if (r.rowCount === 0) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.status(204).send();
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: message });
  }
});

export const productsRouter = router;
