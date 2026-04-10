import type { ProductVariant } from '../../types/shop.types';

interface VariantSelectorProps {
  variants: ProductVariant[];
  valueId: string | null;
  onChange: (variantId: string) => void;
  disabled?: boolean;
}

export function VariantSelector({
  variants,
  valueId,
  onChange,
  disabled,
}: VariantSelectorProps) {
  return (
    <div className="variant-selector">
      <span className="variant-selector__label">Variant</span>
      <div className="variant-selector__options">
        {variants.map((v) => {
          const selected = valueId === v.id;
          const out = v.stock <= 0;
          return (
            <button
              key={v.id}
              type="button"
              className={
                'variant-chip' +
                (selected ? ' variant-chip--active' : '') +
                (out ? ' variant-chip--disabled' : '')
              }
              disabled={disabled || out}
              onClick={() => onChange(v.id)}
            >
              <span className="variant-chip__label">{v.label}</span>
              <span className="variant-chip__meta">
                {out ? 'Out of stock' : `$${v.price.toFixed(2)}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
