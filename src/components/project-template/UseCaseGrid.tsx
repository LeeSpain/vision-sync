import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface UseCaseGridProps {
  title: string;
  description?: string;
  useCases: {
    icon: LucideIcon;
    title: string;
    description: string;
    examples?: string[];
  }[];
}

const UseCaseGrid = ({ title, description, useCases }: UseCaseGridProps) => {
  return (
    <section className="py-16 lg:py-24">
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

        <div className="grid gap-8 md:grid-cols-2">
          {useCases.map((useCase, index) => (
            <Card
              key={index}
              className="group bg-gradient-card border-soft-lilac/30 shadow-card hover:shadow-hover transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                    <useCase.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-heading text-midnight-navy group-hover:text-royal-purple transition-colors">
                    {useCase.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-cool-gray leading-relaxed">
                  {useCase.description}
                </CardDescription>
                
                {useCase.examples && useCase.examples.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-midnight-navy">
                      Applications:
                    </h4>
                    <ul className="space-y-1">
                      {useCase.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="flex items-center text-sm text-cool-gray">
                          <div className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-green"></div>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCaseGrid;