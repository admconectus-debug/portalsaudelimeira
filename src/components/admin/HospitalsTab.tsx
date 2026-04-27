import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { uploadImage } from "@/lib/storage";

interface Hospital {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  address: string | null;
  city: string;
  state: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  is_emergency: boolean;
  is_public: boolean;
  is_active: boolean;
}

const emptyForm = {
  name: "",
  description: "",
  image_url: "",
  address: "",
  city: "",
  state: "",
  phone: "",
  email: "",
  website: "",
  is_emergency: false,
  is_public: false,
  is_active: true,
};

export function HospitalsTab() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Hospital | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const { toast } = useToast();

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    const { data, error } = await supabase
      .from("hospitals")
      .select("*")
      .order("name");

    if (error) {
      toast({ title: "Erro ao carregar hospitais", description: error.message, variant: "destructive" });
    } else {
      setHospitals(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditing(null);
  };

  const openNew = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (hospital: Hospital) => {
    setEditing(hospital);
    setFormData({
      name: hospital.name,
      description: hospital.description || "",
      image_url: hospital.image_url || "",
      address: hospital.address || "",
      city: hospital.city,
      state: hospital.state || "",
      phone: hospital.phone || "",
      email: hospital.email || "",
      website: hospital.website || "",
      is_emergency: hospital.is_emergency,
      is_public: hospital.is_public,
      is_active: hospital.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description || null,
        image_url: formData.image_url || null,
        address: formData.address || null,
        city: formData.city,
        state: formData.state || null,
        phone: formData.phone || null,
        email: formData.email || null,
        website: formData.website || null,
        is_emergency: formData.is_emergency,
        is_public: formData.is_public,
        is_active: formData.is_active,
      };

      if (editing) {
        const { error } = await supabase.from("hospitals").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast({ title: "Hospital atualizado" });
      } else {
        const { error } = await supabase.from("hospitals").insert(payload);
        if (error) throw error;
        toast({ title: "Hospital cadastrado" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchHospitals();
    } catch (error: any) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    }

    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir ${name}?`)) return;
    const { error } = await supabase.from("hospitals").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Hospital excluído" });
      fetchHospitals();
    }
  };

  if (loading) return <div className="flex justify-center py-8">Carregando hospitais...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Hospitais Cadastrados</h3>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Hospital
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Hospital" : "Novo Hospital"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>

            <ImageUpload
              label="Foto do Hospital"
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              onUpload={async (file) => {
                const result = await uploadImage(file, "hospitals", "photos");
                return result.url;
              }}
              maxSize={5}
            />

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>

            <div>
              <Label htmlFor="address">Endereço Completo *</Label>
              <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Rua, número, bairro" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Cidade *</Label>
                <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="state">Estado</Label>
                <Input id="state" maxLength={2} value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} placeholder="SP" />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="col-span-2">
                <Label htmlFor="website">Site</Label>
                <Input id="website" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-center space-x-2">
                <Switch id="is_emergency" checked={formData.is_emergency} onCheckedChange={(v) => setFormData({ ...formData, is_emergency: v })} />
                <Label htmlFor="is_emergency">Urgência/Emergência</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="is_public" checked={formData.is_public} onCheckedChange={(v) => setFormData({ ...formData, is_public: v })} />
                <Label htmlFor="is_public">Público (SUS)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="is_active" checked={formData.is_active} onCheckedChange={(v) => setFormData({ ...formData, is_active: v })} />
                <Label htmlFor="is_active">Ativo</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead>Urgência</TableHead>
            <TableHead>Público</TableHead>
            <TableHead>Ativo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hospitals.map((h) => (
            <TableRow key={h.id}>
              <TableCell className="font-medium">{h.name}</TableCell>
              <TableCell>{h.city}{h.state ? `/${h.state}` : ""}</TableCell>
              <TableCell>{h.is_emergency ? "Sim" : "Não"}</TableCell>
              <TableCell>{h.is_public ? "Sim" : "Não"}</TableCell>
              <TableCell>{h.is_active ? "Sim" : "Não"}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(h)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(h.id, h.name)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {hospitals.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-6">Nenhum hospital cadastrado</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
