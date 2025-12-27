
export type AssetStatus = 'Holding' | 'Watching';
export type UserRole = 'member' | 'guest';

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  avatar?: string;
}

export interface Asset {
  id: string;
  userId: string;
  ticker: string;
  name: string;
  status: AssetStatus;
  price: number;
  change: number;
  quantity: number;
  averageCost: number;
  unrealizedPnL: number;
  entryDate?: string; // Date of first entry
  lastReview?: string;
  type: 'Crypto' | 'US Stock' | 'HK Stock' | 'ETF';
  logo?: string;
  alert?: string;
}

export interface TradeLog {
  id: string;
  userId: string;
  ticker: string;
  title: string;
  timestamp: string;
  pnl: number;
  pnlPercent: number;
  status: 'WIN' | 'LOSS' | 'FLAT';
  assessment: string;
  operation: string;
  result: string;
  tags: string[];
}

export interface AssessmentState {
  step: number;
  cashMindset?: 'Buy' | 'NoBuy';
  concentration?: 'Low' | 'Med' | 'High';
  marketState?: 'Breakout' | 'Retest' | 'MA Breakdown' | 'Other';
  emotionDriver?: 'None' | 'Slight' | 'Obvious';
  riskAcceptance?: 'Low' | 'Med' | 'High';
}
