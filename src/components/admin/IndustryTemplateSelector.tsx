import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PricingDisplay } from '@/components/ui/pricing-display';
import { Plus, X } from 'lucide-react';

interface IndustryTemplateData {
  industry: string;
  foundationFeatures: string[];
  coreIndustryFeatures: string[];
  premiumFeatures: { name: string; price: number }[];
  salePrice: number;
  customizationPrice: number;
}

interface IndustryTemplateSelectorProps {
  onTemplateGenerated: (data: IndustryTemplateData) => void;
  selectedIndustry?: string;
}

const industryTemplates: Record<string, Partial<IndustryTemplateData>> = {
  'Hairdressing & Beauty': {
    foundationFeatures: ['User Authentication', 'Dashboard', 'Contact Management', 'Basic Reporting', 'Mobile Responsive Design', 'Data Backup'],
    coreIndustryFeatures: ['Online Booking System', 'Service Menu Management', 'Client Gallery & Portfolio', 'Loyalty Program & Rewards'],
    premiumFeatures: [
      { name: 'Advanced Analytics', price: 299 },
      { name: 'Marketing Automation', price: 399 },
      { name: 'Multi-location Support', price: 599 },
      { name: 'Advanced Inventory', price: 199 },
      { name: 'SMS Marketing', price: 149 }
    ],
    salePrice: 3500,
    customizationPrice: 500
  },
  'Restaurant & Food Service': {
    foundationFeatures: ['User Authentication', 'Dashboard', 'Order Management', 'Basic Reporting', 'Mobile Responsive Design', 'Data Backup'],
    coreIndustryFeatures: ['Digital Menu Management', 'Online Ordering System', 'Table Reservation System', 'Delivery Tracking'],
    premiumFeatures: [
      { name: 'Kitchen Display System', price: 399 },
      { name: 'Advanced POS Integration', price: 499 },
      { name: 'Multi-restaurant Support', price: 799 },
      { name: 'Advanced Analytics', price: 299 },
      { name: 'Inventory Management', price: 349 }
    ],
    salePrice: 4500,
    customizationPrice: 750
  },
  'Fitness & Wellness': {
    foundationFeatures: ['User Authentication', 'Dashboard', 'Member Management', 'Basic Reporting', 'Mobile Responsive Design', 'Data Backup'],
    coreIndustryFeatures: ['Class Scheduling System', 'Membership Management', 'Workout Plans & Tracking', 'Trainer Assignment'],
    premiumFeatures: [
      { name: 'Nutrition Tracking', price: 249 },
      { name: 'Wearable Device Integration', price: 399 },
      { name: 'Virtual Classes', price: 599 },
      { name: 'Advanced Member Analytics', price: 299 },
      { name: 'Multi-gym Support', price: 699 }
    ],
    salePrice: 4000,
    customizationPrice: 600
  },
  'Home Services': {
    foundationFeatures: ['User Authentication', 'Dashboard', 'Client Management', 'Basic Reporting', 'Mobile Responsive Design', 'Data Backup'],
    coreIndustryFeatures: ['Quote Builder & Estimator', 'Job Tracking & Progress', 'Before/After Photo Gallery', 'Scheduling & Calendar'],
    premiumFeatures: [
      { name: 'GPS Tracking', price: 199 },
      { name: 'Advanced Invoicing', price: 149 },
      { name: 'Material Cost Calculator', price: 249 },
      { name: 'Customer Feedback System', price: 99 },
      { name: 'Multi-team Support', price: 399 }
    ],
    salePrice: 3000,
    customizationPrice: 400
  },
  'Retail & E-commerce': {
    foundationFeatures: ['User Authentication', 'Dashboard', 'Product Management', 'Basic Reporting', 'Mobile Responsive Design', 'Data Backup'],
    coreIndustryFeatures: ['Product Catalog & Inventory', 'Shopping Cart & Checkout', 'Customer Account Portal', 'Order Processing System'],
    premiumFeatures: [
      { name: 'Advanced SEO Tools', price: 299 },
      { name: 'Multi-vendor Support', price: 599 },
      { name: 'Advanced Analytics', price: 399 },
      { name: 'Marketing Automation', price: 499 },
      { name: 'Multi-currency Support', price: 249 }
    ],
    salePrice: 5000,
    customizationPrice: 800
  },
  'Healthcare': {
    foundationFeatures: ['User Authentication', 'Dashboard', 'Patient Management', 'Basic Reporting', 'Mobile Responsive Design', 'Data Backup'],
    coreIndustryFeatures: ['Appointment Booking System', 'Patient Records Management', 'Treatment Plan Tracking', 'Insurance Integration'],
    premiumFeatures: [
      { name: 'Telemedicine Integration', price: 699 },
      { name: 'Advanced Reporting', price: 399 },
      { name: 'Multi-practitioner Support', price: 599 },
      { name: 'Prescription Management', price: 299 },
      { name: 'Lab Results Integration', price: 449 }
    ],
    salePrice: 6000,
    customizationPrice: 1000
  },
  'Real Estate': {
    foundationFeatures: ['User Authentication', 'Dashboard', 'Property Management', 'Basic Reporting', 'Mobile Responsive Design', 'Data Backup'],
    coreIndustryFeatures: ['Property Listing Management', 'Client Portal & Communication', 'Document Management', 'Virtual Tour Integration'],
    premiumFeatures: [
      { name: 'CRM Integration', price: 399 },
      { name: 'Advanced Search Filters', price: 199 },
      { name: 'Market Analytics', price: 499 },
      { name: 'Lead Management', price: 299 },
      { name: 'Multi-office Support', price: 699 }
    ],
    salePrice: 4500,
    customizationPrice: 750
  }
};

