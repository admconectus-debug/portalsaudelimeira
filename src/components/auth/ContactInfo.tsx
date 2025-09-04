import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, Mail, MessageCircle, Lock, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";

interface ContactInfo {
  id: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
}

interface ContactInfoProps {
  professionalId: string;
  professionalName: string;
}

export function ContactInfo({ professionalId, professionalName }: ContactInfoProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchContactInfo();
    } else {
      setLoading(false);
    }
  }, [session, professionalId]);

  const fetchContactInfo = async () => {
    try {
      const { data, error } = await supabase.rpc('get_professional_contact', {
        professional_id: professionalId
      });

      if (error) throw error;

      if (data && data.length > 0) {
        setContactInfo(data[0]);
      } else {
        setError("Informações de contato não encontradas");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    if (contactInfo?.whatsapp) {
      const message = encodeURIComponent(
        `Olá ${professionalName}, encontrei seu contato no portal Saúde Connect e gostaria de agendar uma consulta.`
      );
      const phoneNumber = contactInfo.whatsapp.replace(/\D/g, '');
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }
  };

  const handlePhoneClick = () => {
    if (contactInfo?.phone) {
      window.open(`tel:${contactInfo.phone}`, '_self');
    }
  };

  const handleEmailClick = () => {
    if (contactInfo?.email) {
      window.open(`mailto:${contactInfo.email}`, '_self');
    }
  };

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            Informações de Contato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <LogIn className="h-4 w-4" />
            <AlertDescription>
              Para visualizar as informações de contato deste profissional, você precisa fazer login.
              Isso protege os profissionais contra spam e uso indevido de seus dados.
            </AlertDescription>
          </Alert>
          <Button asChild className="w-full mt-4">
            <Link to="/auth">Fazer Login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Informações de Contato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">Carregando informações de contato...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !contactInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Informações de Contato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              {error || "Não foi possível carregar as informações de contato."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Informações de Contato
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* WhatsApp */}
        {contactInfo.whatsapp && (
          <Button
            onClick={handleWhatsAppClick}
            size="lg"
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            WhatsApp: {contactInfo.whatsapp}
          </Button>
        )}

        {/* Phone */}
        {contactInfo.phone && (
          <Button
            onClick={handlePhoneClick}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <Phone className="h-5 w-5 mr-2" />
            Telefone: {contactInfo.phone}
          </Button>
        )}

        {/* Email */}
        {contactInfo.email && (
          <Button
            onClick={handleEmailClick}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <Mail className="h-5 w-5 mr-2" />
            E-mail
          </Button>
        )}

        {!contactInfo.whatsapp && !contactInfo.phone && !contactInfo.email && (
          <Alert>
            <AlertDescription>
              Este profissional não cadastrou informações de contato públicas.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}