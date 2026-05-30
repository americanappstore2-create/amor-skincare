import { Link } from "wouter";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "../contexts/CartContext";

export default function Cart() {
  const { items, removeItem, updateQuantity, totalAmount, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-6">
          <div className="w-16 h-16 border border-[#e8e0d8] flex items-center justify-center mx-auto mb-8">
            <svg viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1" className="w-7 h-7">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#c9a96e] mb-3 font-medium">Корзина</p>
          <h2 className="font-serif text-2xl font-light text-[#1a1a1a] mb-3 tracking-wide">Корзина пуста</h2>
          <div className="w-8 h-px bg-[#c9a96e] mx-auto mb-6" />
          <p className="text-sm text-[#888] font-light mb-8">Добавьте товары из каталога</p>
          <Link href="/catalog">
            <button className="group inline-flex items-center gap-3 bg-[#1a1a1a] text-white px-10 py-3.5 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-[#c9a96e] transition-all duration-300">
              Перейти в каталог
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-24 pb-16 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="py-10 border-b border-[#e8e0d8] mb-10">
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#c9a96e] mb-2 font-medium">Ваш выбор</p>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-[#1a1a1a] tracking-wide">
            Корзина
            <span className="font-sans text-[#888] ml-3 text-base font-light tracking-normal">
              ({totalItems} {totalItems === 1 ? "товар" : totalItems < 5 ? "товара" : "товаров"})
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-0 divide-y divide-[#e8e0d8]">
            {items.map((item, i) => (
              <div
                key={item.productId}
                className="animate-fade-in-up py-6 flex gap-5 items-start"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Image */}
                <div className="h-24 w-20 shrink-0 bg-[#faf7f4] overflow-hidden" style={{ border: "1px solid #e8e0d8" }}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1" className="w-8 h-8 opacity-40">
                        <rect x="3" y="3" width="18" height="18" rx="1"/>
                        <path d="M3 9h18M9 21V9"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#c9a96e] mb-1 font-medium">{item.brand}</p>
                  <h3 className="text-sm font-light text-[#1a1a1a] leading-snug mb-3 line-clamp-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }}>
                    {item.name}
                  </h3>
                  <p className="text-[#1a1a1a] font-light text-sm">
                    {(item.price * item.quantity).toLocaleString("ru-KZ")} ₸
                  </p>
                  <p className="text-[11px] text-[#888] font-light mt-0.5">
                    {item.price.toLocaleString("ru-KZ")} ₸ × {item.quantity}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-end gap-4 shrink-0">
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-[#ccc] hover:text-[#1a1a1a] transition-colors duration-200"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <div className="flex items-center gap-0" style={{ border: "1px solid #e8e0d8" }}>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="h-8 w-8 flex items-center justify-center text-[#888] hover:bg-[#faf7f4] hover:text-[#1a1a1a] transition-colors duration-200"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-light text-[#1a1a1a]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="h-8 w-8 flex items-center justify-center text-[#888] hover:bg-[#faf7f4] hover:text-[#1a1a1a] transition-colors duration-200"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[#faf7f4] p-8" style={{ border: "1px solid #e8e0d8" }}>
              <p className="text-[10px] tracking-[0.35em] uppercase text-[#c9a96e] mb-4 font-medium">Итого</p>

              <div className="space-y-2.5 mb-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-[13px]">
                    <span className="text-[#888] font-light truncate max-w-[140px]">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-[#1a1a1a] font-light shrink-0 ml-2">
                      {(item.price * item.quantity).toLocaleString("ru-KZ")} ₸
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 mb-6" style={{ borderTop: "1px solid #e8e0d8" }}>
                <div className="flex justify-between items-baseline">
                  <span className="text-[11px] tracking-[0.15em] uppercase font-medium text-[#1a1a1a]">Сумма</span>
                  <span className="font-serif text-2xl font-light text-[#1a1a1a]">
                    {totalAmount.toLocaleString("ru-KZ")} ₸
                  </span>
                </div>
                <p className="text-[11px] text-[#888] font-light mt-1.5">Доступна оплата Kaspi</p>
              </div>

              <Link href="/checkout">
                <button className="group w-full flex items-center justify-center gap-3 bg-[#1a1a1a] text-white py-4 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-[#c9a96e] transition-all duration-300 mb-3">
                  Оформить заказ
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>

              <Link href="/catalog">
                <button className="w-full py-3 text-[11px] tracking-[0.15em] uppercase font-light text-[#888] hover:text-[#1a1a1a] transition-colors duration-200">
                  ← Продолжить покупки
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
