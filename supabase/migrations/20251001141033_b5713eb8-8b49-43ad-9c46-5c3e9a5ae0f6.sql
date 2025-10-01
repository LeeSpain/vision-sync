-- Create page_analytics table for tracking page views and user behavior
CREATE TABLE IF NOT EXISTS public.page_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  country TEXT,
  city TEXT,
  duration_seconds INTEGER DEFAULT 0,
  scroll_depth INTEGER DEFAULT 0,
  interactions_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  exited_at TIMESTAMP WITH TIME ZONE
);

-- Create conversion_tracking table for funnel analytics
CREATE TABLE IF NOT EXISTS public.conversion_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID,
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  funnel_stage TEXT NOT NULL,
  page_path TEXT,
  project_id UUID,
  lead_id UUID,
  quote_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  conversion_value NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create performance_metrics table for real-time KPIs
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT,
  dimensions JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  aggregation_period TEXT DEFAULT 'realtime'
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_page_analytics_session ON public.page_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_page_analytics_created_at ON public.page_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_analytics_page_path ON public.page_analytics(page_path);
CREATE INDEX IF NOT EXISTS idx_conversion_tracking_session ON public.conversion_tracking(session_id);
CREATE INDEX IF NOT EXISTS idx_conversion_tracking_event_type ON public.conversion_tracking(event_type);
CREATE INDEX IF NOT EXISTS idx_conversion_tracking_funnel_stage ON public.conversion_tracking(funnel_stage);
CREATE INDEX IF NOT EXISTS idx_conversion_tracking_created_at ON public.conversion_tracking(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_type ON public.performance_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON public.performance_metrics(timestamp DESC);

-- Enable Row Level Security
ALTER TABLE public.page_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversion_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for read access
CREATE POLICY "Enable read access for all users" ON public.page_analytics FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.page_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.page_analytics FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.conversion_tracking FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.conversion_tracking FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON public.performance_metrics FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.performance_metrics FOR INSERT WITH CHECK (true);

-- Enable realtime for the analytics tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.page_analytics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversion_tracking;
ALTER PUBLICATION supabase_realtime ADD TABLE public.performance_metrics;