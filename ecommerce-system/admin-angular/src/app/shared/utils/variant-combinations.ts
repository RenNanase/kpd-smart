import type { ProductAttributeDefinition } from '../models/product.model';

/** Cartesian product of string arrays. */
export function cartesianProduct(arrays: string[][]): string[][] {
  if (arrays.length === 0) {
    return [[]];
  }
  const [first, ...rest] = arrays;
  const tail = cartesianProduct(rest);
  return first.flatMap((value) => tail.map((t) => [value, ...t]));
}

/**
 * Builds attribute maps for every combination of attribute values.
 * Empty or invalid definitions are skipped.
 */
export function buildVariantAttributeMaps(
  defs: ProductAttributeDefinition[],
): Record<string, string>[] {
  const cleaned = defs
    .map((d) => ({
      name: d.name.trim(),
      values: d.values.map((v) => v.trim()).filter(Boolean),
    }))
    .filter((d) => d.name.length > 0 && d.values.length > 0);

  if (cleaned.length === 0) {
    return [{}];
  }

  const names = cleaned.map((d) => d.name);
  const valueMatrix = cleaned.map((d) => d.values);
  const tuples = cartesianProduct(valueMatrix);

  return tuples.map((values) =>
    Object.fromEntries(names.map((name, i) => [name, values[i]])),
  );
}

/** Deterministic signature for merging variants when attributes change. */
export function variantSignature(attributes: Record<string, string>): string {
  return Object.keys(attributes)
    .sort()
    .map((k) => `${k}=${attributes[k]}`)
    .join('|');
}
