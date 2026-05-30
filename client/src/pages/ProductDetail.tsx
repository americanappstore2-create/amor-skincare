import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, ShoppingCart, Plus, Minus, Star, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";

const categoryLabels: Record<string, string> = {
  serum: "Сыворотка",
  cream: "Крем",
  toner: "Тонер",
  mask: "Маска",
  cleanser: "Очищение",
  eye_care: "Уход за глазами",
  sunscreen: "Санскрин",
  other: "Другое",
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id ?? "0");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "ingredients" | "usage">("description");
  const { addItem } = useCart();

  const { data: product, isLoading, error } = trpc.products.get.useQuery({ id: productId });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: parseFloat(product.price),
        imageUrl: product.imageUrl ?? undefined,
        brand: product.brand,
      });
    }
    toast.success(`${product.name} добавлен в корзину (${quantity} шт.)`, {
      description: `${(parseFloat(product.price) * quantity).toLocaleString("ru-KZ")} ₸`,
    });
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="skeleton aspect-square rounded-3xl" />
            <div className="space-y-4">
              <div className="skeleton h-6 rounded w-1/3" />
              <div className="skeleton h-8 rounded w-2/3" />
              <div className="skeleton h-10 rounded w-1/4" />
              <div className="skeleton h-24 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-24 pb-16 text-center">
        <div className="text-5xl mb-4">😔</div>
        <h2 className="font-display text-2xl font-bold mb-2">Товар не найден</h2>
        <Link href="/catalog">
          <Button variant="outline" className="rounded-full mt-4">← Вернуться в каталог</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-24 pb-16">
      <div className="container max-w-5xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-primary transition-colors">Каталог</Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div className="animate-scale-in">
            <div className="aspect-square rounded-3xl overflow-hidden bg-rose-50 border border-rose-100">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">🌸</div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="animate-fade-in-up space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-rose-100 text-primary">
                  {categoryLabels[product.category] ?? product.category}
                </span>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  {product.brand}
                </span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating placeholder */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-4 w-4 text-amber-400 fill-amber-400" />
              ))}
              <span className="text-sm text-muted-foreground ml-1">(5.0)</span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold gradient-text">
              {parseFloat(product.price).toLocaleString("ru-KZ")} ₸
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-green-500" />
              <span className="text-green-600 font-medium">
                {product.inStock ? "В наличии" : "Нет в наличии"}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-rose-50 rounded-full p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-rose-100 transition-colors"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-8 text-center font-semibold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-rose-100 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                Итого: <strong className="text-foreground">{(parseFloat(product.price) * quantity).toLocaleString("ru-KZ")} ₸</strong>
              </span>
            </div>

            {/* Add to cart */}
            <div className="flex gap-3">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
                style={{ background: "linear-gradient(135deg, oklch(0.58 0.18 10), oklch(0.72 0.14 10))" }}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                В корзину
              </Button>
              <Link href="/cart">
                <Button size="lg" variant="outline" className="rounded-full border-primary/30 text-primary hover:bg-rose-50">
                  Корзина
                </Button>
              </Link>
            </div>

            {/* Tabs */}
            <div className="border border-rose-100 rounded-2xl overflow-hidden">
              <div className="flex border-b border-rose-100">
                {(["description", "ingredients", "usage"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-xs font-medium transition-colors ${
                      activeTab === tab
                        ? "bg-rose-50 text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab === "description" ? "Описание" : tab === "ingredients" ? "Состав" : "Применение"}
                  </button>
                ))}
              </div>
              <div className="p-4 text-sm text-foreground/80 leading-relaxed min-h-[80px]">
                {activeTab === "description" && (product.description ?? "Описание отсутствует")}
                {activeTab === "ingredients" && (product.ingredients ?? "Состав не указан")}
                {activeTab === "usage" && (product.usage ?? "Инструкция по применению не указана")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
