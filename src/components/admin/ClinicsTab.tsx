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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Users } from "lucide-react";
import { uploadImage, uploadBanner } from "@/lib/storage";

interface Clinic {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  banners: string[];
  address: string | null;
  city: string;
  state: string | null;
  phone: string | null;
  email: string | null;
  schedule: string | null;
  website: string | null;
  slug: string;
  category: string | null;
  is_active: boolean;
  is_featured: boolean;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  youtube: string | null;
}

interface Professional {
  id: string;
  name: string;
  location: string;
}

export function ClinicsTab() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProfessionalsDialogOpen, setIsProfessionalsDialogOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const [selectedProfessionalIds, setSelectedProfessionalIds] = useState<string[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    banners: [] as string[],
    address: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    schedule: "",
    website: "",
    category: "",
    is_active: true,
    is_featured: false,
    instagram: "",
    facebook: "",
    linkedin: "",
    youtube: "",
  });

  useEffect(() => {
    fetchClinics();
    fetchProfessionals();
  }, []);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const fetchClinics = async () => {
    const { data, error } = await supabase
      .from("clinics")
      .select("*")
      .order("name");

    if (error) {
      toast({
        title: "Erro ao carregar clínicas",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setClinics(data || []);
    }
    setLoading(false);
  };

  const fetchProfessionals = async () => {
    const { data, error } = await supabase
      .from("professionals")
      .select("id, name, location")
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
  };

  const fetchClinicProfessionals = async (clinicId: string) => {
    const { data, error } = await supabase
      .from("clinic_professionals")
      .select("professional_id")
      .eq("clinic_id", clinicId);

    if (error) {
      toast({
        title: "Erro ao carregar profissionais da clínica",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSelectedProfessionalIds(data?.map(p => p.professional_id) || []);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image_url: "",
      banners: [],
      address: "",
      city: "",
      state: "",
      phone: "",
      email: "",
      schedule: "",
      website: "",
      category: "",
      is_active: true,
      is_featured: false,
      instagram: "",
      facebook: "",
      linkedin: "",
      youtube: "",
    });
    setEditingClinic(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const slug = generateSlug(formData.name);

      if (editingClinic) {
        const { error } = await supabase
          .from("clinics")
          .update({
            name: formData.name,
            description: formData.description || null,
            image_url: formData.image_url || null,
            banners: formData.banners,
            address: formData.address || null,
            city: formData.city,
            state: formData.state || null,
            phone: formData.phone || null,
            email: formData.email || null,
            schedule: formData.schedule || null,
            website: formData.website || null,
            category: formData.category || null,
            slug,
            is_active: formData.is_active,
            instagram: formData.instagram || null,
            facebook: formData.facebook || null,
            linkedin: formData.linkedin || null,
            youtube: formData.youtube || null,
          })
          .eq("id", editingClinic.id);

        if (error) throw error;

        toast({
          title: "Clínica atualizada",
          description: "Os dados foram salvos com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from("clinics")
          .insert({
            name: formData.name,
            description: formData.description || null,
            image_url: formData.image_url || null,
            banners: formData.banners,
            address: formData.address || null,
            city: formData.city,
            state: formData.state || null,
            phone: formData.phone || null,
            email: formData.email || null,
            schedule: formData.schedule || null,
            website: formData.website || null,
            category: formData.category || null,
            slug,
            is_active: formData.is_active,
            instagram: formData.instagram || null,
            facebook: formData.facebook || null,
            linkedin: formData.linkedin || null,
            youtube: formData.youtube || null,
          });

        if (error) throw error;

        toast({
          title: "Clínica adicionada",
          description: "Nova clínica cadastrada com sucesso.",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchClinics();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    }

    setSaving(false);
  };

  const handleEdit = (clinic: Clinic) => {
    setEditingClinic(clinic);
    setFormData({
      name: clinic.name,
      description: clinic.description || "",
      image_url: clinic.image_url || "",
      banners: clinic.banners || [],
      address: clinic.address || "",
      city: clinic.city,
      state: clinic.state || "",
      phone: clinic.phone || "",
      email: clinic.email || "",
      schedule: clinic.schedule || "",
      website: clinic.website || "",
      category: clinic.category || "",
      is_active: clinic.is_active,
      is_featured: clinic.is_featured,
      instagram: clinic.instagram || "",
      facebook: clinic.facebook || "",
      linkedin: clinic.linkedin || "",
      youtube: clinic.youtube || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir ${name}?`)) return;

    const { error } = await supabase
      .from("clinics")
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
        title: "Clínica excluída",
        description: `${name} foi removida com sucesso.`,
      });
      fetchClinics();
    }
  };

  const handleManageProfessionals = async (clinic: Clinic) => {
    setSelectedClinicId(clinic.id);
    await fetchClinicProfessionals(clinic.id);
    setIsProfessionalsDialogOpen(true);
  };

  const handleSaveProfessionals = async () => {
    if (!selectedClinicId) return;
    setSaving(true);

    try {
      // Remove existing professional associations
      await supabase
        .from("clinic_professionals")
        .delete()
        .eq("clinic_id", selectedClinicId);

      // Add new professional associations
      if (selectedProfessionalIds.length > 0) {
        const professionalAssociations = selectedProfessionalIds.map(professionalId => ({
          clinic_id: selectedClinicId,
          professional_id: professionalId,
        }));

        const { error } = await supabase
          .from("clinic_professionals")
          .insert(professionalAssociations);

        if (error) throw error;
      }

      toast({
        title: "Profissionais atualizados",
        description: "Os profissionais da clínica foram salvos com sucesso.",
      });

      setIsProfessionalsDialogOpen(false);
      setSelectedClinicId(null);
      setSelectedProfessionalIds([]);
    } catch (error: any) {
      toast({
        title: "Erro ao salvar profissionais",
        description: error.message,
        variant: "destructive",
      });
    }

    setSaving(false);
  };

  const toggleProfessionalSelection = (professionalId: string) => {
    setSelectedProfessionalIds(prev =>
      prev.includes(professionalId)
        ? prev.filter(id => id !== professionalId)
        : [...prev, professionalId]
    );
  };

  if (loading) {
    return <div className="flex justify-center py-8">Carregando clínicas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Clínicas Cadastradas</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Clínica
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingClinic ? "Editar Clínica" : "Nova Clínica"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Nome da Clínica *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <ImageUpload
                    label="Logotipo / Imagem Principal"
                    value={formData.image_url}
                    onChange={(url) => setFormData({ ...formData, image_url: url })}
                    onUpload={async (file) => {
                      const result = await uploadImage(file, "clinics");
                      return result.url;
                    }}
                    maxSize={5}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Banners (Fotos do Espaço) - Máx. 5</Label>
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
                            const result = await uploadBanner(file, "clinics", "banners");
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
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Informações sobre a clínica, serviços oferecidos, etc."
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="address">Endereço Completo</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Rua, número, bairro"
                  />
                </div>
                <div>
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone / WhatsApp</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="schedule">Horário de Funcionamento</Label>
                  <Input
                    id="schedule"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    placeholder="Ex: Seg a Sex: 8h às 18h"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="website">Site</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://www.seusite.com.br"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="https://instagram.com/seuperfil"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    placeholder="https://facebook.com/suapagina"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/company/suaempresa"
                  />
                </div>
                <div>
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={formData.youtube}
                    onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                    placeholder="https://youtube.com/@seucanal"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="category">Categoria da Clínica</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pediatria">Clínica Pediátrica</SelectItem>
                      <SelectItem value="veterinaria">Clínica Veterinária / Pet</SelectItem>
                      <SelectItem value="beleza">Espaço de Beleza</SelectItem>
                      <SelectItem value="odontologia">Clínica Odontológica</SelectItem>
                      <SelectItem value="fisioterapia">Clínica de Fisioterapia</SelectItem>
                      <SelectItem value="psicologia">Clínica de Psicologia</SelectItem>
                      <SelectItem value="nutricao">Clínica de Nutrição</SelectItem>
                      <SelectItem value="estetica">Clínica de Estética</SelectItem>
                      <SelectItem value="geral">Clínica Geral</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, is_active: checked as boolean })
                    }
                  />
                  <Label htmlFor="is_active" className="cursor-pointer">
                    Clínica ativa
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, is_featured: checked as boolean })
                    }
                  />
                  <Label htmlFor="is_featured" className="cursor-pointer">
                    Clínica em destaque
                  </Label>
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
                  {editingClinic ? "Atualizar" : "Adicionar"}
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
              <TableHead className="whitespace-nowrap">Cidade</TableHead>
              <TableHead className="whitespace-nowrap">Contato</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="text-right whitespace-nowrap">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clinics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhuma clínica cadastrada
                </TableCell>
              </TableRow>
            ) : (
              clinics.map((clinic) => (
                <TableRow key={clinic.id}>
                  <TableCell className="font-medium whitespace-nowrap">{clinic.name}</TableCell>
                  <TableCell className="whitespace-nowrap">{clinic.city}{clinic.state ? ` - ${clinic.state}` : ""}</TableCell>
                  <TableCell>
                    <div className="text-sm whitespace-nowrap">
                      {clinic.phone && <div>{clinic.phone}</div>}
                      {clinic.email && <div>{clinic.email}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                      clinic.is_active 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {clinic.is_active ? "Ativa" : "Inativa"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleManageProfessionals(clinic)}
                        title="Gerenciar profissionais"
                      >
                        <Users className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(clinic)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(clinic.id, clinic.name)}
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

      <Dialog open={isProfessionalsDialogOpen} onOpenChange={setIsProfessionalsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerenciar Profissionais da Clínica</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {professionals.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Nenhum profissional cadastrado
              </p>
            ) : (
              <div className="space-y-2">
                {professionals.map((professional) => (
                  <div key={professional.id} className="flex items-center space-x-2 p-2 rounded hover:bg-muted">
                    <Checkbox
                      id={`professional-${professional.id}`}
                      checked={selectedProfessionalIds.includes(professional.id)}
                      onCheckedChange={() => toggleProfessionalSelection(professional.id)}
                    />
                    <Label htmlFor={`professional-${professional.id}`} className="cursor-pointer flex-1">
                      <div className="font-medium">{professional.name}</div>
                      <div className="text-sm text-muted-foreground">{professional.location}</div>
                    </Label>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsProfessionalsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveProfessionals} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
