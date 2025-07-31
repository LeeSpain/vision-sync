import { LucideIcon } from 'lucide-react';

interface StatsShowcaseProps {
  title?: string;
  stats: {
    icon?: LucideIcon;
    value: string;
    label: string;
    description?: string;
  }[];
  variant?: 'default' | 'gradient';
}

const StatsShowcase = ({ title, stats, variant = 'default' }: StatsShowcaseProps) => {
  const isGradient = variant === 'gradient';

  return (
    <section className={`py-16 lg:py-24 ${isGradient ? 'bg-gradient-primary' : 'bg-slate-white/50'}`}>
      <div className="container">
        {title && (
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className={`text-3xl font-bold lg:text-4xl font-heading ${isGradient ? 'text-white' : 'text-midnight-navy'}`}>
              {title}
            </h2>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              {stat.icon && (
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                  isGradient ? 'bg-white/10' : 'bg-gradient-primary'
                }`}>
                  <stat.icon className={`h-8 w-8 ${isGradient ? 'text-white' : 'text-white'}`} />
                </div>
              )}
              
              <div className={`text-4xl font-bold mb-2 font-heading ${
                isGradient ? 'text-white' : 'text-midnight-navy'
              } group-hover:scale-110 transition-transform duration-300`}>
                {stat.value}
              </div>
              
              <div className={`text-lg font-medium mb-1 ${
                isGradient ? 'text-white/90' : 'text-midnight-navy'
              }`}>
                {stat.label}
              </div>
              
              {stat.description && (
                <div className={`text-sm ${
                  isGradient ? 'text-white/70' : 'text-cool-gray'
                }`}>
                  {stat.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsShowcase;