import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Transaction, Budget, SavingsGoal, Investment, Asset, Liability, IncomeSource, FinanceState } from '@/types';

// ---- DB row → domain type mappers ----

function mapTransaction(r: {
  id: string; type: string; merchant: string; category: string;
  date: string; payment_method: string; amount: number; notes: string | null;
}): Transaction {
  return {
    id: r.id,
    type: r.type as Transaction['type'],
    merchant: r.merchant,
    category: r.category,
    date: r.date,
    paymentMethod: r.payment_method,
    amount: Number(r.amount),
    notes: r.notes ?? undefined,
  };
}

function mapBudget(r: { id: string; category: string; limit_amount: number; period: string }): Budget {
  return { id: r.id, category: r.category, limit: Number(r.limit_amount), period: r.period as Budget['period'] };
}

function mapSavingsGoal(r: {
  id: string; name: string; target_amount: number; current_amount: number;
  deadline: string | null; color: string;
}): SavingsGoal {
  return {
    id: r.id, name: r.name, target: Number(r.target_amount),
    current: Number(r.current_amount), deadline: r.deadline ?? '',
    color: r.color,
  };
}

function mapInvestment(r: {
  id: string; name: string; type: string; invested_amount: number;
  current_value: number; purchase_date: string; notes: string | null;
}): Investment {
  return {
    id: r.id, name: r.name, type: r.type as Investment['type'],
    invested: Number(r.invested_amount), currentValue: Number(r.current_value),
    date: r.purchase_date, notes: r.notes ?? undefined,
  };
}

function mapAsset(r: { id: string; name: string; type: string; value: number }): Asset {
  return { id: r.id, name: r.name, type: r.type as Asset['type'], value: Number(r.value) };
}

function mapLiability(r: { id: string; name: string; type: string; value: number }): Liability {
  return { id: r.id, name: r.name, type: r.type as Liability['type'], value: Number(r.value) };
}

function mapIncomeSource(r: { id: string; name: string; amount: number; frequency: string }): IncomeSource {
  return { id: r.id, name: r.name, amount: Number(r.amount), frequency: r.frequency as IncomeSource['frequency'] };
}

// ---- Context interface ----

