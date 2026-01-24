import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabaseLeadManager } from '@/utils/supabaseLeadManager';
import { analytics } from '@/utils/analytics';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

interface CustomQuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const projectTypes = [
  { value: 'web-app', label: 'Web Application' },
  { value: 'mobile-app', label: 'Mobile App' },
  { value: 'ai-agent', label: 'AI Agent / Chatbot' },
  { value: 'saas-platform', label: 'SaaS Platform' },
  { value: 'e-commerce', label: 'E-Commerce Solution' },
  { value: 'automation', label: 'Business Automation' },
  { value: 'integration', label: 'System Integration' },
  { value: 'other', label: 'Other' },
];

const industries = [
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'technology', label: 'Technology' },
  { value: 'education', label: 'Education' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'other', label: 'Other' },
];

const budgetRanges = [
  { value: 'under-5k', label: 'Under $5,000' },
  { value: '5k-10k', label: '$5,000 - $10,000' },
  { value: '10k-25k', label: '$10,000 - $25,000' },
  { value: '25k-50k', label: '$25,000 - $50,000' },
  { value: '50k-100k', label: '$50,000 - $100,000' },
  { value: '100k-plus', label: '$100,000+' },
];

const timelines = [
  { value: 'asap', label: 'ASAP (Rush)' },
  { value: '1-2-weeks', label: '1-2 Weeks' },
  { value: '2-4-weeks', label: '2-4 Weeks' },
  { value: '1-2-months', label: '1-2 Months' },
  { value: '3-6-months', label: '3-6 Months' },
  { value: 'flexible', label: 'Flexible' },
];

const availableFeatures = [
  'User Authentication',
  'Payment Processing',
  'Admin Dashboard',
  'API Integration',
  'Real-time Notifications',
  'Analytics & Reporting',
  'Mobile Responsive',
  'AI/ML Features',
  'Multi-language Support',
  'Third-party Integrations',
  'Data Export/Import',
  'Custom Branding',
];

