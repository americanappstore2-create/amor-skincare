import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface LoginModalProps {
  onSuccess?: () => void;
}

export default function LoginModal({ onSuccess }: LoginModalProps) {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = trpc.loyalty.login.useQuery(
    { phone },
    { enabled: false }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await loginMutation.refetch();
      if (result.data) {
        toast.success("Добро пожаловать!");
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      const errorMsg = error.message || "Номер не найден";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
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

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            <p className="text-sm font-semibold">{error}</p>
            <p className="text-xs mt-2 text-red-600 dark:text-red-300">
              Не зарегистрированы? Перейдите на регистрацию.
            </p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || !phone}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 rounded-lg transition"
        >
          {isLoading ? "Вход..." : "Войти"}
        </Button>
      </form>
    </div>
  );
}
