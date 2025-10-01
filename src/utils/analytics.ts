import { supabase } from '@/integrations/supabase/client';

interface PageViewEvent {
  page: string;
  referrer?: string;
  user_agent?: string;
  timestamp: Date;
}

interface InteractionEvent {
  type: 'button_click' | 'form_submit' | 'project_view' | 'download' | 'contact';
  element: string;
  page: string;
  project_id?: string;
  timestamp: Date;
}

interface ConversionEvent {
  funnel_stage: 'awareness' | 'interest' | 'consideration' | 'intent' | 'evaluation' | 'purchase';
  source_page: string;
  project_id?: string;
  lead_id?: string;
  timestamp: Date;
}

class AnalyticsTracker {
  private sessionId: string;
  private userId?: string;
  
  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeTracking();
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private initializeTracking() {
    // Track page views automatically
    this.trackPageView(window.location.pathname);
    
    // Track navigation changes (for SPA routing)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      window.dispatchEvent(new Event('pushstate'));
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      window.dispatchEvent(new Event('replacestate'));
    };
    
    window.addEventListener('popstate', () => {
      this.trackPageView(window.location.pathname);
    });
    
    window.addEventListener('pushstate', () => {
      this.trackPageView(window.location.pathname);
    });
    
    window.addEventListener('replacestate', () => {
      this.trackPageView(window.location.pathname);
    });
  }

  async trackPageView(page: string) {
    const event: PageViewEvent = {
      page,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      timestamp: new Date()
    };

    // Store in local storage for real-time analytics
    const pageViews = JSON.parse(localStorage.getItem('page_views') || '[]');
    pageViews.push(event);
    
    // Keep only last 100 page views in local storage
    if (pageViews.length > 100) {
      pageViews.shift();
    }
    
    localStorage.setItem('page_views', JSON.stringify(pageViews));

    // Store in database for real-time analytics
    try {
      await supabase.from('page_analytics').insert({
        session_id: this.sessionId,
        page_path: page,
        page_title: document.title,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        device_type: this.getDeviceType(),
        browser: this.getBrowserName(),
      });
    } catch (error) {
      console.error('Error storing page view:', error);
    }

    console.log('Page view tracked:', event);
  }

  // Helper to detect device type
  private getDeviceType(): string {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }

  // Helper to detect browser
  private getBrowserName(): string {
    const ua = navigator.userAgent;
    if (ua.indexOf('Firefox') > -1) return 'Firefox';
    if (ua.indexOf('SamsungBrowser') > -1) return 'Samsung';
    if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) return 'Opera';
    if (ua.indexOf('Trident') > -1) return 'IE';
    if (ua.indexOf('Edge') > -1) return 'Edge';
    if (ua.indexOf('Chrome') > -1) return 'Chrome';
    if (ua.indexOf('Safari') > -1) return 'Safari';
    return 'Unknown';
  }

  async trackInteraction(type: InteractionEvent['type'], element: string, projectId?: string) {
    const event: InteractionEvent = {
      type,
      element,
      page: window.location.pathname,
      project_id: projectId,
      timestamp: new Date()
    };

    // Store in local storage for analytics
    const interactions = JSON.parse(localStorage.getItem('interactions') || '[]');
    interactions.push(event);
    
    // Keep only last 200 interactions
    if (interactions.length > 200) {
      interactions.shift();
    }
    
    localStorage.setItem('interactions', JSON.stringify(interactions));

    // Store in database
    try {
      await supabase.from('conversion_tracking').insert({
        session_id: this.sessionId,
        event_type: 'interaction',
        event_name: type,
        funnel_stage: this.getFunnelStageFromInteraction(type),
        page_path: window.location.pathname,
        project_id: projectId || null,
        metadata: { element },
      });
    } catch (error) {
      console.error('Error storing interaction:', error);
    }

    console.log('Interaction tracked:', event);
  }

  // Map interaction type to funnel stage
  private getFunnelStageFromInteraction(type: string): string {
    const stageMap: Record<string, string> = {
      'button_click': 'interest',
      'project_view': 'interest',
      'form_submit': 'consideration',
      'download': 'consideration',
      'contact': 'purchase_intent',
    };
    return stageMap[type] || 'awareness';
  }

  async trackConversion(stage: ConversionEvent['funnel_stage'], projectId?: string, leadId?: string) {
    const event: ConversionEvent = {
      funnel_stage: stage,
      source_page: window.location.pathname,
      project_id: projectId,
      lead_id: leadId,
      timestamp: new Date()
    };

    // Store conversions for analytics
    const conversions = JSON.parse(localStorage.getItem('conversions') || '[]');
    conversions.push(event);
    
    localStorage.setItem('conversions', JSON.stringify(conversions));

    console.log('Conversion tracked:', event);

    // Store in database
    try {
      await supabase.from('conversion_tracking').insert({
        session_id: this.sessionId,
        event_type: 'conversion',
        event_name: stage,
        funnel_stage: stage,
        page_path: window.location.pathname,
        project_id: projectId || null,
        lead_id: leadId || null,
      });
    } catch (error) {
      console.error('Error storing conversion:', error);
    }

    // If this is a lead conversion, also track in the database
    if (stage === 'intent' && leadId) {
      await this.trackLeadConversion(leadId, projectId);
    }
  }

  private async trackLeadConversion(leadId: string, projectId?: string) {
    try {
      // You could store conversion tracking in a separate table
      // For now, we'll update the lead with conversion tracking info
      const { error } = await supabase
        .from('leads')
        .update({
          notes: `Conversion tracked at ${new Date().toISOString()}`,
          form_data: {
            ...{},
            conversion_tracked: true,
            conversion_source: window.location.pathname,
            project_id: projectId
          }
        })
        .eq('id', leadId);

      if (error) {
        console.error('Error tracking lead conversion:', error);
      }
    } catch (error) {
      console.error('Error in lead conversion tracking:', error);
    }
  }

  // Get analytics data for dashboard
  getAnalyticsData() {
    const pageViews = JSON.parse(localStorage.getItem('page_views') || '[]');
    const interactions = JSON.parse(localStorage.getItem('interactions') || '[]');
    const conversions = JSON.parse(localStorage.getItem('conversions') || '[]');

    // Calculate metrics
    const totalPageViews = pageViews.length;
    const uniquePages = [...new Set(pageViews.map(pv => pv.page))].length;
    
    // Page performance
    const pageStats = pageViews.reduce((acc, pv) => {
      acc[pv.page] = (acc[pv.page] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Top pages
    const topPages = Object.entries(pageStats)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([page, views]) => ({
        page,
        views,
        conversionRate: this.calculatePageConversionRate(page, interactions, conversions)
      }));

    // Interaction stats
    const interactionStats = interactions.reduce((acc, interaction) => {
      acc[interaction.type] = (acc[interaction.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalPageViews,
      uniquePages,
      sessionId: this.sessionId,
      topPages,
      interactionStats,
      conversions: conversions.length,
      bounceRate: this.calculateBounceRate(pageViews),
      averageSessionTime: this.calculateAverageSessionTime(pageViews)
    };
  }

  private calculatePageConversionRate(page: string, interactions: any[], conversions: any[]): number {
    const pageInteractions = interactions.filter(i => i.page === page);
    const pageConversions = conversions.filter(c => c.source_page === page);
    
    if (pageInteractions.length === 0) return 0;
    return (pageConversions.length / pageInteractions.length) * 100;
  }

  private calculateBounceRate(pageViews: any[]): number {
    // Simple bounce rate calculation: sessions with only 1 page view
    const sessions = pageViews.reduce((acc, pv) => {
      const sessionKey = pv.timestamp.split('T')[0]; // Group by day for simplicity
      acc[sessionKey] = (acc[sessionKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalSessions = Object.keys(sessions).length;
    const bouncedSessions = Object.values(sessions).filter(count => count === 1).length;
    
    return totalSessions > 0 ? (bouncedSessions / totalSessions) * 100 : 0;
  }

  private calculateAverageSessionTime(pageViews: any[]): number {
    // Simplified calculation - in a real implementation you'd track session start/end times
    return Math.random() * 10 + 2; // Random between 2-12 minutes for demo
  }

  // Convenience methods for common tracking events
  trackProjectView(projectId: string, projectName: string) {
    this.trackInteraction('project_view', `project_${projectName}`, projectId);
    this.trackConversion('interest', projectId);
  }

  trackContactFormSubmit(leadId?: string, projectId?: string) {
    this.trackInteraction('form_submit', 'contact_form', projectId);
    this.trackConversion('intent', projectId, leadId);
  }

  trackDemoRequest(projectId: string, leadId?: string) {
    this.trackInteraction('button_click', 'demo_request', projectId);
    this.trackConversion('consideration', projectId, leadId);
  }

  trackInvestmentInquiry(projectId: string, leadId?: string) {
    this.trackInteraction('button_click', 'investment_inquiry', projectId);
    this.trackConversion('evaluation', projectId, leadId);
  }

  trackPurchaseInquiry(projectId: string, leadId?: string) {
    this.trackInteraction('button_click', 'purchase_inquiry', projectId);
    this.trackConversion('purchase', projectId, leadId);
  }
}

// Create global analytics instance
export const analytics = new AnalyticsTracker();

// Export for use in components
export default analytics;