export function IndustryTemplateSelector({ onTemplateGenerated, selectedIndustry }: IndustryTemplateSelectorProps) {
  const [industry, setIndustry] = useState(selectedIndustry || '');
  const [foundationFeatures, setFoundationFeatures] = useState<string[]>([]);
  const [coreFeatures, setCoreFeatures] = useState<string[]>([]);
  const [premiumFeatures, setPremiumFeatures] = useState<{ name: string; price: number; selected: boolean }[]>([]);
  const [customFeatures, setCustomFeatures] = useState<string[]>([]);
  const [salePrice, setSalePrice] = useState(0);
  const [customizationPrice, setCustomizationPrice] = useState(0);
  const [isSubscription, setIsSubscription] = useState(false);

  const handleIndustryChange = (selectedIndustry: string) => {
    setIndustry(selectedIndustry);
    const template = industryTemplates[selectedIndustry];
    if (template) {
      setFoundationFeatures(template.foundationFeatures || []);
      setCoreFeatures(template.coreIndustryFeatures || []);
      setPremiumFeatures((template.premiumFeatures || []).map(f => ({ ...f, selected: false })));
      setSalePrice(template.salePrice || 0);
      setCustomizationPrice(template.customizationPrice || 0);
    }
  };

  const addCustomFeature = () => {
    setCustomFeatures([...customFeatures, '']);
  };

  const removeCustomFeature = (index: number) => {
    setCustomFeatures(customFeatures.filter((_, i) => i !== index));
  };

  const updateCustomFeature = (index: number, value: string) => {
    const updated = [...customFeatures];
    updated[index] = value;
    setCustomFeatures(updated);
  };

  const togglePremiumFeature = (index: number) => {
    const updated = [...premiumFeatures];
    updated[index].selected = !updated[index].selected;
    setPremiumFeatures(updated);
  };

  const calculateTotalPrice = () => {
    const selectedPremiumPrice = premiumFeatures
      .filter(f => f.selected)
      .reduce((sum, f) => sum + f.price, 0);
    return salePrice + customizationPrice + selectedPremiumPrice;
  };

  const generateTemplate = () => {
    const selectedPremiumFeats = premiumFeatures.filter(f => f.selected);
    const allFeatures = [...foundationFeatures, ...coreFeatures, ...customFeatures];
    
    const templateData: IndustryTemplateData = {
      industry,
      foundationFeatures,
      coreIndustryFeatures: [...coreFeatures, ...customFeatures],
      premiumFeatures: selectedPremiumFeats,
      salePrice: calculateTotalPrice(),
      customizationPrice
    };
    
    onTemplateGenerated(templateData);
  };

  if (!industry) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select Industry</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleIndustryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an industry..." />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(industryTemplates).map((ind) => (
                <SelectItem key={ind} value={ind}>{ind}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {industry} Template
            <Button variant="outline" size="sm" onClick={() => setIndustry('')}>
              Change Industry
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Foundation Features */}
          <div>
            <h4 className="font-medium mb-2">Foundation Features (Included)</h4>
            <div className="flex flex-wrap gap-2">
              {foundationFeatures.map((feature, index) => (
                <Badge key={index} variant="secondary">{feature}</Badge>
              ))}
            </div>
          </div>

          {/* Core Industry Features */}
          <div>
            <h4 className="font-medium mb-2">Core Industry Features (Included)</h4>
            <div className="flex flex-wrap gap-2">
              {coreFeatures.map((feature, index) => (
                <Badge key={index} variant="default">{feature}</Badge>
              ))}
            </div>
          </div>

          {/* Premium Features */}
          <div>
            <h4 className="font-medium mb-2">Premium Add-ons (Optional)</h4>
            <div className="space-y-2">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    checked={feature.selected}
                    onCheckedChange={() => togglePremiumFeature(index)}
                  />
                  <span className="flex-1">{feature.name}</span>
                  <Badge variant="outline">+${feature.price}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Features */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Custom Features</h4>
              <Button size="sm" variant="outline" onClick={addCustomFeature}>
                <Plus className="h-4 w-4 mr-1" />
                Add Feature
              </Button>
            </div>
            <div className="space-y-2">
              {customFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateCustomFeature(index, e.target.value)}
                    placeholder="Enter custom feature..."
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeCustomFeature(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h4 className="font-medium mb-4">Pricing Configuration</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Sale Price</Label>
                <Input
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Customization Price</Label>
                <Input
                  type="number"
                  value={customizationPrice}
                  onChange={(e) => setCustomizationPrice(Number(e.target.value))}
                />
              </div>
            </div>
            
            <PricingDisplay
              salePrice={calculateTotalPrice()}
              customizationPrice={0}
              isSubscription={isSubscription}
              onToggle={setIsSubscription}
            />
          </div>

          <Button onClick={generateTemplate} className="w-full">
            Generate Template Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}