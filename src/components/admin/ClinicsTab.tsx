import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Users } from "lucide-react";
import { uploadImage } from "@/lib/storage";

interface Clinic {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  address: string | null;
  city: string;
  state: string | null;
  phone: string | null;
  email: string | null;
  schedule: string | null;
  website: string | null;
  slug: string;
  is_active: boolean;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

interface Professional {
  id: string;
  name: string;
  location: string;
}

export function ClinicsTab() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDoctorsDialogOpen, setIsDoctorsDialogOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const [selectedDoctorIds, setSelectedDoctorIds] = useState<string[]>([]);
  const [selectedProfessionalIds, setSelectedProfessionalIds] = useState<string[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    schedule: "",
    website: "",
    is_active: true,
  });

  useEffect(() => {
    fetchClinics();
    fetchDoctors();
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

  const fetchDoctors = async () => {
    const { data, error } = await supabase
      .from("doctors")
      .select("id, name, specialty")
      .eq("is_active", true)
      .order("name");

    if (error) {
      toast({
        title: "Erro ao carregar médicos",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setDoctors(data || []);
    }
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

  const fetchClinicDoctors = async (clinicId: string) => {
    const { data, error } = await supabase
      .from("clinic_doctors")
      .select("doctor_id")
      .eq("clinic_id", clinicId);

    if (error) {
      toast({
        title: "Erro ao carregar médicos da clínica",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSelectedDoctorIds(data?.map(d => d.doctor_id) || []);
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
      address: "",
      city: "",
      state: "",
      phone: "",
      email: "",
      schedule: "",
      website: "",
      is_active: true,
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
            address: formData.address || null,
            city: formData.city,
            state: formData.state || null,
            phone: formData.phone || null,
            email: formData.email || null,
            schedule: formData.schedule || null,
            website: formData.website || null,
            slug,
            is_active: formData.is_active,
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
            address: formData.address || null,
            city: formData.city,
            state: formData.state || null,
            phone: formData.phone || null,
            email: formData.email || null,
            schedule: formData.schedule || null,
            website: formData.website || null,
            slug,
            is_active: formData.is_active,
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
      address: clinic.address || "",
      city: clinic.city,
      state: clinic.state || "",
      phone: clinic.phone || "",
      email: clinic.email || "",
      schedule: clinic.schedule || "",
      website: clinic.website || "",
      is_active: clinic.is_active,
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

  const handleManageDoctors = async (clinic: Clinic) => {
    setSelectedClinicId(clinic.id);
    await fetchClinicDoctors(clinic.id);
    await fetchClinicProfessionals(clinic.id);
    setIsDoctorsDialogOpen(true);
  };

  const handleSaveDoctors = async () => {
    if (!selectedClinicId) return;
    setSaving(true);

    try {
      // Remove existing doctor associations
      await supabase
        .from("clinic_doctors")
        .delete()
        .eq("clinic_id", selectedClinicId);

      // Remove existing professional associations
      await supabase
        .from("clinic_professionals")
        .delete()
        .eq("clinic_id", selectedClinicId);

      // Add new doctor associations
      if (selectedDoctorIds.length > 0) {
        const doctorAssociations = selectedDoctorIds.map(doctorId => ({
          clinic_id: selectedClinicId,
          doctor_id: doctorId,
        }));

        const { error: doctorError } = await supabase
          .from("clinic_doctors")
          .insert(doctorAssociations);

        if (doctorError) throw doctorError;
      }

      // Add new professional associations
      if (selectedProfessionalIds.length > 0) {
        const professionalAssociations = selectedProfessionalIds.map(professionalId => ({
          clinic_id: selectedClinicId,
          professional_id: professionalId,
        }));

        const { error: professionalError } = await supabase
          .from("clinic_professionals")
          .insert(professionalAssociations);

        if (professionalError) throw professionalError;
      }

      toast({
        title: "Profissionais atualizados",
        description: "Os médicos e profissionais da clínica foram salvos com sucesso.",
      });

      setIsDoctorsDialogOpen(false);
      setSelectedClinicId(null);
      setSelectedDoctorIds([]);
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

  const toggleDoctorSelection = (doctorId: string) => {
    setSelectedDoctorIds(prev =>
      prev.includes(doctorId)
        ? prev.filter(id => id !== doctorId)
        : [...prev, doctorId]
    );
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
                  <Label htmlFor="website">Site / Redes Sociais</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://"
                  />
                </div>
                <div className="col-span-2 flex items-center space-x-2">
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
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
                  <TableCell className="font-medium">{clinic.name}</TableCell>
                  <TableCell>{clinic.city}{clinic.state ? ` - ${clinic.state}` : ""}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {clinic.phone && <div>{clinic.phone}</div>}
                      {clinic.email && <div>{clinic.email}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      clinic.is_active 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {clinic.is_active ? "Ativa" : "Inativa"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleManageDoctors(clinic)}
                        title="Gerenciar médicos"
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

      <Dialog open={isDoctorsDialogOpen} onOpenChange={setIsDoctorsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerenciar Profissionais da Clínica</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Médicos</h4>
              {doctors.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  Nenhum médico cadastrado
                </p>
              ) : (
                <div className="space-y-2">
                  {doctors.map((doctor) => (
                    <div key={doctor.id} className="flex items-center space-x-2 p-2 rounded hover:bg-muted">
                      <Checkbox
                        id={`doctor-${doctor.id}`}
                        checked={selectedDoctorIds.includes(doctor.id)}
                        onCheckedChange={() => toggleDoctorSelection(doctor.id)}
                      />
                      <Label htmlFor={`doctor-${doctor.id}`} className="cursor-pointer flex-1">
                        <div className="font-medium">{doctor.name}</div>
                        <div className="text-sm text-muted-foreground">{doctor.specialty}</div>
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Profissionais</h4>
              {professionals.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
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
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDoctorsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveDoctors} disabled={saving}>
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
