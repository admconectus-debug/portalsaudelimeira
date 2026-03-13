import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  title: string;
  text?: string;
  className?: string;
  size?: "sm" | "md";
}

const ShareButton = ({ title, text, className = "", size = "md" }: ShareButtonProps) => {
  const { toast } = useToast();

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = { title, text: text || title, url };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copiado!",
          description: "O link foi copiado para a área de transferência.",
        });
      } catch {
        toast({
          title: "Erro",
          description: "Não foi possível copiar o link.",
          variant: "destructive",
        });
      }
    }
  };

  const sizeClasses = size === "sm" 
    ? "w-10 h-10" 
    : "w-12 h-12";
  const iconSize = size === "sm" ? "w-5 h-5" : "w-6 h-6";

  return (
    <button
      onClick={handleShare}
      title="Compartilhar"
      className={`${sizeClasses} rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center hover:scale-110 transition-all shadow-lg ${className}`}
    >
      <Share2 className={`${iconSize} text-foreground`} />
    </button>
  );
};

export default ShareButton;
