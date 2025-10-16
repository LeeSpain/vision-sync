import { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HourlyTrafficChartProps {
  data: Array<{ hour: string; views: number; conversions: number }>;
}

export const HourlyTrafficChart = memo(({ data }: HourlyTrafficChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic by Hour</CardTitle>
        <CardDescription>Page views and conversions throughout the day</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="hour" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="conversions" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

HourlyTrafficChart.displayName = 'HourlyTrafficChart';
