import { ExternalLink, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeSectionProps {
  userEmail?: string;
  onRefresh?: () => void;
}

export function WelcomeSection({ userEmail, onRefresh }: WelcomeSectionProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Working late';
  };

  const getUserName = () => {
    if (!userEmail) return 'Admin';
    const name = userEmail.split('@')[0];
    // Capitalize first letter
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewSite = () => {
    window.open('/', '_blank');
  };

  const handleExport = () => {
    // Trigger export functionality
    const event = new CustomEvent('exportAllData');
    window.dispatchEvent(event);
  };

  return (
    <div className="bg-gradient-card rounded-xl shadow-card p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Welcome Message */}
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-midnight-navy">
            {getGreeting()}, {getUserName()}
          </h1>
          <p className="text-cool-gray mt-1">
            {getCurrentDate()} — Here's your business at a glance
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewSite}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            View Site
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
