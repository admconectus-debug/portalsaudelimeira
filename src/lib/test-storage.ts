import { supabase } from "@/integrations/supabase/client";

// Função para testar se o bucket existe e criar se necessário
export async function testAndSetupStorage() {
  try {
    // Verificar se o bucket existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Erro ao listar buckets:", listError);
      return false;
    }

    const professionalsBucket = buckets?.find(bucket => bucket.id === 'professionals');
    
    if (!professionalsBucket) {
      console.log("Bucket 'professionals' não encontrado. Criando...");
      
      // Tentar criar o bucket
      const { data, error } = await supabase.storage.createBucket('professionals', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      });

      if (error) {
        console.error("Erro ao criar bucket:", error);
        return false;
      }

      console.log("Bucket 'professionals' criado com sucesso!");
    } else {
      console.log("Bucket 'professionals' já existe!");
    }

    return true;
  } catch (error) {
    console.error("Erro no setup do storage:", error);
    return false;
  }
}

// Função para testar upload
export async function testUpload() {
  try {
    // Criar um arquivo de teste
    const testContent = "test";
    const testFile = new File([testContent], "test.txt", { type: "text/plain" });
    
    const { data, error } = await supabase.storage
      .from('professionals')
      .upload('test/test.txt', testFile);

    if (error) {
      console.error("Erro no teste de upload:", error);
      return false;
    }

    console.log("Teste de upload bem-sucedido!");
    
    // Limpar arquivo de teste
    await supabase.storage
      .from('professionals')
      .remove(['test/test.txt']);

    return true;
  } catch (error) {
    console.error("Erro no teste de upload:", error);
    return false;
  }
}
