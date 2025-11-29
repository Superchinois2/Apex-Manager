import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
  Area
} from 'recharts';
import { ACCOUNT_CONFIGS } from './constants';
import { AccountTier, DailyLog, EligibilityResult, Account, AccountStatus, User, WithdrawalStatus, WithdrawalDetails } from './types';

// --- Constants ---
const DEFAULT_EXCHANGE_RATE = 0.96;
const TAX_RATE = 0.30; // 30% Provision

// --- Icons ---
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 5v14M5 12h14"/></svg>
);
const DollarSignIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);
const AlertTriangleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
);
const LayersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
);
const UserPlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
);
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const TrendingUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);
const LogOutIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);
const PieChartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
);

// --- Custom Charts Components ---
const CustomBarLabel = (props: any) => {
  const { x, y, width, height, value } = props;
  const yPosition = value >= 0 ? y - 10 : y + height + 15;

  return (
    <text 
      x={x + width / 2} 
      y={yPosition} 
      fill={value >= 0 ? "#4ade80" : "#f87171"} 
      textAnchor="middle" 
      fontSize="10"
      fontWeight="bold"
    >
      {value} $
    </text>
  );
};

// --- AUTH COMPONENT ---
const AuthScreen: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const storedUsersStr = localStorage.getItem('apex_users');
    const users: User[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];

    if (isRegistering) {
        if (users.find(u => u.username === username)) {
            setError("Ce nom d'utilisateur existe déjà.");
            return;
        }
        const newUser: User = { username, password };
        localStorage.setItem('apex_users', JSON.stringify([...users, newUser]));
        onLogin(newUser);
    } else {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            onLogin(user);
        } else {
            setError("Identifiants incorrects.");
        }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl">
            <div className="flex justify-center mb-6">
                 <div className="bg-blue-600/20 p-4 rounded-full">
                    <LayersIcon className="w-10 h-10 text-blue-500" />
                 </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-white mb-2">
                {isRegistering ? 'Créer un compte' : 'Connexion Apex Manager'}
            </h2>
            <p className="text-center text-slate-400 text-sm mb-8">
                Gérez vos comptes de trading et suivez vos performances.
            </p>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded mb-4 text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Nom d'utilisateur</label>
                    <input 
                        type="text" 
                        required 
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        autoComplete="off"
                        name="username_no_autofill"
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Mot de passe</label>
                    <input 
                        type="password" 
                        required 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="new-password"
                        name="password_no_autofill"
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors mt-2"
                >
                    {isRegistering ? "S'inscrire" : 'Se connecter'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button 
                    onClick={() => { 
                        setIsRegistering(!isRegistering); 
                        setError(''); 
                        setUsername('');
                        setPassword('');
                    }}
                    className="text-sm text-slate-400 hover:text-white underline decoration-slate-600 underline-offset-4"
                >
                    {isRegistering ? 'Déjà un compte ? Se connecter' : "Pas encore de compte ? S'inscrire"}
                </button>
            </div>
        </div>
    </div>
  );
};

// --- MAIN APP ---

