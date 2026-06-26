import { useEffect, useState } from "react";
import { Dumbbell, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface GymAd {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
}

const GymAdSection = () => {
  const [ad, setAd] = useState<GymAd | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("gym_ads")
        .select("id, title, description, image_url, link_url")
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) setAd(data);
    })();
  }, []);

  if (!ad) return null;

  const content = (
    <div className="rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:shadow-lg transition-shadow">
      {ad.image_url && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={ad.image_url}
            alt={ad.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wide">
            Patrocinado
          </span>
        </div>
        <h3 className="font-bold text-base mb-1">{ad.title}</h3>
        {ad.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">{ad.description}</p>
        )}
        {ad.link_url && (
          <span className="inline-flex items-center text-sm text-primary font-medium mt-2">
            Saiba mais <ExternalLink className="w-3 h-3 ml-1" />
          </span>
        )}
      </div>
    </div>
  );

  return ad.link_url ? (
    <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    content
  );
};

export default GymAdSection;
