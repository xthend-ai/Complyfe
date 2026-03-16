export interface FundManager {
  id: string;
  name: string;
  fundName: string;
  fundCode: string;
  years: number;
  annualizedReturn: number;
  maxDrawdown: number;
  philosophy: string;
  stockSelectionLogic: string;
  holdings: string[];
  tradingMethod: '场内' | '场外' | '场内/场外';
  isTop3?: boolean;
}
