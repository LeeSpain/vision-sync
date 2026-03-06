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
import { Plus, Edit2, Trash2, Loader2, Star } from 'lucide-react';

type Solution = {
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
};

export function SolutionsManager() {
    const { toast } = useToast();
    const [solutions, setSolutions] = useState<Solution[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSolution, setEditingSolution] = useState<Partial<Solution> | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSolutions();
    }, []);

    const fetchSolutions = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('solutions').select('*').order('sort_order', { ascending: true });
        if (error) {
            toast({ title: 'Error', description: 'Failed to fetch solutions', variant: 'destructive' });
        } else {
            const parsedData = (data || []).map(sol => ({
                ...sol,
                industries: Array.isArray(sol.industries) ? sol.industries : []
            }));
            setSolutions(parsedData as Solution[]);
        }
        setLoading(false);
    };

    const openNewSolutionModal = () => {
        setEditingSolution({
            name: '',
            slug: '',
            summary: '',
            industries: [],
            is_featured: false,
            is_active: true,
            sort_order: solutions.length
        });
        setIsModalOpen(true);
    };

    const openEditModal = (sol: Solution) => {
        setEditingSolution({ ...sol });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this solution?')) return;
        const { error } = await supabase.from('solutions').delete().eq('id', id);
        if (error) {
            toast({ title: 'Error', description: 'Failed to delete solution', variant: 'destructive' });
        } else {
            toast({ title: 'Success', description: 'Solution deleted' });
            fetchSolutions();
        }
    };

    const handleSave = async () => {
        if (!editingSolution?.name || !editingSolution?.slug) {
            toast({ title: 'Validation Error', description: 'Name and slug are required', variant: 'destructive' });
            return;
        }
        setSaving(true);

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
            sort_order: editingSolution.sort_order || 0
        };

        if (editingSolution.id) {
            const { error } = await supabase.from('solutions').update(payload).eq('id', editingSolution.id);
            if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
            else {
                toast({ title: 'Success', description: 'Solution updated' });
                setIsModalOpen(false);
                fetchSolutions();
            }
        } else {
            const { error } = await supabase.from('solutions').insert([payload]);
            if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
            else {
                toast({ title: 'Success', description: 'Solution created' });
                setIsModalOpen(false);
                fetchSolutions();
            }
        }
        setSaving(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-midnight-navy">Solutions Manager</h2>
                    <p className="text-cool-gray">Manage custom business solutions and industry outcomes.</p>
                </div>
                <Button onClick={openNewSolutionModal} className="bg-electric-blue hover:bg-electric-blue/90">
                    <Plus className="h-4 w-4 mr-2" /> Add Solution
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-8 text-center flex justify-center text-cool-gray">
                            <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
                        </div>
                    ) : solutions.length === 0 ? (
                        <div className="p-8 text-center text-cool-gray">
                            No solutions found. Create your first target solution.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Summary</TableHead>
                                    <TableHead>Featured</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {solutions.map((sol) => (
                                    <TableRow key={sol.id}>
                                        <TableCell className="font-medium">{sol.name}</TableCell>
                                        <TableCell className="truncate max-w-xs">{sol.summary}</TableCell>
                                        <TableCell>
                                            {sol.is_featured && <Star className="h-4 w-4 text-emerald-green fill-emerald-green" />}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${sol.is_active ? 'bg-emerald-green/10 text-emerald-green' : 'bg-cool-gray/20 text-cool-gray'}`}>
                                                {sol.is_active ? 'Active' : 'Draft'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => openEditModal(sol)}>
                                                <Edit2 className="h-4 w-4 text-electric-blue" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(sol.id)}>
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
                <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingSolution?.id ? 'Edit Solution' : 'Create New Solution'}</DialogTitle>
                    </DialogHeader>
                    {editingSolution && (
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Solution Name</Label>
                                <Input value={editingSolution.name || ''} onChange={e => setEditingSolution({ ...editingSolution, name: e.target.value })} placeholder="e.g. AI Customer Support" />
                            </div>
                            <div className="space-y-2">
                                <Label>Slug</Label>
                                <Input value={editingSolution.slug || ''} onChange={e => setEditingSolution({ ...editingSolution, slug: e.target.value })} placeholder="e.g. ai-customer-support" />
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label>Summary</Label>
                                <Input value={editingSolution.summary || ''} onChange={e => setEditingSolution({ ...editingSolution, summary: e.target.value })} placeholder="Short subtitle for cards." />
                            </div>

                            <div className="space-y-2 col-span-2 flex items-center justify-between mt-2 p-4 border rounded-lg">
                                <div>
                                    <Label>Featured Solution</Label>
                                    <p className="text-sm text-cool-gray">Highlight this solution prominently on the site.</p>
                                </div>
                                <Switch checked={editingSolution.is_featured || false} onCheckedChange={checked => setEditingSolution({ ...editingSolution, is_featured: checked })} />
                            </div>

                            <div className="space-y-2 col-span-2 flex items-center justify-between mt-2 p-4 border rounded-lg">
                                <div>
                                    <Label>Active Status</Label>
                                    <p className="text-sm text-cool-gray">Make this solution public on the site.</p>
                                </div>
                                <Switch checked={editingSolution.is_active || false} onCheckedChange={checked => setEditingSolution({ ...editingSolution, is_active: checked })} />
                            </div>
                        </div>
                    )}
                    <DialogFooter className="sticky bottom-0 bg-white pt-4">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving} className="bg-electric-blue hover:bg-electric-blue/90">
                            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null} Save Solution
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
