import { useEffect, useState } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, Building2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Solutions() {
    const [solutions, setSolutions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchSolutions = async () => {
            const { data } = await supabase
                .from('solutions')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });

            if (data) setSolutions(data);
            setLoading(false);
        };

        fetchSolutions();
    }, []);

    const fallbackSolutions = [
        {
            id: 'fallback-1',
            name: t('solutions.fallback.hubName'),
            summary: t('solutions.fallback.hubSummary'),
            description: t('solutions.fallback.hubDesc'),
            industries: t('solutions.fallback.hubIndustries', { returnObjects: true }) as string[],
            cta_label: t('solutions.seeHowItWorks'),
            cta_link: '/contact',
            is_featured: true
        },
        {
            id: 'fallback-2',
            name: t('solutions.fallback.leadName'),
            summary: t('solutions.fallback.leadSummary'),
            description: t('solutions.fallback.leadDesc'),
            industries: t('solutions.fallback.leadIndustries', { returnObjects: true }) as string[],
            cta_label: t('solutions.seeHowItWorks'),
            cta_link: '/contact',
            is_featured: false
        },
        {
            id: 'fallback-3',
            name: t('solutions.fallback.teamName'),
            summary: t('solutions.fallback.teamSummary'),
            description: t('solutions.fallback.teamDesc'),
            industries: t('solutions.fallback.teamIndustries', { returnObjects: true }) as string[],
            cta_label: t('solutions.seeHowItWorks'),
            cta_link: '/contact',
            is_featured: false
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
                            {t('solutions.title')}
                        </h1>
                        <p className="text-lg text-cool-gray">
                            {t('solutions.subtitle')}
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-electric-blue" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displaySolutions.map((sol) => (
                                <Card key={sol.id} className={`flex flex-col h-full bg-white relative overflow-hidden transition-all duration-300 border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 ${sol.is_featured ? 'border-electric-blue/50 shadow-electric-blue/10' : ''}`}>
                                    {sol.is_featured && (
                                        <div className="absolute top-0 right-0 p-3">
                                            <Star className="h-5 w-5 text-electric-blue fill-electric-blue/20" />
                                        </div>
                                    )}
                                    <div className="h-2 w-full bg-gradient-to-r from-electric-blue to-sky-blue" />
                                    <CardHeader className="pt-8">
                                        <CardTitle className="text-xl text-midnight-navy">{sol.name}</CardTitle>
                                        <CardDescription className="text-sm mt-2 font-medium text-electric-blue">
                                            {sol.summary}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-sm text-slate-600 line-clamp-4">
                                            {sol.description || t('solutions.fallbackDesc')}
                                        </p>

                                        {Array.isArray(sol.industries) && sol.industries.length > 0 && (
                                            <div className="mt-6 flex flex-wrap gap-2">
                                                {sol.industries.map((ind: string, idx: number) => (
                                                    <span key={idx} className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                                                        {ind}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="pt-6 pb-8">
                                        <Button asChild variant="outline" className="w-full justify-between group hover:bg-electric-blue hover:text-white hover:border-electric-blue transition-colors">
                                            <Link to={sol.cta_link || "/contact"}>
                                                {sol.cta_label || t('solutions.seeHowItWorks')}
                                                <ArrowRight className="h-4 w-4 text-electric-blue group-hover:text-white transition-colors" />
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
