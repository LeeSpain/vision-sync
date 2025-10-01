import { supabase } from '@/integrations/supabase/client';

export interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Quote {
  id: string;
  lead_id: string;
  quote_number: string;
  project_name: string;
  project_description?: string;
  line_items: QuoteLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  discount_amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  valid_until?: string;
  terms_and_conditions?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  sent_at?: string;
  accepted_at?: string;
}

export const quoteManager = {
  async createQuote(quoteData: Omit<Quote, 'id' | 'created_at' | 'updated_at' | 'quote_number'>): Promise<Quote | null> {
    try {
      // Generate quote number
      const quoteNumber = `QT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      
      const { data, error } = await supabase
        .from('quotes')
        .insert([{
          ...quoteData,
          line_items: quoteData.line_items as any,
          quote_number: quoteNumber
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating quote:', error);
        return null;
      }

      return {
        ...data,
        line_items: data.line_items as unknown as QuoteLineItem[]
      } as Quote;
    } catch (error) {
      console.error('Error in createQuote:', error);
      return null;
    }
  },

  async getQuotesByLeadId(leadId: string): Promise<Quote[]> {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching quotes:', error);
        return [];
      }

      return (data || []).map(quote => ({
        ...quote,
        line_items: quote.line_items as unknown as QuoteLineItem[]
      })) as Quote[];
    } catch (error) {
      console.error('Error in getQuotesByLeadId:', error);
      return [];
    }
  },

  async getAllQuotes(): Promise<Quote[]> {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all quotes:', error);
        return [];
      }

      return (data || []).map(quote => ({
        ...quote,
        line_items: quote.line_items as unknown as QuoteLineItem[]
      })) as Quote[];
    } catch (error) {
      console.error('Error in getAllQuotes:', error);
      return [];
    }
  },

  async updateQuote(quoteId: string, updates: Partial<Quote>): Promise<Quote | null> {
    try {
      const updateData: any = { ...updates };
      if (updates.line_items) {
        updateData.line_items = updates.line_items as any;
      }
      
      const { data, error } = await supabase
        .from('quotes')
        .update(updateData as any)
        .eq('id', quoteId)
        .select()
        .single();

      if (error) {
        console.error('Error updating quote:', error);
        return null;
      }

      return {
        ...data,
        line_items: data.line_items as unknown as QuoteLineItem[]
      } as Quote;
    } catch (error) {
      console.error('Error in updateQuote:', error);
      return null;
    }
  },

  async deleteQuote(quoteId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', quoteId);

      if (error) {
        console.error('Error deleting quote:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteQuote:', error);
      return false;
    }
  },

  async sendQuote(quoteId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', quoteId);

      if (error) {
        console.error('Error sending quote:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in sendQuote:', error);
      return false;
    }
  },

  async acceptQuote(quoteId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', quoteId);

      if (error) {
        console.error('Error accepting quote:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in acceptQuote:', error);
      return false;
    }
  },

  calculateQuoteTotals(lineItems: QuoteLineItem[], discountAmount: number = 0, taxRate: number = 0): {
    subtotal: number;
    tax: number;
    total: number;
  } {
    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const discountedSubtotal = subtotal - discountAmount;
    const tax = discountedSubtotal * taxRate;
    const total = discountedSubtotal + tax;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2))
    };
  }
};
