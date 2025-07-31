import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface OverviewSectionProps {
  title: string;
  content: string;
  highlights?: {
    icon?: LucideIcon;
    title: string;
    value: string;
  }[];
  stats?: {
    label: string;
    value: string;
    icon?: LucideIcon;
  }[];
}

const OverviewSection = ({ title, content, highlights, stats }: OverviewSectionProps) => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Overview Content */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-midnight-navy lg:text-4xl font-heading">
              {title}
            </h2>
            <div className="prose prose-lg text-cool-gray max-w-none">
              <p className="leading-relaxed">{content}</p>
            </div>
          </div>

          {/* Highlights & Stats */}
          <div className="space-y-6">
            {/* Platform Highlights */}
            {highlights && highlights.length > 0 && (
              <Card className="bg-gradient-card border-soft-lilac/30 shadow-card">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-semibold text-midnight-navy font-heading">
                    Platform Highlights
                  </h3>
                  <div className="space-y-3">
                    {highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        {highlight.icon && (
                          <highlight.icon className="h-5 w-5 text-emerald-green" />
                        )}
                        <span className="font-medium text-midnight-navy">
                          {highlight.title}:
                        </span>
                        <span className="text-cool-gray">{highlight.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Platform Stats */}
            {stats && stats.length > 0 && (
              <Card className="bg-gradient-card border-soft-lilac/30 shadow-card">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-semibold text-midnight-navy font-heading">
                    Platform Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        {stat.icon && (
                          <stat.icon className="mx-auto mb-2 h-6 w-6 text-royal-purple" />
                        )}
                        <div className="text-2xl font-bold text-midnight-navy">
                          {stat.value}
                        </div>
                        <div className="text-sm text-cool-gray">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;