import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { ArrowRight, MapPin, Phone, Clock, Star, Sparkles, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import ProductCard from "../components/ProductCard";

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function Home() {
  useScrollReveal();
  const { data: products } = trpc.products.list.useQuery({});

  const featuredProducts = products?.slice(0, 4) ?? [];

  return (
    <div className="pt-16 md:pt-20">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden hero-gradient">
        {/* Decorative blobs */}
        <div
          className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.14 10), transparent)" }}
        />
        <div
          className="absolute bottom-20 left-10 w-56 h-56 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, oklch(0.78 0.1 55), transparent)" }}
        />

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="space-y-6">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-primary border border-primary/20 bg-white/80 animate-fade-in"
              >
                <Sparkles className="h-3 w-3" />
                Premium Korean & European Skincare
              </div>

              <div className="animate-fade-in-up delay-100">
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="gradient-text">Amor</span>
                  <br />
                  <span className="text-foreground">Skincare</span>
                </h1>
              </div>

              <p className="text-xl md:text-2xl font-display italic text-foreground/70 animate-fade-in-up delay-200">
                "Твой premium skincare space."
              </p>

              <p className="text-base text-muted-foreground max-w-md leading-relaxed animate-fade-in-up delay-300">
                Откройте для себя лучшие бренды корейской и европейской косметики. Профессиональный подбор ухода для вашей кожи.
              </p>

              <div className="flex flex-wrap gap-3 animate-fade-in-up delay-400">
                <Link href="/catalog">
                  <Button
                    size="lg"
                    className="rounded-full px-8 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{ background: "linear-gradient(135deg, oklch(0.58 0.18 10), oklch(0.72 0.14 10))" }}
                  >
                    Смотреть каталог
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="https://wa.me/7774779779" target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 font-medium border-primary/30 text-primary hover:bg-rose-50"
                  >
                    Написать в WhatsApp
                  </Button>
                </a>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 pt-2 animate-fade-in-up delay-500">
                {[
                  { value: "500+", label: "Товаров" },
                  { value: "5.7K", label: "Подписчиков" },
                  { value: "2", label: "Магазина" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="font-display text-2xl font-bold gradient-text">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Logo + floating image */}
            <div className="hidden lg:flex justify-center items-center relative">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-3xl opacity-40"
                  style={{ background: "radial-gradient(circle, oklch(0.85 0.08 15), transparent)" }}
                />
                <img
                  src="/manus-storage/logo_54158ea0.png"
                  alt="Amor Skincare"
                  className="relative z-10 w-72 h-72 object-contain animate-logo-entrance animate-float"
                />
              </div>
              {/* Floating product cards */}
              <div className="absolute top-0 right-0 bg-white rounded-2xl shadow-xl p-3 animate-fade-in delay-600 animate-float" style={{ animationDelay: "0.5s" }}>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl overflow-hidden">
                    <img src="/manus-storage/product_serum_a7d386b3.jpg" alt="" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Hydra Glow Serum</div>
                    <div className="text-xs text-primary font-bold">8 900 ₸</div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-10 left-0 bg-white rounded-2xl shadow-xl p-3 animate-fade-in delay-700 animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <div className="text-xs font-semibold">Kaspi Red доступен</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Shield className="h-6 w-6" />, title: "Оригинальная косметика", desc: "100% оригинальные товары" },
              { icon: <Star className="h-6 w-6" />, title: "Премиум бренды", desc: "Лучшие мировые бренды" },
              { icon: <Truck className="h-6 w-6" />, title: "Доставка по городу", desc: "Быстрая доставка" },
              { icon: <Phone className="h-6 w-6" />, title: "Kaspi Red", desc: "Рассрочка без %%" },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className={`reveal text-center p-4 rounded-2xl bg-rose-50/50 hover:bg-rose-50 transition-colors`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-3 text-primary">
                  {feature.icon}
                </div>
                <div className="text-sm font-semibold text-foreground">{feature.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-12 reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-primary border border-primary/20 bg-rose-50 mb-4">
              <Sparkles className="h-3 w-3" />
              Популярные товары
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Хиты продаж
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Самые любимые средства наших покупателей
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.length > 0
              ? featuredProducts.map((product, i) => (
                  <div key={product.id} className="reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden">
                    <div className="skeleton aspect-product" />
                    <div className="p-3 space-y-2">
                      <div className="skeleton h-4 rounded w-3/4" />
                      <div className="skeleton h-3 rounded w-1/2" />
                      <div className="skeleton h-5 rounded w-1/3" />
                    </div>
                  </div>
                ))}
          </div>

          <div className="text-center mt-10 reveal">
            <Link href="/catalog">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-10 border-primary/30 text-primary hover:bg-rose-50"
              >
                Весь каталог
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== BRANDS ===== */}
      <section className="py-12 bg-rose-50/40">
        <div className="container">
          <div className="text-center mb-8 reveal">
            <h2 className="font-display text-2xl font-bold text-foreground">Наши бренды</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3 reveal">
            {["Rorobell", "Biodance", "Axis Y", "Unleashia", "rom&nd", "VT", "Davines", "Genosys", "Angiopharm", "Embrace"].map((brand) => (
              <Link
                key={brand}
                href={`/catalog`}
                className="px-5 py-2 rounded-full bg-white border border-rose-100 text-sm font-medium text-foreground hover:border-primary hover:text-primary hover:shadow-sm transition-all duration-200"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STORE INFO ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12 reveal">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Наши магазины</h2>
            <p className="text-muted-foreground mt-2">Приходите к нам лично или закажите онлайн</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                city: "Уральск",
                address: "ТРЦ Атриум",
                fullAddress: "Уральск — ТРЦ Атриум",
              },
              {
                city: "Аксай",
                address: "Asia Plaza",
                fullAddress: "Аксай — Asia Plaza",
              },
            ].map((store, i) => (
              <div
                key={store.city}
                className="reveal bg-gradient-to-br from-rose-50 to-white rounded-3xl p-8 border border-rose-100 hover:shadow-lg transition-shadow duration-300"
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-1">{store.city}</h3>
                <p className="text-muted-foreground text-sm mb-4">{store.address}</p>
                <div className="flex items-center gap-2 text-sm text-foreground/70">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Пн–Вс: 10:00–21:00</span>
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <div className="mt-12 text-center reveal">
            <div className="inline-block bg-gradient-to-br from-rose-50 to-white rounded-3xl p-8 border border-rose-100 max-w-md">
              <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Нужна консультация?</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Напишите нам в WhatsApp — поможем подобрать уход для вашей кожи
              </p>
              <a href="https://wa.me/7774779779" target="_blank" rel="noopener noreferrer">
                <Button
                  className="rounded-full px-8 bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  +7 777 477 97 79
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HERO BANNER ===== */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img
          src="/manus-storage/store_interior_ebd61c00.jpg"
          alt="Amor Skincare Store"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20 flex items-center">
          <div className="container">
            <div className="max-w-lg text-white">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
                Твой premium skincare space
              </h2>
              <p className="text-white/80 mb-5 text-sm md:text-base">
                Более 500 товаров от лучших мировых брендов
              </p>
              <Link href="/catalog">
                <Button className="rounded-full bg-white text-primary hover:bg-rose-50 font-medium">
                  Перейти в каталог
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
