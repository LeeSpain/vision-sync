import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Eye, ExternalLink, Loader2, Star } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import { AutoImageGenerator } from '@/components/admin/AutoImageGenerator';
import { Checkbox } from '@/components/ui/checkbox';
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
    domain_url: '',
    industry: '',
    investment_amount: '',
    price: '',
    subscription_price: '',
    subscription_period: 'monthly',
    billing_type: 'one-time',
    // New pricing fields
    deposit_amount: '',
    service_monthly: '',
    installment_plans: '[]',
    ownership_options: '{}',
    payment_methods: '["one-time"]',
    image_url: '',
    hero_image_url: '',
    featured: false,
    gallery_images: [] as string[],
    key_features: [] as any[],
    stats: [] as any[],
    use_cases: [] as any[],
    purchase_info: {} as any,
    content: {} as any,
        funding_progress: '',
        expected_roi: '',
        investment_deadline: '',
        investor_count: '',
        investment_received: '',
        social_proof: ''
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
        funding_progress: newProject.funding_progress ? parseFloat(newProject.funding_progress) : undefined,
        expected_roi: newProject.expected_roi ? parseFloat(newProject.expected_roi) : undefined,
        investment_deadline: newProject.investment_deadline || undefined,
        investor_count: newProject.investor_count ? parseInt(newProject.investor_count) : undefined,
        investment_received: newProject.investment_received ? parseFloat(newProject.investment_received) : undefined,
        social_proof: newProject.social_proof || undefined,
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
        domain_url: '',
        industry: '',
        investment_amount: '',
        price: '',
        subscription_price: '',
        subscription_period: 'monthly',
        billing_type: 'one-time',
        deposit_amount: '',
        service_monthly: '',
        installment_plans: '[]',
        ownership_options: '{}',
        payment_methods: '["one-time"]',
        image_url: '',
        hero_image_url: '',
        featured: false,
        gallery_images: [],
        key_features: [],
        stats: [],
        use_cases: [],
        purchase_info: {},
        content: {},
        funding_progress: '',
        expected_roi: '',
        investment_deadline: '',
        investor_count: '',
        investment_received: '',
        social_proof: ''
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
      domain_url: project.domain_url || '',
      industry: (project as any).industry || '',
      investment_amount: project.investment_amount?.toString() || '',
      price: project.price?.toString() || '',
      subscription_price: project.subscription_price?.toString() || '',
      subscription_period: project.subscription_period || 'monthly',
      billing_type: project.billing_type || 'one-time',
      deposit_amount: (project as any).deposit_amount?.toString() || '',
      service_monthly: (project as any).service_monthly?.toString() || '',
      installment_plans: JSON.stringify((project as any).installment_plans || []),
      ownership_options: JSON.stringify((project as any).ownership_options || {}),
      payment_methods: JSON.stringify((project as any).payment_methods || ['one-time']),
      image_url: project.image_url || '',
      hero_image_url: project.hero_image_url || '',
      featured: project.featured,
      gallery_images: project.gallery_images || [],
      key_features: project.key_features || [],
      stats: project.stats || [],
      use_cases: project.use_cases || [],
      purchase_info: project.purchase_info || {},
      content: project.content || {},
      funding_progress: project.funding_progress?.toString() || '',
      expected_roi: project.expected_roi?.toString() || '',
      investment_deadline: project.investment_deadline || '',
      investor_count: project.investor_count?.toString() || '',
      investment_received: (project as any).investment_received?.toString() || '',
      social_proof: project.social_proof || ''
    });
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;
    
    try {
      // Parse JSON fields safely
      let installmentPlans, ownershipOptions, paymentMethods;
      
      try {
        installmentPlans = JSON.parse(newProject.installment_plans);
      } catch (e) {
        console.error('Error parsing installment_plans:', e);
        toast.error('Invalid installment plans format');
        return;
      }
      
      try {
        ownershipOptions = JSON.parse(newProject.ownership_options);
      } catch (e) {
        console.error('Error parsing ownership_options:', e);
        toast.error('Invalid ownership options format');
        return;
      }
      
      try {
        paymentMethods = JSON.parse(newProject.payment_methods);
      } catch (e) {
        console.error('Error parsing payment_methods:', e);
        toast.error('Invalid payment methods format');
        return;
      }

      const projectData = {
        ...newProject,
        // Parse numeric fields
        investment_amount: newProject.investment_amount ? parseFloat(newProject.investment_amount) : undefined,
        price: newProject.price ? parseFloat(newProject.price) : undefined,
        subscription_price: newProject.subscription_price ? parseFloat(newProject.subscription_price) : undefined,
        deposit_amount: newProject.deposit_amount ? parseFloat(newProject.deposit_amount) : undefined,
        service_monthly: newProject.service_monthly ? parseFloat(newProject.service_monthly) : undefined,
        funding_progress: newProject.funding_progress ? parseFloat(newProject.funding_progress) : undefined,
        expected_roi: newProject.expected_roi ? parseFloat(newProject.expected_roi) : undefined,
        investor_count: newProject.investor_count ? parseInt(newProject.investor_count) : undefined,
        investment_received: newProject.investment_received ? parseFloat(newProject.investment_received) : undefined,
        
        // Handle date fields
        investment_deadline: newProject.investment_deadline || undefined,
        
        // Handle text fields - convert empty strings to undefined
        social_proof: newProject.social_proof || undefined,
        domain_url: newProject.domain_url || undefined,
        industry: newProject.industry || undefined,
        route: newProject.route || undefined,
        
        // Parse JSON fields
        installment_plans: installmentPlans,
        ownership_options: ownershipOptions,
        payment_methods: paymentMethods,
      };

      console.log('Updating project with data:', projectData);
      
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
        domain_url: '',
        industry: '',
        investment_amount: '',
        price: '',
        subscription_price: '',
        subscription_period: 'monthly',
        billing_type: 'one-time',
        deposit_amount: '',
        service_monthly: '',
        installment_plans: '[]',
        ownership_options: '{}',
        payment_methods: '["one-time"]',
        image_url: '',
        hero_image_url: '',
        featured: false,
        gallery_images: [],
        key_features: [],
        stats: [],
        use_cases: [],
        purchase_info: {},
        content: {},
        funding_progress: '',
        expected_roi: '',
        investment_deadline: '',
        investor_count: '',
        investment_received: '',
        social_proof: ''
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Route Path</label>
          <Input
            value={newProject.route}
            onChange={(e) => setNewProject({ ...newProject, route: e.target.value })}
            placeholder="/project-name (auto-generated if empty)"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Domain URL</label>
          <Input
            value={newProject.domain_url}
            onChange={(e) => setNewProject({ ...newProject, domain_url: e.target.value })}
            placeholder="https://example.com"
          />
          <p className="text-xs text-muted-foreground mt-1">Live website URL for this project</p>
        </div>
      </div>

      {/* AI Image Generation */}
      <AutoImageGenerator
        onThumbnailGenerated={(url) => setNewProject({ ...newProject, image_url: url })}
        onHeroGenerated={(url) => setNewProject({ ...newProject, hero_image_url: url })}
        projectName={newProject.name}
        projectDescription={newProject.description}
      />

      {/* Manual Image Upload Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUpload
          currentUrl={newProject.image_url}
          onImageChange={(url) => setNewProject({ ...newProject, image_url: url })}
          label="Project Thumbnail"
          description="Used in project cards on homepage (recommended: 400x300px)"
        />
        
        <ImageUpload
          currentUrl={newProject.hero_image_url}
          onImageChange={(url) => setNewProject({ ...newProject, hero_image_url: url })}
          label="Hero Image"
          description="Used on detailed project pages (recommended: 1200x600px)"
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
            <SelectItem value="deposit-subscription">Deposit + Subscription</SelectItem>
            <SelectItem value="investment">Investment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Deposit + Subscription Fields */}
      {newProject.billing_type === 'deposit-subscription' && (
        <div className="space-y-4 p-4 bg-soft-lilac/10 rounded-lg border border-soft-lilac/30">
          <h4 className="font-semibold text-midnight-navy">Deposit + Subscription Pricing</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Initial Deposit</label>
              <Input
                type="number"
                value={newProject.deposit_amount}
                onChange={(e) => setNewProject({ ...newProject, deposit_amount: e.target.value })}
                placeholder="1000"
              />
              <p className="text-xs text-muted-foreground mt-1">One-time deposit to get started</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Monthly Subscription</label>
              <Input
                type="number"
                value={newProject.subscription_price}
                onChange={(e) => setNewProject({ ...newProject, subscription_price: e.target.value })}
                placeholder="99"
              />
              <p className="text-xs text-muted-foreground mt-1">Ongoing monthly fee</p>
            </div>
          </div>
        </div>
      )}

      {newProject.billing_type === 'investment' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Investment Amount</label>
              <Input
                type="number"
                value={newProject.investment_amount}
                onChange={(e) => setNewProject({ ...newProject, investment_amount: e.target.value })}
                placeholder="500000"
              />
              <p className="text-xs text-muted-foreground mt-1">Total investment amount needed</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Sale Price</label>
              <Input
                type="number"
                value={newProject.price}
                onChange={(e) => setNewProject({ ...newProject, price: e.target.value })}
                placeholder="50000"
              />
              <p className="text-xs text-muted-foreground mt-1">Listed sale price</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Funding Progress (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={newProject.funding_progress}
                onChange={(e) => setNewProject({ ...newProject, funding_progress: e.target.value })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground mt-1">Current funding percentage (0-100)</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Expected ROI (%)</label>
              <Input
                type="number"
                value={newProject.expected_roi}
                onChange={(e) => setNewProject({ ...newProject, expected_roi: e.target.value })}
                placeholder="25"
              />
              <p className="text-xs text-muted-foreground mt-1">Expected return on investment</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Investment Deadline</label>
              <Input
                type="date"
                value={newProject.investment_deadline}
                onChange={(e) => setNewProject({ ...newProject, investment_deadline: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Investment Received</label>
              <Input
                type="number"
                value={newProject.investment_received}
                onChange={(e) => setNewProject({ ...newProject, investment_received: e.target.value })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground mt-1">Actual amount already raised</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Investor Count</label>
            <Input
              type="number"
              value={newProject.investor_count}
              onChange={(e) => setNewProject({ ...newProject, investor_count: e.target.value })}
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground mt-1">Number of current investors</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Social Proof Text</label>
            <Input
              value={newProject.social_proof}
              onChange={(e) => setNewProject({ ...newProject, social_proof: e.target.value })}
              placeholder="127 investors viewing this opportunity"
            />
            <p className="text-xs text-muted-foreground mt-1">Text to display for social proof</p>
          </div>
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
              <SelectItem value="Development">Development</SelectItem>
              <SelectItem value="Ready">Ready</SelectItem>
              <SelectItem value="Live">Live</SelectItem>
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
              <SelectItem value="Template">Template</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Industry</label>
          <Select value={newProject.industry || ''} onValueChange={(value) => setNewProject({ ...newProject, industry: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="E-commerce">E-commerce</SelectItem>
              <SelectItem value="Real Estate">Real Estate</SelectItem>
              <SelectItem value="Emergency Services">Emergency Services</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
              <SelectItem value="Beauty & Wellness">Beauty & Wellness</SelectItem>
              <SelectItem value="Entertainment">Entertainment</SelectItem>
              <SelectItem value="Professional Services">Professional Services</SelectItem>
            </SelectContent>
          </Select>
        </div>
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

      {/* Homepage Display Control */}
      <div className="flex items-center space-x-2 p-4 bg-gradient-to-r from-royal-purple/5 to-emerald-green/5 rounded-lg border border-soft-lilac/20">
        <Checkbox
          id="featured"
          checked={newProject.featured}
          onCheckedChange={(checked) => setNewProject({ ...newProject, featured: !!checked })}
        />
        <label htmlFor="featured" className="text-sm font-medium cursor-pointer flex items-center gap-2">
          <Star className="h-4 w-4 text-coral-orange" />
          Mark as Featured Project (displays prominently on homepage)
        </label>
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
            domain_url: '',
            industry: '',
            investment_amount: '',
            price: '',
            subscription_price: '',
            subscription_period: 'monthly',
            billing_type: 'one-time',
            deposit_amount: '',
            service_monthly: '',
            installment_plans: '[]',
            ownership_options: '{}',
            payment_methods: '["one-time"]',
            image_url: '',
            hero_image_url: '',
            featured: false,
            gallery_images: [],
            key_features: [],
            stats: [],
            use_cases: [],
            purchase_info: {},
            content: {},
            funding_progress: '',
            expected_roi: '',
            investment_deadline: '',
            investor_count: '',
            investment_received: '',
            social_proof: ''
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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                <DialogDescription>
                  {editingProject ? 'Update project details' : 'Create a new project to showcase on your platform'}
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[70vh] overflow-y-auto pr-2">
                <ProjectForm />
              </div>
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
              <TableHead>Project</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Homepage Display</TableHead>
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
                    <div className="text-xs text-royal-purple">{project.visibility}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {project.image_url ? (
                    <img 
                      src={project.image_url} 
                      alt={project.name}
                      className="w-12 h-12 object-cover rounded-lg shadow-sm"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-soft-lilac/20 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-cool-gray">No img</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{project.status}</Badge>
                </TableCell>
                <TableCell>{project.category}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {/* Show which homepage sections this project appears in */}
                    {project.visibility === 'Public' && project.category === 'Investment' && (
                      <Badge variant="secondary" className="text-xs">Investment Ops</Badge>
                    )}
                    {project.visibility === 'Public' && project.category === 'For Sale' && ['Live', 'Beta'].includes(project.status) && (
                      <Badge variant="secondary" className="text-xs">For Sale</Badge>
                    )}
                    {project.visibility === 'Public' && project.category === 'Internal' && (
                      <Badge variant="secondary" className="text-xs">Internal Tools</Badge>
                    )}
                    {project.featured && (
                      <Badge variant="default" className="text-xs bg-coral-orange flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-center">
                    <div className="font-medium">{project.leads_count}</div>
                    <div className="text-xs text-cool-gray">leads</div>
                  </div>
                </TableCell>
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