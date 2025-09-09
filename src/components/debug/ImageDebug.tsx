import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

export function ImageDebug() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testStorageConnection = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      addLog("🔍 Testando conexão com Supabase Storage...");
      
      // Teste 1: Listar buckets
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        addLog(`❌ Erro ao listar buckets: ${bucketsError.message}`);
        return;
      }
      
      addLog(`✅ Buckets encontrados: ${buckets?.length || 0}`);
      buckets?.forEach(bucket => {
        addLog(`  - ${bucket.id} (público: ${bucket.public})`);
      });
      
      // Teste 2: Verificar bucket professionals
      const professionalsBucket = buckets?.find(b => b.id === 'professionals');
      if (!professionalsBucket) {
        addLog("❌ Bucket 'professionals' não encontrado!");
        addLog("💡 Execute o SQL de configuração no Supabase Dashboard");
        return;
      }
      
      addLog("✅ Bucket 'professionals' encontrado!");
      
      // Teste 3: Listar arquivos no bucket
      const { data: files, error: filesError } = await supabase.storage
        .from('professionals')
        .list('photos', { limit: 5 });
      
      if (filesError) {
        addLog(`❌ Erro ao listar arquivos: ${filesError.message}`);
      } else {
        addLog(`✅ Arquivos encontrados na pasta 'photos': ${files?.length || 0}`);
        files?.forEach(file => {
          addLog(`  - ${file.name}`);
        });
      }
      
      // Teste 4: Buscar profissionais com imagens
      addLog("🔍 Buscando profissionais com imagens...");
      const { data: professionals, error: profError } = await supabase
        .from("professionals")
        .select("id, name, photo_url, banner_url")
        .limit(3);
      
      if (profError) {
        addLog(`❌ Erro ao buscar profissionais: ${profError.message}`);
      } else {
        addLog(`✅ Profissionais encontrados: ${professionals?.length || 0}`);
        professionals?.forEach(prof => {
          addLog(`  - ${prof.name}`);
          addLog(`    Foto: ${prof.photo_url || 'Não definida'}`);
          addLog(`    Banner: ${prof.banner_url || 'Não definida'}`);
        });
      }
      
    } catch (error) {
      addLog(`❌ Erro geral: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testImageUrl = async () => {
    const testUrl = prompt("Cole uma URL de imagem para testar:");
    if (!testUrl) return;
    
    addLog(`🔍 Testando URL: ${testUrl}`);
    
    try {
      const response = await fetch(testUrl, { method: 'HEAD' });
      if (response.ok) {
        addLog(`✅ URL acessível! Status: ${response.status}`);
        addLog(`Content-Type: ${response.headers.get('content-type')}`);
      } else {
        addLog(`❌ URL não acessível! Status: ${response.status}`);
      }
    } catch (error) {
      addLog(`❌ Erro ao testar URL: ${error}`);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Debug de Imagens - Diagnóstico Completo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testStorageConnection} disabled={loading}>
            {loading ? "Testando..." : "🔍 Testar Storage"}
          </Button>
          <Button onClick={testImageUrl} variant="outline">
            🖼️ Testar URL de Imagem
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Log de Testes:</h4>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">📋 Checklist de Solução:</h4>
          <ul className="text-sm space-y-1">
            <li>1. ✅ Verificar se o bucket 'professionals' existe</li>
            <li>2. ✅ Verificar se há arquivos no bucket</li>
            <li>3. ✅ Verificar se as URLs estão sendo salvas no banco</li>
            <li>4. ✅ Verificar se as URLs são acessíveis</li>
            <li>5. ✅ Verificar as políticas RLS do Supabase</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
