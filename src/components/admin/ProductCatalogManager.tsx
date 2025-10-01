import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projectManager } from "@/utils/projectManager";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RefreshCw, Package, DollarSign, Sparkles } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description?: string;
  category?: string;
  status?: string;
  price?: number;
  is_public: boolean;
}

interface AppTemplate {
  id: string;
  title: string;
  description?: string;
  category?: string;
  industry?: string;
  is_active: boolean;
}

export const ProductCatalogManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [templates, setTemplates] = useState<AppTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    setLoading(true);
    try {
      const [projectsData, templatesData] = await Promise.all([
        projectManager.getAllProjects(),
        loadTemplates()
      ]);
      setProjects(projectsData as Project[]);
      setTemplates(templatesData);
    } catch (error) {
      console.error("Error loading catalog:", error);
      toast.error("Failed to load product catalog");
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("app_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error loading templates:", error);
      return [];
    }
  };

  const syncToAIAgents = async () => {
    setSyncing(true);
    try {
      // Prepare catalog data for AI agents
      const catalogData = {
        projects: projects.filter(p => p.is_public).map(p => ({
          id: p.id,
          name: p.title,
          description: p.description,
          category: p.category,
          price: p.price,
          status: p.status
        })),
        templates: templates.filter(t => t.is_active).map(t => ({
          id: t.id,
          name: t.title,
          description: t.description,
          category: t.category,
          industry: t.industry
        }))
      };

      // Update AI agent training data with product catalog
      const { error } = await supabase
        .from("ai_training_data")
        .upsert({
          training_type: "product_catalog",
          content: JSON.stringify(catalogData),
          metadata: {
            last_sync: new Date().toISOString(),
            project_count: catalogData.projects.length,
            template_count: catalogData.templates.length
          },
          is_active: true
        });

      if (error) throw error;

      toast.success("Product catalog synced to AI agents!");
    } catch (error) {
      console.error("Error syncing to AI agents:", error);
      toast.error("Failed to sync catalog to AI agents");
    } finally {
      setSyncing(false);
    }
  };

  const publicProjects = projects.filter(p => p.is_public);
  const activeTemplates = templates.filter(t => t.is_active);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Product Catalog</h2>
          <p className="text-muted-foreground">
            Manage products available for AI agents and quotes
          </p>
        </div>
        <Button onClick={syncToAIAgents} disabled={syncing}>
          {syncing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Sync to AI Agents
            </>
          )}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">{publicProjects.length}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Templates</p>
                <p className="text-2xl font-bold">{activeTemplates.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">
                  {publicProjects.length + activeTemplates.length}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Available Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {publicProjects.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No public projects</p>
            ) : (
              publicProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{project.title}</h3>
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {project.category && (
                      <Badge variant="secondary">{project.category}</Badge>
                    )}
                    {project.price && (
                      <Badge variant="outline">${project.price.toLocaleString()}</Badge>
                    )}
                    <Badge
                      variant={project.status === "active" ? "default" : "secondary"}
                    >
                      {project.status || "active"}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Available Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeTemplates.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No active templates</p>
            ) : (
              activeTemplates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{template.title}</h3>
                    {template.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {template.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {template.category && (
                      <Badge variant="secondary">{template.category}</Badge>
                    )}
                    {template.industry && (
                      <Badge variant="outline">{template.industry}</Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
