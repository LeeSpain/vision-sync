import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabaseLeadManager } from "@/utils/supabaseLeadManager";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface EnhancedLeadFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const EnhancedLeadForm = ({ onSuccess, onCancel }: EnhancedLeadFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    source: "website",
    budget_range: "",
    timeline: "",
    technical_requirements: "",
    project_type: "",
    industry: "",
    preferred_start_date: undefined as Date | undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const leadData = {
        ...formData,
        source: formData.source as 'contact' | 'custom-build' | 'investor' | 'ai-agent' | 'website' | 'referral' | 'social' | 'advertising' | 'direct',
        preferred_start_date: formData.preferred_start_date?.toISOString(),
        // Calculate lead score based on inputs
        form_data: {
          budget_range: formData.budget_range,
          timeline: formData.timeline,
          technical_requirements: formData.technical_requirements,
          project_type: formData.project_type,
          industry: formData.industry,
        }
      };

      const result = await supabaseLeadManager.saveLead(leadData);

      if (result) {
        toast.success("Lead created successfully!");
        onSuccess?.();
      } else {
        toast.error("Failed to create lead");
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error("An error occurred while creating the lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="source">Lead Source *</Label>
          <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="social">Social Media</SelectItem>
              <SelectItem value="advertising">Advertising</SelectItem>
              <SelectItem value="direct">Direct Contact</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget_range">Budget Range</Label>
          <Select value={formData.budget_range} onValueChange={(value) => setFormData({ ...formData, budget_range: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<$5k">Less than $5k</SelectItem>
              <SelectItem value="$5k-$10k">$5k - $10k</SelectItem>
              <SelectItem value="$10k-$20k">$10k - $20k</SelectItem>
              <SelectItem value="$20k-$50k">$20k - $50k</SelectItem>
              <SelectItem value="$50k+">$50k+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeline">Timeline</Label>
          <Select value={formData.timeline} onValueChange={(value) => setFormData({ ...formData, timeline: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate</SelectItem>
              <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
              <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
              <SelectItem value="1-2 months">1-2 months</SelectItem>
              <SelectItem value="2-3 months">2-3 months</SelectItem>
              <SelectItem value="3+ months">3+ months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="project_type">Project Type</Label>
          <Select value={formData.project_type} onValueChange={(value) => setFormData({ ...formData, project_type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="web_app">Web Application</SelectItem>
              <SelectItem value="mobile_app">Mobile Application</SelectItem>
              <SelectItem value="custom_build">Custom Build</SelectItem>
              <SelectItem value="template">Template Customization</SelectItem>
              <SelectItem value="ai_integration">AI Integration</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            placeholder="e.g., Healthcare, Finance, E-commerce"
          />
        </div>

        <div className="space-y-2">
          <Label>Preferred Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.preferred_start_date ? format(formData.preferred_start_date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.preferred_start_date}
                onSelect={(date) => setFormData({ ...formData, preferred_start_date: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="technical_requirements">Technical Requirements</Label>
        <Textarea
          id="technical_requirements"
          value={formData.technical_requirements}
          onChange={(e) => setFormData({ ...formData, technical_requirements: e.target.value })}
          placeholder="Describe any specific technical requirements..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Additional Message</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Any additional information..."
          rows={4}
        />
      </div>

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Lead"}
        </Button>
      </div>
    </form>
  );
};
