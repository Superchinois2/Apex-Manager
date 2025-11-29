import { AccountConfig, AccountTier } from './types';

export const ACCOUNT_CONFIGS: Record<AccountTier, AccountConfig> = {
  [AccountTier.K25]: {
    id: AccountTier.K25,
    name: '25k Account',
    startBalance: 25000,
    minReqBalance: 26600,
    profitGoal: 1500, // Target: 26500
    maxWithdrawal: 1500,
    maxDrawdown: 1500,
  },
  [AccountTier.K50]: {
    id: AccountTier.K50,
    name: '50k Account',
    startBalance: 50000,
    minReqBalance: 52600,
    profitGoal: 3000, // Target: 53000
    maxWithdrawal: 2000,
    maxDrawdown: 2500,
  },
  [AccountTier.K100]: {
    id: AccountTier.K100,
    name: '100k Account',
    startBalance: 100000,
    minReqBalance: 103100,
    profitGoal: 6000, // Target: 106000
    maxWithdrawal: 2500,
    maxDrawdown: 3000,
  },
  [AccountTier.K150]: {
    id: AccountTier.K150,
    name: '150k Account',
    startBalance: 150000,
    minReqBalance: 155100,
    profitGoal: 9000,
    maxWithdrawal: 2750,
    maxDrawdown: 5000,
  },
  [AccountTier.K250]: {
    id: AccountTier.K250,
    name: '250k Account',
    startBalance: 250000,
    minReqBalance: 256600,
    profitGoal: 15000,
    maxWithdrawal: 3000,
    maxDrawdown: 6500,
  },
  [AccountTier.K300]: {
    id: AccountTier.K300,
    name: '300k Account',
    startBalance: 300000,
    minReqBalance: 307600,
    profitGoal: 20000,
    maxWithdrawal: 3500,
    maxDrawdown: 7500,
  },
  [AccountTier.K100Static]: {
    id: AccountTier.K100Static,
    name: '100k Static',
    startBalance: 100000,
    minReqBalance: 102600,
    profitGoal: 2000, // Estimé pour static
    maxWithdrawal: 1000,
    maxDrawdown: 625, // Static Drawdown
  },
};