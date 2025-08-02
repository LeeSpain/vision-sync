import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Eye, ExternalLink, Loader2 } from 'lucide-react';
import { projectManager, type Project } from '@/utils/projectManager';
import { toast } from 'sonner';
import { useCurrency } from '@/contexts/CurrencyContext';

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { formatPrice } = useCurrency();
  const [newProject, setNewProject] = useState({
    name: '',
    status: 'Concept',
    category: 'Investment',
    visibility: 'Public',
    description: '',
    route: '',
    investment_amount: '',
    price: '',
    subscription_price: '',
    subscription_period: 'monthly',
    billing_type: 'one-time'
  });

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectManager.getAllProjects();
      setProjects(data);
    } catch (error) {
      toast.error('Failed to load projects');
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async () => {
    try {
      const projectData = {
        ...newProject,
        route: newProject.route || `/${newProject.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        investment_amount: newProject.investment_amount ? parseFloat(newProject.investment_amount) : undefined,
        price: newProject.price ? parseFloat(newProject.price) : undefined,
        subscription_price: newProject.subscription_price ? parseFloat(newProject.subscription_price) : undefined,
      };
      
      await projectManager.createProject(projectData);
      await loadProjects();
      
      setNewProject({
        name: '',
        status: 'Concept',
        category: 'Investment',
        visibility: 'Public',
        description: '',
        route: '',
        investment_amount: '',
        price: '',
        subscription_price: '',
        subscription_period: 'monthly',
        billing_type: 'one-time'
      });
      setIsAddDialogOpen(false);
      toast.success('Project created successfully!');
    } catch (error) {
      toast.error('Failed to create project');
      console.error('Error creating project:', error);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setNewProject({
      name: project.name,
      status: project.status,
      category: project.category,
      visibility: project.visibility,
      description: project.description || '',
      route: project.route || '',
      investment_amount: project.investment_amount?.toString() || '',
      price: project.price?.toString() || '',
      subscription_price: project.subscription_price?.toString() || '',
      subscription_period: project.subscription_period || 'monthly',
      billing_type: project.billing_type || 'one-time'
    });
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;
    
    try {
      const projectData = {
        ...newProject,
        investment_amount: newProject.investment_amount ? parseFloat(newProject.investment_amount) : undefined,
        price: newProject.price ? parseFloat(newProject.price) : undefined,
        subscription_price: newProject.subscription_price ? parseFloat(newProject.subscription_price) : undefined,
      };
      
      await projectManager.updateProject(editingProject.id, projectData);
      await loadProjects();
      
      setEditingProject(null);
      setNewProject({
        name: '',
        status: 'Concept',
        category: 'Investment',
        visibility: 'Public',
        description: '',
        route: '',
        investment_amount: '',
        price: '',
        subscription_price: '',
        subscription_period: 'monthly',
        billing_type: 'one-time'
      });
      toast.success('Project updated successfully!');
    } catch (error) {
      toast.error('Failed to update project');
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await projectManager.deleteProject(id);
        await loadProjects();
        toast.success('Project deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete project');
        console.error('Error deleting project:', error);
      }
    }
  };

  const ProjectForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Project Name</label>
        <Input
          value={newProject.name}
          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          placeholder="Enter project name"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea
          value={newProject.description}
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          placeholder="Brief project description"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Route Path</label>
        <Input
          value={newProject.route}
          onChange={(e) => setNewProject({ ...newProject, route: e.target.value })}
          placeholder="/project-name (auto-generated if empty)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Billing Type</label>
        <Select value={newProject.billing_type} onValueChange={(value) => setNewProject({ ...newProject, billing_type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="one-time">One-time Purchase</SelectItem>
            <SelectItem value="subscription">Subscription</SelectItem>
            <SelectItem value="investment">Investment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {newProject.billing_type === 'investment' && (
        <div>
          <label className="block text-sm font-medium mb-2">Investment Amount</label>
          <Input
            type="number"
            value={newProject.investment_amount}
            onChange={(e) => setNewProject({ ...newProject, investment_amount: e.target.value })}
            placeholder="500000"
          />
        </div>
      )}

      {newProject.billing_type === 'one-time' && (
        <div>
          <label className="block text-sm font-medium mb-2">Sale Price</label>
          <Input
            type="number"
            value={newProject.price}
            onChange={(e) => setNewProject({ ...newProject, price: e.target.value })}
            placeholder="25000"
          />
        </div>
      )}

      {newProject.billing_type === 'subscription' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Subscription Price</label>
            <Input
              type="number"
              value={newProject.subscription_price}
              onChange={(e) => setNewProject({ ...newProject, subscription_price: e.target.value })}
              placeholder="99"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Billing Period</label>
            <Select value={newProject.subscription_period} onValueChange={(value) => setNewProject({ ...newProject, subscription_period: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <Select value={newProject.status} onValueChange={(value) => setNewProject({ ...newProject, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Concept">Concept</SelectItem>
              <SelectItem value="MVP">MVP</SelectItem>
              <SelectItem value="Beta">Beta</SelectItem>
              <SelectItem value="Live">Live</SelectItem>
              <SelectItem value="For Sale">For Sale</SelectItem>
              <SelectItem value="Private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <Select value={newProject.category} onValueChange={(value) => setNewProject({ ...newProject, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Investment">Investment</SelectItem>
              <SelectItem value="For Sale">For Sale</SelectItem>
              <SelectItem value="Internal">Internal</SelectItem>
              <SelectItem value="Custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Visibility</label>
          <Select value={newProject.visibility} onValueChange={(value) => setNewProject({ ...newProject, visibility: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Public">Public</SelectItem>
              <SelectItem value="Private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={() => {
          setIsAddDialogOpen(false);
          setEditingProject(null);
          setNewProject({
            name: '',
            status: 'Concept',
            category: 'Investment',
            visibility: 'Public',
            description: '',
            route: '',
            investment_amount: '',
            price: '',
            subscription_price: '',
            subscription_period: 'monthly',
            billing_type: 'one-time'
          });
        }}>
          Cancel
        </Button>
        <Button variant="premium" onClick={editingProject ? handleUpdateProject : handleAddProject}>
          {editingProject ? 'Update Project' : 'Add Project'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Revenue Pipeline Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-cool-gray">Investment Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-royal-purple">
              {formatPrice(projects.filter(p => p.category === 'Investment').reduce((sum, p) => sum + (p.investment_amount || 0), 0))}
            </div>
            <div className="text-xs text-cool-gray">
              {projects.filter(p => p.category === 'Investment').length} projects
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-cool-gray">For Sale Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-green">
              {formatPrice(projects.filter(p => p.category === 'For Sale').reduce((sum, p) => sum + (p.price || 0), 0))}
            </div>
            <div className="text-xs text-cool-gray">
              {projects.filter(p => p.category === 'For Sale').length} projects
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-cool-gray">Subscription Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-blue">
              {formatPrice(projects.filter(p => p.billing_type === 'subscription').reduce((sum, p) => sum + (p.subscription_price || 0), 0))}
            </div>
            <div className="text-xs text-cool-gray">
              {projects.filter(p => p.billing_type === 'subscription').length} subscriptions
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-cool-gray">Total Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-midnight-navy">
              {formatPrice(projects.reduce((sum, p) => sum + (p.investment_amount || 0) + (p.price || 0) + (p.subscription_price || 0), 0))}
            </div>
            <div className="text-xs text-cool-gray">
              {projects.reduce((sum, p) => sum + p.leads_count, 0)} total leads
            </div>
          </CardContent>
        </Card>
      </div>

    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-heading">Project Management</CardTitle>
            <CardDescription>Manage your projects, visibility, and status</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen || !!editingProject} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) setEditingProject(null);
          }}>
            <DialogTrigger asChild>
              <Button variant="premium" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                <DialogDescription>
                  {editingProject ? 'Update project details' : 'Create a new project to showcase on your platform'}
                </DialogDescription>
              </DialogHeader>
              <ProjectForm />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-royal-purple" />
            <span className="ml-2 text-cool-gray">Loading projects...</span>
          </div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Leads</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-cool-gray">{project.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{project.status}</Badge>
                </TableCell>
                <TableCell>{project.category}</TableCell>
                <TableCell>
                  <Badge variant={project.visibility === 'Public' ? 'default' : 'secondary'}>
                    {project.visibility}
                  </Badge>
                </TableCell>
                <TableCell>{project.leads_count}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {project.investment_amount && (
                      <div className="text-emerald-green font-medium">
                        Investment: {formatPrice(project.investment_amount)}
                      </div>
                    )}
                    {project.price && (
                      <div className="text-royal-purple font-medium">
                        Price: {formatPrice(project.price)}
                      </div>
                    )}
                    {project.subscription_price && (
                      <div className="text-sky-blue font-medium">
                        Subscription: {formatPrice(project.subscription_price)}/{project.subscription_period}
                      </div>
                    )}
                    {!project.investment_amount && !project.price && !project.subscription_price && (
                      <span className="text-cool-gray">-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => window.open(project.route || `/${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`, '_blank')}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditProject(project)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(project.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </CardContent>
    </Card>
    </div>
  );
}