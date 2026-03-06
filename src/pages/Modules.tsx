import { useEffect, useState } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Modules() {
    const [modules, setModules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModules = async () => {
            const { data, error } = await supabase
                .from('modules')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });

            if (data) {
                setModules(data);
            }
            setLoading(false);
        };

        fetchModules();
    }, []);

    const fallbackModules = [
        {
            id: 'fallback-m1',
            name: 'Sales Automation',
            short_description: 'Intelligent lead generation and automated pipeline management.',
            long_description: 'Our Sales Automation module integrates with your CRM to automatically categorize, score, and route leads based on predictive behavior analytics.',
            monthly_addon_price: 299,
            features: ['Automated Lead Scoring', 'Pipeline Routing', 'Behavioral Triggers'],
        },
        {
            id: 'fallback-m2',
            name: 'Agentic Support',
            short_description: 'Deploy 24/7 AI agents that seamlessly integrate into your knowledge bases.',
            long_description: 'Train your custom agent on your helpdesk articles and internal wikis. Resolves up to 70% of tier-1 support tickets autonomously with human-like accuracy.',
            monthly_addon_price: 499,
            features: ['RAG Knowledge Integration', 'Multi-channel Deployment', 'Human Handoff Protocol'],
        },
        {
            id: 'fallback-m3',
            name: 'Vision CRM Sync',
            short_description: 'Bi-directional data synchronization across all your business tools.',
            long_description: 'Maintain a single source of truth. Vision CRM Sync ensures your sales, support, and marketing platforms share unified, real-time customer states.',
            monthly_addon_price: 199,
            features: ['Real-time Bi-directional Sync', 'Conflict Resolution', 'Custom Field Mapping'],
        }
    ];

    const displayModules = modules.length > 0 ? modules : fallbackModules;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-midnight-navy mb-6">
                            Platform Modules
                        </h1>
                        <p className="text-lg text-cool-gray">
                            Composable AI infrastructure. Select individual modules to enhance your existing stack or combine them for a complete Vision-Sync automation engine.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-emerald-green" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayModules.map((mod) => (
                                <Card key={mod.id} className="flex flex-col h-full border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-green/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-emerald-green/10 rounded-xl text-emerald-green">
                                                <Zap className="h-6 w-6" />
                                            </div>
                                            {mod.monthly_addon_price !== null && (
                                                <div className="text-right">
                                                    <span className="text-2xl font-bold text-midnight-navy">${mod.monthly_addon_price}</span>
                                                    <span className="text-sm text-cool-gray">/mo</span>
                                                </div>
                                            )}
                                        </div>
                                        <CardTitle className="text-xl text-midnight-navy">{mod.name}</CardTitle>
                                        <CardDescription className="text-sm mt-2">
                                            {mod.short_description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        {mod.long_description && (
                                            <p className="text-sm text-slate-600 mb-6">{mod.long_description}</p>
                                        )}
                                        {Array.isArray(mod.features) && mod.features.length > 0 && (
                                            <ul className="space-y-2 mt-4">
                                                {mod.features.map((feat: string, idx: number) => (
                                                    <li key={idx} className="flex items-start text-sm text-slate-700">
                                                        <CheckCircle2 className="h-4 w-4 text-emerald-green mr-2 mt-0.5 shrink-0" />
                                                        <span>{feat}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </CardContent>
                                    <CardFooter className="pt-4 pb-6 px-6">
                                        <Button asChild variant="outline" className="w-full border-emerald-green text-emerald-green hover:bg-emerald-green hover:text-white transition-colors">
                                            <Link to="/contact">
                                                Request Integration
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
