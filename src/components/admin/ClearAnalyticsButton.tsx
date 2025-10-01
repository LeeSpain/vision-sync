import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Admin button to clear all sample analytics data
 */
export default function ClearAnalyticsButton() {
  const [isClearing, setIsClearing] = useState(false);

  const handleClear = async () => {
    if (!confirm('⚠️ This will DELETE ALL analytics data including sample and real data. Are you absolutely sure?\n\nThis action cannot be undone!')) {
      return;
    }

    // Second confirmation
    if (!confirm('Final confirmation: Delete ALL analytics data?')) {
      return;
    }

    setIsClearing(true);
    toast.info('Clearing analytics data...');

    try {
      // Delete from all analytics tables
      const deleteOperations = [
        supabase.from('page_analytics').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('conversion_tracking').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('performance_metrics').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
      ];

      const results = await Promise.all(deleteOperations);
      
      // Check for errors
      const errors = results.filter(r => r.error);
      if (errors.length > 0) {
        console.error('Errors clearing data:', errors);
        toast.error('Some data could not be cleared. Check console for details.');
        return;
      }

      toast.success('All analytics data cleared successfully!', {
        description: 'Only new real-time data will be tracked from now on.'
      });
      
      // Force a hard refresh to reload analytics data
      setTimeout(() => {
        window.location.href = window.location.href;
      }, 1500);
      
    } catch (error) {
      console.error('Error clearing analytics:', error);
      toast.error('Failed to clear analytics data. Check console for details.');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Button
      onClick={handleClear}
      disabled={isClearing}
      variant="destructive"
      size="sm"
    >
      {isClearing ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Clearing Data...
        </>
      ) : (
        <>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All Data
        </>
      )}
    </Button>
  );
}
