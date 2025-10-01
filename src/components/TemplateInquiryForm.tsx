import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppTemplate } from '@/utils/appTemplates';
import { useProjectInquiry } from '@/hooks/useProjectInquiry';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Loader2, Send } from 'lucide-react';
import { PaymentMethodSelector, PaymentMethod } from '@/components/ui/payment-method-selector';

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
    inquiryType: 'purchase' as 'investment' | 'purchase' | 'demo' | 'partnership',
    paymentMethod: 'one-time' as PaymentMethod,
    ownershipPreference: 'full-ownership' as 'full-ownership' | 'managed-service' | 'hybrid',
    serviceLevel: 'standard' as 'basic' | 'standard' | 'premium',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!template) return;

    // Calculate pricing based on payment method
    let estimatedPrice = 0;
    let priceDescription = '';
    
    switch (formData.paymentMethod) {
      case 'one-time':
        estimatedPrice = template.pricing.base;
        priceDescription = 'One-time purchase';
        break;
      case 'subscription':
        estimatedPrice = template.pricing.subscription.monthly;
        priceDescription = 'Monthly subscription';
        break;
      case 'deposit-service':
        estimatedPrice = template.pricing.deposit.amount;
        priceDescription = `Deposit + ${formatPrice(template.pricing.deposit.serviceMonthly)}/month`;
        break;
      case 'installments':
        estimatedPrice = template.pricing.installments.plans[0]?.monthlyAmount || 0;
        priceDescription = `${template.pricing.installments.plans[0]?.months} monthly payments`;
        break;
      case 'service-contract':
        estimatedPrice = template.pricing.ownership.serviceContract.deposit;
        priceDescription = `Service deposit + ${formatPrice(template.pricing.ownership.serviceContract.monthly)}/month`;
        break;
    }

    const result = await submitInquiry({
      projectName: template.title,
      inquiryType: formData.inquiryType,
      name: formData.name,
      email: formData.email,
      company: formData.company,
      message: `Template Inquiry: ${template.title}

Phone: ${formData.phone}
Payment Method: ${formData.paymentMethod}
Ownership Preference: ${formData.ownershipPreference}
Service Level: ${formData.serviceLevel}
Estimated Pricing: ${priceDescription}

Message: ${formData.message}

Payment Method Details:
- Selected Method: ${formData.paymentMethod}
- Estimated Price: ${formatPrice(estimatedPrice)}
- Description: ${priceDescription}`
    });

    if (result.success) {
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        inquiryType: 'purchase',
        paymentMethod: 'one-time',
        ownershipPreference: 'full-ownership',
        serviceLevel: 'standard',
        message: ''
      });
      onClose();
    }
  };

  if (!template) return null;

  // Calculate current pricing estimate
  let currentEstimate = 0;
  let currentDescription = '';
  
  switch (formData.paymentMethod) {
    case 'one-time':
      currentEstimate = template.pricing.base;
      currentDescription = 'One-time purchase';
      break;
    case 'subscription':
      currentEstimate = template.pricing.subscription.monthly;
      currentDescription = 'Monthly subscription';
      break;
    case 'deposit-service':
      currentEstimate = template.pricing.deposit.amount;
      currentDescription = `Deposit + ${formatPrice(template.pricing.deposit.serviceMonthly)}/month`;
      break;
    case 'installments':
      currentEstimate = template.pricing.installments.plans[0]?.monthlyAmount || 0;
      currentDescription = `${template.pricing.installments.plans[0]?.months} monthly payments`;
      break;
    case 'service-contract':
      currentEstimate = template.pricing.ownership.serviceContract.deposit;
      currentDescription = `Service deposit + ${formatPrice(template.pricing.ownership.serviceContract.monthly)}/month`;
      break;
  }

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

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inquiryType">Inquiry Type *</Label>
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
                    <SelectItem value="investment">Interested in Investment</SelectItem>
                    <SelectItem value="demo">Request Demo</SelectItem>
                    <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <Label>Payment Method *</Label>
              <PaymentMethodSelector
                pricing={template.pricing}
                selectedMethod={formData.paymentMethod}
                onMethodChange={(method) => setFormData(prev => ({ ...prev, paymentMethod: method }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ownershipPreference">Ownership Preference *</Label>
                <Select 
                  value={formData.ownershipPreference} 
                  onValueChange={(value: 'full-ownership' | 'managed-service' | 'hybrid') => 
                    setFormData(prev => ({ ...prev, ownershipPreference: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-ownership">Full Ownership (I manage everything)</SelectItem>
                    <SelectItem value="managed-service">Managed Service (You handle everything)</SelectItem>
                    <SelectItem value="hybrid">Hybrid Approach (Shared responsibilities)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {(formData.paymentMethod === 'service-contract' || formData.ownershipPreference === 'managed-service') && (
                <div className="space-y-2">
                  <Label htmlFor="serviceLevel">Service Level *</Label>
                  <Select 
                    value={formData.serviceLevel} 
                    onValueChange={(value: 'basic' | 'standard' | 'premium') => 
                      setFormData(prev => ({ ...prev, serviceLevel: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (Hosting + Updates)</SelectItem>
                      <SelectItem value="standard">Standard (+ Support + Monitoring)</SelectItem>
                      <SelectItem value="premium">Premium (+ Custom features + Priority)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-card p-4 rounded-lg border border-soft-lilac/30">
            <h4 className="font-semibold text-midnight-navy mb-2">Selected Pricing</h4>
            <div className="text-center">
              <div className="text-2xl font-bold text-royal-purple">
                {formatPrice(currentEstimate)}
                {formData.paymentMethod === 'subscription' && '/month'}
                {formData.paymentMethod === 'installments' && `/month for ${template.pricing.installments.plans[0]?.months} months`}
              </div>
              <div className="text-sm text-cool-gray mb-3">{currentDescription}</div>
              
              {(formData.paymentMethod === 'deposit-service' || formData.paymentMethod === 'service-contract') && (
                <div className="text-xs text-royal-purple">
                  + Monthly service fees as displayed above
                </div>
              )}
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