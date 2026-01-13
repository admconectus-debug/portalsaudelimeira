import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
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
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  youtube: string | null;
  clinic_professionals?: { clinic_id: string }[];
}

interface Specialty {
  id: string;
  name: string;
}

interface Clinic {
  id: string;
  name: string;
}

export function ProfessionalsTab() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
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
    instagram: "",
    facebook: "",
    linkedin: "",
    youtube: "",
    clinic_ids: [] as string[],
  });

  useEffect(() => {
    fetchProfessionals();
    fetchSpecialties();
    fetchClinics();
  }, []);

  const fetchProfessionals = async () => {
    const { data, error } = await supabase
      .from("professionals")
      .select(`
        *,
        specialties (name),
        clinic_professionals (clinic_id)
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

  const fetchClinics = async () => {
    const { data, error } = await supabase
      .from("clinics")
      .select("id, name")
      .eq("is_active", true)
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
      instagram: "",
      facebook: "",
      linkedin: "",
      youtube: "",
      clinic_ids: [],
    });
    setEditingProfessional(null);
  };

  const updateClinicProfessionals = async (professionalId: string, clinicIds: string[]) => {
    // First delete all existing relationships
    await supabase
      .from("clinic_professionals")
      .delete()
      .eq("professional_id", professionalId);

    // Then insert new relationships
    if (clinicIds.length > 0) {
      const { error } = await supabase
        .from("clinic_professionals")
        .insert(
          clinicIds.map(clinicId => ({
            professional_id: professionalId,
            clinic_id: clinicId,
          }))
        );

      if (error) throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let professionalId = editingProfessional?.id;

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
            instagram: formData.instagram || null,
            facebook: formData.facebook || null,
            linkedin: formData.linkedin || null,
            youtube: formData.youtube || null,
          })
          .eq("id", editingProfessional.id);

        if (error) throw error;

        // Update clinic associations
        await updateClinicProfessionals(editingProfessional.id, formData.clinic_ids);

        toast({
          title: "Profissional atualizado",
          description: "Os dados foram salvos com sucesso.",
        });
      } else {
        const { data, error } = await supabase
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
            instagram: formData.instagram || null,
            facebook: formData.facebook || null,
            linkedin: formData.linkedin || null,
            youtube: formData.youtube || null,
          })
          .select("id")
          .single();

        if (error) throw error;

        // Add clinic associations for new professional
        if (data?.id) {
          await updateClinicProfessionals(data.id, formData.clinic_ids);
        }

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
    const clinicIds = professional.clinic_professionals?.map(cp => cp.clinic_id) || [];
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
      instagram: professional.instagram || "",
      facebook: professional.facebook || "",
      linkedin: professional.linkedin || "",
      youtube: professional.youtube || "",
      clinic_ids: clinicIds,
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
                  <Label>Clínicas onde Atende</Label>
                  <div className="border rounded-md p-3 mt-1 max-h-40 overflow-y-auto space-y-2">
                    {clinics.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nenhuma clínica cadastrada</p>
                    ) : (
                      clinics.map((clinic) => (
                        <div key={clinic.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`clinic-${clinic.id}`}
                            checked={formData.clinic_ids.includes(clinic.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData({
                                  ...formData,
                                  clinic_ids: [...formData.clinic_ids, clinic.id],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  clinic_ids: formData.clinic_ids.filter((id) => id !== clinic.id),
                                });
                              }
                            }}
                          />
                          <label
                            htmlFor={`clinic-${clinic.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {clinic.name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
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
                    placeholder="https://linkedin.com/in/seuperfil"
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