import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Rate relative to EUR (EUR = 1.0)
}

export const currencies: Currency[] = [
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 1.0 },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.1 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.85 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.45 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.65 },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', rate: 0.95 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 160 },
];

interface CurrencyContextType {
  selectedCurrency: Currency;
  currencies: Currency[];
  changeCurrency: (currencyCode: string) => void;
  formatPrice: (amount: number, showCode?: boolean) => string;
  convertPrice: (eurAmount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]); // Default to EUR

  useEffect(() => {
    const saved = localStorage.getItem('selectedCurrency');
    if (saved) {
      const currency = currencies.find(c => c.code === saved);
      if (currency) {
        setSelectedCurrency(currency);
      }
    }
  }, []);

  const changeCurrency = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    if (currency) {
      setSelectedCurrency(currency);
      localStorage.setItem('selectedCurrency', currencyCode);
    }
  };

  const formatPrice = (amount: number, showCode: boolean = false) => {
    const convertedAmount = amount * selectedCurrency.rate;
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: selectedCurrency.code === 'JPY' ? 0 : 2,
      maximumFractionDigits: selectedCurrency.code === 'JPY' ? 0 : 2,
    }).format(convertedAmount);
    
    const symbol = selectedCurrency.symbol;
    const code = showCode ? ` ${selectedCurrency.code}` : '';
    
    return `${symbol}${formatted}${code}`;
  };

  const convertPrice = (eurAmount: number) => {
    return eurAmount * selectedCurrency.rate;
  };

  const value: CurrencyContextType = {
    selectedCurrency,
    currencies,
    changeCurrency,
    formatPrice,
    convertPrice,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};