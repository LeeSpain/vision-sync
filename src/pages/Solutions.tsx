import { useEffect, useState } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Solutions() {
    const [solutions, setSolutions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSolutions = async () => {
            const { data, error } = await supabase
                .from('solutions')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });

            if (data) {
                setSolutions(data);
            }
            setLoading(false);
        };

        fetchSolutions();
    }, []);

    const fallbackSolutions = [
        {
            id: 'fallback-1',
            name: 'Healthcare Patient Sync',
            summary: 'HIPAA-compliant patient data orchestration and automated outreach.',
            description: 'Connect your EMR to automated communication workflows. Reduce no-shows via intelligent SMS routing and streamline patient onboarding through secure conversational AI agents.',
            industries: ['Healthcare', 'Telemedicine', 'Private Practice'],
            cta_label: 'Explore Healthcare AI',
            cta_link: '/contact'
        },
        {
            id: 'fallback-2',
            name: 'Real Estate Deal Flow',
            summary: 'Automated property matching and buyer qualification pipelines.',
            description: 'Ingest property data and instantly match with your buyer CRM. Qualify incoming inquiries 24/7 using Vision-Sync conversational agents tuned on your property portfolio.',
            industries: ['Real Estate', 'Property Management', 'Commercial Brokerage'],
            cta_label: 'Explore Real Estate AI',
            cta_link: '/contact'
        },
        {
            id: 'fallback-3',
            name: 'Enterprise E-Commerce',
            summary: 'Predictive inventory routing and VIP customer support automations.',
            description: 'Unify Shopify, ERP, and customer support. Vision-Sync resolves tier-1 tickets autonomously while escalating complex issues with full CRM context to your human agents.',
            industries: ['E-Commerce', 'Retail', 'DTC Brands'],
            cta_label: 'Explore Retail AI',
            cta_link: '/contact'
        }
    ];

    const displaySolutions = solutions.length > 0 ? solutions : fallbackSolutions;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-midnight-navy mb-6">
                            Industry Solutions
                        </h1>
                        <p className="text-lg text-cool-gray">
                            Pre-engineered AI automation workflows tailored for specific industries and business outcomes. Accelerate your transformation with proven architectures.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-electric-blue" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displaySolutions.map((sol) => (
                                <Card key={sol.id} className="flex flex-col h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
                                    <div className="h-2 w-full bg-gradient-to-r from-electric-blue to-royal-purple"></div>
                                    <CardHeader>
                                        <CardTitle className="text-2xl text-midnight-navy">{sol.name}</CardTitle>
                                        <CardDescription className="text-base mt-2">
                                            {sol.summary}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        {sol.description && (
                                            <p className="text-sm text-slate-600 mb-6">{sol.description}</p>
                                        )}
                                        {Array.isArray(sol.industries) && sol.industries.length > 0 && (
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-semibold text-midnight-navy uppercase tracking-wider">Ideal For</h4>
                                                <ul className="space-y-2">
                                                    {sol.industries.map((ind: string, idx: number) => (
                                                        <li key={idx} className="flex items-start text-sm text-slate-600">
                                                            <CheckCircle2 className="h-4 w-4 text-emerald-green mr-2 mt-0.5 shrink-0" />
                                                            <span>{ind}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="pt-4 pb-6 px-6">
                                        <Button asChild className="w-full bg-electric-blue hover:bg-electric-blue/90 text-white group">
                                            <Link to={sol.cta_link || "/contact"}>
                                                {sol.cta_label || "Explore Solution"}
                                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
