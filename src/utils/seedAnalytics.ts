import { supabase } from '@/integrations/supabase/client';

/**
 * Utility to generate sample analytics data for testing and demo purposes
 * This will populate the analytics tables with realistic data
 */

const sampleProjects = [
  { id: '1', name: 'Global Health Sync', route: '/global-health-sync' },
  { id: '2', name: 'Nurse Sync', route: '/nurse-sync' },
  { id: '3', name: 'Conneqt Central', route: '/conneqt-central' },
  { id: '4', name: 'ICE SOS Lite', route: '/ice-sos-lite' },
  { id: '5', name: 'Puppy Rescue Spain', route: '/puppy-rescue-spain' },
  { id: '6', name: 'Wakeman Capital', route: '/wakeman-capital' },
  { id: '7', name: 'AI Spain Homes', route: '/ai-spain-homes' },
  { id: '8', name: 'Tether Band', route: '/tether-band' },
  { id: '9', name: 'For Investors', route: '/for-investors' },
  { id: '10', name: 'For Sale', route: '/for-sale' },
  { id: '11', name: 'Custom Builds', route: '/custom-builds' },
];

const deviceTypes = ['desktop', 'mobile', 'tablet'];
const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
const countries = ['US', 'UK', 'CA', 'AU', 'DE', 'FR'];
const cities = ['New York', 'London', 'Toronto', 'Sydney', 'Berlin', 'Paris'];
const referrers = [
  'https://google.com',
  'https://linkedin.com',
  'https://twitter.com',
  'direct',
  'https://github.com',
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

function getRandomDate(daysAgo: number): Date {
  const now = new Date();
  const randomDays = Math.random() * daysAgo;
  return new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000);
}

export async function seedPageAnalytics(count: number = 500) {
  console.log(`Generating ${count} page analytics records...`);
  
  const records = [];
  
  for (let i = 0; i < count; i++) {
    const project = randomElement(sampleProjects);
    const createdAt = getRandomDate(30);
    const duration = randomInt(10, 600);
    
    records.push({
      session_id: generateSessionId(),
      page_path: project.route,
      page_title: project.name,
      referrer: randomElement(referrers),
      device_type: randomElement(deviceTypes),
      browser: randomElement(browsers),
      country: randomElement(countries),
      city: randomElement(cities),
      duration_seconds: duration,
      scroll_depth: randomInt(30, 100),
      interactions_count: randomInt(0, 15),
      created_at: createdAt.toISOString(),
      exited_at: new Date(createdAt.getTime() + duration * 1000).toISOString(),
    });
  }
  
  const { data, error } = await supabase
    .from('page_analytics')
    .insert(records);
  
  if (error) {
    console.error('Error seeding page analytics:', error);
    throw error;
  }
  
  console.log(`✅ Successfully seeded ${count} page analytics records`);
  return data;
}

export async function seedConversionTracking(count: number = 200) {
  console.log(`Generating ${count} conversion tracking records...`);
  
  const funnelStages = ['awareness', 'interest', 'consideration', 'intent', 'purchase'];
  const eventTypes = ['page_view', 'interaction', 'conversion'];
  
  const records = [];
  
  for (let i = 0; i < count; i++) {
    const project = randomElement(sampleProjects);
    const stage = randomElement(funnelStages);
    const eventType = randomElement(eventTypes);
    
    let eventName = 'page_view';
    if (eventType === 'interaction') {
      eventName = randomElement(['button_click', 'form_start', 'scroll', 'video_play']);
    } else if (eventType === 'conversion') {
      eventName = randomElement(['lead_submit', 'purchase_complete', 'demo_request']);
    }
    
    const conversionValue = stage === 'purchase' ? randomInt(5000, 50000) : 0;
    
    records.push({
      session_id: generateSessionId(),
      event_type: eventType,
      event_name: eventName,
      funnel_stage: stage,
      page_path: project.route,
      conversion_value: conversionValue,
      metadata: {
        project_name: project.name,
        browser: randomElement(browsers),
        device: randomElement(deviceTypes),
      },
      created_at: getRandomDate(30).toISOString(),
    });
  }
  
  const { data, error } = await supabase
    .from('conversion_tracking')
    .insert(records);
  
  if (error) {
    console.error('Error seeding conversion tracking:', error);
    throw error;
  }
  
  console.log(`✅ Successfully seeded ${count} conversion tracking records`);
  return data;
}

export async function seedPerformanceMetrics(count: number = 100) {
  console.log(`Generating ${count} performance metrics records...`);
  
  const metricTypes = ['engagement', 'performance', 'business', 'technical'];
  const metricNames = [
    'page_load_time',
    'time_to_interactive',
    'bounce_rate',
    'conversion_rate',
    'avg_session_duration',
    'revenue_per_visitor',
    'lead_quality_score',
    'api_response_time',
  ];
  
  const records = [];
  
  for (let i = 0; i < count; i++) {
    const metricName = randomElement(metricNames);
    let metricValue: number;
    
    // Generate realistic values based on metric type
    switch (metricName) {
      case 'page_load_time':
      case 'time_to_interactive':
      case 'api_response_time':
        metricValue = randomInt(500, 3000); // milliseconds
        break;
      case 'bounce_rate':
      case 'conversion_rate':
        metricValue = Math.random() * 100; // percentage
        break;
      case 'avg_session_duration':
        metricValue = randomInt(60, 600); // seconds
        break;
      case 'revenue_per_visitor':
        metricValue = randomInt(0, 500); // dollars
        break;
      case 'lead_quality_score':
        metricValue = randomInt(0, 100); // score
        break;
      default:
        metricValue = Math.random() * 100;
    }
    
    records.push({
      metric_type: randomElement(metricTypes),
      metric_name: metricName,
      metric_value: metricValue,
      metric_unit: metricName.includes('time') ? 'ms' : metricName.includes('rate') ? '%' : 'count',
      aggregation_period: randomElement(['realtime', 'hourly', 'daily']),
      dimensions: {
        project: randomElement(sampleProjects).name,
        device: randomElement(deviceTypes),
        country: randomElement(countries),
      },
      timestamp: getRandomDate(7).toISOString(),
    });
  }
  
  const { data, error } = await supabase
    .from('performance_metrics')
    .insert(records);
  
  if (error) {
    console.error('Error seeding performance metrics:', error);
    throw error;
  }
  
  console.log(`✅ Successfully seeded ${count} performance metrics records`);
  return data;
}

export async function seedAllAnalytics() {
  console.log('🚀 Starting analytics data seeding...');
  
  try {
    await seedPageAnalytics(500);
    await seedConversionTracking(200);
    await seedPerformanceMetrics(100);
    
    console.log('✅ All analytics data seeded successfully!');
    console.log('You can now view real data in the Real-Time Analytics dashboard.');
  } catch (error) {
    console.error('❌ Error seeding analytics:', error);
    throw error;
  }
}

// Export individual functions for selective seeding
export default {
  seedPageAnalytics,
  seedConversionTracking,
  seedPerformanceMetrics,
  seedAllAnalytics,
};
