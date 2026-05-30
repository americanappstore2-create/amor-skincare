import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, MapPin, Clock, Sparkles, ChevronRight, Star } from "lucide-react";
import { trpc } from "@/lib/trpc";
import ProductCard from "../components/ProductCard";

const LOGO_URL = "/manus-storage/amor-logo_5919afc4.jpg";
const HERO_BG_URL = "/manus-storage/skincare-hero-bg_368fb8f7.png";
const PRODUCTS_BG_URL = "/manus-storage/skincare-products_ce77bb9d.jpg";

// Only subtle, non-plant decorations
const FLOAT_ITEMS = [
  { emoji: "🌸", size: "text-4xl", top: "18%", left: "7%", delay: "0s", duration: "5s" },
  { emoji: "✨", size: "text-2xl", top: "68%", left: "6%", delay: "1s", duration: "4s" },
  { emoji: "💎", size: "text-2xl", top: "22%", right: "7%", delay: "0.5s", duration: "6s" },
  { emoji: "🫧", size: "text-3xl", top: "72%", right: "9%", delay: "1.5s", duration: "4.5s" },
];

const BRANDS = ["Rorobell", "Biodance", "rom&nd", "VT", "Axis Y", "Unleashia", "Davines", "Genosys"];

const FEATURES = [
  { icon: "🛡️", title: "100% Оригинал", desc: "Только сертифицированная косметика" },
  { icon: "⭐", title: "Премиум бренды", desc: "Лучшие корейские и европейские марки" },
  { icon: "🚚", title: "Быстрая доставка", desc: "Доставка по городу или самовывоз" },
  { icon: "💳", title: "Kaspi Red", desc: "Рассрочка без переплат" },
];

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// WhatsApp SVG icon
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export default function Home() {
  const { data: products } = trpc.products.list.useQuery({ category: "all" });
  const featuredProducts = products?.slice(0, 4) ?? [];

  const featuresSection = useInView();
  const productsSection = useInView();
  const brandsSection = useInView();
  const storeSection = useInView();

  return (
    <div className="overflow-x-hidden">

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_BG_URL}
            alt=""
            className="w-full h-full object-cover object-center"
            style={{ filter: "brightness(0.30) saturate(0.75)" }}
          />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(135deg, oklch(0.07 0.04 10 / 0.95) 0%, oklch(0.12 0.06 15 / 0.70) 60%, oklch(0.09 0.05 10 / 0.90) 100%)"
          }} />
          {/* Subtle red glow */}
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, oklch(0.52 0.20 12), transparent)" }} />
          <div className="absolute bottom-1/4 left-1/5 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, oklch(0.78 0.10 75), transparent)" }} />
        </div>

        {/* Floating decorations — no plant */}
        {FLOAT_ITEMS.map((item, i) => (
          <div
            key={i}
            className={`absolute z-10 ${item.size} select-none pointer-events-none opacity-30`}
            style={{
              top: item.top,
              left: item.left,
              right: (item as any).right,
              animation: `floatY ${item.duration} ease-in-out infinite`,
              animationDelay: item.delay,
            }}
          >
            {item.emoji}
          </div>
        ))}

        {/* Hero content */}
        <div className="container relative z-20 pt-28 pb-20">
          <div className="max-w-2xl">

            {/* Eyebrow badge */}
            <div className="animate-fade-in-up mb-7" style={{ animationDelay: "0.05s" }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-medium tracking-[0.16em] uppercase"
                style={{
                  background: "oklch(0.52 0.20 12 / 0.18)",
                  border: "1px solid oklch(0.52 0.20 12 / 0.45)",
                  color: "oklch(0.90 0.06 10)"
                }}>
                <Sparkles className="h-3 w-3" />
                Premium Korean &amp; European Skincare
              </span>
            </div>

            {/* Logo + Brand name row */}
            <div className="flex items-center gap-5 mb-7 animate-fade-in-up delay-100">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full blur-xl opacity-50"
                  style={{ background: "oklch(0.52 0.20 12 / 0.6)", transform: "scale(1.4)" }} />
                <img
                  src={LOGO_URL}
                  alt="Amor Skincare Logo"
                  className="relative rounded-full shadow-2xl"
                  style={{
                    height: "90px",
                    width: "90px",
                    objectFit: "contain",
                    background: "white",
                    border: "2.5px solid oklch(0.52 0.20 12 / 0.55)"
                  }}
                />
              </div>
              <div>
                <h1 className="font-display text-white leading-none"
                  style={{ fontSize: "clamp(3rem, 9vw, 5.8rem)", fontWeight: 400, letterSpacing: "0.10em" }}>
                  AMOR
                </h1>
                <p className="font-sans uppercase mt-1"
                  style={{ fontSize: "clamp(0.62rem, 1.4vw, 0.78rem)", letterSpacing: "0.24em", fontWeight: 400, color: "oklch(0.82 0.06 10)" }}>
                  skin care
                </p>
              </div>
            </div>

            {/* Tagline */}
            <p className="font-display italic mb-3 animate-fade-in-up delay-200"
              style={{ fontSize: "clamp(1.25rem, 3.2vw, 1.9rem)", fontWeight: 400, lineHeight: 1.4, color: "oklch(0.92 0.05 10)" }}>
              "Твой premium skincare space."
            </p>

            <p className="font-sans leading-relaxed mb-10 animate-fade-in-up delay-300"
              style={{ fontSize: "clamp(0.875rem, 1.8vw, 1rem)", color: "oklch(0.68 0.04 10)", maxWidth: "480px" }}>
              Откройте для себя лучшие бренды корейской и европейской косметики.
              Профессиональный подбор ухода для вашей кожи.
            </p>

            {/* CTA Buttons — elegant, premium style */}
            <div className="flex flex-wrap gap-3 animate-fade-in-up delay-400">
              {/* Primary CTA */}
              <Link href="/catalog">
                <button
                  className="group inline-flex items-center gap-2.5 font-sans font-medium transition-all duration-300"
                  style={{
                    background: "white",
                    color: "oklch(0.13 0.02 10)",
                    padding: "0.85rem 2rem",
                    borderRadius: "100px",
                    fontSize: "0.875rem",
                    letterSpacing: "0.02em",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.35)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.25)";
                  }}
                >
                  Смотреть каталог
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/77774779779"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 font-sans font-medium transition-all duration-300"
                style={{
                  background: "transparent",
                  color: "white",
                  padding: "0.85rem 2rem",
                  borderRadius: "100px",
                  fontSize: "0.875rem",
                  letterSpacing: "0.02em",
                  border: "1.5px solid rgba(255,255,255,0.45)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.70)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.45)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                }}
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-10 mt-14 animate-fade-in-up delay-500">
              {[
                { value: "500+", label: "Товаров" },
                { value: "5.7K", label: "Подписчиков" },
                { value: "2", label: "Магазина" },
              ].map((stat, i) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="font-display text-white" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2rem)", fontWeight: 400, lineHeight: 1 }}>
                    {stat.value}
                  </span>
                  <span className="font-sans mt-1" style={{ fontSize: "0.72rem", letterSpacing: "0.08em", color: "oklch(0.58 0.04 10)", textTransform: "uppercase" }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subtle bottom fade — no mouse cursor */}
        <div className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to top, oklch(0.99 0.005 10), transparent)" }} />
      </section>

      {/* ===== FEATURES STRIP ===== */}
      <section ref={featuresSection.ref} className="py-14 bg-white border-b border-rose-100/40">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`flex flex-col items-center text-center gap-3 transition-all duration-700 ${
                  featuresSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="text-3xl">{f.icon}</div>
                <div className="font-sans text-sm font-semibold text-foreground">{f.title}</div>
                <div className="font-sans text-xs text-muted-foreground leading-snug">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section ref={productsSection.ref} className="py-20 md:py-28"
        style={{ background: "linear-gradient(180deg, white 0%, oklch(0.985 0.008 10) 100%)" }}>
        <div className="container">
          <div className={`text-center mb-14 transition-all duration-700 ${productsSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-eyebrow text-primary mb-3 block">Наши товары</span>
            <h2 className="font-display mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 400, lineHeight: 1.15 }}>
              Популярные средства
            </h2>
            <p className="font-sans text-muted-foreground max-w-md mx-auto" style={{ fontSize: "0.9rem", lineHeight: 1.65 }}>
              Тщательно отобранные продукты для вашей идеальной рутины ухода
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.length > 0
              ? featuredProducts.map((product, i) => (
                  <div
                    key={product.id}
                    className={`transition-all duration-700 ${productsSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-rose-50/50 animate-pulse" style={{ height: "320px" }} />
                ))
            }
          </div>

          <div className={`text-center mt-12 transition-all duration-700 ${productsSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "400ms" }}>
            <Link href="/catalog">
              <button
                className="group inline-flex items-center gap-2 font-sans font-medium transition-all duration-300"
                style={{
                  background: "transparent",
                  color: "oklch(0.50 0.20 12)",
                  padding: "0.8rem 2rem",
                  borderRadius: "100px",
                  fontSize: "0.875rem",
                  border: "1.5px solid oklch(0.50 0.20 12)",
                  letterSpacing: "0.02em",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.50 0.20 12)";
                  (e.currentTarget as HTMLButtonElement).style.color = "white";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px oklch(0.50 0.20 12 / 0.28)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.50 0.20 12)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                }}
              >
                Весь каталог
                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== BRANDS MARQUEE ===== */}
      <section ref={brandsSection.ref} className="py-14 overflow-hidden border-y border-rose-100/40"
        style={{ background: "oklch(0.985 0.01 10)" }}>
        <div className="container mb-8 text-center">
          <span className="text-eyebrow text-primary/70">Наши бренды</span>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, oklch(0.985 0.01 10), transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, oklch(0.985 0.01 10), transparent)" }} />

          <div className="flex gap-8 whitespace-nowrap" style={{ animation: "marquee 22s linear infinite" }}>
            {[...BRANDS, ...BRANDS, ...BRANDS].map((brand, i) => (
              <span key={i}
                className="font-display cursor-default px-4 transition-colors duration-300 hover:text-primary"
                style={{ fontSize: "clamp(1rem, 2.2vw, 1.4rem)", fontWeight: 400, letterSpacing: "0.12em", color: "oklch(0.55 0.04 10)" }}>
                {brand}
              </span>
            ))}
          </div>
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }`}</style>
      </section>

      {/* ===== STORE INFO ===== */}
      <section ref={storeSection.ref} className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img src={PRODUCTS_BG_URL} alt="" className="w-full h-full object-cover opacity-[0.04]" />
        </div>

        <div className="container relative z-10">
          <div className={`text-center mb-14 transition-all duration-700 ${storeSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-eyebrow text-primary mb-3 block">Где нас найти</span>
            <h2 className="font-display mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 400, lineHeight: 1.15 }}>
              Наши магазины
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {/* Store 1 */}
            <div className={`bg-white rounded-2xl p-7 border border-rose-100 shadow-sm hover:shadow-lg transition-all duration-400 hover:-translate-y-1 ${storeSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "0ms" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 text-xl"
                style={{ background: "oklch(0.96 0.025 10)" }}>
                🏬
              </div>
              <h3 className="font-display mb-2" style={{ fontSize: "1.2rem", fontWeight: 500 }}>Уральск</h3>
              <p className="font-sans text-sm text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                ТРЦ Атриум
              </p>
            </div>

            {/* Store 2 */}
            <div className={`bg-white rounded-2xl p-7 border border-rose-100 shadow-sm hover:shadow-lg transition-all duration-400 hover:-translate-y-1 ${storeSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "80ms" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 text-xl"
                style={{ background: "oklch(0.96 0.025 10)" }}>
                🏬
              </div>
              <h3 className="font-display mb-2" style={{ fontSize: "1.2rem", fontWeight: 500 }}>Аксай</h3>
              <p className="font-sans text-sm text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                Asia Plaza
              </p>
            </div>

            {/* Contact card */}
            <div className={`rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all duration-400 hover:-translate-y-1 ${storeSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{
                transitionDelay: "160ms",
                background: "linear-gradient(135deg, oklch(0.50 0.20 12), oklch(0.40 0.18 12))",
              }}>
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center mb-5 text-xl">
                💬
              </div>
              <h3 className="font-display text-white mb-4" style={{ fontSize: "1.2rem", fontWeight: 500 }}>Связаться</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-sans text-white/75 text-sm">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  Пн–Вс: 10:00–21:00
                </div>
                <a
                  href="https://wa.me/77774779779"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-sans text-white text-sm font-medium hover:text-white/80 transition-colors"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5 shrink-0" />
                  +7 777 477 97 79
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, oklch(0.09 0.04 10), oklch(0.15 0.06 12))" }}>
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <img src={HERO_BG_URL} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, oklch(0.52 0.20 12), transparent)" }} />

        <div className="container relative z-10 text-center">
          <div className="flex justify-center mb-7">
            <img src={LOGO_URL} alt="Amor Skincare" className="rounded-full object-contain border-2 border-white/20"
              style={{ height: "72px", width: "72px", background: "white" }} />
          </div>
          <h2 className="font-display text-white mb-4"
            style={{ fontSize: "clamp(1.8rem, 5vw, 3.2rem)", fontWeight: 400, lineHeight: 1.2 }}>
            Начни свой путь к идеальной коже
          </h2>
          <p className="font-sans mb-10 max-w-md mx-auto"
            style={{ fontSize: "0.9rem", lineHeight: 1.65, color: "rgba(255,255,255,0.55)" }}>
            Более 500 товаров от лучших брендов. Профессиональная консультация бесплатно.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/catalog">
              <button
                className="group inline-flex items-center gap-2.5 font-sans font-medium transition-all duration-300"
                style={{
                  background: "white",
                  color: "oklch(0.13 0.02 10)",
                  padding: "0.9rem 2.2rem",
                  borderRadius: "100px",
                  fontSize: "0.875rem",
                  letterSpacing: "0.02em",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)";
                }}
              >
                Перейти в каталог
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>
            <a
              href="https://wa.me/77774779779"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 font-sans font-medium transition-all duration-300"
              style={{
                background: "#25D366",
                color: "white",
                padding: "0.9rem 2.2rem",
                borderRadius: "100px",
                fontSize: "0.875rem",
                letterSpacing: "0.02em",
                boxShadow: "0 4px 20px rgba(37,211,102,0.35)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 28px rgba(37,211,102,0.45)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(37,211,102,0.35)";
              }}
            >
              <WhatsAppIcon className="h-4 w-4" />
              Написать в WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
