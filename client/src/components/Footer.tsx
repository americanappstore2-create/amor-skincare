import { Link } from "wouter";
import { MapPin, Phone, Clock, Instagram, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-rose-100 mt-auto">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/manus-storage/logo_54158ea0.png"
                alt="Amor Skincare"
                className="h-12 w-12 object-contain"
              />
              <div>
                <div className="font-display text-xl font-semibold gradient-text">Amor Skincare</div>
                <div className="text-xs text-muted-foreground">Твой premium skincare space</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Премиальная корейская и европейская косметика. Профессиональный подбор ухода для вашей кожи.
            </p>
            <a
              href="https://www.instagram.com/amor.skincare.kz/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <Instagram className="h-4 w-4" />
              @amor.skincare.kz
            </a>
          </div>

          {/* Locations */}
          <div className="space-y-4">
            <h3 className="font-display text-base font-semibold text-foreground">Наши магазины</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-medium">Уральск — ТРЦ Атриум</div>
                  <div className="text-xs text-muted-foreground">г. Уральск, ТРЦ Атриум</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-medium">Аксай — Asia Plaza</div>
                  <div className="text-xs text-muted-foreground">г. Аксай, Asia Plaza</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-display text-base font-semibold text-foreground">Контакты</h3>
            <div className="space-y-3">
              <a
                href="https://wa.me/7774779779"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm hover:text-primary transition-colors group"
              >
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Phone className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">WhatsApp</div>
                  <div className="text-xs text-muted-foreground">+7 777 477 97 79</div>
                </div>
              </a>
              <div className="flex items-center gap-2.5 text-sm">
                <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Режим работы</div>
                  <div className="text-xs text-muted-foreground">Пн–Вс: 10:00–21:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© 2024 Amor Skincare. Все права защищены.</div>
          <div className="flex items-center gap-1">
            Сделано с <Heart className="h-3 w-3 text-primary fill-primary mx-0.5" /> для красоты
          </div>
        </div>
      </div>
    </footer>
  );
}
