import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabaseLeadManager } from "@/utils/supabaseLeadManager";
import { Loader2 } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  pipeline_stage?: string | null;
  lead_score?: number;
  budget_range?: string | null;
  timeline?: string | null;
  created_at: string;
}

const PIPELINE_STAGES = [
  { value: "new", label: "New", color: "bg-blue-500" },
  { value: "qualified", label: "Qualified", color: "bg-purple-500" },
  { value: "proposal", label: "Proposal", color: "bg-yellow-500" },
  { value: "negotiation", label: "Negotiation", color: "bg-orange-500" },
  { value: "closed_won", label: "Closed Won", color: "bg-green-500" },
  { value: "closed_lost", label: "Closed Lost", color: "bg-red-500" },
];

export const SalesPipelineView = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const allLeads = await supabaseLeadManager.getAllLeads();
      setLeads(allLeads.map(lead => ({
        ...lead,
        pipeline_stage: lead.pipeline_stage || 'new',
        lead_score: lead.lead_score || 0
      })) as Lead[]);
    } catch (error) {
      console.error("Error loading leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLeadsByStage = (stage: string) => {
    return leads.filter((lead) => (lead.pipeline_stage || 'new') === stage);
  };

  const getScoreColor = (score: number | undefined) => {
    if (!score) return "text-muted-foreground";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PIPELINE_STAGES.map((stage) => {
          const stageLeads = getLeadsByStage(stage.value);
          const totalValue = stageLeads.reduce((sum, lead) => {
            const budget = lead.budget_range;
            if (!budget) return sum;
            if (budget === "$50k+") return sum + 50000;
            if (budget === "$20k-$50k") return sum + 35000;
            if (budget === "$10k-$20k") return sum + 15000;
            if (budget === "$5k-$10k") return sum + 7500;
            return sum + 2500;
          }, 0);

          return (
            <Card key={stage.value} className="border-t-4" style={{ borderTopColor: stage.color.replace('bg-', '') }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{stage.label}</CardTitle>
                  <Badge variant="secondary">{stageLeads.length}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Est. Value: ${totalValue.toLocaleString()}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {stageLeads.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No leads</p>
                ) : (
                  stageLeads.map((lead) => (
                    <Card key={lead.id} className="p-3 hover:bg-accent transition-colors cursor-pointer">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{lead.name}</p>
                          <Badge variant="outline" className={getScoreColor(lead.lead_score)}>
                            {lead.lead_score || 0}
                          </Badge>
                        </div>
                        {lead.company && (
                          <p className="text-xs text-muted-foreground">{lead.company}</p>
                        )}
                        <div className="flex gap-2">
                          {lead.budget_range && (
                            <Badge variant="secondary" className="text-xs">
                              {lead.budget_range}
                            </Badge>
                          )}
                          {lead.timeline && (
                            <Badge variant="outline" className="text-xs">
                              {lead.timeline}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
