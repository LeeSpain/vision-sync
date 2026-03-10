import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mic, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { INDUSTRIES } from '@/data/industries';

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  red: 'bg-red-100 text-red-700 border-red-200',
  pink: 'bg-pink-100 text-pink-700 border-pink-200',
};

const iconColorMap: Record<string, string> = {
  blue: 'bg-blue-600',
  green: 'bg-emerald-600',
  purple: 'bg-purple-600',
  orange: 'bg-orange-500',
  amber: 'bg-amber-500',
  red: 'bg-red-600',
  pink: 'bg-pink-500',
};

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-midnight-navy mb-6">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-cool-gray">
              Start with your industry base package. Add only what you need. Cancel anytime.
            </p>
          </div>

          {/* Industry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {INDUSTRIES.map(industry => {
              const colorClass = colorMap[industry.color] || colorMap.blue;
              const iconBg = iconColorMap[industry.color] || iconColorMap.blue;
              return (
                <div
                  key={industry.slug}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Top accent */}
                  <div className={`h-1.5 w-full ${iconBg}`} />

                  <div className="p-6 flex flex-col flex-grow">
                    {/* Industry Name */}
                    <h3 className="font-bold text-midnight-navy text-lg mb-3 leading-snug">
                      {industry.name}
                    </h3>

                    {/* Pain statement */}
                    <p className="text-sm text-cool-gray mb-4 line-clamp-3 leading-relaxed flex-grow">
                      {industry.painStatement}
                    </p>

                    {/* Voice badge */}
                    {industry.voiceIncluded && (
                      <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border mb-4 w-fit ${colorClass}`}>
                        <Mic className="h-3 w-3" />
                        Voice included
                      </div>
                    )}

                    {/* Price */}
                    <div className="border-t border-slate-100 pt-4 mb-4">
                      <p className="text-xs text-cool-gray uppercase tracking-wider mb-1">Base package from</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-midnight-navy">€{industry.exVatPrice}</span>
                        <span className="text-sm text-cool-gray">/mo ex IVA</span>
                      </div>
                      <p className="text-xs text-cool-gray mt-1">
                        + IVA 21% = <span className="font-semibold text-midnight-navy">€{industry.totalIncVat}/mo</span>
                      </p>
                    </div>

                    <Link to={`/solutions/${industry.slug}/build`}>
                      <Button className="w-full bg-midnight-navy hover:bg-midnight-navy/90 text-white text-sm font-semibold group">
                        Build your package
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* VAT Note */}
          <div className="text-center mt-12 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-5 py-2.5">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <p className="text-sm text-cool-gray">
                All prices shown exclude IVA (21% Spanish VAT). IVA is shown separately on all invoices and quotes.
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <p className="text-cool-gray mb-4">Not sure which package is right for you?</p>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="border-midnight-navy text-midnight-navy hover:bg-midnight-navy hover:text-white">
                Talk to our team
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
