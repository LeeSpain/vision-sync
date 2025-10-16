import { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CohortAnalysisChartProps {
  data: {
    newVisitors: number;
    returningVisitors: number;
    newConversions: number;
    returningConversions: number;
  };
}

export const CohortAnalysisChart = memo(({ data }: CohortAnalysisChartProps) => {
  const chartData = [
    {
      name: 'Visitors',
      'New': data.newVisitors,
      'Returning': data.returningVisitors
    },
    {
      name: 'Conversions',
      'New': data.newConversions,
      'Returning': data.returningConversions
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cohort Analysis</CardTitle>
        <CardDescription>New vs Returning visitor behavior</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="name"
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
            <Legend />
            <Bar dataKey="New" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Returning" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

CohortAnalysisChart.displayName = 'CohortAnalysisChart';
