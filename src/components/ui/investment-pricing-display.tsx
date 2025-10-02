import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, Target, Calendar, Users, Percent } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useBudgetOptions } from '@/utils/budgetOptions';

interface InvestmentPricingDisplayProps {
  investmentAmount?: number;
  fundingProgress?: number;
  investmentReceived?: number;
  expectedRoi?: number;
  investmentDeadline?: string;
  investorCount?: number;
  onInvestClick: () => void;
  showInvestmentTiers?: boolean;
  investmentPercentage?: number;
}

export const InvestmentPricingDisplay = ({
  investmentAmount = 0,
  fundingProgress = 0,
  investmentReceived = 0,
  expectedRoi,
  investmentDeadline,
  investorCount = 0,
  onInvestClick,
  showInvestmentTiers = true,
  investmentPercentage,
}: InvestmentPricingDisplayProps) => {
  const { formatPrice } = useCurrency();
  const { investment: investmentTiers } = useBudgetOptions();

  const remainingAmount = investmentAmount - investmentReceived;
  const progressPercentage = investmentAmount > 0 
    ? Math.round((investmentReceived / investmentAmount) * 100) 
    : fundingProgress;

  return (
    <div className="space-y-6">
      {/* Main Investment Card */}
      <Card className="border-emerald-green/20 bg-gradient-to-br from-white to-emerald-green/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-midnight-navy">
            <TrendingUp className="h-6 w-6 text-emerald-green" />
            Investment Opportunity
          </CardTitle>
          <CardDescription className="space-y-2">
            <span className="block">Join us in revolutionizing the industry</span>
            {investmentPercentage && (
              <span className="inline-flex items-center gap-2 bg-electric-blue/10 px-4 py-2 rounded-full border border-electric-blue/30 text-sm font-semibold text-electric-blue">
                {investmentPercentage}% of the project available for investment
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-cool-gray">
                <Target className="h-4 w-4" />
                <span>Target Amount</span>
              </div>
              <div className="text-2xl font-bold text-royal-purple">
                {formatPrice(investmentAmount)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-cool-gray">
                <DollarSign className="h-4 w-4" />
                <span>Raised</span>
              </div>
              <div className="text-2xl font-bold text-emerald-green">
                {formatPrice(investmentReceived)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-cool-gray">
                <Users className="h-4 w-4" />
                <span>Investors</span>
              </div>
              <div className="text-2xl font-bold text-electric-blue">
                {investorCount}
              </div>
            </div>

            {expectedRoi && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-cool-gray">
                  <Percent className="h-4 w-4" />
                  <span>Expected ROI</span>
                </div>
                <div className="text-2xl font-bold text-coral-orange">
                  {expectedRoi}%
                </div>
              </div>
            )}

            {investmentDeadline && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-cool-gray">
                  <Calendar className="h-4 w-4" />
                  <span>Deadline</span>
                </div>
                <div className="text-lg font-semibold text-midnight-navy">
                  {new Date(investmentDeadline).toLocaleDateString()}
                </div>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-cool-gray">
                <TrendingUp className="h-4 w-4" />
                <span>Remaining</span>
              </div>
              <div className="text-2xl font-bold text-royal-purple">
                {formatPrice(remainingAmount)}
              </div>
            </div>
          </div>

          {/* Funding Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-cool-gray">Funding Progress</span>
              <span className="font-bold text-emerald-green">{progressPercentage}%</span>
            </div>
            <div className="h-4 bg-soft-lilac/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-green to-electric-blue transition-all duration-500"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Investment Tiers */}
          {showInvestmentTiers && (
            <div className="space-y-3">
              <h4 className="font-semibold text-midnight-navy flex items-center gap-2">
                <Target className="h-5 w-5 text-royal-purple" />
                Investment Tiers Available
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {investmentTiers.map((tier, index) => (
                  <Card key={index} className="border-soft-lilac/30 hover:border-emerald-green/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-lg font-bold text-royal-purple">{tier}</div>
                          <div className="text-xs text-cool-gray">
                            Tier {index + 1} Investment
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-emerald-green/10 text-emerald-green border-emerald-green/20">
                          Available
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* CTA Button */}
          <Button
            onClick={onInvestClick}
            size="lg"
            className="w-full bg-gradient-to-r from-emerald-green to-electric-blue hover:from-emerald-green/90 hover:to-electric-blue/90 text-white font-bold text-lg py-6"
          >
            <TrendingUp className="mr-2 h-5 w-5" />
            Express Interest in Investment
          </Button>

          {/* Disclaimer */}
          <p className="text-xs text-cool-gray text-center leading-relaxed">
            Investment opportunities are subject to qualification and approval. 
            Past performance does not guarantee future results.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
