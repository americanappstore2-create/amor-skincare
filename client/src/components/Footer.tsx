import { Link } from "wouter";
import { MapPin, Clock, Instagram, Heart } from "lucide-react";

const LOGO_URL = "/manus-storage/amor-logo_5919afc4.jpg";

export default function Footer() {
  return (
    <footer style={{ background: "linear-gradient(135deg, oklch(0.10 0.04 10), oklch(0.14 0.05 12))" }}>
      <div className="container py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-md opacity-40"
                  style={{ background: "oklch(0.52 0.20 12)", transform: "scale(1.4)" }} />
                <img
                  src={LOGO_URL}
                  alt="Amor Skincare"
                  className="relative h-14 w-14 rounded-full object-cover border-2"
                  style={{ borderColor: "oklch(0.52 0.20 12 / 0.5)" }}
                />
              </div>
              <div>
                <div className="font-display text-2xl font-light tracking-wider text-white">AMOR</div>
                <div className="text-xs tracking-[0.2em] uppercase font-light"
                  style={{ color: "oklch(0.65 0.08 10)" }}>skin care</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "oklch(0.60 0.04 10)" }}>
              "Твой premium skincare space." — Премиальная корейская и европейская косметика.
              Профессиональный подбор ухода для вашей кожи.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/amor.skincare.kz/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #E1306C, #833AB4, #F77737)",
                  color: "white",
                }}
              >
                <Instagram className="h-3.5 w-3.5" />
                @amor.skincare.kz
              </a>
              <a
                href="https://wa.me/77774779779"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all hover:scale-105"
                style={{ background: "#25D366", color: "white" }}
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-4">
            <h3 className="font-display text-base font-semibold text-white/90">Магазины</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-2.5">
                <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "oklch(0.52 0.20 12 / 0.2)" }}>
                  <MapPin className="h-3.5 w-3.5" style={{ color: "oklch(0.75 0.12 12)" }} />
                </div>
                <div>
                  <div className="text-sm font-medium text-white/80">Уральск</div>
                  <div className="text-xs" style={{ color: "oklch(0.55 0.04 10)" }}>ТРЦ Атриум</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "oklch(0.52 0.20 12 / 0.2)" }}>
                  <MapPin className="h-3.5 w-3.5" style={{ color: "oklch(0.75 0.12 12)" }} />
                </div>
                <div>
                  <div className="text-sm font-medium text-white/80">Аксай</div>
                  <div className="text-xs" style={{ color: "oklch(0.55 0.04 10)" }}>Asia Plaza</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hours & Nav */}
          <div className="space-y-4">
            <h3 className="font-display text-base font-semibold text-white/90">Информация</h3>
            <div className="flex items-start gap-2.5">
              <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: "oklch(0.52 0.20 12 / 0.2)" }}>
                <Clock className="h-3.5 w-3.5" style={{ color: "oklch(0.75 0.12 12)" }} />
              </div>
              <div>
                <div className="text-sm font-medium text-white/80">Режим работы</div>
                <div className="text-xs" style={{ color: "oklch(0.55 0.04 10)" }}>Пн–Вс: 10:00–21:00</div>
              </div>
            </div>
            <div className="space-y-2 pt-1">
              <Link href="/catalog">
                <div className="text-sm transition-colors cursor-pointer hover:text-white" style={{ color: "oklch(0.55 0.04 10)" }}>
                  Каталог товаров
                </div>
              </Link>
              <Link href="/cart">
                <div className="text-sm transition-colors cursor-pointer hover:text-white" style={{ color: "oklch(0.55 0.04 10)" }}>
                  Корзина
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: "1px solid oklch(0.25 0.03 10)", color: "oklch(0.45 0.03 10)" }}>
          <div>© 2025 Amor Skincare. Все права защищены.</div>
          <div className="flex items-center gap-1">
            Сделано с <Heart className="h-3 w-3 mx-0.5" style={{ color: "oklch(0.52 0.20 12)", fill: "oklch(0.52 0.20 12)" }} /> для красоты
          </div>
        </div>
      </div>
    </footer>
  );
}
