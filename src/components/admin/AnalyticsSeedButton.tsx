import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, Loader2, DollarSign } from 'lucide-react';
import { seedAllAnalytics, seedQuotes } from '@/utils/seedAnalytics';
import { toast } from 'sonner';

/**
 * Admin button to seed analytics data for testing/demo
 */
export default function AnalyticsSeedButton() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSeedingQuotes, setIsSeedingQuotes] = useState(false);

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

  const handleSeedQuotes = async () => {
    if (!confirm('This will generate 50 sample quotes with revenue data. Continue?')) {
      return;
    }

    setIsSeedingQuotes(true);
    toast.info('Generating sample quotes...');

    try {
      await seedQuotes(50);
      toast.success('50 sample quotes created! Revenue metrics will now display.');
    } catch (error) {
      console.error('Error seeding quotes:', error);
      toast.error('Failed to seed quotes. Check console for details.');
    } finally {
      setIsSeedingQuotes(false);
    }
  };

  return (
    <div className="flex gap-2">
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
      
      <Button
        onClick={handleSeedQuotes}
        disabled={isSeedingQuotes}
        variant="outline"
        size="sm"
      >
        {isSeedingQuotes ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <DollarSign className="h-4 w-4 mr-2" />
            Generate Quotes
          </>
        )}
      </Button>
    </div>
  );
}
