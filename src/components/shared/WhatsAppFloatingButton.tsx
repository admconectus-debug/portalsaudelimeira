import { MessageCircle } from "lucide-react";

interface WhatsAppFloatingButtonProps {
  phone: string;
  message?: string;
}

const WhatsAppFloatingButton = ({ phone, message = "Olá! Encontrei seu contato no Portal Saúde Limeira e gostaria de mais informações." }: WhatsAppFloatingButtonProps) => {
  const phoneNumber = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      title="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 animate-bounce"
      style={{ animationDuration: '2s', animationIterationCount: '3' }}
    >
      <MessageCircle className="w-8 h-8 text-white" />
    </a>
  );
};

export default WhatsAppFloatingButton;
