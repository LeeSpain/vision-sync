import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface PricingToggleProps {
  isSubscription: boolean;
  onToggle: (value: boolean) => void;
}

export const PricingToggle = ({ isSubscription, onToggle }: PricingToggleProps) => {
  return (
    <div className="flex items-center space-x-3 p-3 bg-soft-lilac/10 rounded-lg border border-soft-lilac/30">
      <Label htmlFor="pricing-mode" className="text-sm font-medium text-midnight-navy">
        One-time purchase
      </Label>
      <Switch
        id="pricing-mode"
        checked={isSubscription}
        onCheckedChange={onToggle}
      />
      <Label htmlFor="pricing-mode" className="text-sm font-medium text-midnight-navy">
        Monthly subscription
      </Label>
    </div>
  );
};