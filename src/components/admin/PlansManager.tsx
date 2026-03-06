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

type Plan = {
    id: string;
    name: string;
    slug: string;
    monthly_price: number | null;
    yearly_price: number | null;
    setup_fee: number | null;
    custom_price_label: string | null;
    description: string | null;
    features: string[]; // Simplification of jsonb for this UI
    is_active: boolean;
    sort_order: number;
};

export function PlansManager() {
    const { toast } = useToast();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Partial<Plan> | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('plans').select('*').order('sort_order', { ascending: true });
        if (error) {
            toast({ title: 'Error', description: 'Failed to fetch plans', variant: 'destructive' });
        } else {
            // Parse JSONB features array or fallback
            const parsedData = (data || []).map(plan => ({
                ...plan,
                features: Array.isArray(plan.features) ? plan.features : []
            }));
            setPlans(parsedData as Plan[]);
        }
        setLoading(false);
    };

    const openNewPlanModal = () => {
        setEditingPlan({
            name: '',
            slug: '',
            monthly_price: 0,
            description: '',
            features: [],
            is_active: true,
            sort_order: plans.length
        });
        setIsModalOpen(true);
    };

    const openEditModal = (plan: Plan) => {
        setEditingPlan({ ...plan });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this plan?')) return;
        const { error } = await supabase.from('plans').delete().eq('id', id);
        if (error) {
            toast({ title: 'Error', description: 'Failed to delete plan', variant: 'destructive' });
        } else {
            toast({ title: 'Success', description: 'Plan deleted' });
            fetchPlans();
        }
    };

    const handleSave = async () => {
        if (!editingPlan?.name || !editingPlan?.slug) {
            toast({ title: 'Validation Error', description: 'Name and slug are required', variant: 'destructive' });
            return;
        }
        setSaving(true);

        const payload = {
            name: editingPlan.name,
            slug: editingPlan.slug,
            monthly_price: editingPlan.monthly_price || null,
            yearly_price: editingPlan.yearly_price || null,
            custom_price_label: editingPlan.custom_price_label || null,
            description: editingPlan.description || '',
            features: editingPlan.features || [],
            is_active: editingPlan.is_active ?? true,
            sort_order: editingPlan.sort_order || 0
        };

        if (editingPlan.id) {
            // Update
            const { error } = await supabase.from('plans').update(payload).eq('id', editingPlan.id);
            if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
            else {
                toast({ title: 'Success', description: 'Plan updated' });
                setIsModalOpen(false);
                fetchPlans();
            }
        } else {
            // Insert
            const { error } = await supabase.from('plans').insert([payload]);
            if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
            else {
                toast({ title: 'Success', description: 'Plan created' });
                setIsModalOpen(false);
                fetchPlans();
            }
        }
        setSaving(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-midnight-navy">Plans Manager</h2>
                    <p className="text-cool-gray">Manage pricing tiers and subscriptions for Vision-Sync platforms.</p>
                </div>
                <Button onClick={openNewPlanModal} className="bg-royal-purple hover:bg-royal-purple/90">
                    <Plus className="h-4 w-4 mr-2" /> Add Plan
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-8 text-center flex justify-center text-cool-gray">
                            <Loader2 className="h-8 w-8 animate-spin text-royal-purple" />
                        </div>
                    ) : plans.length === 0 ? (
                        <div className="p-8 text-center text-cool-gray">
                            No plans found. Create your first pricing tier.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plans.map((plan) => (
                                    <TableRow key={plan.id}>
                                        <TableCell>{plan.sort_order}</TableCell>
                                        <TableCell className="font-medium">{plan.name}</TableCell>
                                        <TableCell>
                                            {plan.custom_price_label
                                                ? plan.custom_price_label
                                                : plan.monthly_price !== null ? `$${plan.monthly_price}/mo` : 'Free'}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${plan.is_active ? 'bg-emerald-green/10 text-emerald-green' : 'bg-cool-gray/20 text-cool-gray'}`}>
                                                {plan.is_active ? 'Active' : 'Draft'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => openEditModal(plan)}>
                                                <Edit2 className="h-4 w-4 text-electric-blue" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(plan.id)}>
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
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingPlan?.id ? 'Edit Plan' : 'Create New Plan'}</DialogTitle>
                    </DialogHeader>
                    {editingPlan && (
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Plan Name</Label>
                                <Input value={editingPlan.name || ''} onChange={e => setEditingPlan({ ...editingPlan, name: e.target.value })} placeholder="e.g. Growth Stack" />
                            </div>
                            <div className="space-y-2">
                                <Label>Slug</Label>
                                <Input value={editingPlan.slug || ''} onChange={e => setEditingPlan({ ...editingPlan, slug: e.target.value })} placeholder="e.g. growth-stack" />
                            </div>

                            <div className="space-y-2">
                                <Label>Monthly Price ($)</Label>
                                <Input type="number" value={editingPlan.monthly_price || ''} onChange={e => setEditingPlan({ ...editingPlan, monthly_price: parseFloat(e.target.value) })} placeholder="e.g. 1299" />
                            </div>
                            <div className="space-y-2">
                                <Label>Custom Price Label (Optional)</Label>
                                <Input value={editingPlan.custom_price_label || ''} onChange={e => setEditingPlan({ ...editingPlan, custom_price_label: e.target.value })} placeholder="e.g. Custom or Contact Us" />
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label>Description</Label>
                                <Input value={editingPlan.description || ''} onChange={e => setEditingPlan({ ...editingPlan, description: e.target.value })} placeholder="Short description for the pricing card" />
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label>Features (comma separated)</Label>
                                <Input
                                    value={(editingPlan.features || []).join(', ')}
                                    onChange={e => setEditingPlan({ ...editingPlan, features: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                    placeholder="e.g. 5 AI Agents, Custom CRM Integration, Priority Support"
                                />
                            </div>

                            <div className="space-y-2 flex items-center justify-between col-span-2 mt-4 p-4 border rounded-lg">
                                <div>
                                    <Label>Active Status</Label>
                                    <p className="text-sm text-cool-gray">Make this plan visible on the pricing page.</p>
                                </div>
                                <Switch checked={editingPlan.is_active || false} onCheckedChange={checked => setEditingPlan({ ...editingPlan, is_active: checked })} />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving} className="bg-royal-purple hover:bg-royal-purple/90">
                            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null} Save Plan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
