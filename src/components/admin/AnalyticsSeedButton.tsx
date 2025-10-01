import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, Loader2 } from 'lucide-react';
import { seedAllAnalytics } from '@/utils/seedAnalytics';
import { toast } from 'sonner';

/**
 * Admin button to seed analytics data for testing/demo
 */
export default function AnalyticsSeedButton() {
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    if (!confirm('This will generate 800+ sample analytics records. Continue?')) {
      return;
    }

    setIsSeeding(true);
    toast.info('Starting analytics data seeding...');

    try {
      await seedAllAnalytics();
      toast.success('Analytics data seeded successfully! Refresh to see the data.');
    } catch (error) {
      console.error('Error seeding analytics:', error);
      toast.error('Failed to seed analytics data. Check console for details.');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Button
      onClick={handleSeed}
      disabled={isSeeding}
      variant="outline"
      size="sm"
    >
      {isSeeding ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Seeding Data...
        </>
      ) : (
        <>
          <Database className="h-4 w-4 mr-2" />
          Generate Sample Data
        </>
      )}
    </Button>
  );
}
