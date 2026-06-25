import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface RegisterModalProps {
  onSuccess?: () => void;
}

export default function RegisterModal({ onSuccess }: RegisterModalProps) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const registerMutation = trpc.loyalty.register.useMutation({
    onSuccess: () => {
      toast.success("Регистрация успешна!");
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      const errorMsg = error.message || "Ошибка при регистрации";
      setError(errorMsg);
      toast.error(errorMsg);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    registerMutation.mutate({
      phone,
      name,
      birthDate: birthDate ? new Date(birthDate) : undefined,
    });

    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Номер телефона
          </label>
          <Input
            type="tel"
            placeholder="+7 (777) 123-45-67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            minLength={10}
            className="bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Имя
          </label>
          <Input
            type="text"
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Дата рождения (опционально)
          </label>
          <Input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white"
          />
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || !phone || !name}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 rounded-lg transition"
        >
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </Button>
      </form>
    </div>
  );
}
