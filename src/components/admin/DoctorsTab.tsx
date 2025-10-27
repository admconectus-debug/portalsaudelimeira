import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  crm: string | null;
  bio: string | null;
  photo_url: string | null;
  schedule: string | null;
  appointment_link: string | null;
  slug: string;
  is_active: boolean;
}

interface Clinic {
  id: string;
  name: string;
}

export function DoctorsTab() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClinics, setSelectedClinics] = useState<string[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    crm: "",
    bio: "",
    photo_url: "",
    schedule: "",
    appointment_link: "",
    is_active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [doctorsResult, clinicsResult] = await Promise.all([
        supabase.from("doctors").select("*").order("name"),
        supabase.from("clinics").select("id, name").eq("is_active", true).order("name"),
      ]);

      if (doctorsResult.error) throw doctorsResult.error;
      if (clinicsResult.error) throw clinicsResult.error;

      setDoctors(doctorsResult.data || []);
      setClinics(clinicsResult.data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorClinics = async (doctorId: string) => {
    const { data } = await supabase
      .from("clinic_doctors")
      .select("clinic_id")
      .eq("doctor_id", doctorId);

    return data?.map((item) => item.clinic_id) || [];
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("doctors")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("doctors").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      specialty: "",
      crm: "",
      bio: "",
      photo_url: "",
      schedule: "",
      appointment_link: "",
      is_active: true,
    });
    setSelectedClinics([]);
    setEditingDoctor(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const slug = generateSlug(formData.name);
      const doctorData = { ...formData, slug };

      let doctorId: string;

      if (editingDoctor) {
        const { error } = await supabase
          .from("doctors")
          .update(doctorData)
          .eq("id", editingDoctor.id);

        if (error) throw error;
        doctorId = editingDoctor.id;

        // Remove existing clinic relationships
        await supabase
          .from("clinic_doctors")
          .delete()
          .eq("doctor_id", doctorId);

        toast({
          title: "Médico atualizado",
          description: "As alterações foram salvas com sucesso.",
        });
      } else {
        const { data, error } = await supabase
          .from("doctors")
          .insert([doctorData])
          .select()
          .single();

        if (error) throw error;
        doctorId = data.id;

        toast({
          title: "Médico adicionado",
          description: "O médico foi cadastrado com sucesso.",
        });
      }

      // Add new clinic relationships
      if (selectedClinics.length > 0) {
        const relationships = selectedClinics.map((clinicId) => ({
          doctor_id: doctorId,
          clinic_id: clinicId,
        }));

        const { error } = await supabase
          .from("clinic_doctors")
          .insert(relationships);

        if (error) throw error;
      }

      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      crm: doctor.crm || "",
      bio: doctor.bio || "",
      photo_url: doctor.photo_url || "",
      schedule: doctor.schedule || "",
      appointment_link: doctor.appointment_link || "",
      is_active: doctor.is_active,
    });

    const clinicIds = await fetchDoctorClinics(doctor.id);
    setSelectedClinics(clinicIds);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o médico "${name}"?`)) return;

    try {
      const { error } = await supabase.from("doctors").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Médico excluído",
        description: "O médico foi removido com sucesso.",
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleClinic = (clinicId: string) => {
    setSelectedClinics((prev) =>
      prev.includes(clinicId)
        ? prev.filter((id) => id !== clinicId)
        : [...prev, clinicId]
    );
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por nome ou especialidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Médico
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDoctor ? "Editar Médico" : "Novo Médico"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <ImageUpload
                    label="Foto do Médico"
                    value={formData.photo_url}
                    onChange={(url) =>
                      setFormData({ ...formData, photo_url: url })
                    }
                    onUpload={uploadImage}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="specialty">Especialidade *</Label>
                  <Input
                    id="specialty"
                    value={formData.specialty}
                    onChange={(e) =>
                      setFormData({ ...formData, specialty: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="crm">CRM</Label>
                  <Input
                    id="crm"
                    value={formData.crm}
                    onChange={(e) =>
                      setFormData({ ...formData, crm: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="bio">Biografia / Apresentação</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows={4}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="schedule">Dias e Horários de Atendimento</Label>
                  <Input
                    id="schedule"
                    value={formData.schedule}
                    onChange={(e) =>
                      setFormData({ ...formData, schedule: e.target.value })
                    }
                    placeholder="Ex: Seg, Qua, Sex: 14h-18h"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="appointment_link">Link para Agendamento</Label>
                  <Input
                    id="appointment_link"
                    type="url"
                    value={formData.appointment_link}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        appointment_link: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-span-2">
                  <Label>Clínicas onde atende</Label>
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                    {clinics.map((clinic) => (
                      <div key={clinic.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={clinic.id}
                          checked={selectedClinics.includes(clinic.id)}
                          onCheckedChange={() => toggleClinic(clinic.id)}
                        />
                        <Label
                          htmlFor={clinic.id}
                          className="font-normal cursor-pointer"
                        >
                          {clinic.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-2 flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_active: checked })
                    }
                  />
                  <Label htmlFor="is_active">Médico ativo</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Especialidade</TableHead>
            <TableHead>CRM</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDoctors.map((doctor) => (
            <TableRow key={doctor.id}>
              <TableCell className="font-medium">{doctor.name}</TableCell>
              <TableCell>{doctor.specialty}</TableCell>
              <TableCell>{doctor.crm || "-"}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    doctor.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {doctor.is_active ? "Ativo" : "Inativo"}
                </span>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(doctor)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(doctor.id, doctor.name)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum médico encontrado.
        </div>
      )}
    </div>
  );
}
