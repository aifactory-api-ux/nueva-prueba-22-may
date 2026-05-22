import { useState } from 'react';
import { tokens } from '../../styles/tokens';
import { useCategories } from '../../hooks/useCategories';

export interface FilterState {
  categories: string[];
  priceRange: { min: number; max: number };
  inStock: boolean;
}

export interface FiltrosDeCatalogoProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

const defaultFilters: FilterState = {
  categories: [],
  priceRange: { min: 0, max: 100000 },
  inStock: false,
};

export default function FiltrosDeCatalogo({
  onFilterChange,
  initialFilters,
}: FiltrosDeCatalogoProps) {
  const { categories } = useCategories();
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initialFilters,
  });
  const [priceMin, setPriceMin] = useState<string>(
    initialFilters?.priceRange?.min?.toString() ?? '0'
  );
  const [priceMax, setPriceMax] = useState<string>(
    initialFilters?.priceRange?.max?.toString() ?? '100000'
  );

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter((id) => id !== categoryId);
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = () => {
    const min = parseInt(priceMin, 10) || 0;
    const max = parseInt(priceMax, 10) || 100000;
    const newFilters = { ...filters, priceRange: { min, max } };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleInStockChange = (checked: boolean) => {
    const newFilters = { ...filters, inStock: checked };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setPriceMin('0');
    setPriceMax('100000');
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.priceRange.min !== 0 ||
    filters.priceRange.max !== 100000 ||
    filters.inStock;

  return (
    <aside
      style={{
        backgroundColor: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '280px',
        minWidth: '280px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3
          style={{
            fontFamily: tokens.typography.fontFamily,
            fontSize: '16px',
            fontWeight: 500,
            lineHeight: 1.6,
            color: tokens.colors.text_primary,
            margin: 0,
          }}
        >
          Filtros
        </h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            style={{
              fontFamily: tokens.typography.fontFamily,
              fontSize: '14px',
              fontWeight: 400,
              color: tokens.colors.accent,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            Limpiar
          </button>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <h4
            style={{
              fontFamily: tokens.typography.fontFamily,
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: 1.6,
              color: tokens.colors.text_primary,
              margin: 0,
            }}
          >
            Categorías
          </h4>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {categories.length === 0 ? (
              <span
                style={{
                  fontFamily: tokens.typography.fontFamily,
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: tokens.colors.text_secondary,
                }}
              >
                Cargando categorías...
              </span>
            ) : (
              categories.map((category) => (
                <label
                  key={category.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      border: `2px solid ${
                        filters.categories.includes(category.id)
                          ? tokens.colors.accent
                          : tokens.colors.border
                      }`,
                      backgroundColor: filters.categories.includes(category.id)
                        ? tokens.colors.accent
                        : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      if (!filters.categories.includes(category.id)) {
                        e.currentTarget.style.borderColor = tokens.colors.accent;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!filters.categories.includes(category.id)) {
                        e.currentTarget.style.borderColor = tokens.colors.border;
                      }
                    }}
                  >
                    {filters.categories.includes(category.id) && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke={tokens.colors.text_on_primary}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category.id)}
                      onChange={(e) =>
                        handleCategoryChange(category.id, e.target.checked)
                      }
                      style={{
                        position: 'absolute',
                        opacity: 0,
                        width: 0,
                        height: 0,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: tokens.typography.fontFamily,
                      fontSize: '14px',
                      fontWeight: 400,
                      lineHeight: 1.5,
                      color: tokens.colors.text_primary,
                    }}
                  >
                    {category.name}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>

        <div
          style={{
            height: '1px',
            backgroundColor: tokens.colors.border,
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <h4
            style={{
              fontFamily: tokens.typography.fontFamily,
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: 1.6,
              color: tokens.colors.text_primary,
              margin: 0,
            }}
          >
            Precio
          </h4>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <label
                style={{
                  fontFamily: tokens.typography.fontFamily,
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: tokens.colors.text_secondary,
                }}
              >
                Mín
              </label>
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                onBlur={handlePriceChange}
                min="0"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontFamily: tokens.typography.fontFamily,
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  border: `1px solid ${tokens.colors.border}`,
                  borderRadius: '8px',
                  outline: 'none',
                  color: tokens.colors.text_primary,
                  backgroundColor: tokens.colors.surface,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = tokens.colors.accent;
                }}
                onBlurCapture={(e) => {
                  e.currentTarget.style.borderColor = tokens.colors.border;
                  handlePriceChange();
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <label
                style={{
                  fontFamily: tokens.typography.fontFamily,
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: tokens.colors.text_secondary,
                }}
              >
                Máx
              </label>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                onBlur={handlePriceChange}
                min="0"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontFamily: tokens.typography.fontFamily,
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  border: `1px solid ${tokens.colors.border}`,
                  borderRadius: '8px',
                  outline: 'none',
                  color: tokens.colors.text_primary,
                  backgroundColor: tokens.colors.surface,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = tokens.colors.accent;
                }}
                onBlurCapture={(e) => {
                  e.currentTarget.style.borderColor = tokens.colors.border;
                  handlePriceChange();
                }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            height: '1px',
            backgroundColor: tokens.colors.border,
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <h4
            style={{
              fontFamily: tokens.typography.fontFamily,
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: 1.6,
              color: tokens.colors.text_primary,
              margin: 0,
            }}
          >
            Disponibilidad
          </h4>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                border: `2px solid ${
                  filters.inStock ? tokens.colors.accent : tokens.colors.border
                }`,
                backgroundColor: filters.inStock
                  ? tokens.colors.accent
                  : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!filters.inStock) {
                  e.currentTarget.style.borderColor = tokens.colors.accent;
                }
              }}
              onMouseLeave={(e) => {
                if (!filters.inStock) {
                  e.currentTarget.style.borderColor = tokens.colors.border;
                }
              }}
            >
              {filters.inStock && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 3L4.5 8.5L2 6"
                    stroke={tokens.colors.text_on_primary}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => handleInStockChange(e.target.checked)}
                style={{
                  position: 'absolute',
                  opacity: 0,
                  width: 0,
                  height: 0,
                }}
              />
            </div>
            <span
              style={{
                fontFamily: tokens.typography.fontFamily,
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: 1.5,
                color: tokens.colors.text_primary,
              }}
            >
              Solo productos en stock
            </span>
          </label>
        </div>
      </div>
    </aside>
  );
}