export const CustomQuoteModal = ({ open, onOpenChange }: CustomQuoteModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1: Contact
    name: '',
    email: '',
    phone: '',
    company: '',
    
    // Step 2: Project
    projectType: '',
    industry: '',
    currentSituation: '',
    
    // Step 3: Requirements
    features: [] as string[],
    technicalRequirements: '',
    integrations: '',
    
    // Step 4: Budget & Timeline
    budget: '',
    timeline: '',
    urgency: '',
    additionalInfo: '',
  });

  const totalSteps = 4;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1:
        return Boolean(formData.name && formData.email);
      case 2:
        return Boolean(formData.projectType);
      case 3:
        return true; // Optional step
      case 4:
        return Boolean(formData.budget && formData.timeline);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps && isStepComplete(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isStepComplete(4)) return;
    
    setIsSubmitting(true);
    analytics.trackInteraction('form_submit', 'quote_request_modal');

    try {
      const result = await supabaseLeadManager.saveLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        company: formData.company || null,
        source: 'custom-build',
        budget_range: formData.budget,
        timeline: formData.timeline,
        project_type: formData.projectType,
        industry: formData.industry || null,
        technical_requirements: formData.technicalRequirements || null,
        form_data: {
          type: 'quote_request',
          currentSituation: formData.currentSituation,
          features: formData.features,
          integrations: formData.integrations,
          urgency: formData.urgency,
          additionalInfo: formData.additionalInfo,
        }
      });

      if (result) {
        analytics.trackConversion('interest', undefined, result.id);
        setIsSuccess(true);
      }
    } catch (error) {
      console.error('Error submitting quote request:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form after close animation
    setTimeout(() => {
      setCurrentStep(1);
      setIsSuccess(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        industry: '',
        currentSituation: '',
        features: [],
        technicalRequirements: '',
        integrations: '',
        budget: '',
        timeline: '',
        urgency: '',
        additionalInfo: '',
      });
    }, 300);
  };

  const renderStepContent = () => {
    if (isSuccess) {
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-emerald-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-emerald-green" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-midnight-navy mb-2">
            Request Submitted!
          </h3>
          <p className="text-cool-gray mb-6">
            Thank you for your quote request. Our team will review your requirements and get back to you within 24 hours.
          </p>
          <Button onClick={handleClose} variant="hero">
            Close
          </Button>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  placeholder="Your Company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Project Type *</Label>
                <Select value={formData.projectType} onValueChange={(v) => handleInputChange('projectType', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select value={formData.industry} onValueChange={(v) => handleInputChange('industry', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map(ind => (
                      <SelectItem key={ind.value} value={ind.value}>{ind.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentSituation">Current Situation</Label>
              <Textarea
                id="currentSituation"
                placeholder="Briefly describe your current setup and what problem you're trying to solve..."
                value={formData.currentSituation}
                onChange={(e) => handleInputChange('currentSituation', e.target.value)}
                rows={4}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Features Needed</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border border-soft-lilac/30 rounded-lg">
                {availableFeatures.map(feature => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={formData.features.includes(feature)}
                      onCheckedChange={() => handleFeatureToggle(feature)}
                    />
                    <label htmlFor={feature} className="text-sm text-midnight-navy cursor-pointer">
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="technicalRequirements">Technical Requirements</Label>
              <Textarea
                id="technicalRequirements"
                placeholder="Any specific technologies, frameworks, or technical specifications..."
                value={formData.technicalRequirements}
                onChange={(e) => handleInputChange('technicalRequirements', e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="integrations">Required Integrations</Label>
              <Input
                id="integrations"
                placeholder="e.g., Stripe, Salesforce, HubSpot, etc."
                value={formData.integrations}
                onChange={(e) => handleInputChange('integrations', e.target.value)}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Budget Range *</Label>
                <Select value={formData.budget} onValueChange={(v) => handleInputChange('budget', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRanges.map(range => (
                      <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timeline *</Label>
                <Select value={formData.timeline} onValueChange={(v) => handleInputChange('timeline', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    {timelines.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Urgency Level</Label>
              <Select value={formData.urgency} onValueChange={(v) => handleInputChange('urgency', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="How urgent is this project?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - No rush</SelectItem>
                  <SelectItem value="medium">Medium - Standard timeline</SelectItem>
                  <SelectItem value="high">High - Need it soon</SelectItem>
                  <SelectItem value="critical">Critical - Very urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                placeholder="Anything else you'd like us to know about your project..."
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = [
    'Contact Information',
    'Project Details',
    'Requirements',
    'Budget & Timeline',
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading">
            {isSuccess ? 'Thank You!' : 'Get a Custom Quote'}
          </DialogTitle>
          {!isSuccess && (
            <DialogDescription>
              Tell us about your project and we'll provide a detailed quote within 24 hours.
            </DialogDescription>
          )}
        </DialogHeader>

        {!isSuccess && (
          <>
            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-6">
              {stepTitles.map((title, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep > index + 1 
                      ? 'bg-emerald-green text-white' 
                      : currentStep === index + 1 
                        ? 'bg-royal-purple text-white' 
                        : 'bg-soft-lilac/30 text-cool-gray'
                  }`}>
                    {currentStep > index + 1 ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  {index < stepTitles.length - 1 && (
                    <div className={`hidden sm:block w-12 h-0.5 mx-1 ${
                      currentStep > index + 1 ? 'bg-emerald-green' : 'bg-soft-lilac/30'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Title */}
            <p className="text-sm text-cool-gray mb-4">
              Step {currentStep} of {totalSteps}: <span className="font-medium text-midnight-navy">{stepTitles[currentStep - 1]}</span>
            </p>
          </>
        )}

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation Buttons */}
        {!isSuccess && (
          <div className="flex justify-between mt-6 pt-4 border-t border-soft-lilac/30">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button
                variant="hero"
                onClick={handleNext}
                disabled={!isStepComplete(currentStep)}
                className="gap-2"
              >
                Next Step
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="hero"
                onClick={handleSubmit}
                disabled={!isStepComplete(currentStep) || isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Request
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomQuoteModal;
