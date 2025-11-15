import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { uploadImage, uploadBanner } from "@/lib/storage";

interface Professional {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  location: string;
  description: string | null;
  photo_url: string | null;
  banners: string[];
  specialty_id: string | null;
  specialties: { name: string } | null;
}

interface Specialty {
  id: string;
  name: string;
}

export function ProfessionalsTab() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    location: "",
    description: "",
    photo_url: "",
    banners: [] as string[],
    specialty_id: "",
  });

  useEffect(() => {
    fetchProfessionals();
    fetchSpecialties();
  }, []);

  const fetchProfessionals = async () => {
    const { data, error } = await supabase
      .from("professionals")
      .select(`
        *,
        specialties (name)
      `)
      .order("name");

    if (error) {
      toast({
        title: "Erro ao carregar profissionais",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setProfessionals(data || []);
    }
    setLoading(false);
  };

  const fetchSpecialties = async () => {
    const { data, error } = await supabase
      .from("specialties")
      .select("*")
      .order("name");

    if (error) {
      toast({
        title: "Erro ao carregar especialidades",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSpecialties(data || []);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      whatsapp: "",
      location: "",
      description: "",
      photo_url: "",
      banners: [],
      specialty_id: "",
    });
    setEditingProfessional(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingProfessional) {
        const { error } = await supabase
          .from("professionals")
          .update({
            name: formData.name,
            email: formData.email || null,
            phone: formData.phone || null,
            whatsapp: formData.whatsapp || null,
            location: formData.location,
            description: formData.description || null,
            photo_url: formData.photo_url || null,
            banners: formData.banners,
            specialty_id: formData.specialty_id || null,
          })
          .eq("id", editingProfessional.id);

        if (error) throw error;

        toast({
          title: "Profissional atualizado",
          description: "Os dados foram salvos com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from("professionals")
          .insert({
            name: formData.name,
            email: formData.email || null,
            phone: formData.phone || null,
            whatsapp: formData.whatsapp || null,
            location: formData.location,
            description: formData.description || null,
            photo_url: formData.photo_url || null,
            banners: formData.banners,
            specialty_id: formData.specialty_id || null,
          });

        if (error) throw error;

        toast({
          title: "Profissional adicionado",
          description: "Novo profissional cadastrado com sucesso.",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchProfessionals();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    }

    setSaving(false);
  };

  const handleEdit = (professional: Professional) => {
    setEditingProfessional(professional);
    setFormData({
      name: professional.name,
      email: professional.email || "",
      phone: professional.phone || "",
      whatsapp: professional.whatsapp || "",
      location: professional.location,
      description: professional.description || "",
      photo_url: professional.photo_url || "",
      banners: professional.banners || [],
      specialty_id: professional.specialty_id || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir ${name}?`)) return;

    const { error } = await supabase
      .from("professionals")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profissional excluído",
        description: `${name} foi removido com sucesso.`,
      });
      fetchProfessionals();
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Carregando profissionais...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Profissionais Cadastrados</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Profissional
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProfessional ? "Editar Profissional" : "Novo Profissional"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Localização *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="specialty">Especialidade</Label>
                  <Select
                    value={formData.specialty_id}
                    onValueChange={(value) => setFormData({ ...formData, specialty_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma especialidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty.id} value={specialty.id}>
                          {specialty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <ImageUpload
                    label="Foto de Perfil"
                    value={formData.photo_url}
                    onChange={(url) => setFormData({ ...formData, photo_url: url })}
                    onUpload={async (file) => {
                      const result = await uploadImage(file);
                      return result.url;
                    }}
                    maxSize={5}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Banners (Fotos do Espaço de Atendimento) - Máx. 5</Label>
                  <div className="space-y-2">
                    {formData.banners.map((banner, index) => (
                      <div key={index} className="flex gap-2">
                        <ImageUpload
                          value={banner}
                          onChange={(url) => {
                            const newBanners = [...formData.banners];
                            newBanners[index] = url;
                            setFormData({ ...formData, banners: newBanners });
                          }}
                          onUpload={async (file) => {
                            const result = await uploadBanner(file);
                            return result.url;
                          }}
                          maxSize={10}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            const newBanners = formData.banners.filter((_, i) => i !== index);
                            setFormData({ ...formData, banners: newBanners });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {formData.banners.length < 5 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setFormData({ ...formData, banners: [...formData.banners, ""] });
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Banner
                      </Button>
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Sobre o Profissional</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Conte sobre a experiência, especialidades, formação e o que mais considerar importante..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingProfessional ? "Atualizar" : "Adicionar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Nome</TableHead>
              <TableHead className="whitespace-nowrap">Especialidade</TableHead>
              <TableHead className="whitespace-nowrap">Localização</TableHead>
              <TableHead className="whitespace-nowrap">Contato</TableHead>
              <TableHead className="text-right whitespace-nowrap">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {professionals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum profissional cadastrado
                </TableCell>
              </TableRow>
            ) : (
              professionals.map((professional) => (
                <TableRow key={professional.id}>
                  <TableCell className="font-medium">{professional.name}</TableCell>
                  <TableCell className="whitespace-nowrap">{professional.specialties?.name || "Não informada"}</TableCell>
                  <TableCell className="whitespace-nowrap">{professional.location}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {professional.phone && <div className="whitespace-nowrap">Tel: {professional.phone}</div>}
                      {professional.whatsapp && <div className="whitespace-nowrap">WhatsApp: {professional.whatsapp}</div>}
                      {professional.email && <div className="truncate max-w-[200px]">{professional.email}</div>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(professional)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(professional.id, professional.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}