/**
 * Utility functions for exporting analytics data
 */

export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that might contain commas
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value ?? '';
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportPageAnalyticsToCSV = (data: any[]) => {
  const formattedData = data.map(item => ({
    'Page Path': item.page_path,
    'Views': item.views || 1,
    'Avg Duration (s)': item.avg_duration || item.duration_seconds || 0,
    'Avg Scroll Depth (%)': item.avg_scroll_depth || item.scroll_depth || 0,
    'Interactions': item.interactions || item.interactions_count || 0,
    'Device': item.device_type || 'unknown',
    'Browser': item.browser || 'unknown',
    'Country': item.country || 'unknown',
    'Referrer': item.referrer || 'direct',
    'Date': new Date(item.created_at).toLocaleString()
  }));
  
  exportToCSV(formattedData, 'page_analytics');
};

export const exportConversionsToCSV = (data: any[]) => {
  const formattedData = data.map(item => ({
    'Event Name': item.event_name,
    'Event Type': item.event_type,
    'Funnel Stage': item.funnel_stage,
    'Conversion Value': item.conversion_value || 0,
    'Page Path': item.page_path || 'unknown',
    'Session ID': item.session_id,
    'Date': new Date(item.created_at).toLocaleString()
  }));
  
  exportToCSV(formattedData, 'conversions');
};

export const exportProjectsToCSV = (data: any[]) => {
  const formattedData = data.map(item => ({
    'Project': item.title,
    'Views': item.views || 0,
    'Inquiries': item.inquiries || 0,
    'Conversions': item.conversions || 0,
    'Conversion Rate (%)': item.conversionRate || 0,
    'Avg Time (s)': item.avgTime || 0,
    'Interactions': item.interactions || 0,
    'Bounce Rate (%)': item.bounceRate || 0,
    'Revenue': item.revenue || 0,
    'Status': item.status,
    'Category': item.category
  }));
  
  exportToCSV(formattedData, 'project_analytics');
};

export const exportLeadsToCSV = (data: any[]) => {
  const formattedData = data.map(item => ({
    'Name': item.name,
    'Email': item.email,
    'Company': item.company || '',
    'Source': item.source,
    'Status': item.status,
    'Lead Score': item.lead_score || 0,
    'Pipeline Stage': item.pipeline_stage,
    'Created': new Date(item.created_at).toLocaleString()
  }));
  
  exportToCSV(formattedData, 'leads');
};

export const exportRevenueToCSV = (data: any[]) => {
  const formattedData = data.map(item => ({
    'Quote Number': item.quote_number,
    'Project Name': item.project_name,
    'Status': item.status,
    'Total': item.total || 0,
    'Subtotal': item.subtotal || 0,
    'Tax': item.tax || 0,
    'Created': new Date(item.created_at).toLocaleString(),
    'Sent': item.sent_at ? new Date(item.sent_at).toLocaleString() : '',
    'Accepted': item.accepted_at ? new Date(item.accepted_at).toLocaleString() : ''
  }));
  
  exportToCSV(formattedData, 'revenue');
};
