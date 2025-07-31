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

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    status: 'Concept',
    category: 'Investment',
    visibility: 'Public',
    description: '',
    route: '',
    investment_amount: '',
    price: ''
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
        price: ''
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
      price: project.price?.toString() || ''
    });
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;
    
    try {
      const projectData = {
        ...newProject,
        investment_amount: newProject.investment_amount ? parseFloat(newProject.investment_amount) : undefined,
        price: newProject.price ? parseFloat(newProject.price) : undefined,
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
        price: ''
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Investment Amount ($)</label>
          <Input
            type="number"
            value={newProject.investment_amount}
            onChange={(e) => setNewProject({ ...newProject, investment_amount: e.target.value })}
            placeholder="500000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Sale Price ($)</label>
          <Input
            type="number"
            value={newProject.price}
            onChange={(e) => setNewProject({ ...newProject, price: e.target.value })}
            placeholder="25000"
          />
        </div>
      </div>

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
            price: ''
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
                        Investment: ${project.investment_amount.toLocaleString()}
                      </div>
                    )}
                    {project.price && (
                      <div className="text-royal-purple font-medium">
                        Price: ${project.price.toLocaleString()}
                      </div>
                    )}
                    {!project.investment_amount && !project.price && (
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
  );
}