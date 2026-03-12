import { useState, useEffect } from "react";
import { VisionFamilyApp, VisionFamilyAppInsert, VisionFamilyAppUpdate } from "@/types/visionFamily";
import {
    fetchAllApps, insertApp, updateApp, deleteApp, isUsingLocalStorage
} from "@/lib/visionFamilyStore";
import {
    Plus, Edit, Trash2, Eye, EyeOff, Star, StarOff,
    Loader2, Save, AlertTriangle, Database
} from "lucide-react";
import { toast } from "sonner";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const CATEGORIES = ["App", "Platform", "Tool", "Service", "API", "Other"];
const COLOR_SWATCHES = [
    "#3b82f6", // Blue
    "#06b6d4", // Cyan
    "#10b981", // Emerald
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#64748b", // Slate
];

const DEFAULT_FORM_STATE: Partial<VisionFamilyApp> = {
    name: "",
    tagline: "",
    description: "",
    url: "",
    logo_url: "",
    logo_emoji: "\u{1F517}",
    accent_color: "#06b6d4",
    category: "App",
    is_published: false,
    is_featured: false,
    display_order: 0,
    powered_by: [],
};

export function VisionFamilyManager() {
    const [apps, setApps] = useState<VisionFamilyApp[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLocal, setIsLocal] = useState(false);

    // Modal states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form handling
    const [formData, setFormData] = useState<Partial<VisionFamilyApp>>(DEFAULT_FORM_STATE);
    const [poweredByInput, setPoweredByInput] = useState("");

    const loadApps = async () => {
        setIsLoading(true);
        try {
            const result = await fetchAllApps();
            setApps(result.data);
            setIsLocal(result.isLocal);
        } catch (error) {
            console.error("Error fetching apps:", error);
            toast.error("Failed to load apps");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadApps();
    }, []);

    const handleOpenForm = (app?: VisionFamilyApp) => {
        if (app) {
            setEditingId(app.id);
            setFormData(app);
            setPoweredByInput(app.powered_by?.join(", ") || "");
        } else {
            setEditingId(null);
            setFormData(DEFAULT_FORM_STATE);
            setPoweredByInput("");
        }
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setFormData(DEFAULT_FORM_STATE);
        setPoweredByInput("");
    };

    const handleFormChange = (field: keyof VisionFamilyApp, value: string | number | boolean | string[] | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!formData.name || !formData.tagline || !formData.description) {
            toast.error("Please fill in all required fields (Name, Tagline, Description)");
            return;
        }

        setIsSubmitting(true);
        try {
            const powered_by = poweredByInput
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s.length > 0);

            const payload = {
                name: formData.name!,
                tagline: formData.tagline!,
                description: formData.description!,
                url: formData.url || null,
                logo_url: formData.logo_url || null,
                logo_emoji: formData.logo_emoji || "\u{1F517}",
                accent_color: formData.accent_color || "#06b6d4",
                category: formData.category || "App",
                is_published: formData.is_published ?? false,
                is_featured: formData.is_featured ?? false,
                display_order: formData.display_order || 0,
                powered_by: powered_by.length > 0 ? powered_by : null,
            };

            if (editingId) {
                await updateApp(editingId, payload as VisionFamilyAppUpdate);
                toast.success("App updated successfully");
            } else {
                await insertApp(payload as VisionFamilyAppInsert);
                toast.success("App created successfully");
            }

            handleCloseForm();
            loadApps();
        } catch (error: unknown) {
            const e = error as { message?: string };
            console.error("Save error:", error);
            toast.error(`Failed to save: ${e.message || "Unknown error"}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTogglePublish = async (id: string, currentStatus: boolean) => {
        try {
            await updateApp(id, { is_published: !currentStatus });
            setApps(apps.map((app) =>
                app.id === id ? { ...app, is_published: !currentStatus } : app
            ));
            toast.success(`App ${!currentStatus ? 'published' : 'unpublished'}`);
        } catch {
            toast.error("Failed to update status");
        }
    };

    const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
        try {
            await updateApp(id, { is_featured: !currentStatus });
            setApps(apps.map((app) =>
                app.id === id ? { ...app, is_featured: !currentStatus } : app
            ));
            toast.success(`App ${!currentStatus ? 'featured' : 'unfeatured'}`);
        } catch {
            toast.error("Failed to update featured status");
        }
    };

    const confirmDelete = async () => {
        if (!deletingId) return;

        setIsSubmitting(true);
        try {
            await deleteApp(deletingId);
            setApps(apps.filter((app) => app.id !== deletingId));
            toast.success("App deleted successfully");
            setIsDeleteOpen(false);
            setDeletingId(null);
        } catch {
            toast.error("Failed to delete app");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full space-y-6">
            {isLocal && (
                <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                    <Database className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                    <div className="text-sm">
                        <p className="font-medium text-amber-400">Using local storage (database table not found)</p>
                        <p className="text-amber-400/70 mt-1">
                            The <code className="text-xs bg-white/5 px-1 py-0.5 rounded">vision_family_apps</code> table
                            doesn't exist in Supabase yet. Data is saved to your browser's local storage.
                            Run migration <code className="text-xs bg-white/5 px-1 py-0.5 rounded">013_add_vision_family.sql</code> in the Supabase SQL editor to enable database storage.
                        </p>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Vision Family Apps</h2>
                    <p className="text-muted-foreground">Manage the ecosystem apps displayed on the homepage.</p>
                </div>
                <Button onClick={() => handleOpenForm()}>
                    <Plus className="mr-2 h-4 w-4" /> Add App
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-24">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : apps.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Plus className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No apps added yet</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mb-6">
                            Get started by adding your first app to the Vision Family ecosystem.
                        </p>
                        <Button onClick={() => handleOpenForm()}>Add First App</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {apps.map((app) => (
                        <Card key={app.id} className="relative overflow-hidden group">
                            <div
                                className="absolute top-0 left-0 w-1 h-full"
                                style={{ backgroundColor: app.accent_color }}
                            />
                            <CardContent className="p-5 pl-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                                            style={{ backgroundColor: `${app.accent_color}20`, color: app.accent_color }}
                                        >
                                            {app.logo_url ? (
                                                <img src={app.logo_url} alt={app.name} className="w-6 h-6 object-contain" />
                                            ) : (
                                                app.logo_emoji
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold leading-none mb-1 text-base">{app.name}</h4>
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="text-muted-foreground">{app.category}</span>
                                                {!app.is_published && (
                                                    <span className="px-1.5 rounded-sm bg-yellow-500/10 text-yellow-600 font-medium">Draft</span>
                                                )}
                                                {app.is_featured && (
                                                    <span className="px-1.5 rounded-sm bg-blue-500/10 text-blue-600 font-medium">Featured</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                    {app.tagline}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t">
                                    <div className="flex bg-muted rounded-md p-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`h-8 w-8 ${app.is_published ? 'text-green-600' : 'text-muted-foreground'}`}
                                            onClick={() => handleTogglePublish(app.id, app.is_published)}
                                            title={app.is_published ? "Unpublish" : "Publish"}
                                        >
                                            {app.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`h-8 w-8 ${app.is_featured ? 'text-amber-500' : 'text-muted-foreground'}`}
                                            onClick={() => handleToggleFeatured(app.id, app.is_featured)}
                                            title={app.is_featured ? "Remove featured" : "Make featured"}
                                        >
                                            {app.is_featured ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
                                        </Button>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleOpenForm(app)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => {
                                                setDeletingId(app.id);
                                                setIsDeleteOpen(true);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit App" : "Add App to Ecosystem"}</DialogTitle>
                        <DialogDescription>
                            Provide the details to showcase this app in the Vision Family section.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">App Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleFormChange("name", e.target.value)}
                                    placeholder="e.g. LifeLink"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(v) => handleFormChange("category", v)}
                                >
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tagline">Tagline *</Label>
                            <Input
                                id="tagline"
                                value={formData.tagline}
                                onChange={(e) => handleFormChange("tagline", e.target.value)}
                                placeholder="Short, punchy pitch"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleFormChange("description", e.target.value)}
                                placeholder="Full description of what the app does..."
                                className="h-24"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="url">External URL</Label>
                                <Input
                                    id="url"
                                    value={formData.url || ""}
                                    onChange={(e) => handleFormChange("url", e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="display_order">Display Order</Label>
                                <Input
                                    id="display_order"
                                    type="number"
                                    value={formData.display_order}
                                    onChange={(e) => handleFormChange("display_order", parseInt(e.target.value) || 0)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="logo_emoji">Logo Emoji</Label>
                                <Input
                                    id="logo_emoji"
                                    value={formData.logo_emoji}
                                    onChange={(e) => handleFormChange("logo_emoji", e.target.value)}
                                    maxLength={5}
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="logo_url">Or Custom Logo URL</Label>
                                <Input
                                    id="logo_url"
                                    value={formData.logo_url || ""}
                                    onChange={(e) => handleFormChange("logo_url", e.target.value)}
                                    placeholder="https://.../logo.png"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>Accent Color</Label>
                            <div className="flex items-center gap-3">
                                <Input
                                    type="color"
                                    value={formData.accent_color}
                                    onChange={(e) => handleFormChange("accent_color", e.target.value)}
                                    className="w-12 h-10 p-1 cursor-pointer"
                                />
                                <div className="flex flex-wrap gap-2">
                                    {COLOR_SWATCHES.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            className={`w-8 h-8 rounded-full border-2 transition-transform ${formData.accent_color === color ? 'border-primary scale-110' : 'border-transparent hover:scale-110'}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => handleFormChange("accent_color", color)}
                                            aria-label={`Select color ${color}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="powered_by">Powered By (comma-separated)</Label>
                            <Input
                                id="powered_by"
                                value={poweredByInput}
                                onChange={(e) => setPoweredByInput(e.target.value)}
                                placeholder="React, TypeScript, Supabase..."
                            />
                        </div>

                        <div className="flex gap-6 mt-2 p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_published"
                                    checked={formData.is_published}
                                    onCheckedChange={(c) => handleFormChange("is_published", c)}
                                />
                                <Label htmlFor="is_published">Published</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_featured"
                                    checked={formData.is_featured}
                                    onCheckedChange={(c) => handleFormChange("is_featured", c)}
                                />
                                <Label htmlFor="is_featured">Featured (Large Card)</Label>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseForm}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            {editingId ? "Save Changes" : "Create App"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center text-destructive">
                            <AlertTriangle className="mr-2 h-5 w-5" /> Confirm Deletion
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this app? This action cannot be undone and it will be removed from the ecosystem immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 break-words">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete App"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
