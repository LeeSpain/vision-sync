import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabaseLeadManager } from "@/utils/supabaseLeadManager";
import { quoteManager } from "@/utils/quoteManager";
import { EnhancedLeadForm } from "./EnhancedLeadForm";
import { QuoteGenerator } from "./QuoteGenerator";
import { SalesPipelineView } from "./SalesPipelineView";
import { toast } from "sonner";
import { 
  Users, 
  Plus, 
  Search, 
  FileText, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Mail,
  Phone,
  Building2,
  Filter,
  ChevronDown,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { format } from "date-fns";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: string;
  status?: string;
  pipeline_stage?: string;
  budget_range?: string;
  timeline?: string;
  lead_score?: number;
  project_type?: string;
  created_at: string;
}

export const EnhancedLeadsManager = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "pipeline">("list");

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchQuery, statusFilter, stageFilter]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const data = await supabaseLeadManager.getAllLeads();
      setLeads(data as Lead[]);
    } catch (error) {
      console.error("Error loading leads:", error);
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = [...leads];

    if (searchQuery) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.company?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    if (stageFilter !== "all") {
      filtered = filtered.filter((lead) => (lead.pipeline_stage || "new") === stageFilter);
    }

    setFilteredLeads(filtered);
  };

  const handleUpdateStage = async (leadId: string, newStage: string) => {
    try {
      await supabaseLeadManager.updateLead(leadId, { pipeline_stage: newStage });
      toast.success("Pipeline stage updated");
      loadLeads();
    } catch (error) {
      toast.error("Failed to update stage");
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    
    try {
      await supabaseLeadManager.deleteLead(leadId);
      toast.success("Lead deleted");
      loadLeads();
    } catch (error) {
      toast.error("Failed to delete lead");
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return "bg-gray-500";
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Enhanced Leads Manager</h2>
          <p className="text-muted-foreground">Manage your sales pipeline and customer inquiries</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{leads.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Qualified</p>
                <p className="text-2xl font-bold">
                  {leads.filter(l => l.pipeline_stage === "qualified").length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Proposal</p>
                <p className="text-2xl font-bold">
                  {leads.filter(l => l.pipeline_stage === "proposal").length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Closed Won</p>
                <p className="text-2xl font-bold">
                  {leads.filter(l => l.pipeline_stage === "closed_won").length}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
              >
                List View
              </Button>
              <Button
                variant={viewMode === "pipeline" ? "default" : "outline"}
                onClick={() => setViewMode("pipeline")}
              >
                Pipeline View
              </Button>
            </div>

            {viewMode === "list" && (
              <>
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search leads..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={stageFilter} onValueChange={setStageFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="closed_won">Closed Won</SelectItem>
                    <SelectItem value="closed_lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {viewMode === "pipeline" ? (
        <SalesPipelineView />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Leads ({filteredLeads.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading leads...</div>
              ) : filteredLeads.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No leads found</div>
              ) : (
                filteredLeads.map((lead) => (
                  <Card key={lead.id} className="p-4 hover:bg-accent transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{lead.name}</h3>
                          {lead.lead_score !== undefined && (
                            <Badge className={getScoreColor(lead.lead_score)}>
                              Score: {lead.lead_score}
                            </Badge>
                          )}
                          <Badge variant="outline">
                            {lead.pipeline_stage || "new"}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {lead.email}
                          </div>
                          {lead.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {lead.phone}
                            </div>
                          )}
                          {lead.company && (
                            <div className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {lead.company}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          {lead.budget_range && (
                            <Badge variant="secondary">{lead.budget_range}</Badge>
                          )}
                          {lead.timeline && (
                            <Badge variant="secondary">{lead.timeline}</Badge>
                          )}
                          {lead.project_type && (
                            <Badge variant="outline">{lead.project_type}</Badge>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Created: {format(new Date(lead.created_at), "PPP")}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedLead(lead);
                            setShowQuoteModal(true);
                          }}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Quote
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteLead(lead.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Lead Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
          </DialogHeader>
          <EnhancedLeadForm
            onSuccess={() => {
              setShowAddForm(false);
              loadLeads();
            }}
            onCancel={() => setShowAddForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Quote Generator Dialog */}
      <Dialog open={showQuoteModal} onOpenChange={setShowQuoteModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate Quote for {selectedLead?.name}</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <QuoteGenerator
              leadId={selectedLead.id}
              onSuccess={() => {
                setShowQuoteModal(false);
                toast.success("Quote created successfully!");
              }}
              onCancel={() => setShowQuoteModal(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
