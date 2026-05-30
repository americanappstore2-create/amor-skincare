import { useState } from "react";
import { Link } from "wouter";
import { Package, Clock, CheckCircle, Truck, XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

const statusConfig = {
  new: { label: "Новый", icon: <Package className="h-3.5 w-3.5" />, class: "status-new" },
  confirmed: { label: "Подтверждён", icon: <CheckCircle className="h-3.5 w-3.5" />, class: "status-confirmed" },
  processing: { label: "В обработке", icon: <Clock className="h-3.5 w-3.5" />, class: "status-processing" },
  shipped: { label: "Отправлен", icon: <Truck className="h-3.5 w-3.5" />, class: "status-shipped" },
  delivered: { label: "Доставлен", icon: <CheckCircle className="h-3.5 w-3.5" />, class: "status-delivered" },
  cancelled: { label: "Отменён", icon: <XCircle className="h-3.5 w-3.5" />, class: "status-cancelled" },
};

const paymentLabels = { kaspi_red: "Kaspi Red", cash: "Наличные" };

type OrderStatus = keyof typeof statusConfig;

interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const utils = trpc.useUtils();

  const { data: orders, isLoading, refetch } = trpc.orders.list.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const updateStatus = trpc.orders.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Статус обновлён");
      utils.orders.list.invalidate();
    },
    onError: (err) => toast.error("Ошибка: " + err.message),
  });

  if (loading) {
    return (
      <div className="pt-24 pb-16 flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="pt-24 pb-16 text-center min-h-screen flex items-center justify-center">
        <div>
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="font-display text-2xl font-bold mb-2">Требуется авторизация</h2>
          <p className="text-muted-foreground mb-6">Войдите в аккаунт для доступа к панели управления</p>
          <a href={getLoginUrl()}>
            <Button style={{ background: "linear-gradient(135deg, oklch(0.58 0.18 10), oklch(0.72 0.14 10))" }} className="rounded-full">
              Войти
            </Button>
          </a>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="pt-24 pb-16 text-center min-h-screen flex items-center justify-center">
        <div>
          <div className="text-5xl mb-4">⛔</div>
          <h2 className="font-display text-2xl font-bold mb-2">Доступ запрещён</h2>
          <p className="text-muted-foreground mb-6">У вас нет прав для просмотра этой страницы</p>
          <Link href="/">
            <Button variant="outline" className="rounded-full">← На главную</Button>
          </Link>
        </div>
      </div>
    );
  }

  const selectedOrderData = orders?.find((o) => o.id === selectedOrder);

  return (
    <div className="pt-20 md:pt-24 pb-16">
      <div className="container max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold gradient-text">Панель управления</h1>
            <p className="text-muted-foreground text-sm mt-1">Управление заказами Amor Skincare</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="rounded-full border-rose-200"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Обновить
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = orders?.filter((o) => o.status === status).length ?? 0;
            return (
              <div key={status} className="bg-white rounded-2xl p-4 border border-rose-100">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-2 ${config.class}`}>
                  {config.icon}
                  {config.label}
                </div>
                <div className="text-2xl font-bold">{count}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders list */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-rose-100 overflow-hidden">
              <div className="p-4 border-b border-rose-100">
                <h2 className="font-display text-lg font-semibold">Все заказы</h2>
              </div>
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                </div>
              ) : !orders?.length ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Заказов пока нет</p>
                </div>
              ) : (
                <div className="divide-y divide-rose-50">
                  {orders.map((order) => {
                    const status = statusConfig[order.status as OrderStatus];
                    const items = order.items as OrderItem[];
                    return (
                      <button
                        key={order.id}
                        onClick={() => setSelectedOrder(order.id === selectedOrder ? null : order.id)}
                        className={`w-full text-left p-4 hover:bg-rose-50/50 transition-colors ${
                          selectedOrder === order.id ? "bg-rose-50" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold">#{order.id}</span>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.class}`}>
                                {status.icon}
                                {status.label}
                              </span>
                            </div>
                            <div className="text-sm font-medium">{order.customerName}</div>
                            <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
                            <div className="text-xs text-muted-foreground mt-0.5 truncate">{order.deliveryAddress}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-bold text-primary text-sm">
                              {parseFloat(order.totalAmount).toLocaleString("ru-KZ")} ₸
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {items.length} товаров
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString("ru-KZ")}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Order detail */}
          <div className="lg:col-span-1">
            {selectedOrderData ? (
              <div className="bg-white rounded-2xl border border-rose-100 p-5 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-base font-semibold">Заказ #{selectedOrderData.id}</h3>
                  <button onClick={() => setSelectedOrder(null)} className="text-muted-foreground hover:text-foreground">
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3 text-sm mb-5">
                  <div><span className="text-muted-foreground">Клиент:</span> <strong>{selectedOrderData.customerName}</strong></div>
                  <div><span className="text-muted-foreground">Телефон:</span> <a href={`tel:${selectedOrderData.customerPhone}`} className="text-primary">{selectedOrderData.customerPhone}</a></div>
                  {selectedOrderData.deliveryMethod === "pickup" ? (
                    <div><span className="text-muted-foreground">Самовывоз:</span> <strong className="text-primary">{selectedOrderData.pickupLocation ?? "не указано"}</strong></div>
                  ) : (
                    <div><span className="text-muted-foreground">Адрес:</span> {selectedOrderData.deliveryAddress ?? "не указано"}</div>
                  )}
                  <div><span className="text-muted-foreground">Оплата:</span> {paymentLabels[selectedOrderData.paymentMethod]}</div>
                  {selectedOrderData.notes && <div><span className="text-muted-foreground">Примечание:</span> {selectedOrderData.notes}</div>}
                </div>

                {/* Items */}
                <div className="border-t border-rose-100 pt-3 mb-4">
                  <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Товары</div>
                  <div className="space-y-2">
                    {(selectedOrderData.items as OrderItem[]).map((item, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-foreground/80 truncate max-w-[160px]">{item.name} × {item.quantity}</span>
                        <span className="font-medium shrink-0 ml-2">{(item.price * item.quantity).toLocaleString("ru-KZ")} ₸</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-bold text-sm mt-2 pt-2 border-t border-rose-50">
                    <span>Итого</span>
                    <span className="text-primary">{parseFloat(selectedOrderData.totalAmount).toLocaleString("ru-KZ")} ₸</span>
                  </div>
                </div>

                {/* Status update */}
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Изменить статус</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(Object.keys(statusConfig) as OrderStatus[]).map((status) => {
                      const config = statusConfig[status];
                      return (
                        <button
                          key={status}
                          onClick={() => updateStatus.mutate({ id: selectedOrderData.id, status })}
                          disabled={selectedOrderData.status === status || updateStatus.isPending}
                          className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            selectedOrderData.status === status
                              ? `${config.class} opacity-100`
                              : "bg-rose-50 text-foreground/70 hover:bg-rose-100"
                          } disabled:cursor-not-allowed`}
                        >
                          {config.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-rose-50/50 rounded-2xl border border-rose-100 p-8 text-center text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Выберите заказ для просмотра деталей</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
