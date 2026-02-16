'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/loyalty-auth-context';
import { api } from '@/lib/loyalty-api';
import HomePage from '@/components/loyalty/HomePage';
import PackagesPage from '@/components/loyalty/PackagesPage';
import BranchesPage from '@/components/loyalty/BranchesPage';
import HistoryPage from '@/components/loyalty/HistoryPage';
import ProfilePage from '@/components/loyalty/ProfilePage';
import RewardsPage from '@/components/loyalty/RewardsPage';
import NotificationsPage from '@/components/loyalty/NotificationsPage';
import BottomNav from '@/components/loyalty/BottomNav';
import QRModal from '@/components/loyalty/QRModal';
import { QrCode } from 'lucide-react';

type Tab = 'home' | 'packages' | 'branches' | 'history' | 'profile' | 'rewards' | 'notifications';

export default function LoyaltyBranchPage() {
  const router = useRouter();
  const { customer, isLoggedIn, branchSlug, branchInfo, pointsData, refreshPoints, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showQR, setShowQR] = useState(false);
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

  const showNavbar = !['rewards', 'notifications'].includes(activeTab);

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            user={user}
            banners={banners}
            config={config}
            branchName={branchInfo?.name}
            onOpenQR={() => setShowQR(true)}
            onOpenRewards={() => setActiveTab('rewards')}
            onOpenNotifications={() => setActiveTab('notifications')}
            onOpenSettings={() => setActiveTab('profile')}
          />
        );
      case 'packages':
        return <PackagesPage packages={config?.packages || []} />;
      case 'branches':
        return <BranchesPage />;
      case 'history':
        return <HistoryPage customerId={customer.id} branchSlug={branchSlug} />;
      case 'profile':
        return <ProfilePage user={user} customerId={customer.id} onLogout={logout} />;
      case 'rewards':
        return (
          <RewardsPage
            user={user}
            templates={coupons.templates}
            myCoupons={coupons.myCoupons}
            branchSlug={branchSlug}
            customerId={customer.id}
            onBack={() => setActiveTab('home')}
            onRefresh={() => {
              refreshPoints();
              api.getCoupons(branchSlug, customer.id).then(setCoupons).catch(() => {});
            }}
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
        <button
          onClick={() => setShowQR(true)}
          className="fixed bottom-24 right-6 z-50 gradient-red p-4 rounded-2xl shadow-lg shadow-red-600/30 active:scale-95 transition-transform"
        >
          <QrCode size={28} color="white" />
        </button>
      )}

      {showNavbar && <BottomNav activeTab={activeTab as any} setActiveTab={setActiveTab} />}
      {showQR && <QRModal user={user} onClose={() => setShowQR(false)} />}
    </>
  );
}
