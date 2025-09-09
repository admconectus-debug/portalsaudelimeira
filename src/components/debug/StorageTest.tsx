import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { testAndSetupStorage, testUpload } from "@/lib/test-storage";
import { uploadImage } from "@/lib/storage";

export function StorageTest() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    setLoading(true);
    setStatus("Configurando storage...");
    
    const success = await testAndSetupStorage();
    
    if (success) {
      setStatus("✅ Storage configurado com sucesso!");
    } else {
      setStatus("❌ Erro ao configurar storage. Verifique o console.");
    }
    
    setLoading(false);
  };

  const handleTestUpload = async () => {
    setLoading(true);
    setStatus("Testando upload...");
    
    const success = await testUpload();
    
    if (success) {
      setStatus("✅ Upload funcionando!");
    } else {
      setStatus("❌ Erro no upload. Verifique o console.");
    }
    
    setLoading(false);
  };

  const handleTestImageUpload = async () => {
    setLoading(true);
    setStatus("Testando upload de imagem...");
    
    try {
      // Criar uma imagem de teste
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.fillStyle = '#4F46E5';
        ctx.fillRect(0, 0, 100, 100);
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText('Test', 30, 50);
      }
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          const testImage = new File([blob], "test-image.png", { type: "image/png" });
          
          try {
            const result = await uploadImage(testImage);
            setStatus(`✅ Upload de imagem bem-sucedido! URL: ${result.url}`);
          } catch (error) {
            setStatus(`❌ Erro no upload de imagem: ${error}`);
          }
        }
        setLoading(false);
      }, 'image/png');
    } catch (error) {
      setStatus(`❌ Erro ao criar imagem de teste: ${error}`);
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Teste de Storage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button 
            onClick={handleSetup} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Configurando..." : "1. Configurar Storage"}
          </Button>
          
          <Button 
            onClick={handleTestUpload} 
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            {loading ? "Testando..." : "2. Testar Upload Básico"}
          </Button>
          
          <Button 
            onClick={handleTestImageUpload} 
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            {loading ? "Testando..." : "3. Testar Upload de Imagem"}
          </Button>
        </div>
        
        {status && (
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm">{status}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
