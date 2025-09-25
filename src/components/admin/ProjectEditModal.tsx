import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Project, CreateProjectData } from '@/utils/projectManager';
import { X, Plus } from 'lucide-react';

interface ProjectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, projectData: Partial<CreateProjectData>) => Promise<void>;
  project: Project | null;
  loading?: boolean;
}

const ProjectEditModal: React.FC<ProjectEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  project,
  loading = false
}) => {
  const [formData, setFormData] = useState<CreateProjectData>({
    title: '',
    description: '',
    category: '',
    image_url: '',
    demo_url: '',
    github_url: '',
    technologies: [],
    is_public: true,
    is_featured: false
  });
  
  const [newTech, setNewTech] = useState('');

  const categories = [
    'E-commerce',
    'Healthcare',
    'Real Estate',
    'Finance',
    'Education',
    'Travel',
    'Productivity',
    'Entertainment',
    'Social',
    'Business',
    'Portfolio',
    'Other'
  ];

  // Initialize form data when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description || '',
        category: project.category || '',
        image_url: project.image_url || '',
        demo_url: project.demo_url || '',
        github_url: project.github_url || '',
        technologies: project.technologies || [],
        is_public: project.is_public,
        is_featured: project.is_featured
      });
    }
  }, [project]);

  const handleAddTechnology = () => {
    if (newTech.trim() && !formData.technologies?.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const handleRemoveTechnology = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies?.filter(tech => tech !== techToRemove) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !project) {
      alert('Please enter a project title');
      return;
    }

    await onSubmit(project.id, formData);
  };

  const handleClose = () => {
    setNewTech('');
    onClose();
  };

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter project title"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your project"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* URLs */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="demo_url">Demo URL</Label>
              <Input
                id="demo_url"
                type="url"
                value={formData.demo_url}
                onChange={(e) => setFormData(prev => ({ ...prev, demo_url: e.target.value }))}
                placeholder="https://demo.example.com"
              />
            </div>

            <div>
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          {/* Technologies */}
          <div className="space-y-4">
            <Label>Technologies</Label>
            <div className="flex gap-2">
              <Input
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="Add technology (e.g., React, Node.js)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTechnology();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTechnology} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.technologies && formData.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTechnology(tech)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="is_public">Public Project</Label>
              <Switch
                id="is_public"
                checked={formData.is_public}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_featured">Featured Project</Label>
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className="flex-1"
            >
              {loading ? 'Updating...' : 'Update Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectEditModal;