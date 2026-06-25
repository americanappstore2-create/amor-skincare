import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Login() {
  const [, navigate] = useLocation();
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.loyalty.login.useQuery(
    { phone },
    { enabled: false }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await loginMutation.refetch();
      if (result.data) {
        toast.success("Добро пожаловать!");
        navigate(`/account?phone=${phone}`);
      }
    } catch (error: any) {
      toast.error(error.message || "Ошибка при входе");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2 text-rose-900">AMOR</h1>
        <p className="text-center text-gray-600 mb-8">Вход в личный кабинет</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Номер телефона
            </label>
            <Input
              type="tel"
              placeholder="+7 (777) 123-45-67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              minLength={10}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !phone}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 rounded-lg transition"
          >
            {isLoading ? "Вход..." : "Войти"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Нет аккаунта?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-rose-600 hover:text-rose-700 font-semibold"
          >
            Зарегистрироваться
          </button>
        </p>
      </Card>
    </div>
  );
}
