import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';

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
};

export function ModulesManager() {
    const { toast } = useToast();
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingModule, setEditingModule] = useState<Partial<Module> | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('modules').select('*').order('sort_order', { ascending: true });
        if (error) {
            toast({ title: 'Error', description: 'Failed to fetch modules', variant: 'destructive' });
        } else {
            const parsedData = (data || []).map(mod => ({
                ...mod,
                features: Array.isArray(mod.features) ? mod.features : []
            }));
            setModules(parsedData as Module[]);
        }
        setLoading(false);
    };

    const openNewModuleModal = () => {
        setEditingModule({
            name: '',
            slug: '',
            short_description: '',
            monthly_addon_price: 0,
            features: [],
            is_active: true,
            sort_order: modules.length
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
        if (error) {
            toast({ title: 'Error', description: 'Failed to delete module', variant: 'destructive' });
        } else {
            toast({ title: 'Success', description: 'Module deleted' });
            fetchModules();
        }
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
            sort_order: editingModule.sort_order || 0
        };

        if (editingModule.id) {
            const { error } = await supabase.from('modules').update(payload).eq('id', editingModule.id);
            if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
            else {
                toast({ title: 'Success', description: 'Module updated' });
                setIsModalOpen(false);
                fetchModules();
            }
        } else {
            const { error } = await supabase.from('modules').insert([payload]);
            if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
            else {
                toast({ title: 'Success', description: 'Module created' });
                setIsModalOpen(false);
                fetchModules();
            }
        }
        setSaving(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-midnight-navy">Modules Manager</h2>
                    <p className="text-cool-gray">Manage the core automation building blocks and add-ons.</p>
                </div>
                <Button onClick={openNewModuleModal} className="bg-emerald-green hover:bg-emerald-green/90">
                    <Plus className="h-4 w-4 mr-2" /> Add Module
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-8 text-center flex justify-center text-cool-gray">
                            <Loader2 className="h-8 w-8 animate-spin text-emerald-green" />
                        </div>
                    ) : modules.length === 0 ? (
                        <div className="p-8 text-center text-cool-gray">
                            No modules found. Create your first module node.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Short Desc</TableHead>
                                    <TableHead>Add-on Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {modules.map((mod) => (
                                    <TableRow key={mod.id}>
                                        <TableCell className="font-medium">{mod.name}</TableCell>
                                        <TableCell className="truncate max-w-xs">{mod.short_description}</TableCell>
                                        <TableCell>
                                            {mod.monthly_addon_price !== null ? `$${mod.monthly_addon_price}/mo` : 'Included'}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${mod.is_active ? 'bg-emerald-green/10 text-emerald-green' : 'bg-cool-gray/20 text-cool-gray'}`}>
                                                {mod.is_active ? 'Active' : 'Draft'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => openEditModal(mod)}>
                                                <Edit2 className="h-4 w-4 text-electric-blue" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(mod.id)}>
                                                <Trash2 className="h-4 w-4 text-coral-orange" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl bg-white">
                    <DialogHeader>
                        <DialogTitle>{editingModule?.id ? 'Edit Module' : 'Create New Module'}</DialogTitle>
                    </DialogHeader>
                    {editingModule && (
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Module Name</Label>
                                <Input value={editingModule.name || ''} onChange={e => setEditingModule({ ...editingModule, name: e.target.value })} placeholder="e.g. AI Sales Sync" />
                            </div>
                            <div className="space-y-2">
                                <Label>Slug</Label>
                                <Input value={editingModule.slug || ''} onChange={e => setEditingModule({ ...editingModule, slug: e.target.value })} placeholder="e.g. ai-sales-sync" />
                            </div>

                            <div className="space-y-2">
                                <Label>Monthly Add-on Price ($)</Label>
                                <Input type="number" value={editingModule.monthly_addon_price || ''} onChange={e => setEditingModule({ ...editingModule, monthly_addon_price: parseFloat(e.target.value) })} placeholder="e.g. 299 (Leave blank for included)" />
                            </div>
                            <div className="space-y-2">
                                <Label>Setup Fee ($)</Label>
                                <Input type="number" value={editingModule.setup_fee || ''} onChange={e => setEditingModule({ ...editingModule, setup_fee: parseFloat(e.target.value) })} placeholder="Optional: 1500" />
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label>Short Description</Label>
                                <Input value={editingModule.short_description || ''} onChange={e => setEditingModule({ ...editingModule, short_description: e.target.value })} placeholder="Displayed on cards" />
                            </div>

                            <div className="space-y-2 col-span-2 flex items-center justify-between mt-4 p-4 border rounded-lg">
                                <div>
                                    <Label>Active Status</Label>
                                    <p className="text-sm text-cool-gray">Make this module public on the site.</p>
                                </div>
                                <Switch checked={editingModule.is_active || false} onCheckedChange={checked => setEditingModule({ ...editingModule, is_active: checked })} />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
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
