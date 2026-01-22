import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HealthPlan {
  id: string;
  name: string;
  is_particular: boolean;
  is_active: boolean;
}

export function HealthPlansTab() {
  const [healthPlans, setHealthPlans] = useState<HealthPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<HealthPlan | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    is_particular: false,
    is_active: true,
  });

  useEffect(() => {
    fetchHealthPlans();
  }, []);

  const fetchHealthPlans = async () => {
    const { data, error } = await supabase
      .from("health_plans" as any)
      .select("*")
      .order("is_particular", { ascending: false })
      .order("name");

    if (error) {
      toast({
        title: "Erro ao carregar planos",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setHealthPlans((data as unknown as HealthPlan[]) || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      is_particular: false,
      is_active: true,
    });
    setEditingPlan(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingPlan) {
        const { error } = await supabase
          .from("health_plans" as any)
          .update({
            name: formData.name,
            is_particular: formData.is_particular,
            is_active: formData.is_active,
          })
          .eq("id", editingPlan.id);

        if (error) throw error;

        toast({
          title: "Plano atualizado",
          description: "Os dados foram salvos com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from("health_plans" as any)
          .insert({
            name: formData.name,
            is_particular: formData.is_particular,
            is_active: formData.is_active,
          });

        if (error) throw error;

        toast({
          title: "Plano adicionado",
          description: "Novo plano cadastrado com sucesso.",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchHealthPlans();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    }

    setSaving(false);
  };

  const handleEdit = (plan: HealthPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      is_particular: plan.is_particular,
      is_active: plan.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir ${name}?`)) return;

    const { error } = await supabase
      .from("health_plans" as any)
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
        title: "Plano excluído",
        description: `${name} foi removido com sucesso.`,
      });
      fetchHealthPlans();
    }
  };

  const toggleActive = async (plan: HealthPlan) => {
    const { error } = await supabase
      .from("health_plans" as any)
      .update({ is_active: !plan.is_active })
      .eq("id", plan.id);

    if (error) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    } else {
      fetchHealthPlans();
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Carregando planos de saúde...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Planos de Saúde Cadastrados</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Plano
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? "Editar Plano" : "Novo Plano de Saúde"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Plano *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Unimed, Hapvida, Particular..."
                  required
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_particular">É Particular?</Label>
                  <p className="text-sm text-muted-foreground">
                    Marque se for atendimento particular (sem convênio)
                  </p>
                </div>
                <Switch
                  id="is_particular"
                  checked={formData.is_particular}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_particular: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_active">Ativo</Label>
                  <p className="text-sm text-muted-foreground">
                    Planos inativos não aparecem para seleção
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Salvando..." : editingPlan ? "Salvar Alterações" : "Adicionar"}
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
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[120px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {healthPlans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Nenhum plano cadastrado
                </TableCell>
              </TableRow>
            ) : (
              healthPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      {plan.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={plan.is_particular ? "secondary" : "default"}>
                      {plan.is_particular ? "Particular" : "Convênio"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={plan.is_active}
                      onCheckedChange={() => toggleActive(plan)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(plan)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(plan.id, plan.name)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
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
