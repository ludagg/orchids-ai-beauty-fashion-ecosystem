"use client";

import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  theme: 'system',
  sidebarOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,

  setTheme: (theme) => {
    set({ theme });
    // Theme will be handled by ThemeProvider component
  },

  toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  toggleMobileMenu: () => set({ mobileMenuOpen: !get().mobileMenuOpen }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  
  toggleSearch: () => set({ searchOpen: !get().searchOpen }),
  setSearchOpen: (open) => set({ searchOpen: open }),
}));
