import { create } from 'zustand';

interface NavigateState {
  currentPage: string;
  navigate: (page: string) => void;
}

export const useNavigate = create<NavigateState>((set) => ({
  currentPage: 'dashboard',
  navigate: (page) => set({ currentPage: page }),
}));