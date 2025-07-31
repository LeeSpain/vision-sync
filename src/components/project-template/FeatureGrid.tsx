import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface FeatureGridProps {
  title: string;
  description?: string;
  features: {
    icon: LucideIcon;
    title: string;
    description: string;
  }[];
}

const FeatureGrid = ({ title, description, features }: FeatureGridProps) => {
  return (
    <section className="py-16 lg:py-24 bg-slate-white/50">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-midnight-navy lg:text-4xl font-heading">
            {title}
          </h2>
          {description && (
            <p className="mb-12 text-lg text-cool-gray leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group bg-gradient-card border-soft-lilac/30 shadow-card hover:shadow-hover transition-all duration-300 hover:scale-105"
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-heading text-midnight-navy group-hover:text-royal-purple transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-cool-gray leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;