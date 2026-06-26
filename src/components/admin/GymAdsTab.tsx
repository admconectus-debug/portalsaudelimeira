import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { uploadBanner } from "@/lib/storage";

interface GymAd {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  active: boolean;
}

export function GymAdsTab() {
  const [ads, setAds] = useState<GymAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<GymAd | null>(null);
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: "",
    description: "",
    image_url: "",
    link_url: "",
    active: true,
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gym_ads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Erro ao carregar", description: error.message, variant: "destructive" });
    } else {
      setAds(data || []);
    }
    setLoading(false);
  };

  const reset = () => {
    setForm({ title: "", description: "", image_url: "", link_url: "", active: true });
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        image_url: form.image_url || null,
        link_url: form.link_url || null,
        active: form.active,
      };
      if (editing) {
        const { error } = await supabase.from("gym_ads").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast({ title: "Propaganda atualizada" });
      } else {
        const { error } = await supabase.from("gym_ads").insert(payload);
        if (error) throw error;
        toast({ title: "Propaganda cadastrada" });
      }
      setIsOpen(false);
      reset();
      fetchAds();
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const handleEdit = (ad: GymAd) => {
    setEditing(ad);
    setForm({
      title: ad.title,
      description: ad.description || "",
      image_url: ad.image_url || "",
      link_url: ad.link_url || "",
      active: ad.active,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta propaganda?")) return;
    const { error } = await supabase.from("gym_ads").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Propaganda excluída" });
      fetchAds();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Propaganda de academia exibida no rodapé do site.
        </p>
        <Button onClick={() => { reset(); setIsOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Nova Propaganda
        </Button>
      </div>

      {loading ? (
        <p className="text-center py-8 text-muted-foreground">Carregando...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Ativa</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ads.map((ad) => (
              <TableRow key={ad.id}>
                <TableCell>
                  {ad.image_url ? (
                    <img src={ad.image_url} alt={ad.title} className="w-16 h-12 object-cover rounded" />
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="font-medium">{ad.title}</TableCell>
                <TableCell>{ad.active ? "Sim" : "Não"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(ad)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(ad.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {ads.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Nenhuma propaganda cadastrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <Dialog open={isOpen} onOpenChange={(o) => { setIsOpen(o); if (!o) reset(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Propaganda" : "Nova Propaganda"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Imagem</Label>
              <ImageUpload
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
                onUpload={async (file) => {
                  const result = await uploadBanner(file, "banners", "gym-ads");
                  return result.url;
                }}
                maxSize={5}
              />
            </div>
            <div>
              <Label htmlFor="link_url">Link (URL)</Label>
              <Input
                id="link_url"
                type="url"
                placeholder="https://..."
                value={form.link_url}
                onChange={(e) => setForm({ ...form, link_url: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="active"
                checked={form.active}
                onCheckedChange={(v) => setForm({ ...form, active: v })}
              />
              <Label htmlFor="active">Ativa</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
