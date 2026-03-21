import { create } from 'zustand';
import type { Account, Transaction, Category } from '../types/finance';

interface FinanceState {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  selectedAccountId: string | null;
  setAccounts: (accounts: Account[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setCategories: (categories: Category[]) => void;
  selectAccount: (id: string | null) => void;
  addTransaction: (transaction: Transaction) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  accounts: [],
  transactions: [],
  categories: [],
  selectedAccountId: null,
  setAccounts: (accounts) => set({ accounts }),
  setTransactions: (transactions) => set({ transactions }),
  setCategories: (categories) => set({ categories }),
  selectAccount: (selectedAccountId) => set({ selectedAccountId }),
  addTransaction: (transaction) =>
    set((state) => ({ transactions: [transaction, ...state.transactions] })),
}));
