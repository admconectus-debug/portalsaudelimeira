import { MapPin } from "lucide-react";

interface MapEmbedProps {
  address: string;
  className?: string;
}

const MapEmbed = ({ address, className = "" }: MapEmbedProps) => {
  const encodedAddress = encodeURIComponent(address);
  const mapSrc = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

  return (
    <div className={`rounded-lg overflow-hidden border border-border ${className}`}>
      <div className="flex items-center gap-2 px-4 py-2 bg-muted/50">
        <MapPin className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Como Chegar</span>
      </div>
      <iframe
        src={mapSrc}
        width="100%"
        height="300"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Mapa - ${address}`}
      />
    </div>
  );
};

export default MapEmbed;
