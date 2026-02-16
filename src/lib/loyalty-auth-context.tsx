'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { api } from '@/lib/loyalty-api';

interface BranchInfo {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
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

  // Validate branch slug on mount
  useEffect(() => {
    setBranchLoading(true);
    setBranchNotFound(false);
    api.getBranch(slug).then((data) => {
      if (!data || data.error) {
        setBranchNotFound(true);
      } else {
        setBranchInfo(data);
      }
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
