import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Calendar, Target } from 'lucide-react';

interface InvestmentSectionProps {
  title?: string;
  description?: string;
  metrics: {
    seeking: string;
    valuation?: string;
    stage: string;
    timeline?: string;
    roi?: string;
    market?: string;
  };
  onRequestDetails: () => void;
}

const InvestmentSection = ({ 
  title = "Investment Opportunity", 
  description = "Join us in revolutionizing the industry with strategic investment.",
  metrics,
  onRequestDetails 
}: InvestmentSectionProps) => {
  const investmentMetrics = [
    { icon: DollarSign, label: 'Seeking', value: metrics.seeking },
    ...(metrics.valuation ? [{ icon: TrendingUp, label: 'Valuation', value: metrics.valuation }] : []),
    { icon: Target, label: 'Stage', value: metrics.stage },
    ...(metrics.timeline ? [{ icon: Calendar, label: 'Timeline', value: metrics.timeline }] : []),
    ...(metrics.roi ? [{ icon: TrendingUp, label: 'Expected ROI', value: metrics.roi }] : []),
    ...(metrics.market ? [{ icon: Target, label: 'Market Size', value: metrics.market }] : []),
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-primary">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl font-heading">
            {title}
          </h2>
          <p className="mb-12 text-lg text-white/90 leading-relaxed">
            {description}
          </p>

          <Card className="bg-white/10 border-white/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white font-heading">Investment Details</CardTitle>
              <CardDescription className="text-white/80">
                Key metrics and investment information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {investmentMetrics.map((metric, index) => (
                  <div key={index} className="text-center">
                    <metric.icon className="mx-auto mb-3 h-8 w-8 text-emerald-green" />
                    <div className="text-2xl font-bold text-white mb-1">
                      {metric.value}
                    </div>
                    <div className="text-sm text-white/70">{metric.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button
                  onClick={onRequestDetails}
                  size="lg"
                  className="bg-white text-royal-purple hover:bg-white/90 font-semibold"
                >
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Request Investment Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default InvestmentSection;