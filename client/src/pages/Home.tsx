import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Star, MapPin, Clock, Phone, Sparkles, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import ProductCard from "../components/ProductCard";

const LOGO_URL = "/manus-storage/amor-logo_5919afc4.jpg";
const HERO_BG_URL = "/manus-storage/skincare-hero-bg_368fb8f7.png";
const PRODUCTS_BG_URL = "/manus-storage/skincare-products_ce77bb9d.jpg";

// Floating product blobs in hero
const FLOAT_ITEMS = [
  { emoji: "🌸", size: "text-4xl", top: "15%", left: "8%", delay: "0s", duration: "5s" },
  { emoji: "✨", size: "text-2xl", top: "70%", left: "5%", delay: "1s", duration: "4s" },
  { emoji: "🌿", size: "text-3xl", top: "25%", right: "6%", delay: "0.5s", duration: "6s" },
  { emoji: "💎", size: "text-2xl", top: "75%", right: "8%", delay: "1.5s", duration: "4.5s" },
  { emoji: "🫧", size: "text-3xl", top: "50%", left: "3%", delay: "2s", duration: "5.5s" },
];

const BRANDS = ["Rorobell", "Biodance", "rom&nd", "VT", "Axis Y", "Unleashia", "Davines", "Genosys"];

const FEATURES = [
  { icon: "🛡️", title: "100% Оригинал", desc: "Только сертифицированная косметика" },
  { icon: "⭐", title: "Премиум бренды", desc: "Лучшие корейские и европейские марки" },
  { icon: "🚚", title: "Быстрая доставка", desc: "Доставка по городу или самовывоз" },
  { icon: "💳", title: "Kaspi Red", desc: "Рассрочка без переплат" },
];

