import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrency, type Currency } from '@/hooks/useCurrency';

interface CurrencySelectorProps {
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
}

export const CurrencySelector = ({ variant = 'default', className = '' }: CurrencySelectorProps) => {
  const { selectedCurrency, currencies, changeCurrency } = useCurrency();

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant === 'inline' ? 'ghost' : 'outline'}
          size={variant === 'compact' ? 'sm' : 'default'}
          className={`${getButtonClasses()} ${className}`}
        >
          <span className="font-medium">
            {selectedCurrency.symbol} {selectedCurrency.code}
          </span>
          <ChevronDown className={`ml-1 ${getIconSize()}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {currencies.map((currency: Currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => changeCurrency(currency.code)}
            className={`flex items-center justify-between ${
              selectedCurrency.code === currency.code ? 'bg-soft-lilac/20' : ''
            }`}
          >
            <span className="flex items-center">
              <span className="font-medium mr-2">{currency.symbol}</span>
              <span>{currency.name}</span>
            </span>
            <span className="text-sm text-cool-gray">{currency.code}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};