export interface FinanceContextValue {
  session: Session | null;
  user: User | null;
  displayName: string;
  loading: boolean;
  dataLoading: boolean;
  isAuthed: boolean;
  state: FinanceState;
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  investments: Investment[];
  assets: Asset[];
  liabilities: Liability[];
  incomeSources: IncomeSource[];
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string) => Promise<{ error: string | null }>;
  addTransaction: (t: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, t: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addBudget: (b: Omit<Budget, 'id'>) => Promise<void>;
  updateBudget: (id: string, b: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  addSavingsGoal: (g: Omit<SavingsGoal, 'id'>) => Promise<void>;
  updateSavingsGoal: (id: string, g: Partial<SavingsGoal>) => Promise<void>;
  deleteSavingsGoal: (id: string) => Promise<void>;
  addInvestment: (i: Omit<Investment, 'id'>) => Promise<void>;
  updateInvestment: (id: string, i: Partial<Investment>) => Promise<void>;
  deleteInvestment: (id: string) => Promise<void>;
  addAsset: (a: Omit<Asset, 'id'>) => Promise<void>;
  updateAsset: (id: string, a: Partial<Asset>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  addLiability: (l: Omit<Liability, 'id'>) => Promise<void>;
  updateLiability: (id: string, l: Partial<Liability>) => Promise<void>;
  deleteLiability: (id: string) => Promise<void>;
  addIncomeSource: (s: Omit<IncomeSource, 'id'>) => Promise<void>;
  updateIncomeSource: (id: string, s: Partial<IncomeSource>) => Promise<void>;
  deleteIncomeSource: (id: string) => Promise<void>;
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);

  const loadProfile = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', uid)
      .maybeSingle();
    setDisplayName(data?.display_name || '');
  }, []);

  const loadAllData = useCallback(async (uid: string) => {
    setDataLoading(true);
    try {
      const [txRes, budRes, goalRes, invRes, assetRes, liabRes, incomeRes] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', uid).order('date', { ascending: false }),
        supabase.from('budgets').select('*').eq('user_id', uid).order('created_at', { ascending: true }),
        supabase.from('savings_goals').select('*').eq('user_id', uid).order('created_at', { ascending: true }),
        supabase.from('investments').select('*').eq('user_id', uid).order('created_at', { ascending: true }),
        supabase.from('assets').select('*').eq('user_id', uid).order('created_at', { ascending: true }),
        supabase.from('liabilities').select('*').eq('user_id', uid).order('created_at', { ascending: true }),
        supabase.from('income_sources').select('*').eq('user_id', uid).order('created_at', { ascending: true }),
      ]);

      setTransactions((txRes.data ?? []).map(mapTransaction));
      setBudgets((budRes.data ?? []).map(mapBudget));
      setSavingsGoals((goalRes.data ?? []).map(mapSavingsGoal));
      setInvestments((invRes.data ?? []).map(mapInvestment));
      setAssets((assetRes.data ?? []).map(mapAsset));
      setLiabilities((liabRes.data ?? []).map(mapLiability));
      setIncomeSources((incomeRes.data ?? []).map(mapIncomeSource));
    } finally {
      setDataLoading(false);
    }
  }, []);

  // Auth state listener + initial session
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!mounted) return;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        loadProfile(s.user.id);
        loadAllData(s.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      (async () => {
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          await loadProfile(s.user.id);
          await loadAllData(s.user.id);
        } else {
          setDisplayName('');
          setTransactions([]);
          setBudgets([]);
          setSavingsGoals([]);
          setInvestments([]);
          setAssets([]);
          setLiabilities([]);
          setIncomeSources([]);
        }
      })();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile, loadAllData]);

  // ---- Auth methods ----

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } },
    });
    return { error: error?.message ?? null };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const updateProfile = useCallback(async (name: string) => {
    if (!user) return { error: 'Not authenticated' };
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: name })
      .eq('id', user.id);
    if (!error) setDisplayName(name);
    return { error: error?.message ?? null };
  }, [user]);

  // ---- Transaction CRUD ----

  const addTransaction = useCallback(async (t: Omit<Transaction, 'id'>) => {
    const { data, error } = await supabase.from('transactions').insert({
      type: t.type, merchant: t.merchant, category: t.category,
      date: t.date, payment_method: t.paymentMethod,
      amount: t.amount, notes: t.notes ?? null,
    }).select('*').single();
    if (error) throw error;
    if (data) setTransactions(prev => [mapTransaction(data), ...prev]);
  }, []);

  const updateTransaction = useCallback(async (id: string, t: Partial<Transaction>) => {
    const update: Record<string, unknown> = {};
    if (t.type !== undefined) update.type = t.type;
    if (t.merchant !== undefined) update.merchant = t.merchant;
    if (t.category !== undefined) update.category = t.category;
    if (t.date !== undefined) update.date = t.date;
    if (t.paymentMethod !== undefined) update.payment_method = t.paymentMethod;
    if (t.amount !== undefined) update.amount = t.amount;
    if (t.notes !== undefined) update.notes = t.notes ?? null;

    const { data, error } = await supabase.from('transactions').update(update).eq('id', id).select('*').single();
    if (error) throw error;
    if (data) setTransactions(prev => prev.map(x => x.id === id ? mapTransaction(data) : x));
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) throw error;
    setTransactions(prev => prev.filter(x => x.id !== id));
  }, []);

  // ---- Budget CRUD ----

  const addBudget = useCallback(async (b: Omit<Budget, 'id'>) => {
    const { data, error } = await supabase.from('budgets').insert({
      category: b.category, limit_amount: b.limit, period: b.period,
    }).select('*').single();
    if (error) throw error;
    if (data) setBudgets(prev => [...prev, mapBudget(data)]);
  }, []);

  const updateBudget = useCallback(async (id: string, b: Partial<Budget>) => {
    const update: Record<string, unknown> = {};
    if (b.category !== undefined) update.category = b.category;
    if (b.limit !== undefined) update.limit_amount = b.limit;
    if (b.period !== undefined) update.period = b.period;

    const { data, error } = await supabase.from('budgets').update(update).eq('id', id).select('*').single();
    if (error) throw error;
    if (data) setBudgets(prev => prev.map(x => x.id === id ? mapBudget(data) : x));
  }, []);

  const deleteBudget = useCallback(async (id: string) => {
    const { error } = await supabase.from('budgets').delete().eq('id', id);
    if (error) throw error;
    setBudgets(prev => prev.filter(x => x.id !== id));
  }, []);

  // ---- Savings Goal CRUD ----

  const addSavingsGoal = useCallback(async (g: Omit<SavingsGoal, 'id'>) => {
    const { data, error } = await supabase.from('savings_goals').insert({
      name: g.name, target_amount: g.target, current_amount: g.current,
      deadline: g.deadline || null, color: g.color,
    }).select('*').single();
    if (error) throw error;
    if (data) setSavingsGoals(prev => [...prev, mapSavingsGoal(data)]);
  }, []);

  const updateSavingsGoal = useCallback(async (id: string, g: Partial<SavingsGoal>) => {
    const update: Record<string, unknown> = {};
    if (g.name !== undefined) update.name = g.name;
    if (g.target !== undefined) update.target_amount = g.target;
    if (g.current !== undefined) update.current_amount = g.current;
    if (g.deadline !== undefined) update.deadline = g.deadline || null;
    if (g.color !== undefined) update.color = g.color;

    const { data, error } = await supabase.from('savings_goals').update(update).eq('id', id).select('*').single();
    if (error) throw error;
    if (data) setSavingsGoals(prev => prev.map(x => x.id === id ? mapSavingsGoal(data) : x));
  }, []);

  const deleteSavingsGoal = useCallback(async (id: string) => {
    const { error } = await supabase.from('savings_goals').delete().eq('id', id);
    if (error) throw error;
    setSavingsGoals(prev => prev.filter(x => x.id !== id));
  }, []);

  // ---- Investment CRUD ----

  const addInvestment = useCallback(async (i: Omit<Investment, 'id'>) => {
    const { data, error } = await supabase.from('investments').insert({
      name: i.name, type: i.type, invested_amount: i.invested,
      current_value: i.currentValue, purchase_date: i.date, notes: i.notes ?? null,
    }).select('*').single();
    if (error) throw error;
    if (data) setInvestments(prev => [...prev, mapInvestment(data)]);
  }, []);

  const updateInvestment = useCallback(async (id: string, i: Partial<Investment>) => {
    const update: Record<string, unknown> = {};
    if (i.name !== undefined) update.name = i.name;
    if (i.type !== undefined) update.type = i.type;
    if (i.invested !== undefined) update.invested_amount = i.invested;
    if (i.currentValue !== undefined) update.current_value = i.currentValue;
    if (i.date !== undefined) update.purchase_date = i.date;
    if (i.notes !== undefined) update.notes = i.notes ?? null;

    const { data, error } = await supabase.from('investments').update(update).eq('id', id).select('*').single();
    if (error) throw error;
    if (data) setInvestments(prev => prev.map(x => x.id === id ? mapInvestment(data) : x));
  }, []);

  const deleteInvestment = useCallback(async (id: string) => {
    const { error } = await supabase.from('investments').delete().eq('id', id);
    if (error) throw error;
    setInvestments(prev => prev.filter(x => x.id !== id));
  }, []);

  // ---- Asset CRUD ----

  const addAsset = useCallback(async (a: Omit<Asset, 'id'>) => {
    const { data, error } = await supabase.from('assets').insert({
      name: a.name, type: a.type, value: a.value,
    }).select('*').single();
    if (error) throw error;
    if (data) setAssets(prev => [...prev, mapAsset(data)]);
  }, []);

  const updateAsset = useCallback(async (id: string, a: Partial<Asset>) => {
    const update: Record<string, unknown> = {};
    if (a.name !== undefined) update.name = a.name;
    if (a.type !== undefined) update.type = a.type;
    if (a.value !== undefined) update.value = a.value;

    const { data, error } = await supabase.from('assets').update(update).eq('id', id).select('*').single();
    if (error) throw error;
    if (data) setAssets(prev => prev.map(x => x.id === id ? mapAsset(data) : x));
  }, []);

  const deleteAsset = useCallback(async (id: string) => {
    const { error } = await supabase.from('assets').delete().eq('id', id);
    if (error) throw error;
    setAssets(prev => prev.filter(x => x.id !== id));
  }, []);

  // ---- Liability CRUD ----

  const addLiability = useCallback(async (l: Omit<Liability, 'id'>) => {
    const { data, error } = await supabase.from('liabilities').insert({
      name: l.name, type: l.type, value: l.value,
    }).select('*').single();
    if (error) throw error;
    if (data) setLiabilities(prev => [...prev, mapLiability(data)]);
  }, []);

  const updateLiability = useCallback(async (id: string, l: Partial<Liability>) => {
    const update: Record<string, unknown> = {};
    if (l.name !== undefined) update.name = l.name;
    if (l.type !== undefined) update.type = l.type;
    if (l.value !== undefined) update.value = l.value;

    const { data, error } = await supabase.from('liabilities').update(update).eq('id', id).select('*').single();
    if (error) throw error;
    if (data) setLiabilities(prev => prev.map(x => x.id === id ? mapLiability(data) : x));
  }, []);

  const deleteLiability = useCallback(async (id: string) => {
    const { error } = await supabase.from('liabilities').delete().eq('id', id);
    if (error) throw error;
    setLiabilities(prev => prev.filter(x => x.id !== id));
  }, []);

  // ---- Income Source CRUD ----

  const addIncomeSource = useCallback(async (s: Omit<IncomeSource, 'id'>) => {
    const { data, error } = await supabase.from('income_sources').insert({
      name: s.name, amount: s.amount, frequency: s.frequency,
    }).select('*').single();
    if (error) throw error;
    if (data) setIncomeSources(prev => [...prev, mapIncomeSource(data)]);
  }, []);

  const updateIncomeSource = useCallback(async (id: string, s: Partial<IncomeSource>) => {
    const update: Record<string, unknown> = {};
    if (s.name !== undefined) update.name = s.name;
    if (s.amount !== undefined) update.amount = s.amount;
    if (s.frequency !== undefined) update.frequency = s.frequency;

    const { data, error } = await supabase.from('income_sources').update(update).eq('id', id).select('*').single();
    if (error) throw error;
    if (data) setIncomeSources(prev => prev.map(x => x.id === id ? mapIncomeSource(data) : x));
  }, []);

  const deleteIncomeSource = useCallback(async (id: string) => {
    const { error } = await supabase.from('income_sources').delete().eq('id', id);
    if (error) throw error;
    setIncomeSources(prev => prev.filter(x => x.id !== id));
  }, []);

  const state: FinanceState = {
    user: { username: user?.email ?? '', pin: '', name: displayName || (user?.email?.split('@')[0] ?? '') },
    transactions, budgets, savingsGoals, investments, assets, liabilities, incomeSources,
  };

  const value: FinanceContextValue = {
    session, user, displayName, loading, dataLoading, isAuthed: !!session, state,
    transactions, budgets, savingsGoals, investments, assets, liabilities, incomeSources,
    signUp, signIn, signOut, logout: signOut, updateProfile,
    addTransaction, updateTransaction, deleteTransaction,
    addBudget, updateBudget, deleteBudget,
    addSavingsGoal, updateSavingsGoal, deleteSavingsGoal,
    addInvestment, updateInvestment, deleteInvestment,
    addAsset, updateAsset, deleteAsset,
    addLiability, updateLiability, deleteLiability,
    addIncomeSource, updateIncomeSource, deleteIncomeSource,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
}
