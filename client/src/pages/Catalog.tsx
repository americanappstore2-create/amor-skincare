import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, ChevronDown, ChevronUp, SlidersHorizontal, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import ProductCard from "../components/ProductCard";

/* ─── Data ─────────────────────────────────────────── */
const CATEGORIES = [
  { value: "all",       label: "Все",          emoji: "✨" },
  { value: "serum",     label: "Сыворотки",    emoji: "💧" },
  { value: "cream",     label: "Крема",        emoji: "🫙" },
  { value: "toner",     label: "Тонеры",       emoji: "🌊" },
  { value: "mask",      label: "Маски",        emoji: "🌿" },
  { value: "cleanser",  label: "Очищение",     emoji: "✨" },
  { value: "eye_care",  label: "Глаза",        emoji: "👁️" },
  { value: "sunscreen", label: "Санскрины",    emoji: "☀️" },
];

const SKIN_TYPES = [
  { value: "all",        label: "Любой тип" },
  { value: "dry",        label: "Сухая" },
  { value: "oily",       label: "Жирная" },
  { value: "combo",      label: "Комбинированная" },
  { value: "sensitive",  label: "Чувствительная" },
  { value: "normal",     label: "Нормальная" },
];

const PURPOSES = [
  { value: "all",          label: "Любое" },
  { value: "hydration",    label: "Увлажнение" },
  { value: "brightening",  label: "Осветление" },
  { value: "anti_aging",   label: "Антивозрастной" },
  { value: "acne",         label: "Против акне" },
  { value: "pore",         label: "Сужение пор" },
  { value: "soothing",     label: "Успокоение" },
];

const BRANDS = ["Все бренды", "Rorobell", "Biodance", "rom&nd", "VT", "Axis Y", "Unleashia", "Davines", "Genosys"];

const SORT_OPTIONS = [
  { value: "default",    label: "По умолчанию" },
  { value: "price_asc",  label: "Цена: дешевле" },
  { value: "price_desc", label: "Цена: дороже" },
  { value: "name_asc",   label: "По названию" },
];

/* ─── Scroll-reveal hook ────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ─── Animated product item ─────────────────────────── */
function AnimatedCard({ product, index }: { product: any; index: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.97)",
        transition: `opacity 0.55s cubic-bezier(0.23,1,0.32,1) ${index * 60}ms, transform 0.55s cubic-bezier(0.23,1,0.32,1) ${index * 60}ms`,
      }}
    >
      <ProductCard product={product} />
    </div>
  );
}

