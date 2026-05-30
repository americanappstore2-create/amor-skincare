import { useEffect } from "react";
import { Link } from "wouter";
import { CheckCircle, Phone, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderConfirmation() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
      <div className="container max-w-lg text-center">
        <div className="animate-bounce-in">
          <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
        </div>

        <div className="animate-fade-in-up delay-200">
          <h1 className="font-display text-3xl font-bold mb-3">Заказ оформлен!</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Спасибо за ваш заказ! Мы свяжемся с вами в ближайшее время для подтверждения.
            Наш менеджер позвонит или напишет в WhatsApp.
          </p>
        </div>

        <div className="animate-fade-in-up delay-300 bg-rose-50 rounded-2xl p-6 mb-8 text-left space-y-3">
          <h2 className="font-display text-base font-semibold text-center mb-4">Что дальше?</h2>
          {[
            { step: "1", text: "Наш менеджер свяжется с вами для подтверждения заказа" },
            { step: "2", text: "Вы выбираете удобное время и способ получения" },
            { step: "3", text: "Получаете свои любимые средства ухода" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                style={{ background: "linear-gradient(135deg, oklch(0.58 0.18 10), oklch(0.72 0.14 10))" }}>
                {item.step}
              </div>
              <p className="text-sm text-foreground/80">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="animate-fade-in-up delay-400 space-y-3">
          <a href="https://wa.me/7774779779" target="_blank" rel="noopener noreferrer">
            <Button
              className="w-full rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg"
              size="lg"
            >
              <Phone className="mr-2 h-4 w-4" />
              Написать в WhatsApp
            </Button>
          </a>
          <Link href="/catalog">
            <Button
              variant="outline"
              className="w-full rounded-full border-primary/30 text-primary hover:bg-rose-50"
              size="lg"
            >
              Продолжить покупки
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="w-full text-muted-foreground">
              <Home className="mr-2 h-4 w-4" />
              На главную
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
