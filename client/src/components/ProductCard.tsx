import { useState } from "react";
import { Link } from "wouter";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: string;
  imageUrl?: string | null;
  inStock: number;
  description?: string | null;
}

interface ProductCardProps {
  product: Product;
}

const categoryLabels: Record<string, string> = {
  serum: "Сыворотка",
  cream: "Крем",
  toner: "Тонер",
  mask: "Маска",
  cleanser: "Очищение",
  eye_care: "Глаза",
  sunscreen: "Санскрин",
  other: "Другое",
};

const categoryEmojis: Record<string, string> = {
  serum: "💧",
  cream: "🫙",
  toner: "🌊",
  mask: "🌿",
  cleanser: "✨",
  eye_care: "👁️",
  sunscreen: "☀️",
  other: "🌸",
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [liked, setLiked] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingToCart(true);
    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      imageUrl: product.imageUrl ?? undefined,
      brand: product.brand,
    });
    toast.success(`${product.name}`, {
      description: `Добавлено в корзину • ${parseFloat(product.price).toLocaleString("ru-KZ")} ₸`,
    });
    setTimeout(() => setAddingToCart(false), 600);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer h-full flex flex-col transition-all duration-350"
        style={{
          border: "1px solid oklch(0.93 0.02 10)",
          boxShadow: "0 2px 12px oklch(0.52 0.20 12 / 0.04)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 48px oklch(0.52 0.20 12 / 0.14)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.52 0.20 12 / 0.25)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px oklch(0.52 0.20 12 / 0.04)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.93 0.02 10)";
        }}
      >
        {/* Image */}
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 to-pink-50/50"
          style={{ aspectRatio: "1 / 1" }}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
              style={{ transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <div className="text-5xl">{categoryEmojis[product.category] ?? "🌸"}</div>
              <div className="text-xs text-muted-foreground font-medium">{product.brand}</div>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-2.5 left-2.5">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide"
              style={{
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(8px)",
                border: "1px solid oklch(0.52 0.20 12 / 0.2)",
                color: "oklch(0.52 0.20 12)",
              }}>
              {categoryLabels[product.category] ?? product.category}
            </span>
          </div>

          {/* Wishlist */}
          <button
            onClick={handleLike}
            className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90"
            style={{
              background: liked ? "oklch(0.52 0.20 12)" : "rgba(255,255,255,0.85)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Heart className={`h-3.5 w-3.5 transition-all ${liked ? "text-white fill-white" : "text-rose-400"}`} />
          </button>

          {/* Out of stock */}
          {product.inStock === 0 && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Нет в наличии</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3.5 flex flex-col flex-1">
          <div className="font-sans uppercase mb-1" style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.12em", color: "oklch(0.62 0.10 12)" }}>
            {product.brand}
          </div>
          <h3 className="font-sans text-foreground leading-snug mb-3 flex-1 line-clamp-2" style={{ fontSize: "0.82rem", fontWeight: 500, lineHeight: 1.4 }}>
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-auto">
            <div className="font-display" style={{ fontSize: "1.05rem", fontWeight: 500, color: "oklch(0.35 0.18 12)" }}>
              {parseFloat(product.price).toLocaleString("ru-KZ")} ₸
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.inStock === 0}
              className="h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90 disabled:opacity-40"
              style={{
                background: addingToCart
                  ? "oklch(0.62 0.14 12)"
                  : "linear-gradient(135deg, oklch(0.52 0.20 12), oklch(0.62 0.18 15))",
                boxShadow: "0 4px 14px oklch(0.52 0.20 12 / 0.3)",
                transform: addingToCart ? "scale(0.9)" : "scale(1)",
              }}
            >
              <ShoppingCart className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
