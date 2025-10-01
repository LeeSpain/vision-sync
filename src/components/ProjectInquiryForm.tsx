import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjectInquiry } from '@/hooks/useProjectInquiry';
import { Loader2, Send } from 'lucide-react';

interface ProjectInquiryFormProps {
  projectName: string;
  projectDescription?: string;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectInquiryForm = ({ projectName, projectDescription, isOpen, onClose }: ProjectInquiryFormProps) => {
  const { submitInquiry, isSubmitting } = useProjectInquiry();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    inquiryType: 'purchase' as 'investment' | 'purchase' | 'demo' | 'partnership',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await submitInquiry({
      projectName: projectName,
      inquiryType: formData.inquiryType,
      name: formData.name,
      email: formData.email,
      company: formData.company,
      message: `Project Inquiry: ${projectName}

Phone: ${formData.phone}
Inquiry Type: ${formData.inquiryType}

Message: ${formData.message}`
    });

    if (result.success) {
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        inquiryType: 'purchase',
        message: ''
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading text-midnight-navy">
            Inquire About: {projectName}
          </DialogTitle>
          <DialogDescription className="text-cool-gray">
            {projectDescription || 'Fill out this form to learn more about this project. We\'ll get back to you within 24 hours.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                placeholder="your.email@company.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company/Business</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Your business name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inquiryType">I'm Interested In *</Label>
            <Select 
              value={formData.inquiryType} 
              onValueChange={(value: 'investment' | 'purchase' | 'demo' | 'partnership') => 
                setFormData(prev => ({ ...prev, inquiryType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="purchase">Purchase Enquiry</SelectItem>
                <SelectItem value="investment">Investment Opportunity</SelectItem>
                <SelectItem value="demo">Request Demo</SelectItem>
                <SelectItem value="partnership">Partnership Inquiry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Your Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Tell us about your interest, questions, or requirements..."
              rows={5}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="premium" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Inquiry
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectInquiryForm;