const App: React.FC = () => {
  // --- Auth State ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // --- App Data State ---
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  // UI State
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  
  // Create Account Form
  const [newAccountNameSuffix, setNewAccountNameSuffix] = useState('');
  const [newAccountStatus, setNewAccountStatus] = useState<AccountStatus>(AccountStatus.EVAL);
  const [newAccountTier, setNewAccountTier] = useState<AccountTier>(AccountTier.K50);
  
  const [historyView, setHistoryView] = useState<'daily' | 'monthly' | 'withdrawals'>('daily');

  // Forms for Active Account
  const [newProfit, setNewProfit] = useState<string>('');
  const [newWins, setNewWins] = useState<string>('');
  const [newLosses, setNewLosses] = useState<string>('');
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Withdrawal Form State
  const [withdrawalDate, setWithdrawalDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [withdrawalRequestAmount, setWithdrawalRequestAmount] = useState<string>('');
  const [withdrawalFees, setWithdrawalFees] = useState<string>('0');
  const [currentExchangeRate, setCurrentExchangeRate] = useState<string>(DEFAULT_EXCHANGE_RATE.toString());
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- Load User Data ---
  useEffect(() => {
    const sessionUser = sessionStorage.getItem('apex_current_user');
    if (sessionUser) {
        setCurrentUser(JSON.parse(sessionUser));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
        const userKey = `apex_data_${currentUser.username}`;
        const savedData = localStorage.getItem(userKey);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setAccounts(parsed.accounts || []);
            setSelectedAccountId(parsed.selectedAccountId || null);
        } else {
            setAccounts([]);
            setSelectedAccountId(null);
        }
    }
  }, [currentUser]);

  // --- Save User Data ---
  useEffect(() => {
    if (currentUser) {
        const userKey = `apex_data_${currentUser.username}`;
        localStorage.setItem(userKey, JSON.stringify({
            accounts,
            selectedAccountId
        }));
    }
  }, [accounts, selectedAccountId, currentUser]);

  const handleLogout = () => {
      sessionStorage.removeItem('apex_current_user');
      setCurrentUser(null);
      setAccounts([]);
  };

  const handleLoginSuccess = (user: User) => {
      sessionStorage.setItem('apex_current_user', JSON.stringify(user));
      setCurrentUser(user);
  };

  // --- Helper Functions ---
  const getAccountAgeMonth = (createdAt: number) => {
      const start = new Date(createdAt);
      const now = new Date();
      let months = (now.getFullYear() - start.getFullYear()) * 12;
      months -= start.getMonth();
      months += now.getMonth();
      return Math.max(1, months + 1); // Month 1 is the first month
  };

  // --- Logic Helpers ---

  const calculateAccountEligibility = (account: Account): EligibilityResult => {
    const config = ACCOUNT_CONFIGS[account.tier];
    const logs = account.logs;
    const currentBalance = logs.length > 0 ? logs[logs.length - 1].balanceAfter : config.startBalance;

    const reasons: string[] = [];
    let isEligible = true;

    // --- SHARED METRICS ---
    let lastWithdrawalIndex = -1;
    for (let i = logs.length - 1; i >= 0; i--) {
        if (logs[i].isWithdrawal) {
            lastWithdrawalIndex = i;
            break;
        }
    }
    const currentSegmentLogs = lastWithdrawalIndex === -1 ? logs : logs.slice(lastWithdrawalIndex + 1);
    
    // High Water Mark
    const allBalances = logs.map(l => l.balanceAfter);
    const highWaterMark = Math.max(config.startBalance, ...allBalances);

    // --- LOGIC SPLIT BASED ON STATUS ---

    if (account.status === AccountStatus.PA) {
        // === PA RULES ===
        
        // 1. Trading Days
        const tradingDays = currentSegmentLogs.length;
        if (tradingDays < 5) {
            reasons.push(`Minimum 5 jours de trading (Actuel: ${tradingDays})`);
            isEligible = false;
        }

        // 2. Profitable Days
        const profitableDays = currentSegmentLogs.filter(l => l.profit >= 50).length;
        if (profitableDays < 5) {
            reasons.push(`Minimum 5 jours de profit > 50 $ (Actuel: ${profitableDays})`);
            isEligible = false;
        }

        // 3. Min Balance
        if (currentBalance < config.minReqBalance) {
            reasons.push(`Solde minimum: ${config.minReqBalance.toLocaleString()} $ (Actuel: ${currentBalance.toLocaleString()} $)`);
            isEligible = false;
        }

        // 4. Consistency Rule
        let consistencyPercentage = 0;
        let maxDailyProfit = 0;
        let totalProfitCurrentSegment = 0;
        const segmentStartBalance = lastWithdrawalIndex === -1 
            ? config.startBalance 
            : logs[lastWithdrawalIndex].balanceAfter;

        totalProfitCurrentSegment = currentBalance - segmentStartBalance;
        maxDailyProfit = Math.max(0, ...currentSegmentLogs.map(l => l.profit));
        const requiredTotalProfit = maxDailyProfit / 0.3;
        
        if (totalProfitCurrentSegment > 0) {
            consistencyPercentage = (maxDailyProfit / totalProfitCurrentSegment) * 100;
        }

        if (account.withdrawalCount < 6 && totalProfitCurrentSegment < requiredTotalProfit) {
            reasons.push(`Règle 30% violée: Max jour (${maxDailyProfit} $) = ${consistencyPercentage.toFixed(1)}% des profits.`);
            isEligible = false;
        }

        // 5. Withdrawal Amount
        let calculatedMax = 0;
        if (currentBalance >= config.minReqBalance) {
            calculatedMax = 500 + (currentBalance - config.minReqBalance);
        }
        if (account.withdrawalCount < 5 && calculatedMax > config.maxWithdrawal) {
            calculatedMax = config.maxWithdrawal;
        }
        if (calculatedMax < 500) {
            if(isEligible) {
                reasons.push("Montant dispo < Minimum 500 $");
                isEligible = false;
            }
            calculatedMax = 0;
        }

        return {
            isEligible,
            canWithdrawAmount: Math.floor(calculatedMax),
            reasons,
            metrics: {
                tradingDays,
                profitableDays,
                maxDailyProfit,
                totalProfitCurrentSegment,
                consistencyPercentage,
                highWaterMark,
                trailingDrawdownLimit: config.startBalance + 100, // PA stops trailing at +100
                distanceToLiquidation: currentBalance - (config.startBalance + 100),
                profitGoalProgress: 100
            }
        };

    } else {
        // === EVAL / DEMO RULES (Rithmic Style) ===
        
        // 1. Calculate Dynamic Trailing Drawdown
        let trailingThreshold = 0;
        
        if (account.tier === AccountTier.K100Static) {
            trailingThreshold = config.startBalance - config.maxDrawdown; // Fixed
        } else {
            const rawThreshold = highWaterMark - config.maxDrawdown;
            const cap = config.startBalance + config.profitGoal;
            trailingThreshold = Math.min(rawThreshold, cap);
        }

        const distanceToLiquidation = currentBalance - trailingThreshold;
        if (distanceToLiquidation < 0) {
             reasons.push("Compte liquidé (Sous le Trailing Drawdown)");
             isEligible = false; // FAILED
        }

        // 2. Profit Goal
        const targetBalance = config.startBalance + config.profitGoal;
        const profitGoalProgress = Math.min(100, ((currentBalance - config.startBalance) / config.profitGoal) * 100);

        if (currentBalance < targetBalance) {
            reasons.push(`Objectif de profit non atteint (${targetBalance.toLocaleString()} $)`);
            isEligible = false;
        }

        // 3. Trading Days (7 days for Eval)
        const tradingDays = logs.length;
        if (tradingDays < 7) {
            reasons.push(`Minimum 7 jours de trading (Actuel: ${tradingDays})`);
            isEligible = false;
        }

        return {
            isEligible: isEligible && distanceToLiquidation >= 0, // Passed if goal met + days met + not blown
            canWithdrawAmount: 0, // No withdrawals in Eval
            reasons,
            metrics: {
                tradingDays,
                profitableDays: logs.filter(l => l.profit > 0).length,
                maxDailyProfit: 0,
                totalProfitCurrentSegment: currentBalance - config.startBalance,
                consistencyPercentage: 0,
                highWaterMark,
                trailingDrawdownLimit: trailingThreshold,
                distanceToLiquidation,
                profitGoalProgress
            }
        };
    }
  };

  const activeAccount = useMemo(() => {
      return accounts.find(a => a.id === selectedAccountId) || null;
  }, [accounts, selectedAccountId]);

  const activeEligibility = useMemo(() => {
      if (!activeAccount) return null;
      return calculateAccountEligibility(activeAccount);
  }, [activeAccount]);

  const activeConfig = activeAccount ? ACCOUNT_CONFIGS[activeAccount.tier] : null;

  const currentBalance = useMemo(() => {
    if (!activeAccount || !activeConfig) return 0;
    if (activeAccount.logs.length === 0) return activeConfig.startBalance;
    return activeAccount.logs[activeAccount.logs.length - 1].balanceAfter;
  }, [activeAccount, activeConfig]);

  // Global Stats
  const globalFinancialStats = useMemo(() => {
      let totalWithdrawable = 0;
      let totalEligibleAccounts = 0;
      let ytdPayouts = 0;
      let monthlyPayouts = 0;
      let totalLifetimeProfits = 0;
      let uncappedAccountsCount = 0;

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      accounts.filter(a => a.status === AccountStatus.PA).forEach(acc => {
          // Eligibility for Sidebar
          const res = calculateAccountEligibility(acc);
          if (res.isEligible) {
              totalWithdrawable += res.canWithdrawAmount;
              totalEligibleAccounts++;
          }
          
          // Uncapped Check
          if (getAccountAgeMonth(acc.createdAt) >= 4) {
              uncappedAccountsCount++;
          }

          // Financials
          acc.logs.forEach(log => {
              if (log.isWithdrawal) {
                   ytdPayouts += (log.withdrawalAmount || 0);
                   const [y, m, d] = log.date.split('-').map(Number);
                   if (y === currentYear && (m - 1) === currentMonth) {
                       monthlyPayouts += (log.withdrawalAmount || 0);
                   }
              } else {
                  if (log.profit > 0) totalLifetimeProfits += log.profit;
              }
          });
      });

      const conversionRate = totalLifetimeProfits > 0 ? (ytdPayouts / totalLifetimeProfits) * 100 : 0;

      return { 
          totalWithdrawable, 
          totalEligibleAccounts,
          ytdPayouts,
          monthlyPayouts,
          conversionRate,
          uncappedAccountsCount
      };
  }, [accounts]);

  const globalMonthlyStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let totalProfit = 0;
    let totalWins = 0;
    let totalLosses = 0;

    accounts.forEach(acc => {
      acc.logs.forEach(log => {
        if (log.isWithdrawal) return;
        const [y, m, d] = log.date.split('-').map(Number);
        if (y === currentYear && (m - 1) === currentMonth) {
          totalProfit += log.profit;
          totalWins += (log.wins || 0);
          totalLosses += (log.losses || 0);
        }
      });
    });

    return { totalProfit, totalWins, totalLosses };
  }, [accounts]);

  const performanceSummary = useMemo(() => {
    if (!activeAccount) return null;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayOfWeek = today.getDay();
    const distToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - distToMonday);
    
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let weekProfit = 0, weekWins = 0, weekLosses = 0;
    let monthProfit = 0, monthWins = 0, monthLosses = 0;
    let monthTradingDays = 0;

    activeAccount.logs.forEach(log => {
        if (log.isWithdrawal) return;
        
        const [y, m, d] = log.date.split('-').map(Number);
        const logDateObj = new Date(y, m - 1, d);

        if (logDateObj >= monday) {
            weekProfit += log.profit;
            weekWins += (log.wins || 0);
            weekLosses += (log.losses || 0);
        }

        if (m - 1 === currentMonth && y === currentYear) {
            monthProfit += log.profit;
            monthWins += (log.wins || 0);
            monthLosses += (log.losses || 0);
            monthTradingDays += 1;
        }
    });

    return {
        week: { profit: weekProfit, wins: weekWins, losses: weekLosses },
        month: { profit: monthProfit, wins: monthWins, losses: monthLosses, tradingDays: monthTradingDays }
    };
  }, [activeAccount]);

  const monthlyStats = useMemo(() => {
      if (!activeAccount) return [];
      const stats: Record<string, { date: string, profit: number, wins: number, losses: number }> = {};
      
      activeAccount.logs.forEach(log => {
          if (log.isWithdrawal) return; 
          const monthKey = log.date.substring(0, 7);
          
          if (!stats[monthKey]) {
              stats[monthKey] = { date: monthKey, profit: 0, wins: 0, losses: 0 };
          }
          stats[monthKey].profit += log.profit;
          stats[monthKey].wins += (log.wins || 0);
          stats[monthKey].losses += (log.losses || 0);
      });

      return Object.values(stats).sort((a, b) => b.date.localeCompare(a.date));
  }, [activeAccount]);

  const withdrawalsList = useMemo(() => {
      if (!activeAccount) return [];
      return activeAccount.logs.filter(l => l.isWithdrawal && l.withdrawalDetails).reverse();
  }, [activeAccount]);

  // --- Handlers ---

  const handleCreateAccount = (e: React.FormEvent) => {
      e.preventDefault();
      
      let prefix = '';
      if (newAccountStatus === AccountStatus.PA) prefix = 'PA-APEX-';
      else if (newAccountStatus === AccountStatus.EVAL) prefix = 'APEX-';
      else if (newAccountStatus === AccountStatus.DEMO) prefix = 'DEMO-';

      const finalName = `${prefix}${newAccountNameSuffix.trim() || Date.now().toString().slice(-4)}`;

      const newAcc: Account = {
          id: Date.now().toString(),
          name: finalName,
          tier: newAccountTier,
          status: newAccountStatus,
          logs: [],
          withdrawalCount: 0,
          createdAt: Date.now()
      };
      setAccounts([...accounts, newAcc]);
      setSelectedAccountId(newAcc.id);
      setShowAddAccountModal(false);
      setNewAccountNameSuffix('');
  };

  const handleDeleteAccount = () => {
      if (!selectedAccountId) return;
      const newAccounts = accounts.filter(a => a.id !== selectedAccountId);
      setAccounts(newAccounts);
      setSelectedAccountId(newAccounts.length > 0 ? newAccounts[0].id : null);
      setShowDeleteAccountModal(false);
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAccount) return;
    
    const profit = parseFloat(newProfit);
    if (isNaN(profit)) return;

    const wins = newWins ? parseInt(newWins) : undefined;
    const losses = newLosses ? parseInt(newLosses) : undefined;

    const balanceAfter = currentBalance + profit;

    const newLog: DailyLog = {
      id: Date.now().toString(),
      date: newDate,
      profit: profit,
      balanceAfter: balanceAfter,
      isWithdrawal: false,
      wins: wins,
      losses: losses
    };

    const updatedAccount = {
        ...activeAccount,
        logs: [...activeAccount.logs, newLog]
    };

    setAccounts(accounts.map(a => a.id === activeAccount.id ? updatedAccount : a));
    setNewProfit('');
    setNewWins('');
    setNewLosses('');
  };

  const handleDeleteLog = (logId: string) => {
      if (!activeAccount || !activeConfig) return;
      const filteredLogs = activeAccount.logs.filter(l => l.id !== logId);
      let runningBal = activeConfig.startBalance;
      const remappedLogs = filteredLogs.map(l => {
          let bal = runningBal;
          if (l.isWithdrawal) {
             bal -= (l.withdrawalAmount || 0);
          } else {
             bal += l.profit;
          }
          runningBal = bal;
          return { ...l, balanceAfter: bal };
      });
      const updatedAccount = { ...activeAccount, logs: remappedLogs };
      setAccounts(accounts.map(a => a.id === activeAccount.id ? updatedAccount : a));
  };

  const handleWithdrawal = () => {
    if (!activeAccount || !activeEligibility || !activeConfig) return;
    const amount = parseFloat(withdrawalRequestAmount);
    const fees = parseFloat(withdrawalFees);
    const rate = parseFloat(currentExchangeRate);

    // Note: We allow entering amount > available if manual, but warn usually.
    // For now we keep strict check but it's based on current state.
    if (isNaN(amount) || amount < 500) {
        alert("Montant invalide ou inférieur au minimum de 500 $.");
        return;
    }

    const netDollar = amount - fees;
    const netEuro = netDollar * rate;
    const tax = netEuro * TAX_RATE;
    const safetyThreshold = activeConfig.startBalance + 100;
    const margin = (currentBalance - amount) - safetyThreshold;

    const details: WithdrawalDetails = {
        status: WithdrawalStatus.REQUESTED,
        requestDate: withdrawalDate,
        accountAgeMonth: getAccountAgeMonth(activeAccount.createdAt),
        balanceBefore: currentBalance,
        safetyThreshold: safetyThreshold,
        remainingMargin: margin,
        processorFees: fees,
        netAmountDollar: netDollar,
        exchangeRate: rate,
        netAmountEuro: netEuro,
        taxProvision: tax
    };

    const newLog: DailyLog = {
        id: Date.now().toString(),
        date: withdrawalDate,
        profit: 0,
        balanceAfter: currentBalance - amount,
        isWithdrawal: true,
        withdrawalAmount: amount,
        notes: `Retrait #${activeAccount.withdrawalCount + 1}`,
        withdrawalDetails: details
    };

    const updatedAccount = {
        ...activeAccount,
        logs: [...activeAccount.logs, newLog],
        withdrawalCount: activeAccount.withdrawalCount + 1
    };
    setAccounts(accounts.map(a => a.id === activeAccount.id ? updatedAccount : a));
    setWithdrawalRequestAmount('');
    setWithdrawalFees('0');
    setWithdrawalDate(new Date().toISOString().split('T')[0]); // Reset date
    setShowWithdrawalModal(false);
  };

  const getProgressColor = (current: number, target: number) => {
    return current >= target ? 'bg-green-500' : 'bg-blue-500';
  };

  if (!currentUser) {
      return <AuthScreen onLogin={handleLoginSuccess} />;
  }

  // Filter accounts for Sidebar
  const paAccounts = accounts.filter(a => a.status === AccountStatus.PA);
  const evalAccounts = accounts.filter(a => a.status === AccountStatus.EVAL);
  const demoAccounts = accounts.filter(a => a.status === AccountStatus.DEMO);

  const renderAccountList = (list: Account[], title: string, colorClass: string) => {
      if (list.length === 0) return null;
      return (
          <div className="mb-4">
              <p className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${colorClass}`}>{title}</p>
              {list.map(acc => {
                const elig = calculateAccountEligibility(acc);
                const isActive = selectedAccountId === acc.id;
                
                let statusDot = null;
                if (acc.status === AccountStatus.PA && elig.isEligible) {
                    statusDot = <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>;
                } else if (acc.status === AccountStatus.EVAL) {
                    if (elig.metrics.distanceToLiquidation < 0) {
                        statusDot = <div className="h-2 w-2 rounded-full bg-red-500"></div>; // Blown
                    } else if (elig.isEligible) { // Passed
                         statusDot = <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>;
                    }
                }

                // Eval Synthesis for Sidebar
                let evalSummary = null;
                if (acc.status === AccountStatus.EVAL) {
                    const currentBal = acc.logs.length > 0 ? acc.logs[acc.logs.length-1].balanceAfter : ACCOUNT_CONFIGS[acc.tier].startBalance;
                    const goal = ACCOUNT_CONFIGS[acc.tier].startBalance + ACCOUNT_CONFIGS[acc.tier].profitGoal;
                    const distToGoal = goal - currentBal;
                    const distToLiq = elig.metrics.distanceToLiquidation;

                    if (distToLiq < 0) {
                        evalSummary = <span className="text-[10px] text-red-500 font-bold block">Cramé ({distToLiq.toLocaleString()} $)</span>
                    } else if (distToGoal <= 0) {
                        evalSummary = <span className="text-[10px] text-green-500 font-bold block">Objectif Atteint !</span>
                    } else {
                        evalSummary = (
                            <div className="flex justify-between text-[10px] text-slate-500 w-full pr-1 mt-0.5">
                                <span className="text-blue-400">Obj: {distToGoal.toLocaleString()} $</span>
                                <span className="text-orange-400">Survie: {distToLiq.toLocaleString()} $</span>
                            </div>
                        );
                    }
                }

                return (
                    <button
                        key={acc.id}
                        onClick={() => {
                            setSelectedAccountId(acc.id);
                            setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 my-0.5 rounded-lg flex items-center justify-between group transition-colors ${isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                    >
                        <div className="w-full">
                            <div className="flex justify-between items-center w-full">
                                <div className="font-medium truncate max-w-[140px] text-sm">{acc.name}</div>
                                {statusDot}
                            </div>
                            <div className="text-[10px] opacity-70 flex justify-between">
                                <span>{acc.tier}</span>
                            </div>
                            {evalSummary}
                        </div>
                    </button>
                );
            })}
          </div>
      );
  };

  return (
    <div className="flex h-screen bg-slate-900 font-sans text-slate-200 overflow-hidden">
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <LayersIcon className="text-blue-500" /> Apex Manager
            </h1>
            <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-slate-400">
                <XIcon />
            </button>
        </div>
        
        {/* User Info */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                    {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm font-medium text-white truncate max-w-[100px]">
                    {currentUser.username}
                </div>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-white p-1" title="Déconnexion">
                <LogOutIcon />
            </button>
        </div>

        {/* Global Financial KPIs */}
        <div className="p-4 bg-slate-900/30 border-b border-slate-800 space-y-3">
             <div className="flex items-center gap-2">
                 <PieChartIcon className="text-orange-400 w-4 h-4"/>
                 <p className="text-xs text-slate-400 uppercase font-bold">KPIs Financiers</p>
             </div>
             
             <div className="grid grid-cols-2 gap-2">
                 <div className="bg-slate-800/50 p-2 rounded">
                     <p className="text-[10px] text-slate-500">Payouts (Mois)</p>
                     <p className="text-sm font-bold text-green-400">{globalFinancialStats.monthlyPayouts.toLocaleString()} $</p>
                 </div>
                 <div className="bg-slate-800/50 p-2 rounded">
                     <p className="text-[10px] text-slate-500">Payouts (YTD)</p>
                     <p className="text-sm font-bold text-blue-400">{globalFinancialStats.ytdPayouts.toLocaleString()} $</p>
                 </div>
             </div>

             <div className="flex justify-between text-[10px] text-slate-500">
                 <span>Conversion Gains/Retraits:</span>
                 <span className="text-white font-bold">{globalFinancialStats.conversionRate.toFixed(1)}%</span>
             </div>
             <div className="flex justify-between text-[10px] text-slate-500">
                 <span>Comptes "Uncapped" (4+):</span>
                 <span className="text-white font-bold">{globalFinancialStats.uncappedAccountsCount}</span>
             </div>
        </div>

        {/* Stats Retirable */}
        <div className="p-4 bg-slate-900/50 border-b border-slate-800">
            <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Total Retirable (PA)</p>
            <div className="text-2xl font-bold text-green-400">
                {globalFinancialStats.totalWithdrawable.toLocaleString()} $
            </div>
            <p className="text-xs text-slate-500 font-medium">
                ≈ {(globalFinancialStats.totalWithdrawable * DEFAULT_EXCHANGE_RATE).toLocaleString(undefined, {maximumFractionDigits: 0})} €
            </p>
        </div>

        <div className="p-4 bg-slate-900/30 border-b border-slate-800">
            <div className="flex items-center gap-2 mb-1">
                <TrendingUpIcon className="text-slate-400 w-3 h-3" />
                <p className="text-xs text-slate-400 uppercase font-semibold">Gains Mois en cours</p>
            </div>
            <div className={`text-xl font-bold ${globalMonthlyStats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {globalMonthlyStats.totalProfit.toLocaleString()} $
            </div>
            <p className="text-xs text-slate-500 font-medium mb-1">
                ≈ {(globalMonthlyStats.totalProfit * DEFAULT_EXCHANGE_RATE).toLocaleString(undefined, {maximumFractionDigits: 0})} €
            </p>
            <div className="text-xs text-slate-500 flex items-center gap-2 bg-slate-900 p-1 rounded inline-block">
                <span className="text-green-500 font-bold">{globalMonthlyStats.totalWins}W</span> 
                <span className="text-slate-600">/</span>
                <span className="text-red-500 font-bold">{globalMonthlyStats.totalLosses}L</span>
            </div>
        </div>

        {/* Account Lists Groups */}
        <div className="flex-1 overflow-y-auto p-2">
            {accounts.length === 0 && <p className="text-center text-slate-600 text-xs mt-4">Aucun compte</p>}
            
            {renderAccountList(paAccounts, "Comptes Validés (PA)", "text-green-500")}
            {renderAccountList(evalAccounts, "En Évaluation", "text-blue-500")}
            {renderAccountList(demoAccounts, "Comptes Démo", "text-slate-500")}
            
            <button 
                onClick={() => setShowAddAccountModal(true)}
                className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-3 rounded-lg border border-dashed border-slate-700 text-slate-500 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all"
            >
                <UserPlusIcon /> Nouveau Compte
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-900">
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
             <button onClick={() => setMobileMenuOpen(true)} className="text-white">
                 <LayersIcon />
             </button>
             <span className="font-bold text-white">{activeAccount?.name || 'Tableau de bord'}</span>
             <div className="w-5"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {!activeAccount ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 text-center max-w-md shadow-xl">
                        <UserPlusIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <h2 className="text-2xl font-bold text-white mb-2">Bienvenue, {currentUser.username}</h2>
                        <p className="mb-6 text-sm">Créez votre premier compte pour commencer à suivre vos performances.</p>
                        <button 
                            onClick={() => setShowAddAccountModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full"
                        >
                            Créer un compte
                        </button>
                    </div>
                </div>
            ) : activeConfig && activeEligibility && performanceSummary && (
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Header Details */}
                    <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-slate-800 pb-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-3xl font-bold text-white">{activeAccount.name}</h2>
                                {activeAccount.status === AccountStatus.PA && <span className="bg-green-900/40 text-green-400 text-xs px-2 py-1 rounded border border-green-800 font-bold">PA</span>}
                                {activeAccount.status === AccountStatus.EVAL && <span className="bg-blue-900/40 text-blue-400 text-xs px-2 py-1 rounded border border-blue-800 font-bold">EVAL</span>}
                                {activeAccount.status === AccountStatus.DEMO && <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded font-bold">DEMO</span>}
                                <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded border border-slate-700">{activeAccount.tier}</span>
                            </div>
                            <p className="text-slate-400 text-sm mt-1">
                                {activeAccount.status === AccountStatus.PA 
                                    ? `Mois de vie: ${getAccountAgeMonth(activeAccount.createdAt)} • Retraits: ${activeAccount.withdrawalCount}` 
                                    : `High Water Mark: ${activeEligibility.metrics.highWaterMark.toLocaleString()} $`}
                            </p>
                        </div>
                        <button 
                            onClick={() => setShowDeleteAccountModal(true)}
                            className="text-xs text-red-900 hover:text-red-500 bg-red-950/30 hover:bg-red-900/20 px-3 py-1.5 rounded transition-colors self-start md:self-auto"
                        >
                            Supprimer ce compte
                        </button>
                    </div>
                    
                    {/* --- LIQUIDATION ALERT (EVAL) --- */}
                    {activeAccount.status !== AccountStatus.PA && activeEligibility.metrics.distanceToLiquidation < 0 && (
                        <div className="bg-red-900/50 border border-red-500 text-red-100 p-4 rounded-xl flex items-center gap-4 animate-pulse">
                            <div className="p-2 bg-red-600 rounded-full"><AlertTriangleIcon /></div>
                            <div>
                                <h3 className="font-bold text-lg">Compte Cramé (Liquidation)</h3>
                                <p className="text-sm">Votre solde est passé sous le Trailing Drawdown.</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT: Stats & Charts */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                
                                {/* CARD 1: Solde */}
                                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
                                    <p className="text-slate-400 text-sm font-medium">Solde Actuel</p>
                                    <div className="text-3xl font-bold text-white mt-1">
                                        {currentBalance.toLocaleString()} $
                                    </div>
                                    <div className={`text-xs mt-2 ${currentBalance >= (activeAccount.status === AccountStatus.PA ? activeConfig.minReqBalance : (activeConfig.startBalance + activeConfig.profitGoal)) ? 'text-green-400' : 'text-orange-400'}`}>
                                        {activeAccount.status === AccountStatus.PA 
                                            ? `Obj Retrait: ${activeConfig.minReqBalance.toLocaleString()} $`
                                            : `Obj Valid: ${(activeConfig.startBalance + activeConfig.profitGoal).toLocaleString()} $`
                                        }
                                    </div>
                                </div>
                                
                                {/* CARD 2: Jours */}
                                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
                                    <p className="text-slate-400 text-sm font-medium">Jours de Trading</p>
                                    <div className="text-3xl font-bold text-white mt-1">
                                        {performanceSummary.month.tradingDays} <span className="text-lg text-slate-500">/ Mois</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-400 mt-2 mb-1">
                                        <span>Cycle / Min</span>
                                        <span>{activeEligibility.metrics.tradingDays} / {activeAccount.status === AccountStatus.PA ? '5' : '7'}</span>
                                    </div>
                                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                        <div className={`h-full ${getProgressColor(activeEligibility.metrics.tradingDays, activeAccount.status === AccountStatus.PA ? 5 : 7)}`} style={{width: `${Math.min(100, (activeEligibility.metrics.tradingDays/(activeAccount.status === AccountStatus.PA ? 5 : 7))*100)}%`}}></div>
                                    </div>
                                </div>

                                {/* CARD 3: Dynamic (Retrait OR Drawdown) */}
                                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden">
                                    {activeAccount.status === AccountStatus.PA ? (
                                        <>
                                            <div className="absolute top-0 right-0 p-2 opacity-10"><DollarSignIcon /></div>
                                            <p className="text-slate-400 text-sm font-medium">Retrait Dispo</p>
                                            <div className={`text-3xl font-bold mt-1 ${activeEligibility.isEligible ? 'text-green-400' : 'text-slate-500'}`}>
                                                {activeEligibility.canWithdrawAmount.toLocaleString()} $
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">
                                                ≈ {(activeEligibility.canWithdrawAmount * DEFAULT_EXCHANGE_RATE).toLocaleString(undefined, {maximumFractionDigits: 0})} €
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="absolute top-0 right-0 p-2 opacity-10"><AlertTriangleIcon /></div>
                                            <p className="text-slate-400 text-sm font-medium">Distance Drawdown</p>
                                            <div className={`text-3xl font-bold mt-1 ${activeEligibility.metrics.distanceToLiquidation < 500 ? 'text-red-500' : 'text-blue-400'}`}>
                                                {activeEligibility.metrics.distanceToLiquidation.toLocaleString()} $
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Seuil: {activeEligibility.metrics.trailingDrawdownLimit.toLocaleString()} $
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Rules & Status Block */}
                            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    {activeAccount.status === AccountStatus.PA ? <AlertTriangleIcon /> : <TrendingUpIcon />} 
                                    {activeAccount.status === AccountStatus.PA ? 'Cohérence et Règles' : 'Progression Évaluation'}
                                </h3>
                                
                                <div className="space-y-4">
                                    {activeAccount.status === AccountStatus.PA ? (
                                        // --- PA RULES ---
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-300">Concentration Profit (Max 30%)</span>
                                                <span className={activeEligibility.metrics.consistencyPercentage > 30 ? "text-red-400 font-bold" : "text-green-400 font-bold"}>
                                                    {activeEligibility.metrics.consistencyPercentage.toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden relative">
                                                <div className="absolute top-0 bottom-0 left-[30%] w-0.5 bg-slate-500 z-10 opacity-50"></div>
                                                <div 
                                                    className={`h-full transition-all duration-500 ${activeEligibility.metrics.consistencyPercentage > 30 ? 'bg-red-500' : 'bg-green-500'}`} 
                                                    style={{width: `${Math.min(100, activeEligibility.metrics.consistencyPercentage)}%`}}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-2 flex justify-between">
                                                <span>Meilleure journée: <span className="text-white">{activeEligibility.metrics.maxDailyProfit.toFixed(2)} $</span></span>
                                                <span>Profit Cycle: <span className="text-white">{activeEligibility.metrics.totalProfitCurrentSegment.toFixed(2)} $</span></span>
                                            </p>
                                        </div>
                                    ) : (
                                        // --- EVAL RULES ---
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-300">Objectif Profit ({activeConfig.profitGoal} $)</span>
                                                <span className="text-white font-bold">{activeEligibility.metrics.profitGoalProgress.toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-blue-500 transition-all duration-500" 
                                                    style={{width: `${activeEligibility.metrics.profitGoalProgress}%`}}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-slate-900/50 rounded-lg p-4 mt-4">
                                        <h4 className="text-sm font-medium text-slate-300 mb-2">Statut</h4>
                                        {activeEligibility.reasons.length === 0 ? (
                                            <div className="flex items-center text-green-400 gap-2 mb-2">
                                                <CheckCircleIcon />
                                                <span className="font-medium">
                                                    {activeAccount.status === AccountStatus.PA 
                                                        ? "Compte éligible pour retrait !" 
                                                        : "Félicitations ! Objectifs atteints."}
                                                </span>
                                            </div>
                                        ) : (
                                            <ul className="space-y-2">
                                                {activeEligibility.reasons.map((r, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-red-400">
                                                        <span className="mt-1 block min-w-[6px] w-[6px] h-[6px] rounded-full bg-red-500"></span>
                                                        {r}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {activeAccount.status === AccountStatus.PA && activeEligibility.isEligible && (
                                            <button 
                                                onClick={() => setShowWithdrawalModal(true)}
                                                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-medium transition-colors flex justify-center items-center gap-2"
                                            >
                                                <DollarSignIcon /> Effectuer le retrait ({activeEligibility.canWithdrawAmount} $)
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                             {/* Charts */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 h-72 flex flex-col">
                                    <h3 className="text-sm font-semibold text-white mb-2">
                                        {activeAccount.status === AccountStatus.PA ? 'Solde vs Seuil Retrait' : 'Solde vs Drawdown'}
                                    </h3>
                                    <div className="flex-1">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={activeAccount.logs}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => val.substring(5)} />
                                                <YAxis stroke="#94a3b8" fontSize={10} domain={['auto', 'auto']} width={40} />
                                                <RechartsTooltip 
                                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', fontSize: '12px' }}
                                                    itemStyle={{ color: '#f1f5f9' }}
                                                />
                                                {activeAccount.status === AccountStatus.PA ? (
                                                     <ReferenceLine y={activeConfig.minReqBalance} stroke="orange" strokeDasharray="3 3" />
                                                ) : (
                                                     <ReferenceLine y={activeConfig.startBalance + activeConfig.profitGoal} stroke="green" strokeDasharray="3 3" label="Goal" />
                                                )}
                                                <Line type="monotone" dataKey="balanceAfter" stroke="#3b82f6" strokeWidth={2} dot={{r: 2}} activeDot={{r: 4}} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 h-72 flex flex-col">
                                    <h3 className="text-sm font-semibold text-white mb-2">Gains/Pertes Journaliers</h3>
                                    <div className="flex-1">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={activeAccount.logs.filter(l => !l.isWithdrawal)} margin={{ top: 20, bottom: 20 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => val.substring(5)} />
                                                <YAxis stroke="#94a3b8" fontSize={10} width={40} />
                                                <RechartsTooltip 
                                                    cursor={{fill: '#334155', opacity: 0.4}}
                                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', fontSize: '12px' }}
                                                />
                                                <ReferenceLine y={0} stroke="#475569" />
                                                <Bar dataKey="profit" label={<CustomBarLabel />}>
                                                    {activeAccount.logs.filter(l => !l.isWithdrawal).map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#4ade80' : '#f87171'} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Actions & Table */}
                        <div className="space-y-6">
                            
                            {/* Input */}
                            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 sticky top-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <PlusIcon /> Ajouter une journée
                                </h3>
                                <form onSubmit={handleAddLog} className="space-y-4">
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">Date</label>
                                        <input 
                                            type="date" 
                                            required
                                            value={newDate}
                                            onChange={(e) => setNewDate(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">Profit / Perte ($)</label>
                                        <input 
                                            type="number" 
                                            required
                                            step="0.01"
                                            value={newProfit}
                                            onChange={(e) => setNewProfit(e.target.value)}
                                            placeholder="Ex: 520.50"
                                            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1">Trades Gagnants</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2 text-green-500 text-xs font-bold">+</span>
                                                <input 
                                                    type="number"
                                                    min="0"
                                                    value={newWins}
                                                    onChange={(e) => setNewWins(e.target.value)}
                                                    placeholder="0"
                                                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 pl-6 py-2 text-white focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1">Trades Perdants</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2 text-red-500 text-xs font-bold">-</span>
                                                <input 
                                                    type="number"
                                                    min="0"
                                                    value={newLosses}
                                                    onChange={(e) => setNewLosses(e.target.value)}
                                                    placeholder="0"
                                                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 pl-6 py-2 text-white focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors">
                                        Ajouter au journal
                                    </button>
                                </form>
                                {activeAccount.status === AccountStatus.PA && (
                                    <>
                                        <div className="border-t border-slate-700 my-4"></div>
                                        <button 
                                            onClick={() => setShowWithdrawalModal(true)}
                                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded transition-colors flex items-center justify-center gap-2"
                                        >
                                            <DollarSignIcon className="w-4 h-4" /> Saisir un Retrait
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* History */}
                            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col max-h-[600px]">
                                <div className="p-4 border-b border-slate-700 bg-slate-800 sticky top-0 flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-white">Historique</h3>
                                    </div>
                                    <div className="flex bg-slate-900 rounded-lg p-1 self-start">
                                         <button 
                                            onClick={() => setHistoryView('daily')}
                                            className={`px-3 py-1 text-xs rounded-md transition-colors ${historyView === 'daily' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                                         >
                                            Journalier
                                         </button>
                                         <button 
                                            onClick={() => setHistoryView('monthly')}
                                            className={`px-3 py-1 text-xs rounded-md transition-colors ${historyView === 'monthly' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                                         >
                                            Mensuel
                                         </button>
                                         {activeAccount.status === AccountStatus.PA && (
                                            <button 
                                                onClick={() => setHistoryView('withdrawals')}
                                                className={`px-3 py-1 text-xs rounded-md transition-colors ${historyView === 'withdrawals' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                                            >
                                                Retraits
                                            </button>
                                         )}
                                    </div>
                                </div>
                                
                                {historyView !== 'withdrawals' && performanceSummary && (
                                    <div className="grid grid-cols-2 text-center border-b border-slate-700 divide-x divide-slate-700 bg-slate-800/50">
                                        <div className="p-3">
                                            <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Cette Semaine (5j)</p>
                                            <div className={`text-sm font-bold ${performanceSummary.week.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {performanceSummary.week.profit.toLocaleString()} $
                                            </div>
                                            <div className="text-[10px] text-slate-400 mt-1">
                                                <span className="text-green-500">{performanceSummary.week.wins}W</span> / <span className="text-red-500">{performanceSummary.week.losses}L</span>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Ce Mois</p>
                                            <div className={`text-sm font-bold ${performanceSummary.month.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {performanceSummary.month.profit.toLocaleString()} $
                                            </div>
                                            <div className="text-[10px] text-slate-400 mt-1">
                                                <span className="text-green-500">{performanceSummary.month.wins}W</span> / <span className="text-red-500">{performanceSummary.month.losses}L</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="overflow-y-auto flex-1">
                                    {activeAccount.logs.length === 0 ? (
                                        <div className="p-8 text-center text-slate-500 text-sm">Aucune donnée</div>
                                    ) : historyView === 'monthly' ? (
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 sticky top-0">
                                                <tr>
                                                    <th className="px-4 py-3">Mois</th>
                                                    <th className="px-4 py-3 text-right">P/L Total</th>
                                                    <th className="px-4 py-3 text-right">Trades (+/-)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {monthlyStats.map((stat) => (
                                                    <tr key={stat.date} className="border-b border-slate-700 hover:bg-slate-700/50">
                                                        <td className="px-4 py-3 font-medium text-slate-300 capitalize">
                                                            {new Date(stat.date + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <div className={`font-bold ${stat.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                                {stat.profit.toLocaleString()} $
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-slate-300">
                                                            <span className="text-green-400">{stat.wins}W</span>
                                                            <span className="mx-1 text-slate-500">/</span>
                                                            <span className="text-red-400">{stat.losses}L</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : historyView === 'withdrawals' ? (
                                        <table className="w-full text-xs text-left whitespace-nowrap">
                                             <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 sticky top-0">
                                                <tr>
                                                    <th className="px-2 py-3">Date</th>
                                                    <th className="px-2 py-3">Mois</th>
                                                    <th className="px-2 py-3 text-right">Brut ($)</th>
                                                    <th className="px-2 py-3 text-right">Marge</th>
                                                    <th className="px-2 py-3 text-right">Net (€)</th>
                                                    <th className="px-2 py-3 text-right">Prov. Impôt</th>
                                                    <th className="px-2 py-3">Statut</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {withdrawalsList.length === 0 && <tr><td colSpan={7} className="text-center p-4 text-slate-500">Aucun retrait</td></tr>}
                                                {withdrawalsList.map((log) => {
                                                    const d = log.withdrawalDetails;
                                                    if (!d) return null;
                                                    return (
                                                        <tr key={log.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                                            <td className="px-2 py-3 text-slate-300">{d.requestDate}</td>
                                                            <td className="px-2 py-3 text-slate-300 text-center">{d.accountAgeMonth}</td>
                                                            <td className="px-2 py-3 text-right font-bold text-white">{log.withdrawalAmount} $</td>
                                                            <td className={`px-2 py-3 text-right font-bold ${d.remainingMargin < 500 ? 'text-red-400' : 'text-green-400'}`}>
                                                                {d.remainingMargin.toLocaleString()} $
                                                            </td>
                                                            <td className="px-2 py-3 text-right font-bold text-blue-300">
                                                                {d.netAmountEuro.toFixed(0)} €
                                                            </td>
                                                            <td className="px-2 py-3 text-right text-slate-400">
                                                                {d.taxProvision.toFixed(0)} €
                                                            </td>
                                                            <td className="px-2 py-3">
                                                                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-700 text-white uppercase">{d.status}</span>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 sticky top-0">
                                                <tr>
                                                    <th className="px-4 py-3">Date</th>
                                                    <th className="px-4 py-3 text-right">P/L</th>
                                                    <th className="px-4 py-3 text-right">Solde</th>
                                                    <th className="px-2 py-3"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[...activeAccount.logs].reverse().map((log) => (
                                                    <tr key={log.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                                        <td className="px-4 py-3 font-medium text-slate-300">
                                                            {log.date}
                                                            {log.isWithdrawal && <span className="block text-[10px] text-orange-400">RETRAIT</span>}
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <div className={`font-bold ${log.isWithdrawal ? 'text-orange-400' : log.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                                {log.isWithdrawal ? `-${log.withdrawalAmount} $` : `${log.profit} $`}
                                                            </div>
                                                            {!log.isWithdrawal && (log.wins !== undefined || log.losses !== undefined) && (
                                                                <div className="text-[10px] opacity-80 mt-0.5">
                                                                    <span className="text-green-500 font-semibold">{log.wins || 0}+</span>
                                                                    <span className="text-slate-500 mx-1">/</span>
                                                                    <span className="text-red-500 font-semibold">{log.losses || 0}-</span>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-slate-300">
                                                            {log.balanceAfter.toLocaleString()} $
                                                        </td>
                                                        <td className="px-2 py-3 text-right">
                                                            <button onClick={() => handleDeleteLog(log.id)} className="text-slate-500 hover:text-red-400">
                                                                <TrashIcon />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </main>

      {/* --- Modals --- */}
      {showDeleteAccountModal && activeAccount && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-sm w-full shadow-2xl">
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center mb-4 text-red-500">
                        <AlertTriangleIcon />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Supprimer le compte ?</h3>
                    <p className="text-slate-400 text-sm mb-6">
                        Êtes-vous sûr de vouloir supprimer définitivement <strong>{activeAccount.name}</strong> ?
                    </p>
                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={() => setShowDeleteAccountModal(false)}
                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded transition-colors"
                        >
                            Annuler
                        </button>
                        <button 
                            onClick={handleDeleteAccount}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-medium transition-colors"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {showAddAccountModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-md w-full shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">Nouveau Compte Apex</h3>
                
                <form onSubmit={handleCreateAccount}>
                    <div className="mb-4">
                        <label className="block text-sm text-slate-400 mb-1">Type de Compte</label>
                        <div className="grid grid-cols-3 gap-2">
                             <button
                                type="button"
                                onClick={() => setNewAccountStatus(AccountStatus.PA)}
                                className={`py-2 px-1 text-xs font-bold rounded border ${newAccountStatus === AccountStatus.PA ? 'bg-green-600 border-green-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-green-500/50'}`}
                             >
                                Validé (PA)
                             </button>
                             <button
                                type="button"
                                onClick={() => setNewAccountStatus(AccountStatus.EVAL)}
                                className={`py-2 px-1 text-xs font-bold rounded border ${newAccountStatus === AccountStatus.EVAL ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-blue-500/50'}`}
                             >
                                Évaluation
                             </button>
                             <button
                                type="button"
                                onClick={() => setNewAccountStatus(AccountStatus.DEMO)}
                                className={`py-2 px-1 text-xs font-bold rounded border ${newAccountStatus === AccountStatus.DEMO ? 'bg-slate-500 border-slate-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-400/50'}`}
                             >
                                Démo
                             </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm text-slate-400 mb-1">Numéro / Identifiant</label>
                        <div className="flex items-center">
                            <span className="bg-slate-800 border border-r-0 border-slate-600 text-slate-400 px-3 py-2 rounded-l text-sm min-w-[80px] text-center">
                                {newAccountStatus === AccountStatus.PA ? 'PA-APEX-' : newAccountStatus === AccountStatus.EVAL ? 'APEX-' : 'DEMO-'}
                            </span>
                            <input 
                                type="text"
                                placeholder="001"
                                value={newAccountNameSuffix}
                                onChange={(e) => setNewAccountNameSuffix(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded-r px-3 py-2 text-white outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-sm text-slate-400 mb-1">Taille du Compte</label>
                        <select 
                            value={newAccountTier} 
                            onChange={(e) => setNewAccountTier(e.target.value as AccountTier)}
                            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {Object.values(ACCOUNT_CONFIGS).map(acc => (
                                <option key={acc.id} value={acc.id}>{acc.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            type="button"
                            onClick={() => setShowAddAccountModal(false)}
                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded transition-colors"
                        >
                            Annuler
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium transition-colors"
                        >
                            Créer
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {showWithdrawalModal && activeEligibility && activeConfig && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-2xl w-full shadow-2xl">
                <div className="flex justify-between items-start mb-6">
                    <div>
                         <h3 className="text-xl font-bold text-white">Demande de Retrait</h3>
                         <p className="text-slate-400 text-sm">Compte: {activeAccount?.name}</p>
                    </div>
                    <div className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded text-xs border border-blue-500/30">
                        Dispo Max: <strong>{activeEligibility.canWithdrawAmount} $</strong>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Colonne GAUCHE: Données Apex */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                        <h4 className="text-xs font-bold text-slate-300 uppercase mb-3 flex items-center gap-2">
                            <LayersIcon className="w-4 h-4" /> Données Apex
                        </h4>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1 uppercase">Date de la demande</label>
                                <input 
                                    type="date" 
                                    value={withdrawalDate}
                                    onChange={(e) => setWithdrawalDate(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1 uppercase">Montant Brut demandé ($)</label>
                                <input 
                                    type="number"
                                    min="500"
                                    max={activeEligibility.canWithdrawAmount}
                                    value={withdrawalRequestAmount}
                                    onChange={(e) => setWithdrawalRequestAmount(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-lg font-bold outline-none focus:border-green-500"
                                />
                            </div>

                            <div className="flex justify-between text-xs text-slate-400 border-t border-slate-700 pt-2">
                                <span>Solde avant retrait:</span>
                                <span className="text-white">{currentBalance.toLocaleString()} $</span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Seuil sécurité (Start+100):</span>
                                <span className="text-orange-300">{(activeConfig.startBalance + 100).toLocaleString()} $</span>
                            </div>
                            
                            <div className="bg-slate-800 p-2 rounded flex justify-between items-center mt-2">
                                <span className="text-xs text-slate-400">Marge Restante:</span>
                                <span className={`text-sm font-bold ${(currentBalance - (parseFloat(withdrawalRequestAmount) || 0) - (activeConfig.startBalance + 100)) < 500 ? 'text-red-400' : 'text-green-400'}`}>
                                    {((currentBalance - (parseFloat(withdrawalRequestAmount) || 0) - (activeConfig.startBalance + 100))).toLocaleString()} $
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Colonne DROITE: Réalité Bancaire */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                        <h4 className="text-xs font-bold text-slate-300 uppercase mb-3 flex items-center gap-2">
                            <DollarSignIcon className="w-4 h-4" /> Réalité Bancaire
                        </h4>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1 uppercase">Frais ($)</label>
                                <input 
                                    type="number"
                                    value={withdrawalFees}
                                    onChange={(e) => setWithdrawalFees(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1 uppercase">Taux Change</label>
                                <input 
                                    type="number"
                                    step="0.01"
                                    value={currentExchangeRate}
                                    onChange={(e) => setCurrentExchangeRate(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 border-t border-slate-700 pt-2">
                             <div className="flex justify-between text-xs">
                                <span className="text-slate-400">Net estimé ($):</span>
                                <span className="text-white font-medium">{Math.max(0, (parseFloat(withdrawalRequestAmount) || 0) - (parseFloat(withdrawalFees) || 0)).toLocaleString()} $</span>
                            </div>
                            <div className="flex justify-between text-sm bg-blue-900/20 p-2 rounded">
                                <span className="text-blue-300 font-bold">Net Poche (€):</span>
                                <span className="text-blue-100 font-bold text-lg">
                                    {Math.max(0, ((parseFloat(withdrawalRequestAmount) || 0) - (parseFloat(withdrawalFees) || 0)) * (parseFloat(currentExchangeRate) || 0)).toLocaleString(undefined, {maximumFractionDigits: 0})} €
                                </span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Prov. Impôt (30%):</span>
                                <span className="text-slate-300">
                                     {Math.max(0, (((parseFloat(withdrawalRequestAmount) || 0) - (parseFloat(withdrawalFees) || 0)) * (parseFloat(currentExchangeRate) || 0)) * TAX_RATE).toLocaleString(undefined, {maximumFractionDigits: 0})} €
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowWithdrawalModal(false)}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded transition-colors"
                    >
                        Annuler
                    </button>
                    <button 
                        onClick={handleWithdrawal}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded font-bold transition-colors"
                    >
                        Confirmer la demande
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default App;