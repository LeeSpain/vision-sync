import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface LeadSourceChartProps {
  sourceBreakdown?: Record<string, number>;
  loading?: boolean;
}

export function LeadSourceChart({ sourceBreakdown, loading }: LeadSourceChartProps) {
  if (loading || !sourceBreakdown) {
    return (
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="font-heading">Lead Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  const data = Object.entries(sourceBreakdown).map(([source, count]) => ({
    name: getSourceDisplayName(source),
    value: count,
    source: source
  }));

  const COLORS = [
    'hsl(var(--royal-purple))',
    'hsl(var(--electric-blue))', 
    'hsl(var(--emerald-green))',
    'hsl(var(--coral-orange))',
    'hsl(var(--soft-lilac))',
    'hsl(var(--cool-gray))'
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  function getSourceDisplayName(source: string): string {
    const sourceMap: Record<string, string> = {
      'contact': 'Contact Form',
      'custom_build': 'Custom Build',
      'investor': 'Investor Interest', 
      'project_ai_agents': 'AI Agents',
      'project_global_health_sync': 'Global Health-Sync',
      'project_ice_sos_lite': 'ICE-SOS Lite',
      'project_nurse_sync': 'Nurse-Sync',
      'project_ai_spain_homes': 'AI Spain Homes',
      'project_conneqt_central': 'ConneQt Central',
      'project_tether_band': 'Tether Band',
      'unknown': 'Unknown'
    };
    return sourceMap[source] || source.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0';
      return (
        <div className="bg-slate-white p-3 rounded-lg shadow-elegant border border-soft-lilac/30">
          <p className="font-medium text-midnight-navy">{data.payload.name}</p>
          <p className="text-sm text-cool-gray">
            {data.value} leads ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-heading">Lead Sources</CardTitle>
        <Badge variant="outline" className="text-xs">
          {total} total leads
        </Badge>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-cool-gray">
            <p>No lead data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="grid grid-cols-1 gap-2">
              {data.map((item, index) => {
                const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
                return (
                  <div key={item.source} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm text-midnight-navy">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-midnight-navy">{item.value}</span>
                      <span className="text-xs text-cool-gray">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}