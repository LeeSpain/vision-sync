import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Layers, Zap, Shield, Database, Cpu, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Platform() {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div className="text-center max-w-4xl mx-auto mb-20 animate-fade-in">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-midnight-navy mb-6 leading-tight">
                            {t('platform.title')}
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
                            {t('platform.subtitle')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="bg-electric-blue hover:bg-electric-blue/90 text-white rounded-full px-8">
                                <Link to="/solutions">{t('platform.exploreSolutions')}</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="rounded-full px-8 text-midnight-navy border-slate-300 hover:bg-slate-100">
                                <Link to="/contact">{t('platform.requestDemo')} <ArrowRight className="h-4 w-4 ml-2" /></Link>
                            </Button>
                        </div>
                    </div>

                    {/* Architecture Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto mt-24">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-royal-purple/30 transition-colors">
                            <div className="h-12 w-12 bg-royal-purple/10 rounded-xl flex items-center justify-center mb-6">
                                <Cpu className="h-6 w-6 text-royal-purple" />
                            </div>
                            <h3 className="text-2xl font-bold text-midnight-navy mb-4">{t('platform.feature1Title')}</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {t('platform.feature1Desc')}
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-emerald-green/30 transition-colors">
                            <div className="h-12 w-12 bg-emerald-green/10 rounded-xl flex items-center justify-center mb-6">
                                <Database className="h-6 w-6 text-emerald-green" />
                            </div>
                            <h3 className="text-2xl font-bold text-midnight-navy mb-4">{t('platform.feature2Title')}</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {t('platform.feature2Desc')}
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-electric-blue/30 transition-colors">
                            <div className="h-12 w-12 bg-electric-blue/10 rounded-xl flex items-center justify-center mb-6">
                                <Zap className="h-6 w-6 text-electric-blue" />
                            </div>
                            <h3 className="text-2xl font-bold text-midnight-navy mb-4">{t('platform.feature3Title')}</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {t('platform.feature3Desc')}
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-coral-orange/30 transition-colors">
                            <div className="h-12 w-12 bg-coral-orange/10 rounded-xl flex items-center justify-center mb-6">
                                <Shield className="h-6 w-6 text-coral-orange" />
                            </div>
                            <h3 className="text-2xl font-bold text-midnight-navy mb-4">{t('platform.feature4Title')}</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {t('platform.feature4Desc')}
                            </p>
                        </div>
                    </div>

                    {/* Modular Add-ons Banner */}
                    <div className="mt-32 bg-gradient-to-br from-midnight-navy to-royal-purple rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Layers className="h-64 w-64" />
                        </div>
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('platform.growBannerTitle')}</h2>
                            <p className="text-lg text-slate-300 mb-8">
                                {t('platform.growBannerDesc')}
                            </p>
                            <Button asChild size="lg" className="bg-white text-midnight-navy hover:bg-slate-100">
                                <Link to="/modules">{t('platform.browseSkills')}</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
