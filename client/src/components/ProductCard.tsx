import { Link } from "wouter";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  eye_care: "Уход за глазами",
  sunscreen: "Санскрин",
  other: "Другое",
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      imageUrl: product.imageUrl ?? undefined,
      brand: product.brand,
    });
    toast.success(`${product.name} добавлен в корзину`, {
      description: `${parseFloat(product.price).toLocaleString("ru-KZ")} ₸`,
    });
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div className="product-card group bg-white rounded-2xl overflow-hidden border border-rose-100 cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden aspect-product bg-rose-50">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-image w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-4xl">🌸</div>
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-2 left-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/90 text-primary border border-primary/20">
              {categoryLabels[product.category] ?? product.category}
            </span>
          </div>
          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/90 rounded-full p-2">
              <Eye className="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col flex-1">
          <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide mb-1">
            {product.brand}
          </div>
          <h3 className="text-sm font-semibold text-foreground leading-tight mb-2 flex-1 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-auto">
            <div className="font-bold text-primary text-base">
              {parseFloat(product.price).toLocaleString("ru-KZ")} ₸
            </div>
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="h-8 w-8 p-0 rounded-full shadow-sm hover:shadow-md transition-all"
              style={{ background: "linear-gradient(135deg, oklch(0.58 0.18 10), oklch(0.72 0.14 10))" }}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
