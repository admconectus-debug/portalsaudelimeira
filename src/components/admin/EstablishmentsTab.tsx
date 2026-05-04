import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { uploadImage } from "@/lib/storage";
import { MODALITY_CONFIGS } from "@/pages/ModalityPage";

interface Item {
  id: string;
  category: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  address: string | null;
  city: string;
  state: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  schedule: string | null;
  is_24h: boolean;
  is_featured: boolean;
  is_active: boolean;
}

const categories = Object.values(MODALITY_CONFIGS).map((c) => ({
  value: c.category,
  label: c.title,
}));

const emptyForm = {
  category: "planos-medicos",
  name: "",
  slug: "",
  description: "",
  image_url: "",
  address: "",
  city: "Limeira",
  state: "SP",
  phone: "",
  whatsapp: "",
  email: "",
  website: "",
  schedule: "",
  is_24h: false,
  is_featured: false,
  is_active: true,
};

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function EstablishmentsTab() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [filterCat, setFilterCat] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("establishments").select("*").order("category").order("name");
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else setItems(data || []);
    setLoading(false);
  };

  const reset = () => { setFormData(emptyForm); setEditing(null); };

  const openNew = () => { reset(); setOpen(true); };

  const handleEdit = (i: Item) => {
    setEditing(i);
    setFormData({
      category: i.category, name: i.name, slug: i.slug,
      description: i.description || "", image_url: i.image_url || "",
      address: i.address || "", city: i.city, state: i.state || "",
      phone: i.phone || "", whatsapp: i.whatsapp || "", email: i.email || "",
      website: i.website || "", schedule: i.schedule || "",
      is_24h: i.is_24h, is_featured: i.is_featured, is_active: i.is_active,
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        slug: formData.slug || slugify(formData.name),
        description: formData.description || null,
        image_url: formData.image_url || null,
        address: formData.address || null,
        state: formData.state || null,
        phone: formData.phone || null,
        whatsapp: formData.whatsapp || null,
        email: formData.email || null,
        website: formData.website || null,
        schedule: formData.schedule || null,
      };
      if (editing) {
        const { error } = await supabase.from("establishments").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast({ title: "Atualizado" });
      } else {
        const { error } = await supabase.from("establishments").insert(payload);
        if (error) throw error;
        toast({ title: "Cadastrado" });
      }
      setOpen(false); reset(); fetchItems();
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir ${name}?`)) return;
    const { error } = await supabase.from("establishments").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Excluído" }); fetchItems(); }
  };

  if (loading) return <div className="flex justify-center py-8">Carregando...</div>;

  const filtered = filterCat === "all" ? items : items.filter(i => i.category === filterCat);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="text-lg font-semibold">Estabelecimentos (Modalidades)</h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger className="w-full sm:w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              {categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />Adicionar</Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar" : "Novo"} Estabelecimento</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Categoria *</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nome *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: editing ? formData.slug : slugify(e.target.value) })} required />
            </div>
            <ImageUpload
              label="Foto"
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              onUpload={async (file) => (await uploadImage(file, "clinics", "establishments")).url}
              maxSize={5}
            />
            <div>
              <Label>Descrição</Label>
              <Textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div>
              <Label>Endereço</Label>
              <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Cidade *</Label><Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required /></div>
              <div><Label>UF</Label><Input maxLength={2} value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} /></div>
              <div><Label>Telefone</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
              <div><Label>WhatsApp</Label><Input value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} /></div>
              <div><Label>E-mail</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
              <div><Label>Site</Label><Input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} /></div>
              <div className="col-span-2"><Label>Horário</Label><Input value={formData.schedule} onChange={(e) => setFormData({ ...formData, schedule: e.target.value })} /></div>
            </div>
            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-center space-x-2"><Switch checked={formData.is_24h} onCheckedChange={(v) => setFormData({ ...formData, is_24h: v })} /><Label>24 horas</Label></div>
              <div className="flex items-center space-x-2"><Switch checked={formData.is_featured} onCheckedChange={(v) => setFormData({ ...formData, is_featured: v })} /><Label>Destaque</Label></div>
              <div className="flex items-center space-x-2"><Switch checked={formData.is_active} onCheckedChange={(v) => setFormData({ ...formData, is_active: v })} /><Label>Ativo</Label></div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead>Ativo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((i) => (
            <TableRow key={i.id}>
              <TableCell className="font-medium">{i.name}</TableCell>
              <TableCell>{categories.find(c => c.value === i.category)?.label || i.category}</TableCell>
              <TableCell>{i.city}{i.state && `/${i.state}`}</TableCell>
              <TableCell>{i.is_active ? "Sim" : "Não"}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(i)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(i.id, i.name)}><Trash2 className="w-4 h-4" /></Button>
              </TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && (
            <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">Nenhum cadastro</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
