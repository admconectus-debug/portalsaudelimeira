import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dumbbell, Leaf, HeartHandshake, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import wellnessImage from "@/assets/wellness-fitness.jpg";
import gymImage from "@/assets/wellness-gym.jpg";
import personalImage from "@/assets/wellness-personal.jpg";
import pilatesImage from "@/assets/wellness-pilates.jpg";

const slides = [
  { src: gymImage, alt: "Academia moderna com equipamentos" },
  { src: personalImage, alt: "Personal trainer com aluno" },
  { src: pilatesImage, alt: "Aula de pilates em estúdio" },
  { src: wellnessImage, alt: "Aula de yoga e bem-estar" },
];

const items = [
  { icon: Dumbbell, title: "Fitness & Personal", desc: "Treinos personalizados e educação física." },
  { icon: Leaf, title: "Terapias Integrativas", desc: "Acupuntura, reiki, aromaterapia e mais." },
  { icon: HeartHandshake, title: "Saúde Mental", desc: "Psicologia, mindfulness e meditação." },
  { icon: Sparkles, title: "Bem-estar", desc: "Yoga, pilates e nutrição funcional." },
];

export const WellnessSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/10">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-xl order-2 lg:order-1">
            <img
              src={wellnessImage}
              alt="Profissionais de bem-estar e terapias integrativas"
              loading="lazy"
              width={1280}
              height={832}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent" />
          </div>

          <div className="order-1 lg:order-2">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              Saúde além do consultório
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Cuidar de você é movimento, equilíbrio e bem-estar
            </h2>
            <p className="text-muted-foreground mb-8">
              Vá além da medicina tradicional. Conecte-se com profissionais de fitness,
              terapias integrativas e práticas que promovem saúde de corpo e mente.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {items.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button asChild size="lg">
              <Link to="/especialidades">
                Explorar especialidades
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
