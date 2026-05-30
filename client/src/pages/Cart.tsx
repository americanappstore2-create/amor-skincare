import { Link } from "wouter";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "../contexts/CartContext";

export default function Cart() {
  const { items, removeItem, updateQuantity, totalAmount, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-float">🛍️</div>
          <h2 className="font-display text-2xl font-bold mb-2">Корзина пуста</h2>
          <p className="text-muted-foreground mb-6 text-sm">Добавьте товары из каталога</p>
          <Link href="/catalog">
            <Button
              className="rounded-full px-8"
              style={{ background: "linear-gradient(135deg, oklch(0.58 0.18 10), oklch(0.72 0.14 10))" }}
            >
              Перейти в каталог
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-24 pb-16">
      <div className="container max-w-4xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold gradient-text mb-8">
          Корзина
          <span className="text-lg text-muted-foreground font-normal ml-3">({totalItems} товаров)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <div
                key={item.productId}
                className="animate-fade-in-up bg-white rounded-2xl p-4 border border-rose-100 flex gap-4 items-start"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Image */}
                <div className="h-20 w-20 rounded-xl overflow-hidden bg-rose-50 shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-2xl">🌸</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                    {item.brand}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground leading-tight mb-2 line-clamp-2">
                    {item.name}
                  </h3>
                  <div className="font-bold text-primary">
                    {(item.price * item.quantity).toLocaleString("ru-KZ")} ₸
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.price.toLocaleString("ru-KZ")} ₸ × {item.quantity}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-1.5 rounded-full hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-1.5 bg-rose-50 rounded-full p-0.5">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="h-6 w-6 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-rose-100 transition-colors"
                    >
                      <Minus className="h-2.5 w-2.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="h-6 w-6 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-rose-100 transition-colors"
                    >
                      <Plus className="h-2.5 w-2.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-rose-100 sticky top-24">
              <h2 className="font-display text-lg font-semibold mb-4">Итого</h2>

              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate max-w-[160px]">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium shrink-0 ml-2">
                      {(item.price * item.quantity).toLocaleString("ru-KZ")} ₸
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-rose-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Итого</span>
                  <span className="font-bold text-xl gradient-text">
                    {totalAmount.toLocaleString("ru-KZ")} ₸
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Доступна рассрочка Kaspi Red
                </div>
              </div>

              <Link href="/checkout">
                <Button
                  className="w-full rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                  style={{ background: "linear-gradient(135deg, oklch(0.58 0.18 10), oklch(0.72 0.14 10))" }}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Оформить заказ
                </Button>
              </Link>

              <Link href="/catalog">
                <Button variant="ghost" className="w-full mt-2 text-sm text-muted-foreground hover:text-primary">
                  ← Продолжить покупки
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
