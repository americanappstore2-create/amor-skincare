import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export default function Account() {
  const [, navigate] = useLocation();
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const phoneParam = params.get("phone");
    if (phoneParam) {
      setPhone(phoneParam);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const { data: profileData, isLoading: isProfileLoading } =
    trpc.loyalty.getProfile.useQuery(
      { phone },
      { enabled: !!phone }
    );

  useEffect(() => {
    if (!isProfileLoading) {
      setIsLoading(false);
    }
  }, [isProfileLoading]);

  const handleLogout = () => {
    navigate("/login");
    toast.success("Вы вышли из аккаунта");
  };

  if (isLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!profileData?.customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <h2 className="text-2xl font-bold text-rose-900 mb-4">Клиент не найден</h2>
          <p className="text-gray-600 mb-6">Пожалуйста, зарегистрируйтесь или войдите заново.</p>
          <Button
            onClick={() => navigate("/login")}
            className="w-full bg-rose-600 hover:bg-rose-700"
          >
            Вернуться к входу
          </Button>
        </Card>
      </div>
    );
  }

  const { customer, transactions } = profileData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-rose-900">Мой кабинет</h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Выход
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="p-6 mb-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-rose-900 mb-4">Профиль</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Имя</p>
              <p className="text-lg font-semibold text-gray-900">{customer.name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Номер телефона</p>
              <p className="text-lg font-semibold text-gray-900">{customer.phone}</p>
            </div>
            {customer.birthDate && (
              <div>
                <p className="text-gray-600 text-sm">Дата рождения</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(customer.birthDate).toLocaleDateString("ru-RU")}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Loyalty Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Bonus Balance */}
          <Card className="p-6 shadow-lg bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200">
            <h3 className="text-sm font-semibold text-amber-900 mb-2">Бонусы</h3>
            <p className="text-4xl font-bold text-amber-600">{customer.bonusBalance}</p>
            <p className="text-xs text-amber-700 mt-2">Доступные бонусные баллы</p>
          </Card>

          {/* Discount */}
          <Card className="p-6 shadow-lg bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200">
            <h3 className="text-sm font-semibold text-rose-900 mb-2">Персональная скидка</h3>
            <p className="text-4xl font-bold text-rose-600">{customer.discountPercent}%</p>
            <p className="text-xs text-rose-700 mt-2">Скидка на все покупки</p>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-rose-900 mb-4">История операций</h2>
          {transactions && transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-rose-200">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Дата</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Тип</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Сумма</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Описание</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-200 hover:bg-rose-50">
                      <td className="py-3 px-2 text-gray-600">
                        {new Date(tx.createdAt).toLocaleDateString("ru-RU")}
                      </td>
                      <td className="py-3 px-2">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
                          {tx.type === "bonus_earned" && "Бонусы получены"}
                          {tx.type === "bonus_spent" && "Бонусы потрачены"}
                          {tx.type === "discount_applied" && "Скидка применена"}
                          {tx.type === "manual_adjustment" && "Корректировка"}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-semibold text-gray-900">{tx.amount}</td>
                      <td className="py-3 px-2 text-gray-600">{tx.description || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-600 py-8">История операций пуста</p>
          )}
        </Card>
      </div>
    </div>
  );
}
