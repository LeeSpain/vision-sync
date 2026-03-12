import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, ArrowRight, Mic, Users } from 'lucide-react';
import { INDUSTRIES } from '@/data/industries';

export default function Solutions() {
  const { industrySlug } = useParams<{ industrySlug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!industrySlug) {
      navigate('/#industries', { replace: true });
      return;
    }
    const found = INDUSTRIES.find(i => i.slug === industrySlug);
    if (!found) {
      navigate('/#industries', { replace: true });
    }
  }, [industrySlug, navigate]);

  const industry = INDUSTRIES.find(i => i.slug === industrySlug);

  if (!industry) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow pt-20">

        {/* Back link */}
        <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
          <div className="container mx-auto max-w-5xl">
            <Link
              to="/#industries"
              className="inline-flex items-center gap-2 text-cool-gray hover:text-midnight-navy text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              View all industries
            </Link>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-b from-[#0A1628] to-[#1E3A8A] py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-300 mb-4">
              Built for {industry.name} in Alicante & Almeria
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {industry.name}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              {industry.painStatement}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing">
                <Button className="bg-white text-[#0A1628] hover:bg-slate-100 font-bold px-8 py-6 text-base shadow-lg">
                  Get Your Quote
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 px-8 py-6 text-base">
                  Talk to our team
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <span className="text-xs font-bold text-electric-blue uppercase tracking-widest">Base Package</span>
                <h2 className="text-3xl font-bold text-midnight-navy mt-2 mb-6">
                  What's included as standard
                </h2>
                <ul className="space-y-4">
                  {industry.baseIncludes.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
                {industry.voiceIncluded && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
                    <Mic className="h-5 w-5 text-blue-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-blue-900 text-sm">Voice Agent Included</p>
                      <p className="text-blue-700 text-sm">{industry.voiceMinutes?.toLocaleString()} inbound voice minutes per month</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Social Proof */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#0A1628] rounded-xl flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-midnight-navy">Trusted by businesses</p>
                      <p className="text-sm text-cool-gray">across the Costa Blanca and Costa del Sol</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    From Alicante and Almeria to the Costa Blanca and beyond, Vision-Sync AI agents are helping {industry.name.toLowerCase()} businesses capture more leads, reduce admin, and work smarter — in English and Spanish.
                  </p>
                </div>

                {/* CTA Card */}
                <div className="bg-[#0A1628] rounded-2xl p-6 text-white">
                  <h3 className="font-bold text-lg mb-2">Ready to get started?</h3>
                  <p className="text-white/70 text-sm mb-6">
                    Get a personalised quote for your business — select your industry, pick your AI skills, and receive your custom proposal instantly.
                  </p>
                  <Link to="/pricing" className="block">
                    <Button className="w-full bg-electric-blue hover:bg-electric-blue/90 text-white font-bold py-5">
                      Get Your Quote →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
