import { TrendingUp, TrendingDown, Minus, Users, MessageCircle, Target, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TodaySummaryProps {
  metrics: {
    leadsToday: number;
    conversationsToday: number;
    qualifiedToday?: number;
    revenueToday?: number;
  } | null;
  yesterdayMetrics?: {
    leadsYesterday: number;
    conversationsYesterday: number;
    qualifiedYesterday?: number;
    revenueYesterday?: number;
  };
}

export function TodaySummary({ metrics, yesterdayMetrics }: TodaySummaryProps) {
  const getTrend = (today: number, yesterday: number) => {
    if (today > yesterday) return { icon: TrendingUp, color: 'text-emerald-green', label: 'up' };
    if (today < yesterday) return { icon: TrendingDown, color: 'text-coral-orange', label: 'down' };
    return { icon: Minus, color: 'text-cool-gray', label: 'same' };
  };

  const summaryItems = [
    {
      label: 'New Leads',
      value: metrics?.leadsToday || 0,
      yesterday: yesterdayMetrics?.leadsYesterday || 0,
      icon: Users,
      iconColor: 'text-electric-blue',
      bgColor: 'bg-electric-blue/10'
    },
    {
      label: 'Conversations',
      value: metrics?.conversationsToday || 0,
      yesterday: yesterdayMetrics?.conversationsYesterday || 0,
      icon: MessageCircle,
      iconColor: 'text-royal-purple',
      bgColor: 'bg-royal-purple/10'
    },
    {
      label: 'Qualified',
      value: metrics?.qualifiedToday || 0,
      yesterday: yesterdayMetrics?.qualifiedYesterday || 0,
      icon: Target,
      iconColor: 'text-emerald-green',
      bgColor: 'bg-emerald-green/10'
    },
    {
      label: 'Pipeline Added',
      value: metrics?.revenueToday || 0,
      yesterday: yesterdayMetrics?.revenueYesterday || 0,
      icon: DollarSign,
      iconColor: 'text-coral-orange',
      bgColor: 'bg-coral-orange/10',
      isCurrency: true
    }
  ];

  return (
    <Card className="bg-gradient-card shadow-card mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-midnight-navy uppercase tracking-wide">
            Today at a Glance
          </h3>
          <span className="text-xs text-cool-gray">
            vs yesterday
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryItems.map((item) => {
            const trend = getTrend(item.value, item.yesterday);
            const TrendIcon = trend.icon;
            const ItemIcon = item.icon;
            
            return (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${item.bgColor}`}>
                  <ItemIcon className={`h-5 w-5 ${item.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-bold text-midnight-navy">
                      {item.isCurrency ? `€${item.value.toLocaleString()}` : item.value}
                    </span>
                    <TrendIcon className={`h-3.5 w-3.5 ${trend.color}`} />
                  </div>
                  <p className="text-xs text-cool-gray truncate">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