/* ─── Filter section ────────────────────────────────── */
function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-rose-100/70 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between mb-3 group"
      >
        <span className="font-sans text-foreground" style={{ fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {title}
        </span>
        {open
          ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
          : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
        }
      </button>
      <div style={{
        maxHeight: open ? "300px" : "0",
        overflow: "hidden",
        transition: "max-height 0.3s cubic-bezier(0.23,1,0.32,1)",
      }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Main component ────────────────────────────────── */
export default function Catalog() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [skinType, setSkinType] = useState("all");
  const [purpose, setPurpose] = useState("all");
  const [brand, setBrand] = useState("Все бренды");
  const [sort, setSort] = useState("default");
  const [priceMax, setPriceMax] = useState(50000);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setHeaderVisible(true), 80);
  }, []);

  const { data: products, isLoading } = trpc.products.list.useQuery(
    { category: activeCategory },
    { keepPreviousData: true } as any
  );

  const filtered = (products ?? [])
    .filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) return false;
      if (brand !== "Все бренды" && p.brand !== brand) return false;
      if (parseFloat(p.price) > priceMax) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "price_asc") return parseFloat(a.price) - parseFloat(b.price);
      if (sort === "price_desc") return parseFloat(b.price) - parseFloat(a.price);
      if (sort === "name_asc") return a.name.localeCompare(b.name);
      return 0;
    });

  const activeFiltersCount = [
    skinType !== "all",
    purpose !== "all",
    brand !== "Все бренды",
    priceMax < 50000,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSkinType("all");
    setPurpose("all");
    setBrand("Все бренды");
    setPriceMax(50000);
    setSearch("");
    setActiveCategory("all");
  };

  const FilterPanel = () => (
    <div className="space-y-0">
      <FilterSection title="Тип кожи">
        <div className="flex flex-col gap-1.5">
          {SKIN_TYPES.map((s) => (
            <button
              key={s.value}
              onClick={() => setSkinType(s.value)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-200"
              style={{
                background: skinType === s.value ? "oklch(0.50 0.20 12 / 0.10)" : "transparent",
                color: skinType === s.value ? "oklch(0.50 0.20 12)" : "oklch(0.40 0.02 10)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.85rem",
                fontWeight: skinType === s.value ? 600 : 400,
              }}
            >
              <span
                className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                style={{
                  borderColor: skinType === s.value ? "oklch(0.50 0.20 12)" : "oklch(0.80 0.03 10)",
                  background: skinType === s.value ? "oklch(0.50 0.20 12)" : "transparent",
                }}
              >
                {skinType === s.value && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
              {s.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Назначение">
        <div className="flex flex-col gap-1.5">
          {PURPOSES.map((p) => (
            <button
              key={p.value}
              onClick={() => setPurpose(p.value)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-200"
              style={{
                background: purpose === p.value ? "oklch(0.50 0.20 12 / 0.10)" : "transparent",
                color: purpose === p.value ? "oklch(0.50 0.20 12)" : "oklch(0.40 0.02 10)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.85rem",
                fontWeight: purpose === p.value ? 600 : 400,
              }}
            >
              <span
                className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                style={{
                  borderColor: purpose === p.value ? "oklch(0.50 0.20 12)" : "oklch(0.80 0.03 10)",
                  background: purpose === p.value ? "oklch(0.50 0.20 12)" : "transparent",
                }}
              >
                {purpose === p.value && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
              {p.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Бренд">
        <div className="flex flex-col gap-1.5">
          {BRANDS.map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-200"
              style={{
                background: brand === b ? "oklch(0.50 0.20 12 / 0.10)" : "transparent",
                color: brand === b ? "oklch(0.50 0.20 12)" : "oklch(0.40 0.02 10)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.85rem",
                fontWeight: brand === b ? 600 : 400,
              }}
            >
              <span
                className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                style={{
                  borderColor: brand === b ? "oklch(0.50 0.20 12)" : "oklch(0.80 0.03 10)",
                  background: brand === b ? "oklch(0.50 0.20 12)" : "transparent",
                }}
              >
                {brand === b && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
              {b}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Цена до">
        <div className="px-1">
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans text-muted-foreground" style={{ fontSize: "0.78rem" }}>0 ₸</span>
            <span className="font-display" style={{ fontSize: "1rem", fontWeight: 500, color: "oklch(0.35 0.18 12)" }}>
              {priceMax.toLocaleString("ru-KZ")} ₸
            </span>
          </div>
          <input
            type="range"
            min={1000}
            max={50000}
            step={500}
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="w-full accent-primary"
            style={{ accentColor: "oklch(0.50 0.20 12)" }}
          />
          <div className="flex justify-between mt-1">
            <span className="font-sans text-muted-foreground" style={{ fontSize: "0.72rem" }}>1 000 ₸</span>
            <span className="font-sans text-muted-foreground" style={{ fontSize: "0.72rem" }}>50 000 ₸</span>
          </div>
        </div>
      </FilterSection>

      {activeFiltersCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all duration-200 hover:bg-rose-50"
          style={{ borderColor: "oklch(0.50 0.20 12 / 0.3)", color: "oklch(0.50 0.20 12)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: 500 }}
        >
          <X className="h-3.5 w-3.5" />
          Сбросить фильтры
        </button>
      )}
    </div>
  );

  return (
    <div className="pt-20 md:pt-24 pb-20" style={{ background: "oklch(0.99 0.004 10)" }}>
      <div className="container">

        {/* ── Header ── */}
        <div
          className="text-center mb-10 pt-4"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)",
          }}
        >
          <span className="text-eyebrow text-primary mb-2 block">Наш ассортимент</span>
          <h1 className="font-display gradient-text mb-2" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 400, lineHeight: 1.15 }}>
            Каталог
          </h1>
          <p className="font-sans text-muted-foreground" style={{ fontSize: "0.875rem" }}>
            Премиальная корейская и европейская косметика
          </p>
        </div>

        {/* ── Search bar ── */}
        <div
          className="max-w-xl mx-auto mb-8"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s cubic-bezier(0.23,1,0.32,1) 0.1s, transform 0.6s cubic-bezier(0.23,1,0.32,1) 0.1s",
          }}
        >
          <div
            className="relative flex items-center"
            style={{
              background: "white",
              border: "1.5px solid oklch(0.91 0.015 10)",
              borderRadius: "100px",
              boxShadow: "0 4px 24px oklch(0.50 0.20 12 / 0.07)",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocusCapture={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.50 0.20 12 / 0.5)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px oklch(0.50 0.20 12 / 0.14)";
            }}
            onBlurCapture={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.91 0.015 10)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px oklch(0.50 0.20 12 / 0.07)";
            }}
          >
            <Search className="absolute left-5 h-4 w-4 shrink-0" style={{ color: "oklch(0.65 0.08 12)" }} />
            <input
              type="text"
              placeholder="Поиск по названию или бренду..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                paddingLeft: "2.75rem",
                paddingRight: search ? "3rem" : "1.25rem",
                paddingTop: "0.75rem",
                paddingBottom: "0.75rem",
                background: "transparent",
                border: "none",
                outline: "none",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.875rem",
                color: "oklch(0.15 0.02 10)",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 h-6 w-6 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "oklch(0.93 0.02 10)" }}
              >
                <X className="h-3 w-3" style={{ color: "oklch(0.50 0.04 10)" }} />
              </button>
            )}
          </div>
        </div>

        {/* ── Category pills ── */}
        <div
          className="flex flex-wrap justify-center gap-2 mb-10"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.6s cubic-bezier(0.23,1,0.32,1) 0.18s, transform 0.6s cubic-bezier(0.23,1,0.32,1) 0.18s",
          }}
        >
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.45rem 1.1rem",
                  borderRadius: "100px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.82rem",
                  fontWeight: active ? 600 : 400,
                  letterSpacing: "0.01em",
                  border: active ? "1.5px solid transparent" : "1.5px solid oklch(0.88 0.02 10)",
                  background: active
                    ? "linear-gradient(135deg, oklch(0.50 0.20 12), oklch(0.60 0.18 15))"
                    : "white",
                  color: active ? "white" : "oklch(0.40 0.03 10)",
                  boxShadow: active ? "0 4px 16px oklch(0.50 0.20 12 / 0.28)" : "none",
                  transform: active ? "translateY(-1px)" : "translateY(0)",
                  transition: "all 0.22s cubic-bezier(0.23,1,0.32,1)",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "0.85em" }}>{cat.emoji}</span>
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ── Main layout: sidebar + grid ── */}
        <div className="flex gap-7 items-start">

          {/* ── Desktop sidebar filters ── */}
          <aside
            className="hidden lg:block shrink-0"
            style={{
              width: "220px",
              background: "white",
              borderRadius: "20px",
              padding: "1.4rem",
              border: "1px solid oklch(0.93 0.015 10)",
              boxShadow: "0 4px 24px oklch(0.50 0.20 12 / 0.05)",
              position: "sticky",
              top: "100px",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <span className="font-sans" style={{ fontSize: "0.9rem", fontWeight: 700, color: "oklch(0.15 0.02 10)" }}>
                Фильтры
              </span>
              {activeFiltersCount > 0 && (
                <span
                  className="flex items-center justify-center rounded-full text-white"
                  style={{
                    width: "20px", height: "20px",
                    background: "oklch(0.50 0.20 12)",
                    fontSize: "0.65rem", fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <FilterPanel />
          </aside>

          {/* ── Right column ── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="font-sans text-muted-foreground" style={{ fontSize: "0.82rem" }}>
                  {isLoading ? "Загрузка..." : `${filtered.length} товаров`}
                </span>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full transition-all hover:scale-105"
                    style={{
                      background: "oklch(0.50 0.20 12 / 0.10)",
                      color: "oklch(0.50 0.20 12)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.72rem",
                      fontWeight: 500,
                    }}
                  >
                    <X className="h-3 w-3" />
                    Сбросить
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Mobile filter button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-full border transition-all"
                  style={{
                    border: "1.5px solid oklch(0.88 0.02 10)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    color: "oklch(0.35 0.03 10)",
                    background: "white",
                  }}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Фильтры
                  {activeFiltersCount > 0 && (
                    <span
                      className="rounded-full text-white flex items-center justify-center"
                      style={{ width: "16px", height: "16px", background: "oklch(0.50 0.20 12)", fontSize: "0.6rem", fontWeight: 700 }}
                    >
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    style={{
                      appearance: "none",
                      padding: "0.45rem 2.2rem 0.45rem 0.9rem",
                      borderRadius: "100px",
                      border: "1.5px solid oklch(0.88 0.02 10)",
                      background: "white",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.8rem",
                      fontWeight: 400,
                      color: "oklch(0.35 0.03 10)",
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none" style={{ color: "oklch(0.55 0.04 10)" }} />
                </div>
              </div>
            </div>

            {/* Product grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden bg-white border border-rose-50">
                    <div className="aspect-square bg-gradient-to-br from-rose-50 to-pink-50/40 animate-pulse" />
                    <div className="p-3.5 space-y-2">
                      <div className="h-2.5 rounded-full bg-rose-50 animate-pulse w-1/3" />
                      <div className="h-3.5 rounded-full bg-gray-100 animate-pulse w-4/5" />
                      <div className="h-3 rounded-full bg-gray-100 animate-pulse w-3/5" />
                      <div className="flex justify-between items-center pt-1">
                        <div className="h-5 rounded-full bg-rose-100/60 animate-pulse w-2/5" />
                        <div className="h-9 w-9 rounded-full bg-rose-100/60 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-6xl mb-5">🌸</div>
                <h3 className="font-display mb-2" style={{ fontSize: "1.4rem", fontWeight: 400 }}>Товары не найдены</h3>
                <p className="font-sans text-muted-foreground mb-6" style={{ fontSize: "0.875rem" }}>
                  Попробуйте изменить фильтры или поисковый запрос
                </p>
                <button
                  onClick={clearAllFilters}
                  className="btn-amor"
                  style={{ fontSize: "0.85rem" }}
                >
                  Сбросить все фильтры
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((product, i) => (
                  <AnimatedCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      {showMobileFilters && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
            style={{ animation: "fadeIn 0.2s ease" }}
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl overflow-y-auto"
            style={{
              maxHeight: "85vh",
              padding: "1.5rem",
              animation: "slideUp 0.35s cubic-bezier(0.23,1,0.32,1)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-sans" style={{ fontSize: "1rem", fontWeight: 700 }}>Фильтры</span>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center"
                style={{ background: "oklch(0.95 0.01 10)" }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <FilterPanel />
            <button
              onClick={() => setShowMobileFilters(false)}
              className="btn-amor w-full mt-6 justify-center"
              style={{ fontSize: "0.875rem" }}
            >
              Показать {filtered.length} товаров
            </button>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
