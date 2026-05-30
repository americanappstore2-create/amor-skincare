import { useState } from "react";
import { Link, useLocation } from "wouter";
import { User, Phone, MapPin, CreditCard, Banknote, CheckCircle, Store, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";

const PICKUP_LOCATIONS = [
  { value: "uralsk_atrium", label: "Уральск — ТРЦ Атриум" },
  { value: "aksai_asia_plaza", label: "Аксай — Asia Plaza" },
];

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, totalAmount, clearCart } = useCart();
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    deliveryMethod: "delivery" as "delivery" | "pickup",
    deliveryAddress: "",
    pickupLocation: "uralsk_atrium",
    paymentMethod: "kaspi_red" as "kaspi_red" | "cash",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createOrder = trpc.orders.create.useMutation({
    onSuccess: (data) => {
      clearCart();
      // Open WhatsApp with order details for manager notification
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank");
      }
      navigate(`/order-confirmation?orderId=${data.orderId}`);
    },
    onError: (err) => {
      toast.error("Ошибка при оформлении заказа", { description: err.message });
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.customerName.trim()) newErrors.customerName = "Введите ваше имя";
    if (!form.customerPhone.trim() || form.customerPhone.length < 7)
      newErrors.customerPhone = "Введите корректный номер";
    if (form.deliveryMethod === "delivery" && (!form.deliveryAddress.trim() || form.deliveryAddress.length < 5))
      newErrors.deliveryAddress = "Введите адрес доставки";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) { toast.error("Корзина пуста"); return; }

    createOrder.mutate({
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      deliveryMethod: form.deliveryMethod,
      deliveryAddress: form.deliveryMethod === "delivery" ? form.deliveryAddress : undefined,
      pickupLocation: form.deliveryMethod === "pickup"
        ? PICKUP_LOCATIONS.find((l) => l.value === form.pickupLocation)?.label
        : undefined,
      paymentMethod: form.paymentMethod,
      notes: form.notes || undefined,
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      totalAmount,
    });
  };

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16 text-center">
        <div className="text-5xl mb-4">🛍️</div>
        <h2 className="font-display text-2xl font-bold mb-2">Корзина пуста</h2>
        <Link href="/catalog">
          <Button className="rounded-full mt-4" style={{ background: "linear-gradient(135deg, oklch(0.58 0.18 10), oklch(0.72 0.14 10))" }}>
            Перейти в каталог
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-24 pb-16">
      <div className="container max-w-4xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold gradient-text mb-8">
          Оформление заказа
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form fields */}
            <div className="lg:col-span-2 space-y-6">

              {/* Contact */}
              <div className="bg-white rounded-2xl p-6 border border-rose-100">
                <h2 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Контактные данные
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Ваше имя *</label>
                    <input
                      type="text"
                      placeholder="Введите ваше имя"
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.customerName ? "border-red-300 bg-red-50" : "border-rose-200"
                      }`}
                    />
                    {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Номер телефона *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="tel"
                        placeholder="+7 777 000 00 00"
                        value={form.customerPhone}
                        onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          errors.customerPhone ? "border-red-300 bg-red-50" : "border-rose-200"
                        }`}
                      />
                    </div>
                    {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone}</p>}
                  </div>
                </div>
              </div>

              {/* Delivery method */}
              <div className="bg-white rounded-2xl p-6 border border-rose-100">
                <h2 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Способ получения
                </h2>

                {/* Method toggle */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { value: "delivery", label: "Доставка", desc: "Курьером по городу", icon: <Truck className="h-5 w-5" /> },
                    { value: "pickup", label: "Самовывоз", desc: "Из нашего магазина", icon: <Store className="h-5 w-5" /> },
                  ].map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setForm({ ...form, deliveryMethod: method.value as "delivery" | "pickup" })}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        form.deliveryMethod === method.value
                          ? "border-primary bg-rose-50"
                          : "border-rose-100 hover:border-rose-300"
                      }`}
                    >
                      <div className={`mb-2 ${form.deliveryMethod === method.value ? "text-primary" : "text-muted-foreground"}`}>
                        {method.icon}
                      </div>
                      <div className="text-sm font-semibold">{method.label}</div>
                      <div className="text-xs text-muted-foreground">{method.desc}</div>
                      {form.deliveryMethod === method.value && (
                        <CheckCircle className="h-4 w-4 text-primary absolute top-3 right-3" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Delivery address */}
                {form.deliveryMethod === "delivery" && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-medium mb-1.5">Адрес доставки *</label>
                    <textarea
                      placeholder="Город, улица, дом, квартира"
                      value={form.deliveryAddress}
                      onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
                      rows={3}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.deliveryAddress ? "border-red-300 bg-red-50" : "border-rose-200"
                      }`}
                    />
                    {errors.deliveryAddress && <p className="text-red-500 text-xs mt-1">{errors.deliveryAddress}</p>}
                  </div>
                )}

                {/* Pickup location */}
                {form.deliveryMethod === "pickup" && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-medium mb-2">Выберите магазин</label>
                    <div className="space-y-2">
                      {PICKUP_LOCATIONS.map((loc) => (
                        <button
                          key={loc.value}
                          type="button"
                          onClick={() => setForm({ ...form, pickupLocation: loc.value })}
                          className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-200 ${
                            form.pickupLocation === loc.value
                              ? "border-primary bg-rose-50"
                              : "border-rose-100 hover:border-rose-300"
                          }`}
                        >
                          <Store className={`h-5 w-5 shrink-0 ${form.pickupLocation === loc.value ? "text-primary" : "text-muted-foreground"}`} />
                          <span className="text-sm font-medium">{loc.label}</span>
                          {form.pickupLocation === loc.value && (
                            <CheckCircle className="h-4 w-4 text-primary ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <span>🕐</span> Режим работы: Пн–Вс 10:00–21:00
                    </p>
                  </div>
                )}
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl p-6 border border-rose-100">
                <h2 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Способ оплаты
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "kaspi_red", label: "Kaspi Red", desc: "Рассрочка без %%", icon: <CreditCard className="h-5 w-5" /> },
                    { value: "cash", label: "Наличные", desc: "При получении", icon: <Banknote className="h-5 w-5" /> },
                  ].map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setForm({ ...form, paymentMethod: method.value as "kaspi_red" | "cash" })}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        form.paymentMethod === method.value
                          ? "border-primary bg-rose-50"
                          : "border-rose-100 hover:border-rose-300"
                      }`}
                    >
                      <div className={`mb-2 ${form.paymentMethod === method.value ? "text-primary" : "text-muted-foreground"}`}>
                        {method.icon}
                      </div>
                      <div className="text-sm font-semibold">{method.label}</div>
                      <div className="text-xs text-muted-foreground">{method.desc}</div>
                      {form.paymentMethod === method.value && (
                        <CheckCircle className="h-4 w-4 text-primary absolute top-3 right-3" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl p-6 border border-rose-100">
                <h2 className="font-display text-base font-semibold mb-3">Комментарий к заказу</h2>
                <textarea
                  placeholder="Дополнительные пожелания..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-rose-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 border border-rose-100 sticky top-24">
                <h2 className="font-display text-lg font-semibold mb-4">Ваш заказ</h2>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3 items-start">
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-rose-50 shrink-0">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-sm">🌸</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium leading-tight line-clamp-2">{item.name}</div>
                        <div className="text-xs text-muted-foreground">× {item.quantity}</div>
                      </div>
                      <div className="text-xs font-bold text-primary shrink-0">
                        {(item.price * item.quantity).toLocaleString("ru-KZ")} ₸
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery summary */}
                <div className="bg-rose-50 rounded-xl p-3 mb-4 text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-foreground/80">
                    {form.deliveryMethod === "pickup" ? (
                      <><Store className="h-3.5 w-3.5 text-primary" /> Самовывоз</>
                    ) : (
                      <><Truck className="h-3.5 w-3.5 text-primary" /> Доставка</>
                    )}
                  </div>
                  {form.deliveryMethod === "pickup" && (
                    <div className="text-muted-foreground mt-0.5">
                      {PICKUP_LOCATIONS.find((l) => l.value === form.pickupLocation)?.label}
                    </div>
                  )}
                </div>

                <div className="border-t border-rose-100 pt-4 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Итого</span>
                    <span className="font-bold text-xl gradient-text">
                      {totalAmount.toLocaleString("ru-KZ")} ₸
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
                  disabled={createOrder.isPending}
                  style={{ background: "linear-gradient(135deg, oklch(0.58 0.18 10), oklch(0.72 0.14 10))" }}
                >
                  {createOrder.isPending ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Оформляем...
                    </span>
                  ) : (
                    "Подтвердить заказ"
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  После подтверждения откроется WhatsApp для связи с менеджером
                </p>

                <Link href="/cart">
                  <Button variant="ghost" className="w-full mt-2 text-sm text-muted-foreground">
                    ← Вернуться в корзину
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
