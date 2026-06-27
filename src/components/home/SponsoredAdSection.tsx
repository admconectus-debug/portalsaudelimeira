import { useEffect, useState } from "react";
import { Dumbbell, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface GymAd {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
}

export const SponsoredAdSection = () => {
  const [ads, setAds] = useState<GymAd[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("gym_ads")
        .select("id, title, description, image_url, link_url")
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (data) setAds(data);
    })();
  }, []);

  if (ads.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">
            Patrocinado
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-medium text-center mb-12 uppercase tracking-wider text-primary">
          Academias Parceiras
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {ads.map((ad) => {
            const card = (
              <div className="group rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:shadow-lg transition-all h-full flex flex-col">
                {ad.image_url && (
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={ad.image_url}
                      alt={ad.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-2">{ad.title}</h3>
                  {ad.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                      {ad.description}
                    </p>
                  )}
                  {ad.link_url && (
                    <Button variant="outline" size="sm" className="self-start">
                      Saiba mais <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            );
            return ad.link_url ? (
              <a
                key={ad.id}
                href={ad.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {card}
              </a>
            ) : (
              <div key={ad.id}>{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
