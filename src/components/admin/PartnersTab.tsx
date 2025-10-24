import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";

interface Partner {
  id: string;
  company_name: string;
  description: string | null;
  business_area: string;
  logo_url: string | null;
  website_url: string | null;
  is_active: boolean;
  created_at: string;
}

const businessAreas = [
  "Laboratório",
  "Clínica",
  "Telessaúde",
  "Distribuidora",
  "Farmácia",
  "Diagnóstico",
  "Hospital",
  "Tecnologia Médica",
  "Vacinas",
  "Outros",
];

export const PartnersTab = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState({
    company_name: "",
    description: "",
    business_area: "",
    logo_url: "",
    website_url: "",
    is_active: true,
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  useEffect(() => {
    filterPartners();
  }, [partners, searchTerm, areaFilter]);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error("Erro ao buscar parceiros:", error);
      toast.error("Erro ao carregar parceiros");
    } finally {
      setLoading(false);
    }
  };

  const filterPartners = () => {
    let filtered = partners;

    if (searchTerm) {
      filtered = filtered.filter((partner) =>
        partner.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (areaFilter !== "all") {
      filtered = filtered.filter((partner) => partner.business_area === areaFilter);
    }

    setFilteredPartners(filtered);
  };

  const handleSubmit = async () => {
    if (!formData.company_name || !formData.business_area) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    if (formData.description && formData.description.length > 200) {
      toast.error("Descrição deve ter no máximo 200 caracteres");
      return;
    }

    try {
      if (selectedPartner) {
        const { error } = await supabase
          .from("partners")
          .update(formData)
          .eq("id", selectedPartner.id);

        if (error) throw error;
        toast.success("Parceiro atualizado com sucesso!");
      } else {
        const { error } = await supabase.from("partners").insert([formData]);

        if (error) throw error;
        toast.success("Parceiro adicionado com sucesso!");
      }

      setDialogOpen(false);
      resetForm();
      fetchPartners();
    } catch (error) {
      console.error("Erro ao salvar parceiro:", error);
      toast.error("Erro ao salvar parceiro");
    }
  };

  const handleEdit = (partner: Partner) => {
    setSelectedPartner(partner);
    setFormData({
      company_name: partner.company_name,
      description: partner.description || "",
      business_area: partner.business_area,
      logo_url: partner.logo_url || "",
      website_url: partner.website_url || "",
      is_active: partner.is_active,
    });
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedPartner) return;

    try {
      const { error } = await supabase
        .from("partners")
        .delete()
        .eq("id", selectedPartner.id);

      if (error) throw error;

      toast.success("Parceiro excluído com sucesso!");
      setDeleteDialogOpen(false);
      setSelectedPartner(null);
      fetchPartners();
    } catch (error) {
      console.error("Erro ao excluir parceiro:", error);
      toast.error("Erro ao excluir parceiro");
    }
  };

  const resetForm = () => {
    setFormData({
      company_name: "",
      description: "",
      business_area: "",
      logo_url: "",
      website_url: "",
      is_active: true,
    });
    setSelectedPartner(null);
  };

  const openNewDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Parceiros</h2>
          <p className="text-muted-foreground">
            Adicione e gerencie os parceiros exibidos no site
          </p>
        </div>
        <Button onClick={openNewDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Parceiro
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as áreas</SelectItem>
            {businessAreas.map((area) => (
              <SelectItem key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Logo</TableHead>
              <TableHead>Nome da Empresa</TableHead>
              <TableHead>Área de Atuação</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filteredPartners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Nenhum parceiro encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredPartners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell>
                    {partner.logo_url ? (
                      <img
                        src={partner.logo_url}
                        alt={partner.company_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xs">
                        Sem logo
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {partner.company_name}
                    {partner.website_url && (
                      <a
                        href={partner.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 inline-block"
                      >
                        <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary" />
                      </a>
                    )}
                  </TableCell>
                  <TableCell>{partner.business_area}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        partner.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {partner.is_active ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(partner)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedPartner(partner);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de Criar/Editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPartner ? "Editar Parceiro" : "Adicionar Parceiro"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do parceiro. Campos com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="company_name">Nome da Empresa *</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
                placeholder="Ex: MedPrime Laboratórios"
              />
            </div>

            <div>
              <Label htmlFor="description">
                Descrição (máx. 200 caracteres)
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Breve descrição do parceiro"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.description.length}/200 caracteres
              </p>
            </div>

            <div>
              <Label htmlFor="business_area">Área de Atuação *</Label>
              <Select
                value={formData.business_area}
                onValueChange={(value) =>
                  setFormData({ ...formData, business_area: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma área" />
                </SelectTrigger>
                <SelectContent>
                  {businessAreas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Logo (1:1, máx. 2MB, .jpg ou .png)</Label>
              <ImageUpload
                value={formData.logo_url}
                onChange={(url) => setFormData({ ...formData, logo_url: url })}
                onUpload={async (file: File) => {
                  const fileExt = file.name.split(".").pop();
                  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
                  const filePath = `${fileName}`;

                  const { error: uploadError } = await supabase.storage
                    .from("partners")
                    .upload(filePath, file);

                  if (uploadError) throw uploadError;

                  const { data: { publicUrl } } = supabase.storage
                    .from("partners")
                    .getPublicUrl(filePath);

                  return publicUrl;
                }}
                accept="image/jpeg,image/png,image/jpg"
                maxSize={2}
              />
            </div>

            <div>
              <Label htmlFor="website_url">Site ou Link Externo</Label>
              <Input
                id="website_url"
                type="url"
                value={formData.website_url}
                onChange={(e) =>
                  setFormData({ ...formData, website_url: e.target.value })
                }
                placeholder="https://exemplo.com.br"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <Label htmlFor="is_active">
                Exibir no site (Status: {formData.is_active ? "Ativo" : "Inativo"})
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o parceiro{" "}
              <strong>{selectedPartner?.company_name}</strong>? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
