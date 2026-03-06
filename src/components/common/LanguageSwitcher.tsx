import { Globe, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LanguageSwitcherProps {
    variant?: 'default' | 'compact' | 'inline';
    className?: string;
}

export const LanguageSwitcher = ({ variant = 'default', className = '' }: LanguageSwitcherProps) => {
    const { i18n } = useTranslation();

    const handleLanguageChange = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const currentLanguage = i18n.language || 'en';

    const getButtonClasses = () => {
        switch (variant) {
            case 'compact':
                return 'h-8 px-2 text-xs';
            case 'inline':
                return 'h-auto p-1 text-sm bg-transparent hover:bg-white/10 text-white border-white/20';
            default:
                return '';
        }
    };

    const getIconSize = () => {
        switch (variant) {
            case 'compact':
                return 'h-3 w-3';
            case 'inline':
                return 'h-3 w-3';
            default:
                return 'h-4 w-4';
        }
    };

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Español' },
    ];

    const currentLangName = languages.find(l => l.code === (currentLanguage.startsWith('es') ? 'es' : 'en'))?.name || 'English';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={variant === 'inline' ? 'ghost' : 'outline'}
                    size={variant === 'compact' ? 'sm' : 'default'}
                    className={`${getButtonClasses()} ${className}`}
                >
                    <Globe className={`mr-1 md:mr-2 ${getIconSize()}`} />
                    <span className="font-medium mr-1 hidden sm:inline-block">{currentLangName}</span>
                    <span className="font-medium mr-1 inline-block sm:hidden">{currentLangName.substring(0, 2).toUpperCase()}</span>
                    <ChevronDown className={getIconSize()} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 z-[100]">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`flex items-center justify-between cursor-pointer ${currentLanguage.startsWith(lang.code) ? 'bg-soft-lilac/20 font-bold' : ''
                            }`}
                    >
                        <span>{lang.name}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
