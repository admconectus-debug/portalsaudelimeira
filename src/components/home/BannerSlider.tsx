import bannerVivax from "@/assets/banner-vivax.jpg.asset.json";

export function BannerSlider() {
  return (
    <div className="relative w-full overflow-hidden bg-primary">
      <div className="relative w-full aspect-[1599/499] max-h-[50vh]">
        <img
          src={bannerVivax.url}
          alt="Vivax Saúde - Portal de busca de profissionais e serviços de saúde"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
