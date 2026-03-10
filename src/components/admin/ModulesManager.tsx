import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit2, Trash2, Loader2, Mic } from 'lucide-react';

const INDUSTRY_SLUGS = [
  { slug: 'estate-agents', label: 'Estate Agents' },
  { slug: 'dental-clinics', label: 'Dental & Health Clinics' },
  { slug: 'legal-gestorias', label: 'Legal Firms & Gestorias' },
  { slug: 'holiday-rentals', label: 'Holiday Rentals & Property Mgmt' },
  { slug: 'gyms-fitness', label: 'Gyms & Fitness Studios' },
  { slug: 'building-renovation', label: 'Building & Renovation' },
  { slug: 'restaurants-bars', label: 'Restaurants & Bars' },
  { slug: 'beauty-hair', label: 'Beauty & Hair Salons' },
];

type Module = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  long_description: string | null;
  monthly_addon_price: number | null;
  setup_fee: number | null;
  features: string[];
  is_active: boolean;
  sort_order: number;
  internal_cost: number | null;
  ex_vat_price: number | null;
  iva_amount: number | null;
  total_inc_vat: number | null;
  is_voice_module: boolean;
  voice_minutes: number | null;
  industry_slugs: string[];
};

export function ModulesManager() {
  const { toast } = useToast();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Partial<Module> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchModules(); }, []);

  const fetchModules = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('modules').select('*').order('sort_order', { ascending: true });
    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch modules', variant: 'destructive' });
    } else {
      const parsedData = (data || []).map(mod => ({
        ...mod,
        features: Array.isArray(mod.features) ? mod.features : [],
        industry_slugs: Array.isArray(mod.industry_slugs) ? mod.industry_slugs : [],
        is_voice_module: mod.is_voice_module || false,
      }));
      setModules(parsedData as Module[]);
    }
    setLoading(false);
  };

  const openNewModuleModal = () => {
    setEditingModule({
      name: '', slug: '', short_description: '', monthly_addon_price: 0,
      features: [], is_active: true, sort_order: modules.length,
      internal_cost: null, ex_vat_price: null, iva_amount: null, total_inc_vat: null,
      is_voice_module: false, voice_minutes: null, industry_slugs: []
    });
    setIsModalOpen(true);
  };

  const openEditModal = (mod: Module) => {
    setEditingModule({ ...mod });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this module?')) return;
    const { error } = await supabase.from('modules').delete().eq('id', id);
    if (error) toast({ title: 'Error', description: 'Failed to delete module', variant: 'destructive' });
    else { toast({ title: 'Success', description: 'Module deleted' }); fetchModules(); }
  };

  const handleExVatChange = (val: number) => {
    const iva = parseFloat((val * 0.21).toFixed(2));
    const total = parseFloat((val * 1.21).toFixed(2));
    setEditingModule(prev => prev ? { ...prev, ex_vat_price: val, iva_amount: iva, total_inc_vat: total } : prev);
  };

  const toggleIndustrySlug = (slug: string) => {
    setEditingModule(prev => {
      if (!prev) return prev;
      const current = prev.industry_slugs || [];
      const updated = current.includes(slug)
        ? current.filter(s => s !== slug)
        : [...current, slug];
      return { ...prev, industry_slugs: updated };
    });
  };

  const handleSave = async () => {
    if (!editingModule?.name || !editingModule?.slug) {
      toast({ title: 'Validation Error', description: 'Name and slug are required', variant: 'destructive' });
      return;
    }
    setSaving(true);

    const payload = {
      name: editingModule.name,
      slug: editingModule.slug,
      short_description: editingModule.short_description || null,
      long_description: editingModule.long_description || null,
      monthly_addon_price: editingModule.monthly_addon_price || null,
      setup_fee: editingModule.setup_fee || null,
      features: editingModule.features || [],
      is_active: editingModule.is_active ?? true,
      sort_order: editingModule.sort_order || 0,
      internal_cost: editingModule.internal_cost || null,
      ex_vat_price: editingModule.ex_vat_price || null,
      iva_amount: editingModule.iva_amount || null,
      total_inc_vat: editingModule.total_inc_vat || null,
      is_voice_module: editingModule.is_voice_module || false,
      voice_minutes: editingModule.is_voice_module ? (editingModule.voice_minutes || null) : null,
      industry_slugs: editingModule.industry_slugs || [],
    };

    if (editingModule.id) {
      const { error } = await supabase.from('modules').update(payload).eq('id', editingModule.id);
      if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
      else { toast({ title: 'Success', description: 'Module updated' }); setIsModalOpen(false); fetchModules(); }
    } else {
      const { error } = await supabase.from('modules').insert([payload]);
      if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
      else { toast({ title: 'Success', description: 'Module created' }); setIsModalOpen(false); fetchModules(); }
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-midnight-navy">Modules Manager</h2>
          <p className="text-cool-gray">Manage add-on modules available to industries.</p>
        </div>
        <Button onClick={openNewModuleModal} className="bg-emerald-green hover:bg-emerald-green/90">
          <Plus className="h-4 w-4 mr-2" /> Add Module
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-green" /></div>
          ) : modules.length === 0 ? (
            <div className="p-8 text-center text-cool-gray">No modules found. Create your first module.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Ex VAT</TableHead>
                  <TableHead>Total inc VAT</TableHead>
                  <TableHead>Industries</TableHead>
                  <TableHead>Voice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((mod) => (
                  <TableRow key={mod.id}>
                    <TableCell className="font-medium">{mod.name}</TableCell>
                    <TableCell>{mod.ex_vat_price ? `€${mod.ex_vat_price}` : '—'}</TableCell>
                    <TableCell>{mod.total_inc_vat ? `€${mod.total_inc_vat}/mo` : '—'}</TableCell>
                    <TableCell>
                      <span className="text-xs text-cool-gray">{(mod.industry_slugs || []).length} industries</span>
                    </TableCell>
                    <TableCell>
                      {mod.is_voice_module && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                          <Mic className="h-3 w-3" /> Voice
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${mod.is_active ? 'bg-emerald-green/10 text-emerald-green' : 'bg-cool-gray/20 text-cool-gray'}`}>
                        {mod.is_active ? 'Active' : 'Draft'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(mod)}><Edit2 className="h-4 w-4 text-electric-blue" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(mod.id)}><Trash2 className="h-4 w-4 text-coral-orange" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingModule?.id ? 'Edit Module' : 'Create New Module'}</DialogTitle>
          </DialogHeader>
          {editingModule && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Module Name</Label>
                <Input value={editingModule.name || ''} onChange={e => setEditingModule({ ...editingModule, name: e.target.value })} placeholder="e.g. WhatsApp Integration" />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={editingModule.slug || ''} onChange={e => setEditingModule({ ...editingModule, slug: e.target.value })} placeholder="e.g. whatsapp-integration" />
              </div>

              <div className="space-y-2">
                <Label>Internal Cost (€) — Admin only</Label>
                <Input type="number" value={editingModule.internal_cost || ''} onChange={e => setEditingModule({ ...editingModule, internal_cost: parseFloat(e.target.value) })} placeholder="Your cost" />
              </div>
              <div className="space-y-2">
                <Label>Ex VAT Price (€)</Label>
                <Input type="number" value={editingModule.ex_vat_price || ''} onChange={e => handleExVatChange(parseFloat(e.target.value) || 0)} placeholder="e.g. 99" />
              </div>

              <div className="space-y-2">
                <Label>IVA Amount (€) — auto-calculated</Label>
                <Input readOnly value={editingModule.iva_amount?.toFixed(2) || ''} className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label>Total inc VAT (€) — auto-calculated</Label>
                <Input readOnly value={editingModule.total_inc_vat?.toFixed(2) || ''} className="bg-slate-50" />
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Short Description</Label>
                <Input value={editingModule.short_description || ''} onChange={e => setEditingModule({ ...editingModule, short_description: e.target.value })} placeholder="Displayed on module cards" />
              </div>

              <div className="col-span-2 space-y-3 p-4 border rounded-lg">
                <Label className="text-sm font-semibold">Industries (select which industries can use this module)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {INDUSTRY_SLUGS.map(ind => (
                    <label key={ind.slug} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={(editingModule.industry_slugs || []).includes(ind.slug)}
                        onChange={() => toggleIndustrySlug(ind.slug)}
                        className="rounded"
                      />
                      {ind.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="col-span-2 space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Voice Module</Label>
                    <p className="text-sm text-cool-gray">This module provides voice call minutes.</p>
                  </div>
                  <Switch checked={editingModule.is_voice_module || false} onCheckedChange={checked => setEditingModule({ ...editingModule, is_voice_module: checked })} />
                </div>
                {editingModule.is_voice_module && (
                  <div className="space-y-2">
                    <Label>Voice Minutes</Label>
                    <Input type="number" value={editingModule.voice_minutes || ''} onChange={e => setEditingModule({ ...editingModule, voice_minutes: parseInt(e.target.value) })} placeholder="e.g. 500" />
                  </div>
                )}
              </div>

              <div className="space-y-2 col-span-2 flex items-center justify-between mt-2 p-4 border rounded-lg">
                <div>
                  <Label>Active Status</Label>
                  <p className="text-sm text-cool-gray">Make this module visible in the package builder.</p>
                </div>
                <Switch checked={editingModule.is_active || false} onCheckedChange={checked => setEditingModule({ ...editingModule, is_active: checked })} />
              </div>
            </div>
          )}
          <DialogFooter className="sticky bottom-0 bg-white pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-emerald-green hover:bg-emerald-green/90">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null} Save Module
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
