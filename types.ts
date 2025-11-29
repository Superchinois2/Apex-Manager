export enum AccountTier {
  K25 = '25k',
  K50 = '50k',
  K100 = '100k',
  K150 = '150k',
  K250 = '250k',
  K300 = '300k',
  K100Static = '100k Static',
}

export enum AccountStatus {
  PA = 'PA',       // Validé (PA-APEX-)
  EVAL = 'EVAL',   // En cours (APEX-)
  DEMO = 'DEMO'    // Démo
}

export enum WithdrawalStatus {
  REQUESTED = 'Demandé',
  APPROVED = 'Approuvé',
  RECEIVED = 'Reçu',
  DENIED = 'Refusé'
}

export interface User {
  username: string;
  password: string; // Stored locally
}

export interface AccountConfig {
  id: AccountTier;
  name: string;
  startBalance: number;
  minReqBalance: number; // For PA: Withdrawal threshold
  profitGoal: number;    // For EVAL: Target to pass
  maxWithdrawal: number; // Max for first 5 months (PA)
  maxDrawdown: number;   // Trailing drawdown amount
}

export interface WithdrawalDetails {
  status: WithdrawalStatus;
  requestDate: string;
  accountAgeMonth: number; // 1, 2, 3, 4+
  balanceBefore: number;
  safetyThreshold: number; // Start + 100 usually
  remainingMargin: number; // Balance - Amount - Threshold
  processorFees: number;
  netAmountDollar: number;
  exchangeRate: number;
  netAmountEuro: number;
  taxProvision: number; // 30% default
}

export interface DailyLog {
  id: string;
  date: string;
  profit: number; // Can be negative
  balanceAfter: number;
  notes?: string;
  isWithdrawal?: boolean; // If true, this log represents a payout event
  withdrawalAmount?: number;
  wins?: number; // Number of winning trades
  losses?: number; // Number of losing trades
  withdrawalDetails?: WithdrawalDetails; // Extended financial data
}

export interface Account {
  id: string;
  name: string; // User defined name e.g. "PA-001"
  tier: AccountTier;
  status: AccountStatus; // Type of account
  logs: DailyLog[];
  withdrawalCount: number;
  createdAt: number;
}

export interface AppState {
  accounts: Account[];
  selectedAccountId: string | null;
}

export interface EligibilityResult {
  isEligible: boolean; // For PA: Can withdraw? For EVAL: Is Passed?
  canWithdrawAmount: number;
  reasons: string[];
  metrics: {
    tradingDays: number;
    profitableDays: number;
    maxDailyProfit: number;
    totalProfitCurrentSegment: number;
    consistencyPercentage: number;
    highWaterMark: number;     // Highest balance reached
    trailingDrawdownLimit: number; // The liquidation price
    distanceToLiquidation: number;
    profitGoalProgress: number; // % to goal (Eval)
  };
}