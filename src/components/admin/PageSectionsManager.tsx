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
import { Plus, Edit2, Trash2, Loader2, LayoutTemplate } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

type PageSection = {
    id: string;
    page_key: string;
    section_key: string;
    title: string | null;
    subtitle: string | null;
    content: string | null;
    cta_label: string | null;
    cta_link: string | null;
    image_url: string | null;
    is_active: boolean;
    sort_order: number;
};

export function PageSectionsManager() {
    const { toast } = useToast();
    const [sections, setSections] = useState<PageSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<Partial<PageSection> | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('page_sections').select('*').order('page_key', { ascending: true }).order('sort_order', { ascending: true });
        if (error) {
            toast({ title: 'Error', description: 'Failed to fetch page sections', variant: 'destructive' });
        } else {
            setSections((data || []) as PageSection[]);
        }
        setLoading(false);
    };

    const openNewSectionModal = () => {
        setEditingSection({
            page_key: 'homepage',
            section_key: '',
            title: '',
            subtitle: '',
            content: '',
            is_active: true,
            sort_order: 0
        });
        setIsModalOpen(true);
    };

    const openEditModal = (sec: PageSection) => {
        setEditingSection({ ...sec });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this section block?')) return;
        const { error } = await supabase.from('page_sections').delete().eq('id', id);
        if (error) {
            toast({ title: 'Error', description: 'Failed to delete section', variant: 'destructive' });
        } else {
            toast({ title: 'Success', description: 'Section deleted' });
            fetchSections();
        }
    };

    const handleSave = async () => {
        if (!editingSection?.page_key || !editingSection?.section_key) {
            toast({ title: 'Validation Error', description: 'Page Key and Section Key are required', variant: 'destructive' });
            return;
        }
        setSaving(true);

        const payload = {
            page_key: editingSection.page_key,
            section_key: editingSection.section_key,
            title: editingSection.title || null,
            subtitle: editingSection.subtitle || null,
            content: editingSection.content || null,
            cta_label: editingSection.cta_label || null,
            cta_link: editingSection.cta_link || null,
            image_url: editingSection.image_url || null,
            is_active: editingSection.is_active ?? true,
            sort_order: editingSection.sort_order || 0
        };

        if (editingSection.id) {
            const { error } = await supabase.from('page_sections').update(payload).eq('id', editingSection.id);
            if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
            else {
                toast({ title: 'Success', description: 'Section updated' });
                setIsModalOpen(false);
                fetchSections();
            }
        } else {
            const { error } = await supabase.from('page_sections').insert([payload]);
            if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
            else {
                toast({ title: 'Success', description: 'Section created' });
                setIsModalOpen(false);
                fetchSections();
            }
        }
        setSaving(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-midnight-navy">Page Sections Manager</h2>
                    <p className="text-cool-gray">Manage dynamic content blocks across the site (e.g., Homepage Hero, Footer texts).</p>
                </div>
                <Button onClick={openNewSectionModal} className="bg-coral-orange hover:bg-coral-orange/90">
                    <Plus className="h-4 w-4 mr-2" /> Add Section
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-8 text-center flex justify-center text-cool-gray">
                            <Loader2 className="h-8 w-8 animate-spin text-coral-orange" />
                        </div>
                    ) : sections.length === 0 ? (
                        <div className="p-8 text-center text-cool-gray">
                            No sections found. Add a block to dynamically control public pages.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Page Key</TableHead>
                                    <TableHead>Section Key</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sections.map((sec) => (
                                    <TableRow key={sec.id}>
                                        <TableCell className="font-medium text-electric-blue">{sec.page_key}</TableCell>
                                        <TableCell className="font-mono text-sm">{sec.section_key}</TableCell>
                                        <TableCell className="truncate max-w-xs">{sec.title || <span className="text-cool-gray italic">No Title</span>}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${sec.is_active ? 'bg-emerald-green/10 text-emerald-green' : 'bg-cool-gray/20 text-cool-gray'}`}>
                                                {sec.is_active ? 'Active' : 'Draft'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => openEditModal(sec)}>
                                                <Edit2 className="h-4 w-4 text-electric-blue" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(sec.id)}>
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
                <DialogContent className="max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <LayoutTemplate className="h-5 w-5 text-coral-orange" />
                            {editingSection?.id ? 'Edit Page Section' : 'Add New Page Section'}
                        </DialogTitle>
                    </DialogHeader>
                    {editingSection && (
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Page Key</Label>
                                <Input value={editingSection.page_key || ''} onChange={e => setEditingSection({ ...editingSection, page_key: e.target.value })} placeholder="e.g. homepage, pricing, platform" />
                            </div>
                            <div className="space-y-2">
                                <Label>Section Key</Label>
                                <Input value={editingSection.section_key || ''} onChange={e => setEditingSection({ ...editingSection, section_key: e.target.value })} placeholder="e.g. hero-area, features-list" />
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label>Section Title</Label>
                                <Input value={editingSection.title || ''} onChange={e => setEditingSection({ ...editingSection, title: e.target.value })} placeholder="Main headline text" />
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label>Content / Body Text</Label>
                                <Textarea value={editingSection.content || ''} onChange={e => setEditingSection({ ...editingSection, content: e.target.value })} placeholder="The main copy of this section." className="h-32" />
                            </div>

                            <div className="space-y-2">
                                <Label>CTA Label</Label>
                                <Input value={editingSection.cta_label || ''} onChange={e => setEditingSection({ ...editingSection, cta_label: e.target.value })} placeholder="e.g. Learn More" />
                            </div>
                            <div className="space-y-2">
                                <Label>CTA Link</Label>
                                <Input value={editingSection.cta_link || ''} onChange={e => setEditingSection({ ...editingSection, cta_link: e.target.value })} placeholder="e.g. /pricing" />
                            </div>

                            <div className="space-y-2 col-span-2 flex items-center justify-between mt-4 p-4 border rounded-lg">
                                <div>
                                    <Label>Active Status</Label>
                                    <p className="text-sm text-cool-gray">Show this section on the public site if referenced in code.</p>
                                </div>
                                <Switch checked={editingSection.is_active || false} onCheckedChange={checked => setEditingSection({ ...editingSection, is_active: checked })} />
                            </div>
                        </div>
                    )}
                    <DialogFooter className="sticky bottom-0 bg-white pt-4">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving} className="bg-coral-orange hover:bg-coral-orange/90">
                            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null} Save Section
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
