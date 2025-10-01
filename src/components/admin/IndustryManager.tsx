import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Building2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Industry {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function IndustryManager() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true
  });

  useEffect(() => {
    loadIndustries();
  }, []);

  const loadIndustries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('industries')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setIndustries(data || []);
    } catch (error) {
      console.error('Error loading industries:', error);
      toast.error('Failed to load industries');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingIndustry) {
        const { error } = await supabase
          .from('industries')
          .update({
            name: formData.name,
            description: formData.description,
            is_active: formData.is_active
          })
          .eq('id', editingIndustry.id);
        
        if (error) throw error;
        toast.success('Industry updated successfully');
      } else {
        const { error } = await supabase
          .from('industries')
          .insert([{
            name: formData.name,
            description: formData.description,
            is_active: formData.is_active
          }]);
        
        if (error) throw error;
        toast.success('Industry created successfully');
      }
      
      loadIndustries();
      handleCloseModal();
    } catch (error: any) {
      console.error('Error saving industry:', error);
      toast.error(error.message || 'Failed to save industry');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this industry?')) return;
    
    try {
      const { error } = await supabase
        .from('industries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Industry deleted successfully');
      loadIndustries();
    } catch (error: any) {
      console.error('Error deleting industry:', error);
      toast.error(error.message || 'Failed to delete industry');
    }
  };

  const handleEdit = (industry: Industry) => {
    setEditingIndustry(industry);
    setFormData({
      name: industry.name,
      description: industry.description || '',
      is_active: industry.is_active
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingIndustry(null);
    setFormData({
      name: '',
      description: '',
      is_active: true
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Industry Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage industry categories for templates
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Industry
        </Button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Loading industries...</p>
            </CardContent>
          </Card>
        ) : industries.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">No industries found. Add your first industry!</p>
            </CardContent>
          </Card>
        ) : (
          industries.map((industry) => (
            <Card key={industry.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {industry.name}
                      {!industry.is_active && (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </CardTitle>
                    {industry.description && (
                      <CardDescription className="mt-2">
                        {industry.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(industry)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(industry.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingIndustry ? 'Edit Industry' : 'Add New Industry'}
            </DialogTitle>
            <DialogDescription>
              {editingIndustry 
                ? 'Update the industry information below'
                : 'Create a new industry category for templates'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Industry Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Healthcare"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the industry"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Active</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit">
                {editingIndustry ? 'Update' : 'Create'} Industry
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
