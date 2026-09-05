import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import bannerFixo from "@/assets/banner-fixo.png.asset.json";
import bannerFixoMobile from "@/assets/banner-fixo-mobile.png.asset.json";
import bannerOdonto from "@/assets/banner-odonto.png.asset.json";
import bannerOdontoMobile from "@/assets/banner-odonto-mobile.png.asset.json";
import bannerMedicos from "@/assets/banner-medicos.png.asset.json";
import bannerMedicosMobile from "@/assets/banner-medicos-mobile.png.asset.json";

const slides = [
  {
    desktop: bannerFixo.url,
    mobile: bannerFixoMobile.url,
    alt: "Vivax Saúde - Portal de busca de profissionais e serviços",
  },
  {
    desktop: bannerOdonto.url,
    mobile: bannerOdontoMobile.url,
    alt: "Saúde Odontológica - Dentistas qualificados para cuidar do seu sorriso",
  },
  {
    desktop: bannerMedicos.url,
    mobile: bannerMedicosMobile.url,
    alt: "Médicos Especialistas - Profissionais de saúde de confiança",
  },
];

export function BannerSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const goTo = (index: number) => setCurrent(index);
  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);
  const next = () => setCurrent((p) => (p + 1) % slides.length);

  return (
    <div className="relative w-full overflow-hidden bg-primary group">
      {/* Desktop slides */}
      <div className="hidden md:block relative w-full aspect-[1599/499] max-h-[50vh]">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide.desktop}
            alt={slide.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Mobile slides */}
      <div className="md:hidden relative w-full aspect-[1080/1350] max-h-[70vh]">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide.mobile}
            alt={slide.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label="Banner anterior"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 hover:bg-black/50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        aria-label="Próximo banner"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 hover:bg-black/50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            aria-label={`Ir para banner ${index + 1}`}
            className={`h-2 rounded-full transition-all ${
              index === current ? "bg-white w-6" : "bg-white/50 hover:bg-white/75 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
