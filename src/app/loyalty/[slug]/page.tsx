'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/loyalty-auth-context';
import { api } from '@/lib/loyalty-api';
import HomePage from '@/components/loyalty/HomePage';
import BranchesPage from '@/components/loyalty/BranchesPage';
import BranchDetailPage from '@/components/loyalty/BranchDetailPage';
import BranchMapPage from '@/components/loyalty/BranchMapPage';
import GeoMapPage from '@/components/loyalty/GeoMapPage';
import HistoryPage from '@/components/loyalty/HistoryPage';
import ProfilePage from '@/components/loyalty/ProfilePage';
import CouponsPage from '@/components/loyalty/CouponsPage';
import NotificationsPage from '@/components/loyalty/NotificationsPage';
import PromoDetailPage from '@/components/loyalty/PromoDetailPage';
import SettingsPage from '@/components/loyalty/SettingsPage';
import ScanPage from '@/components/loyalty/ScanPage';
import BottomNav from '@/components/loyalty/BottomNav';

type Tab = 'home' | 'coupons' | 'branches' | 'branchDetail' | 'branchMap' | 'geoMap' | 'history' | 'profile' | 'notifications' | 'promoDetail' | 'settings';

export default function LoyaltyBranchPage() {
  const router = useRouter();
  const { customer, isLoggedIn, branchSlug, branchInfo, pointsData, refreshPoints, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showScan, setShowScan] = useState(false);
  const [coupons, setCoupons] = useState<any>({ templates: [], myCoupons: [] });
  const [banners, setBanners] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [selectedPromo, setSelectedPromo] = useState<any>(null);

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

  const fullScreenPages: Tab[] = ['notifications', 'branchDetail', 'branchMap', 'geoMap', 'promoDetail', 'settings'];
  const showNavbar = !fullScreenPages.includes(activeTab) && !showScan;

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
            onOpenSettings={() => setActiveTab('settings')}
            onOpenBranches={() => setActiveTab('branches')}
            onOpenHistory={() => setActiveTab('history')}
            onOpenPromo={(id: string) => {
              const banner = banners.find(b => b.id === id);
              setSelectedPromo(banner);
              setActiveTab('promoDetail');
            }}
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
      case 'branchDetail':
        return (
          <BranchDetailPage
            branch={selectedBranch}
            onBack={() => setActiveTab('branches')}
            onOpenGeoMap={() => setActiveTab('geoMap')}
          />
        );
      case 'branchMap':
        return (
          <BranchMapPage
            onBack={() => setActiveTab('branches')}
            onOpenGeoMap={() => setActiveTab('geoMap')}
          />
        );
      case 'geoMap':
        return (
          <GeoMapPage
            branch={selectedBranch}
            onBack={() => setActiveTab('branches')}
          />
        );
      case 'history':
        return <HistoryPage customerId={customer.id} branchSlug={branchSlug} />;
      case 'profile':
        return (
          <ProfilePage
            user={user}
            customerId={customer.id}
            onLogout={logout}
            onOpenCoupons={() => setActiveTab('coupons')}
            onOpenSettings={() => setActiveTab('settings')}
          />
        );
      case 'notifications':
        return <NotificationsPage onBack={() => setActiveTab('home')} />;
      case 'promoDetail':
        return (
          <PromoDetailPage
            promo={selectedPromo}
            onBack={() => setActiveTab('home')}
            onOpenBranches={() => setActiveTab('branches')}
          />
        );
      case 'settings':
        return <SettingsPage onBack={() => setActiveTab('profile')} />;
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