function useInView(threshold = 0.15) {
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
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_BG_URL}
            alt=""
            className="w-full h-full object-cover object-center"
            style={{ filter: "brightness(0.35) saturate(0.8)" }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(135deg, oklch(0.08 0.04 10 / 0.92) 0%, oklch(0.12 0.06 15 / 0.75) 50%, oklch(0.10 0.05 10 / 0.88) 100%)"
          }} />
          {/* Subtle red glow */}
          <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, oklch(0.52 0.20 12), transparent)" }} />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
            style={{ background: "radial-gradient(circle, oklch(0.78 0.10 75), transparent)" }} />
        </div>

        {/* Floating emoji decorations */}
        {FLOAT_ITEMS.map((item, i) => (
          <div
            key={i}
            className={`absolute z-10 ${item.size} select-none pointer-events-none opacity-40`}
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
        <div className="container relative z-20 pt-24 pb-16">
          <div className="max-w-2xl">

            {/* Badge */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-6"
                style={{ background: "oklch(0.52 0.20 12 / 0.2)", border: "1px solid oklch(0.52 0.20 12 / 0.4)", color: "oklch(0.88 0.08 10)" }}>
                <Sparkles className="h-3 w-3" />
                Premium Korean & European Skincare
              </span>
            </div>

            {/* Logo + Brand name */}
            <div className="flex items-center gap-5 mb-6 animate-fade-in-up delay-100">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-lg opacity-60"
                  style={{ background: "oklch(0.52 0.20 12 / 0.5)", transform: "scale(1.3)" }} />
                <img
                  src={LOGO_URL}
                  alt="Amor Skincare Logo"
                  className="relative h-20 w-20 md:h-24 md:w-24 rounded-full object-cover border-2 shadow-2xl"
                  style={{ borderColor: "oklch(0.52 0.20 12 / 0.6)" }}
                />
              </div>
              <div>
                <h1 className="font-display text-5xl md:text-7xl font-light tracking-wider text-white leading-none">
                  AMOR
                </h1>
                <p className="text-sm md:text-base tracking-[0.3em] uppercase font-light mt-1"
                  style={{ color: "oklch(0.88 0.08 10)" }}>
                  skin care
                </p>
              </div>
            </div>

            {/* Tagline */}
            <p className="font-display text-2xl md:text-3xl font-light italic mb-4 animate-fade-in-up delay-200"
              style={{ color: "oklch(0.90 0.06 10)" }}>
              "Твой premium skincare space."
            </p>

            <p className="text-sm md:text-base leading-relaxed mb-8 animate-fade-in-up delay-300"
              style={{ color: "oklch(0.75 0.04 10)" }}>
              Откройте для себя лучшие бренды корейской и европейской косметики.<br />
              Профессиональный подбор ухода для вашей кожи.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 animate-fade-in-up delay-400">
              <Link href="/catalog">
                <button className="btn-amor flex items-center gap-2 text-sm">
                  Смотреть каталог
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <a
                href="https://wa.me/77774779779"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-250 hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  color: "white",
                  backdropFilter: "blur(10px)"
                }}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 animate-fade-in-up delay-500">
              {[
                { value: "500+", label: "Товаров" },
                { value: "5.7K", label: "Подписчиков" },
                { value: "2", label: "Магазина" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-display font-semibold text-white">{stat.value}</div>
                  <div className="text-xs tracking-wide" style={{ color: "oklch(0.65 0.04 10)" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-white/60" />
          </div>
        </div>
      </section>

      {/* ===== FEATURES STRIP ===== */}
      <section ref={featuresSection.ref} className="py-12 bg-white border-b border-rose-100/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`flex flex-col items-center text-center gap-2 transition-all duration-700 ${
                  featuresSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl mb-1">{f.icon}</div>
                <div className="font-display text-base font-semibold">{f.title}</div>
                <div className="text-xs text-muted-foreground">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section ref={productsSection.ref} className="py-20 md:py-28"
        style={{ background: "linear-gradient(180deg, white 0%, oklch(0.98 0.012 10) 100%)" }}>
        <div className="container">
          <div className={`text-center mb-14 transition-all duration-700 ${productsSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-xs tracking-[0.25em] uppercase font-medium text-primary mb-3 block">Наши товары</span>
            <h2 className="font-display text-4xl md:text-5xl font-light mb-4">
              Популярные средства
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Тщательно отобранные продукты для вашей идеальной рутины ухода
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.length > 0
              ? featuredProducts.map((product, i) => (
                  <div
                    key={product.id}
                    className={`transition-all duration-700 ${productsSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                    style={{ transitionDelay: `${i * 120}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-rose-50/50 animate-pulse h-72" />
                ))
            }
          </div>

          <div className={`text-center mt-12 transition-all duration-700 delay-500 ${productsSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <Link href="/catalog">
              <button className="btn-outline-amor flex items-center gap-2 mx-auto">
                Весь каталог
                <ChevronRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== BRANDS MARQUEE ===== */}
      <section ref={brandsSection.ref} className="py-14 overflow-hidden border-y border-rose-100/50"
        style={{ background: "linear-gradient(135deg, oklch(0.98 0.015 10), oklch(0.96 0.02 10))" }}>
        <div className="container mb-8 text-center">
          <span className="text-xs tracking-[0.25em] uppercase font-medium text-primary">Наши бренды</span>
        </div>
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10"
            style={{ background: "linear-gradient(to right, oklch(0.97 0.015 10), transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10"
            style={{ background: "linear-gradient(to left, oklch(0.97 0.015 10), transparent)" }} />

          <div className="flex gap-8 animate-marquee whitespace-nowrap" style={{
            animation: "marquee 20s linear infinite",
          }}>
            {[...BRANDS, ...BRANDS, ...BRANDS].map((brand, i) => (
              <span key={i} className="font-display text-xl md:text-2xl font-light tracking-widest text-foreground/40 hover:text-primary transition-colors duration-300 cursor-default px-4">
                {brand}
              </span>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-33.33%); }
          }
        `}</style>
      </section>

      {/* ===== STORE INFO ===== */}
      <section ref={storeSection.ref} className="py-20 md:py-28 relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img src={PRODUCTS_BG_URL} alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, white 0%, oklch(0.98 0.01 10) 100%)" }} />
        </div>

        <div className="container relative z-10">
          <div className={`text-center mb-14 transition-all duration-700 ${storeSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-xs tracking-[0.25em] uppercase font-medium text-primary mb-3 block">Где нас найти</span>
            <h2 className="font-display text-4xl md:text-5xl font-light mb-4">Наши магазины</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Store 1 */}
            <div className={`bg-white rounded-2xl p-7 border border-rose-100 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 ${storeSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "0ms" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-xl"
                style={{ background: "linear-gradient(135deg, oklch(0.52 0.20 12 / 0.12), oklch(0.52 0.20 12 / 0.05))" }}>
                🏬
              </div>
              <h3 className="font-display text-lg font-semibold mb-1">Уральск</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                ТРЦ Атриум
              </p>
            </div>

            {/* Store 2 */}
            <div className={`bg-white rounded-2xl p-7 border border-rose-100 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 ${storeSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "100ms" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-xl"
                style={{ background: "linear-gradient(135deg, oklch(0.52 0.20 12 / 0.12), oklch(0.52 0.20 12 / 0.05))" }}>
                🏬
              </div>
              <h3 className="font-display text-lg font-semibold mb-1">Аксай</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                Asia Plaza
              </p>
            </div>

            {/* Contact */}
            <div className={`rounded-2xl p-7 border shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 ${storeSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{
                transitionDelay: "200ms",
                background: "linear-gradient(135deg, oklch(0.52 0.20 12), oklch(0.42 0.18 12))",
                borderColor: "transparent"
              }}>
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-4 text-xl">
                💬
              </div>
              <h3 className="font-display text-lg font-semibold mb-3 text-white">Связаться</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  Пн–Вс: 10:00–21:00
                </div>
                <a
                  href="https://wa.me/77774779779"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white text-sm font-medium hover:text-white/80 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  +7 777 477 97 79
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, oklch(0.10 0.04 10), oklch(0.16 0.06 12))" }}>
        <div className="absolute inset-0 opacity-20">
          <img src={HERO_BG_URL} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, oklch(0.52 0.20 12), transparent)" }} />

        <div className="container relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <img src={LOGO_URL} alt="Amor Skincare" className="h-16 w-16 rounded-full object-cover border-2 border-white/20" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-4">
            Начни свой путь к идеальной коже
          </h2>
          <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">
            Более 500 товаров от лучших брендов. Профессиональная консультация бесплатно.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/catalog">
              <button className="btn-amor flex items-center gap-2">
                Перейти в каталог
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <a
              href="https://wa.me/77774779779"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white transition-all hover:scale-105"
              style={{ background: "#25D366" }}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Написать в WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
