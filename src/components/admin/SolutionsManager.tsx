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

const INDUSTRY_SLUG_OPTIONS = [
  'estate-agents', 'dental-clinics', 'legal-gestorias', 'holiday-rentals',
  'gyms-fitness', 'building-renovation', 'restaurants-bars', 'beauty-hair'
];

type IndustryRow = {
  id: string;
  name: string;
  slug: string;
  summary: string | null;
  description: string | null;
  industries: string[];
  cta_label: string | null;
  cta_link: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  industry_slug: string | null;
  internal_cost: number | null;
  ex_vat_price: number | null;
  iva_amount: number | null;
  total_inc_vat: number | null;
  voice_included: boolean;
  voice_minutes_included: number | null;
  pain_statement: string | null;
  base_includes: string[];
  icon_name: string | null;
};

export function SolutionsManager() {
  const { toast } = useToast();
  const [solutions, setSolutions] = useState<IndustryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSolution, setEditingSolution] = useState<Partial<IndustryRow> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSolutions(); }, []);

  const fetchSolutions = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('solutions').select('*').order('sort_order', { ascending: true });
    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch solutions', variant: 'destructive' });
    } else {
      const parsedData = (data || []).map(sol => ({
        ...sol,
        industries: Array.isArray(sol.industries) ? sol.industries : [],
        base_includes: Array.isArray(sol.base_includes) ? sol.base_includes : [],
        voice_included: sol.voice_included || false,
      }));
      setSolutions(parsedData as IndustryRow[]);
    }
    setLoading(false);
  };

  const openNewModal = () => {
    setEditingSolution({
      name: '', slug: '', summary: '', industries: [],
      is_featured: false, is_active: true, sort_order: solutions.length,
      industry_slug: null, internal_cost: null, ex_vat_price: null,
      iva_amount: null, total_inc_vat: null, voice_included: false,
      voice_minutes_included: null, pain_statement: null,
      base_includes: [], icon_name: null
    });
    setIsModalOpen(true);
  };

  const openEditModal = (sol: IndustryRow) => {
    setEditingSolution({ ...sol });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this industry record?')) return;
    const { error } = await supabase.from('solutions').delete().eq('id', id);
    if (error) toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    else { toast({ title: 'Success', description: 'Deleted' }); fetchSolutions(); }
  };

  const handleExVatChange = (val: number) => {
    const iva = parseFloat((val * 0.21).toFixed(2));
    const total = parseFloat((val * 1.21).toFixed(2));
    setEditingSolution(prev => prev ? { ...prev, ex_vat_price: val, iva_amount: iva, total_inc_vat: total } : prev);
  };

  const handleSave = async () => {
    if (!editingSolution?.name || !editingSolution?.slug) {
      toast({ title: 'Validation Error', description: 'Name and slug are required', variant: 'destructive' });
      return;
    }
    setSaving(true);

    const baseIncludesStr = (editingSolution.base_includes || []);
    const payload = {
      name: editingSolution.name,
      slug: editingSolution.slug,
      summary: editingSolution.summary || null,
      description: editingSolution.description || null,
      industries: editingSolution.industries || [],
      cta_label: editingSolution.cta_label || null,
      cta_link: editingSolution.cta_link || null,
      is_featured: editingSolution.is_featured ?? false,
      is_active: editingSolution.is_active ?? true,
      sort_order: editingSolution.sort_order || 0,
      industry_slug: editingSolution.industry_slug || null,
      internal_cost: editingSolution.internal_cost || null,
      ex_vat_price: editingSolution.ex_vat_price || null,
      iva_amount: editingSolution.iva_amount || null,
      total_inc_vat: editingSolution.total_inc_vat || null,
      voice_included: editingSolution.voice_included || false,
      voice_minutes_included: editingSolution.voice_included ? (editingSolution.voice_minutes_included || null) : null,
      pain_statement: editingSolution.pain_statement || null,
      base_includes: baseIncludesStr,
      icon_name: editingSolution.icon_name || null,
    };

    if (editingSolution.id) {
      const { error } = await supabase.from('solutions').update(payload).eq('id', editingSolution.id);
      if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
      else { toast({ title: 'Success', description: 'Updated' }); setIsModalOpen(false); fetchSolutions(); }
    } else {
      const { error } = await supabase.from('solutions').insert([payload]);
      if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
      else { toast({ title: 'Success', description: 'Created' }); setIsModalOpen(false); fetchSolutions(); }
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-midnight-navy">Industry Manager</h2>
          <p className="text-cool-gray">Manage industry base packages and pricing data.</p>
        </div>
        <Button onClick={openNewModal} className="bg-electric-blue hover:bg-electric-blue/90">
          <Plus className="h-4 w-4 mr-2" /> Add Industry
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-electric-blue" /></div>
          ) : solutions.length === 0 ? (
            <div className="p-8 text-center text-cool-gray">No industry records. Add an industry to get started.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Industry Slug</TableHead>
                  <TableHead>Ex VAT Price</TableHead>
                  <TableHead>Total inc VAT</TableHead>
                  <TableHead>Voice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solutions.map((sol) => (
                  <TableRow key={sol.id}>
                    <TableCell className="font-medium">{sol.name}</TableCell>
                    <TableCell className="text-cool-gray text-sm font-mono">{sol.industry_slug || sol.slug}</TableCell>
                    <TableCell>{sol.ex_vat_price ? `€${sol.ex_vat_price}` : '—'}</TableCell>
                    <TableCell>{sol.total_inc_vat ? `€${sol.total_inc_vat}/mo` : '—'}</TableCell>
                    <TableCell>
                      {sol.voice_included && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                          <Mic className="h-3 w-3" /> {sol.voice_minutes_included?.toLocaleString()} mins
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${sol.is_active ? 'bg-emerald-green/10 text-emerald-green' : 'bg-cool-gray/20 text-cool-gray'}`}>
                        {sol.is_active ? 'Active' : 'Draft'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(sol)}><Edit2 className="h-4 w-4 text-electric-blue" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(sol.id)}><Trash2 className="h-4 w-4 text-coral-orange" /></Button>
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
            <DialogTitle>{editingSolution?.id ? 'Edit Industry' : 'Add Industry'}</DialogTitle>
          </DialogHeader>
          {editingSolution && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Industry Name</Label>
                <Input value={editingSolution.name || ''} onChange={e => setEditingSolution({ ...editingSolution, name: e.target.value })} placeholder="e.g. Estate Agents" />
              </div>
              <div className="space-y-2">
                <Label>Industry Slug</Label>
                <select
                  value={editingSolution.industry_slug || ''}
                  onChange={e => setEditingSolution({ ...editingSolution, industry_slug: e.target.value, slug: e.target.value })}
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Select slug...</option>
                  {INDUSTRY_SLUG_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Pain Statement</Label>
                <Input value={editingSolution.pain_statement || ''} onChange={e => setEditingSolution({ ...editingSolution, pain_statement: e.target.value })} placeholder="The main pain point this industry faces..." />
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Base Includes (comma-separated)</Label>
                <Input
                  value={(editingSolution.base_includes || []).join(', ')}
                  onChange={e => setEditingSolution({ ...editingSolution, base_includes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  placeholder="AI Chat Agent, Lead Capture, 24/7 Availability"
                />
              </div>

              <div className="space-y-2">
                <Label>Internal Cost (€)</Label>
                <Input type="number" value={editingSolution.internal_cost || ''} onChange={e => setEditingSolution({ ...editingSolution, internal_cost: parseFloat(e.target.value) })} placeholder="Your cost" />
              </div>
              <div className="space-y-2">
                <Label>Ex VAT Price (€)</Label>
                <Input type="number" value={editingSolution.ex_vat_price || ''} onChange={e => handleExVatChange(parseFloat(e.target.value) || 0)} placeholder="e.g. 349" />
              </div>

              <div className="space-y-2">
                <Label>IVA Amount (€) — auto</Label>
                <Input readOnly value={editingSolution.iva_amount?.toFixed(2) || ''} className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label>Total inc VAT (€) — auto</Label>
                <Input readOnly value={editingSolution.total_inc_vat?.toFixed(2) || ''} className="bg-slate-50" />
              </div>

              <div className="col-span-2 space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Voice Included</Label>
                    <p className="text-sm text-cool-gray">Base package includes voice agent minutes.</p>
                  </div>
                  <Switch checked={editingSolution.voice_included || false} onCheckedChange={checked => setEditingSolution({ ...editingSolution, voice_included: checked })} />
                </div>
                {editingSolution.voice_included && (
                  <div className="space-y-2">
                    <Label>Voice Minutes Included</Label>
                    <Input type="number" value={editingSolution.voice_minutes_included || ''} onChange={e => setEditingSolution({ ...editingSolution, voice_minutes_included: parseInt(e.target.value) })} placeholder="e.g. 1500" />
                  </div>
                )}
              </div>

              <div className="space-y-2 col-span-2 flex items-center justify-between mt-2 p-4 border rounded-lg">
                <div>
                  <Label>Active Status</Label>
                  <p className="text-sm text-cool-gray">Make this industry visible on the site.</p>
                </div>
                <Switch checked={editingSolution.is_active || false} onCheckedChange={checked => setEditingSolution({ ...editingSolution, is_active: checked })} />
              </div>
            </div>
          )}
          <DialogFooter className="sticky bottom-0 bg-white pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-electric-blue hover:bg-electric-blue/90">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
