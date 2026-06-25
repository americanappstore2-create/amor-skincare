import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Register() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    phone: "",
    name: "",
    birthDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const registerMutation = trpc.loyalty.register.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const birthDate = formData.birthDate ? new Date(formData.birthDate) : undefined;
      await registerMutation.mutateAsync({
        phone: formData.phone,
        name: formData.name,
        birthDate,
      });

      toast.success("Регистрация успешна!");
      navigate(`/account?phone=${formData.phone}`);
    } catch (error: any) {
      toast.error(error.message || "Ошибка при регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2 text-rose-900">AMOR</h1>
        <p className="text-center text-gray-600 mb-8">Регистрация в программе лояльности</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Номер телефона *
            </label>
            <Input
              type="tel"
              name="phone"
              placeholder="+7 (777) 123-45-67"
              value={formData.phone}
              onChange={handleChange}
              required
              minLength={10}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Имя *
            </label>
            <Input
              type="text"
              name="name"
              placeholder="Ваше имя"
              value={formData.name}
              onChange={handleChange}
              required
              minLength={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дата рождения (опционально)
            </label>
            <Input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !formData.phone || !formData.name}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 rounded-lg transition"
          >
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Уже зарегистрированы?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-rose-600 hover:text-rose-700 font-semibold"
          >
            Войти
          </button>
        </p>
      </Card>
    </div>
  );
}
