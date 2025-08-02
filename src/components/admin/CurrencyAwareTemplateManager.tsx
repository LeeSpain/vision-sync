import React from 'react';
import { TemplateManager } from './TemplateManager';
import { CurrencyProvider } from '@/contexts/CurrencyContext';

export function CurrencyAwareTemplateManager() {
  return (
    <CurrencyProvider>
      <TemplateManager />
    </CurrencyProvider>
  );
}