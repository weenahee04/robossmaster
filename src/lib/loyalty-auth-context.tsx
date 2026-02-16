'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { api } from '@/lib/loyalty-api';

interface BranchInfo {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

interface ThemeData {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  logoUrl?: string | null;
  brandName?: string | null;
  tagline?: string | null;
  templateId?: string;
  borderRadius?: string;
  cardStyle?: string;
  navStyle?: string;
  buttonStyle?: string;
  headerStyle?: string;
  bannerUrl?: string | null;
  backgroundImage?: string | null;
}

interface AuthContextType {
  customer: any;
  setCustomer: (c: any) => void;
  branchSlug: string;
  branchInfo: BranchInfo | null;
  branchLoading: boolean;
  branchNotFound: boolean;
  pointsData: any;
  refreshPoints: () => void;
  isLoggedIn: boolean;
  logout: () => void;
  themeData: ThemeData | null;
}

const AuthContext = createContext<AuthContextType>({
  customer: null,
  setCustomer: () => {},
  branchSlug: '',
  branchInfo: null,
  branchLoading: true,
  branchNotFound: false,
  pointsData: null,
  refreshPoints: () => {},
  isLoggedIn: false,
  logout: () => {},
  themeData: null,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({
  children,
  slug,
}: {
  children: React.ReactNode;
  slug: string;
}) {
  const [customer, setCustomer] = useState<any>(null);
  const [pointsData, setPointsData] = useState<any>(null);
  const [branchInfo, setBranchInfo] = useState<BranchInfo | null>(null);
  const [branchLoading, setBranchLoading] = useState(true);
  const [branchNotFound, setBranchNotFound] = useState(false);
  const [themeData, setThemeData] = useState<ThemeData | null>(null);

  // Validate branch slug on mount
  useEffect(() => {
    setBranchLoading(true);
    setBranchNotFound(false);
    Promise.all([
      api.getBranch(slug),
      fetch(`/api/loyalty/theme?branch=${slug}`).then(r => r.json()).catch(() => null),
    ]).then(([branchData, theme]) => {
      if (!branchData || branchData.error) {
        setBranchNotFound(true);
      } else {
        setBranchInfo(branchData);
      }
      if (theme) setThemeData(theme);
      setBranchLoading(false);
    }).catch(() => {
      setBranchNotFound(true);
      setBranchLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    const saved = localStorage.getItem(`roboss-loyalty-${slug}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCustomer(parsed);
      } catch {}
    }
  }, [slug]);

  const refreshPoints = async () => {
    if (!customer?.id) return;
    try {
      const data = await api.getPoints(customer.id, slug);
      setPointsData(data);
    } catch {}
  };

  useEffect(() => {
    if (customer?.id) {
      refreshPoints();
      localStorage.setItem(`roboss-loyalty-${slug}`, JSON.stringify(customer));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer?.id, slug]);

  const logout = () => {
    setCustomer(null);
    setPointsData(null);
    localStorage.removeItem(`roboss-loyalty-${slug}`);
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        setCustomer,
        branchSlug: slug,
        branchInfo,
        branchLoading,
        branchNotFound,
        pointsData,
        refreshPoints,
        isLoggedIn: !!customer,
        logout,
        themeData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
