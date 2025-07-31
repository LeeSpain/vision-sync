import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppTemplate } from '@/utils/appTemplates';
import { useProjectInquiry } from '@/hooks/useProjectInquiry';
import { useCurrency } from '@/hooks/useCurrency';
import { Loader2, Send } from 'lucide-react';

interface TemplateInquiryFormProps {
  template: AppTemplate | null;
  isOpen: boolean;
  onClose: () => void;
}

const TemplateInquiryForm = ({ template, isOpen, onClose }: TemplateInquiryFormProps) => {
  const { submitInquiry, isSubmitting } = useProjectInquiry();
  const { formatPrice } = useCurrency();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    inquiryType: 'purchase' as 'purchase' | 'demo' | 'partnership',
    customizationLevel: 'basic' as 'basic' | 'moderate' | 'extensive',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!template) return;

    const customizationPricing = {
      basic: template.pricing.customization,
      moderate: template.pricing.customization * 1.5,
      extensive: template.pricing.customization * 2.5
    };

    const estimatedTotal = template.pricing.base + customizationPricing[formData.customizationLevel];

    const result = await submitInquiry({
      projectName: template.title,
      inquiryType: formData.inquiryType,
      name: formData.name,
      email: formData.email,
      company: formData.company,
      message: `Template Inquiry: ${template.title}

Phone: ${formData.phone}
Customization Level: ${formData.customizationLevel}
Estimated Budget: ${formatPrice(estimatedTotal)}

Message: ${formData.message}

Template Details:
- Base Price: ${formatPrice(template.pricing.base)}
- Customization: ${formatPrice(customizationPricing[formData.customizationLevel])}
- Total Estimate: ${formatPrice(estimatedTotal)}`
    });

    if (result.success) {
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        inquiryType: 'purchase',
        customizationLevel: 'basic',
        message: ''
      });
      onClose();
    }
  };

  if (!template) return null;

  const customizationPricing = {
    basic: template.pricing.customization,
    moderate: template.pricing.customization * 1.5,
    extensive: template.pricing.customization * 2.5
  };

  const estimatedTotal = template.pricing.base + customizationPricing[formData.customizationLevel];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading text-midnight-navy">
            Request Template: {template.title}
          </DialogTitle>
          <DialogDescription className="text-cool-gray">
            Fill out this form to request a customized version of this app template. 
            We'll get back to you within 24 hours with a detailed proposal.
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inquiryType">Inquiry Type *</Label>
              <Select 
                value={formData.inquiryType} 
                onValueChange={(value: 'purchase' | 'demo' | 'partnership') => 
                  setFormData(prev => ({ ...prev, inquiryType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Purchase Template</SelectItem>
                  <SelectItem value="demo">Request Demo</SelectItem>
                  <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customizationLevel">Customization Level *</Label>
              <Select 
                value={formData.customizationLevel} 
                onValueChange={(value: 'basic' | 'moderate' | 'extensive') => 
                  setFormData(prev => ({ ...prev, customizationLevel: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic ({formatPrice(customizationPricing.basic)})</SelectItem>
                  <SelectItem value="moderate">Moderate ({formatPrice(customizationPricing.moderate)})</SelectItem>
                  <SelectItem value="extensive">Extensive ({formatPrice(customizationPricing.extensive)})</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-gradient-card p-4 rounded-lg border border-soft-lilac/30">
            <h4 className="font-semibold text-midnight-navy mb-2">Pricing Estimate</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-cool-gray">Base Template:</span>
                <span className="font-semibold">{formatPrice(template.pricing.base)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cool-gray">Customization ({formData.customizationLevel}):</span>
                <span className="font-semibold">{formatPrice(customizationPricing[formData.customizationLevel])}</span>
              </div>
              <div className="border-t border-soft-lilac/30 pt-1 mt-2">
                <div className="flex justify-between font-bold text-royal-purple">
                  <span>Estimated Total:</span>
                  <span>{formatPrice(estimatedTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Additional Requirements</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Tell us about your specific requirements, timeline, or any questions you have..."
              rows={4}
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
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateInquiryForm;