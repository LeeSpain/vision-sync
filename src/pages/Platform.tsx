import { useEffect, useState } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Layers, Cpu, Network, ShieldCheck, Zap } from 'lucide-react';

export default function Platform() {
    const [sections, setSections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSections = async () => {
            const { data, error } = await supabase
                .from('page_sections')
                .select('*')
                .eq('page_key', 'platform')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });

            if (data) {
                setSections(data);
            }
            setLoading(false);
        };

        fetchSections();
    }, []);

    const getSection = (key: string) => sections.find(s => s.section_key === key);

    const heroSection = getSection('hero-area') || {
        title: 'The Vision-Sync Platform Architecture',
        content: 'An enterprise-grade orchestration layer that connects disparate business systems through intelligent AI agents. Designed for scalability, security, and seamless integration.'
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans cursor-default">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                {/* Dynamic Hero Section */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center max-w-4xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-midnight-navy mb-6 leading-tight">
                        {heroSection.title}
                    </h1>
                    <p className="text-lg md:text-xl text-cool-gray">
                        {heroSection.content}
                    </p>
                </section>

                {/* Architecture Visualization */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-electric-blue/5 to-transparent rounded-3xl -z-10 mt-20"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 max-w-6xl mx-auto">
                        {/* Layer 1 */}
                        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm transform transition duration-500 hover:-translate-y-2">
                            <CardContent className="p-8 text-center flex flex-col items-center">
                                <div className="w-16 h-16 bg-electric-blue/10 rounded-2xl flex items-center justify-center mb-6 text-electric-blue">
                                    <Layers className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-midnight-navy mb-3">Core Application Layer</h3>
                                <p className="text-cool-gray leading-relaxed">
                                    Your foundational business software and databases. We integrate seamlessly with your existing tech stack, whether legacy or modern.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Layer 2 */}
                        <Card className="border-2 border-emerald-green/20 shadow-2xl bg-white transform md:-translate-y-8 transition duration-500 hover:-translate-y-10 relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-green text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide flex items-center shadow-lg">
                                <Zap className="w-4 h-4 mr-1" /> VISION-SYNC ENGINE
                            </div>
                            <CardContent className="p-8 text-center flex flex-col items-center pt-10">
                                <div className="w-20 h-20 bg-gradient-to-br from-emerald-green to-teal-500 rounded-2xl flex items-center justify-center mb-6 text-white shadow-inner">
                                    <Cpu className="h-10 w-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-midnight-navy mb-3">Orchestration & AI</h3>
                                <p className="text-cool-gray leading-relaxed">
                                    The central nervous system. Our proprietary routers direct requests to the appropriate AI modules, maintaining context, security, and state.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Layer 3 */}
                        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm transform transition duration-500 hover:-translate-y-2">
                            <CardContent className="p-8 text-center flex flex-col items-center">
                                <div className="w-16 h-16 bg-royal-purple/10 rounded-2xl flex items-center justify-center mb-6 text-royal-purple">
                                    <Network className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-midnight-navy mb-3">Automation Endpoints</h3>
                                <p className="text-cool-gray leading-relaxed">
                                    The outputs. From automated customer support emails to CRM data entry and real-time dashboard analytics.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Dynamic Sections Loop */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
                        </div>
                    ) : (
                        sections.filter(s => s.section_key !== 'hero-area').map((sec) => (
                            <div key={sec.id} className="mb-20 bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mr-4 border border-slate-100">
                                        <ShieldCheck className="h-6 w-6 text-midnight-navy" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-midnight-navy">{sec.title}</h2>
                                </div>
                                <div className="prose prose-lg prose-slate max-w-none text-cool-gray">
                                    {sec.content?.split('\n').map((paragraph: string, i: number) => (
                                        <p key={i}>{paragraph}</p>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}
