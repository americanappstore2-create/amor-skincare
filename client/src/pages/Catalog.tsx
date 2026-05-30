import { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { trpc } from "@/lib/trpc";
import ProductCard from "../components/ProductCard";

const categories = [
  { value: "all", label: "Все товары" },
  { value: "serum", label: "Сыворотки" },
  { value: "cream", label: "Кремы" },
  { value: "toner", label: "Тонеры" },
  { value: "mask", label: "Маски" },
  { value: "cleanser", label: "Очищение" },
  { value: "eye_care", label: "Уход за глазами" },
  { value: "sunscreen", label: "Санскрины" },
];

export default function Catalog() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const { data: products, isLoading } = trpc.products.list.useQuery(
    { category: activeCategory },
    { keepPreviousData: true } as any
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const filtered = products?.filter((p) =>
    search
      ? p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
      : true
  ) ?? [];

  return (
    <div className="pt-20 md:pt-24 pb-16">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-3">Каталог</h1>
          <p className="text-muted-foreground">Премиальная корейская и европейская косметика</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск по названию или бренду..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full border border-rose-200 bg-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`category-pill px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                activeCategory === cat.value
                  ? "active border-transparent text-white"
                  : "border-rose-200 text-foreground/70 hover:border-primary hover:text-primary bg-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!isLoading && (
          <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            <span>{filtered.length} товаров</span>
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="skeleton aspect-product" />
                <div className="p-3 space-y-2">
                  <div className="skeleton h-4 rounded w-3/4" />
                  <div className="skeleton h-3 rounded w-1/2" />
                  <div className="skeleton h-5 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌸</div>
            <h3 className="font-display text-xl font-semibold mb-2">Товары не найдены</h3>
            <p className="text-muted-foreground text-sm">Попробуйте изменить фильтры или поисковый запрос</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
