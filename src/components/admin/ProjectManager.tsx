import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Eye, ExternalLink } from 'lucide-react';

const initialProjects = [
  { id: 1, name: 'Global Health-Sync', status: 'MVP', category: 'Investment', visibility: 'Public', leads: 12, description: 'Healthcare platform connecting patients globally' },
  { id: 2, name: 'Nurse-Sync', status: 'Live', category: 'Investment', visibility: 'Public', leads: 8, description: 'Nursing staff coordination platform' },
  { id: 3, name: 'Conneqt-Central', status: 'Private', category: 'Internal', visibility: 'Private', leads: 0, description: 'Internal team collaboration hub' },
  { id: 4, name: 'ICE-SOS Lite', status: 'For Sale', category: 'For Sale', visibility: 'Public', leads: 15, description: 'Emergency contact management app' },
  { id: 5, name: 'AI Spain Homes', status: 'Concept', category: 'Investment', visibility: 'Public', leads: 6, description: 'AI-powered Spanish real estate platform' },
  { id: 6, name: 'Tether-Band', status: 'Beta', category: 'For Sale', visibility: 'Public', leads: 9, description: 'Wearable technology platform' },
];

export function ProjectManager() {
  const [projects, setProjects] = useState(initialProjects);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    status: 'Concept',
    category: 'Investment',
    visibility: 'Public',
    description: ''
  });

  const handleAddProject = () => {
    const project = {
      id: Date.now(),
      ...newProject,
      leads: 0
    };
    setProjects([...projects, project]);
    setNewProject({
      name: '',
      status: 'Concept',
      category: 'Investment',
      visibility: 'Public',
      description: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setNewProject({
      name: project.name,
      status: project.status,
      category: project.category,
      visibility: project.visibility,
      description: project.description
    });
  };

  const handleUpdateProject = () => {
    setProjects(projects.map(p => 
      p.id === editingProject.id 
        ? { ...p, ...newProject }
        : p
    ));
    setEditingProject(null);
    setNewProject({
      name: '',
      status: 'Concept',
      category: 'Investment',
      visibility: 'Public',
      description: ''
    });
  };

  const handleDeleteProject = (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
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
            description: ''
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Leads</TableHead>
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
                <TableCell>{project.leads}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => window.open(`/${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`, '_blank')}>
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
      </CardContent>
    </Card>
  );
}