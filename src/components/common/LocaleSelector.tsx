import { Globe, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useCurrency, type Currency } from '@/contexts/CurrencyContext';

interface LocaleSelectorProps {
    variant?: 'compact' | 'default';
    className?: string;
}

const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export const LocaleSelector = ({ variant = 'default', className = '' }: LocaleSelectorProps) => {
    const { i18n } = useTranslation();
    const { selectedCurrency, currencies, changeCurrency } = useCurrency();

    const currentLang = languages.find(l =>
        l.code === (i18n.language?.startsWith('es') ? 'es' : 'en')
    ) ?? languages[0];

    const isCompact = variant === 'compact';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size={isCompact ? 'sm' : 'default'}
                    className={`${isCompact ? 'h-8 px-2.5 text-xs gap-1' : 'gap-1.5'} ${className}`}
                >
                    <Globe className={isCompact ? 'h-3 w-3' : 'h-4 w-4'} />
                    <span className="font-medium hidden sm:inline">
                        {currentLang.name}
                    </span>
                    <span className="font-medium inline sm:hidden">
                        {currentLang.code.toUpperCase()}
                    </span>
                    <span className="text-cool-gray hidden sm:inline">·</span>
                    <span className="font-medium hidden sm:inline">
                        {selectedCurrency.symbol} {selectedCurrency.code}
                    </span>
                    <ChevronDown className={isCompact ? 'h-3 w-3' : 'h-4 w-4'} />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52 z-[100]">
                <DropdownMenuLabel className="text-xs text-cool-gray font-semibold uppercase tracking-wider">
                    Language
                </DropdownMenuLabel>
                {languages.map((lang) => {
                    const isActive = i18n.language?.startsWith(lang.code);
                    return (
                        <DropdownMenuItem
                            key={lang.code}
                            onClick={() => i18n.changeLanguage(lang.code)}
                            className="flex items-center justify-between cursor-pointer"
                        >
                            <span className="flex items-center gap-2">
                                <span>{lang.flag}</span>
                                <span>{lang.name}</span>
                            </span>
                            {isActive && <Check className="h-3.5 w-3.5 text-royal-purple" />}
                        </DropdownMenuItem>
                    );
                })}

                <DropdownMenuSeparator />

                <DropdownMenuLabel className="text-xs text-cool-gray font-semibold uppercase tracking-wider">
                    Currency
                </DropdownMenuLabel>
                {currencies.map((currency: Currency) => {
                    const isActive = selectedCurrency.code === currency.code;
                    return (
                        <DropdownMenuItem
                            key={currency.code}
                            onClick={() => changeCurrency(currency.code)}
                            className="flex items-center justify-between cursor-pointer"
                        >
                            <span className="flex items-center gap-2">
                                <span className="font-medium w-6 text-center">{currency.symbol}</span>
                                <span>{currency.name}</span>
                            </span>
                            <span className={`text-xs ${isActive ? 'text-royal-purple font-bold' : 'text-cool-gray'}`}>
                                {currency.code}
                            </span>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
