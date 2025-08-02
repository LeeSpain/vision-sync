import { useCurrency } from '@/contexts/CurrencyContext';

export const useBudgetOptions = () => {
  const { formatPrice } = useCurrency();
  
  return {
    aiAgent: [
      `Under ${formatPrice(10000)}`,
      `${formatPrice(10000)} - ${formatPrice(25000)}`,
      `${formatPrice(25000)} - ${formatPrice(50000)}`,
      `${formatPrice(50000)} - ${formatPrice(100000)}`,
      `${formatPrice(100000)}+`
    ],
    general: [
      `Under ${formatPrice(10000)}`,
      `${formatPrice(10000)} - ${formatPrice(25000)}`,
      `${formatPrice(25000)} - ${formatPrice(50000)}`,
      `${formatPrice(50000)} - ${formatPrice(100000)}`,
      `${formatPrice(100000)}+`,
      'Let\'s discuss'
    ],
    investment: [
      `Under ${formatPrice(100000)}`,
      `${formatPrice(100000)} - ${formatPrice(500000)}`,
      `${formatPrice(500000)} - ${formatPrice(1000000)}`,
      `${formatPrice(1000000)} - ${formatPrice(5000000)}`,
      `Over ${formatPrice(5000000)}`
    ],
    forSale: [
      `Under ${formatPrice(50000)}`,
      `${formatPrice(50000)} - ${formatPrice(100000)}`,
      `${formatPrice(100000)} - ${formatPrice(200000)}`,
      `Over ${formatPrice(200000)}`
    ],
    customBuilds: [
      `Under ${formatPrice(25000)}`,
      `${formatPrice(25000)} - ${formatPrice(50000)}`,
      `${formatPrice(50000)} - ${formatPrice(100000)}`,
      `${formatPrice(100000)} - ${formatPrice(250000)}`,
      `Over ${formatPrice(250000)}`
    ]
  };
};