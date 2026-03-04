'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/loyalty-auth-context';
import { api } from '@/lib/loyalty-api';
import HomePage from '@/components/loyalty/HomePage';
import BranchesPage from '@/components/loyalty/BranchesPage';
import HistoryPage from '@/components/loyalty/HistoryPage';
import ProfilePage from '@/components/loyalty/ProfilePage';
import CouponsPage from '@/components/loyalty/CouponsPage';
import NotificationsPage from '@/components/loyalty/NotificationsPage';
import ScanPage from '@/components/loyalty/ScanPage';
import BottomNav from '@/components/loyalty/BottomNav';

type Tab = 'home' | 'coupons' | 'branches' | 'history' | 'profile' | 'notifications';

export default function LoyaltyBranchPage() {
  const router = useRouter();
  const { customer, isLoggedIn, branchSlug, branchInfo, pointsData, refreshPoints, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showScan, setShowScan] = useState(false);
  const [coupons, setCoupons] = useState<any>({ templates: [], myCoupons: [] });
  const [banners, setBanners] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(`/loyalty/${branchSlug}/login`);
    }
  }, [isLoggedIn, branchSlug, router]);

  useEffect(() => {
    if (!branchSlug) return;
    api.getBanners(branchSlug).then(setBanners).catch(() => {});
    api.getConfig(branchSlug).then(setConfig).catch(() => {});
  }, [branchSlug]);

  useEffect(() => {
    if (!branchSlug || !customer?.id) return;
    api.getCoupons(branchSlug, customer.id).then(setCoupons).catch(() => {});
  }, [branchSlug, customer?.id]);

  if (!isLoggedIn) return null;

  const user = {
    id: customer.id,
    name: customer.name || 'สมาชิก',
    phone: customer.phone,
    points: pointsData?.balance || 0,
    currentStamps: pointsData?.stamps || 0,
    totalStamps: config?.config?.stampsForFreeWash || 10,
    memberTier: pointsData?.tier || 'SILVER',
    profileImage: customer.profileImage,
  };

  const showNavbar = !['notifications'].includes(activeTab) && !showScan;

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            user={user}
            banners={banners}
            config={config}
            branchName={branchInfo?.name}
            onOpenQR={() => setShowScan(true)}
            onOpenRewards={() => setActiveTab('coupons')}
            onOpenNotifications={() => setActiveTab('notifications')}
            onOpenSettings={() => setActiveTab('profile')}
            onOpenBranches={() => setActiveTab('branches')}
            onOpenHistory={() => setActiveTab('history')}
          />
        );
      case 'coupons':
        return (
          <CouponsPage
            user={user}
            templates={coupons.templates}
            myCoupons={coupons.myCoupons}
            branchSlug={branchSlug}
            customerId={customer.id}
            onRefresh={() => {
              refreshPoints();
              api.getCoupons(branchSlug, customer.id).then(setCoupons).catch(() => {});
            }}
          />
        );
      case 'branches':
        return <BranchesPage />;
      case 'history':
        return <HistoryPage customerId={customer.id} branchSlug={branchSlug} />;
      case 'profile':
        return (
          <ProfilePage
            user={user}
            customerId={customer.id}
            onLogout={logout}
            onOpenCoupons={() => setActiveTab('coupons')}
          />
        );
      case 'notifications':
        return <NotificationsPage onBack={() => setActiveTab('home')} />;
      default:
        return null;
    }
  };

  return (
    <>
      <main>{renderPage()}</main>

      {showNavbar && (
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onScan={() => setShowScan(true)}
        />
      )}

      {showScan && <ScanPage user={user} onClose={() => setShowScan(false)} />}
    </>
  );
}
