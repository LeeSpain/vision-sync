import { useEffect, useState } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Pricing() {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchPlans = async () => {
            const { data, error } = await supabase
                .from('plans')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });

            if (data) {
                setPlans(data);
            }
            setLoading(false);
        };

        fetchPlans();
    }, []);

    const fallbackPlans = [
        {
            id: 'fallback-p1',
            name: t('pricing.fallback.starterName'),
            description: t('pricing.fallback.starterDesc'),
            monthly_price: 999,
            custom_price_label: null,
            features: t('pricing.fallback.starterFeatures', { returnObjects: true }) as string[]
        },
        {
            id: 'fallback-p2',
            name: t('pricing.fallback.enterpriseName'),
            description: t('pricing.fallback.enterpriseDesc'),
            monthly_price: 2499,
            custom_price_label: null,
            features: t('pricing.fallback.enterpriseFeatures', { returnObjects: true }) as string[]
        },
        {
            id: 'fallback-p3',
            name: t('pricing.fallback.customName'),
            description: t('pricing.fallback.customDesc'),
            monthly_price: null,
            custom_price_label: t('pricing.fallback.talkToSales'),
            features: t('pricing.fallback.customFeatures', { returnObjects: true }) as string[]
        }
    ];

    const displayPlans = plans.length > 0 ? plans : fallbackPlans;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-midnight-navy mb-6">
                            {t('pricing.title')}
                        </h1>
                        <p className="text-lg text-cool-gray">
                            {t('pricing.subtitle')}
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-royal-purple" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {displayPlans.map((plan, index) => {
                                const isPopular = index === 1; // Highlight the middle plan nominally
                                return (
                                    <Card
                                        key={plan.id}
                                        className={`flex flex-col h-full bg-white relative overflow-hidden transition-all duration-300 ${isPopular
                                            ? 'border-royal-purple shadow-xl shadow-royal-purple/10 scale-105 z-10'
                                            : 'border-slate-200 shadow-sm hover:shadow-md'
                                            }`}
                                    >
                                        {isPopular && (
                                            <div className="absolute top-0 right-0 left-0 bg-royal-purple text-white text-xs font-bold uppercase tracking-wider py-1.5 text-center">
                                                {t('pricing.mostPopular')}
                                            </div>
                                        )}
                                        <CardHeader className={isPopular ? 'pt-10' : ''}>
                                            <CardTitle className="text-2xl text-midnight-navy">{plan.name}</CardTitle>
                                            <CardDescription className="text-sm mt-2 min-h-[40px]">
                                                {plan.description}
                                            </CardDescription>
                                            <div className="mt-6 mb-2">
                                                {plan.custom_price_label ? (
                                                    <span className="text-4xl font-bold text-midnight-navy">{plan.custom_price_label}</span>
                                                ) : (
                                                    <>
                                                        <span className="text-4xl font-bold text-midnight-navy">
                                                            {plan.monthly_price !== null ? `$${plan.monthly_price}` : t('pricing.free')}
                                                        </span>
                                                        {plan.monthly_price !== null && <span className="text-cool-gray ml-2">{t('pricing.month')}</span>}
                                                    </>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            {Array.isArray(plan.features) && plan.features.length > 0 && (
                                                <ul className="space-y-4 mt-4">
                                                    {plan.features.map((feat: string, idx: number) => (
                                                        <li key={idx} className="flex items-start text-sm text-slate-700">
                                                            <CheckCircle2 className={`h-5 w-5 mr-3 shrink-0 ${isPopular ? 'text-royal-purple' : 'text-emerald-green'}`} />
                                                            <span>{feat}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </CardContent>
                                        <CardFooter className="pt-6 pb-8 px-6">
                                            <Button
                                                asChild
                                                className={`w-full py-6 text-base ${isPopular
                                                    ? 'bg-royal-purple hover:bg-royal-purple/90 text-white shadow-md'
                                                    : 'bg-white hover:bg-slate-50 text-midnight-navy border-2 border-slate-200 hover:border-slate-300'
                                                    }`}
                                                variant={isPopular ? 'default' : 'outline'}
                                            >
                                                <Link to="/contact">
                                                    {t('pricing.getStarted')}
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
