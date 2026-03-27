'use client';

import { useState, useEffect, useCallback } from 'react';
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
import BottomNav from '@/components/loyalty/BottomNav';
import ServiceSelectPage from '@/components/loyalty/ServiceSelectPage';
import WashFlow from '@/components/loyalty/WashFlow';
import OnboardingTour from '@/components/loyalty/OnboardingTour';
import VehicleSetupPage from '@/components/loyalty/VehicleSetupPage';

type Tab = 'home' | 'coupons' | 'branches' | 'branchDetail' | 'branchMap' | 'geoMap' | 'history' | 'profile' | 'notifications' | 'promoDetail' | 'settings';
type ServiceType = 'car' | 'bike';

function getStoredServiceType(slug: string): ServiceType | null {
  if (typeof window === 'undefined') return null;
  const val = localStorage.getItem(`roboss-service-${slug}`);
  return val === 'car' || val === 'bike' ? val : null;
}

function hasSeenOnboarding(slug: string): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(`roboss-onboarding-${slug}`) === 'done';
}

export default function LoyaltyBranchPage() {
  const router = useRouter();
  const { customer, isLoggedIn, branchSlug, branchInfo, pointsData, refreshPoints, logout } = useAuth();
  const [serviceType, setServiceType] = useState<ServiceType | null>(() => getStoredServiceType(branchSlug));
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showWashFlow, setShowWashFlow] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => !hasSeenOnboarding(branchSlug));
  const [coupons, setCoupons] = useState<any>({ templates: [], myCoupons: [] });
  const [banners, setBanners] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [selectedPromo, setSelectedPromo] = useState<any>(null);
  const [showAdPopup, setShowAdPopup] = useState(true);
  const [adSlide, setAdSlide] = useState(0);

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [showVehicleSetup, setShowVehicleSetup] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(`/loyalty/${branchSlug}/login`);
    }
  }, [isLoggedIn, branchSlug, router]);

  const handleServiceSelect = (type: ServiceType) => {
    setServiceType(type);
    localStorage.setItem(`roboss-service-${branchSlug}`, type);
  };

  useEffect(() => {
    if (!branchSlug) return;
    api.getBanners(branchSlug).then(setBanners).catch(() => {});
    api.getConfig(branchSlug).then(setConfig).catch(() => {});
  }, [branchSlug]);

  useEffect(() => {
    if (!branchSlug || !customer?.id) return;
    api.getCoupons(branchSlug, customer.id).then(setCoupons).catch(() => {});
  }, [branchSlug, customer?.id]);

  const loadVehicles = useCallback(() => {
    if (!customer?.id) return;
    api.getVehicles(customer.id).then(setVehicles).catch(() => {});
  }, [customer?.id]);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const handleOnboardingDone = useCallback(() => {
    setShowOnboarding(false);
    localStorage.setItem(`roboss-onboarding-${branchSlug}`, 'done');
  }, [branchSlug]);

  const handleResetTour = useCallback(() => {
    localStorage.removeItem(`roboss-onboarding-${branchSlug}`);
    setActiveTab('home');
    setShowOnboarding(true);
  }, [branchSlug]);

  const handleWashComplete = useCallback((earnedPoints: number) => {
    setShowWashFlow(false);
    refreshPoints();
  }, [refreshPoints]);

  const handleSelectBranch = useCallback((branch: any) => {
    setSelectedBranch(branch);
    setActiveTab('branchDetail');
  }, []);

  const handleAddVehicle = useCallback(() => {
    setEditingVehicle(null);
    setShowVehicleSetup(true);
  }, []);

  const handleEditVehicle = useCallback((vehicle: any) => {
    setEditingVehicle(vehicle);
    setShowVehicleSetup(true);
  }, []);

  const handleSaveVehicle = useCallback(async (data: { make: string; model: string; color: string; year: string; licensePlate: string }) => {
    if (!customer?.id) return;
    if (editingVehicle) {
      await api.updateVehicle({ id: editingVehicle.id, ...data });
    } else {
      const isFirst = vehicles.length === 0;
      await api.addVehicle({ customerId: customer.id, ...data, isPrimary: isFirst });
    }
    loadVehicles();
    setShowVehicleSetup(false);
    setEditingVehicle(null);
  }, [customer?.id, editingVehicle, vehicles.length, loadVehicles]);

  if (!isLoggedIn) return null;

  if (!serviceType) {
    return (
      <ServiceSelectPage
        branchName={branchInfo?.name}
        customerName={customer?.name}
        onSelect={handleServiceSelect}
      />
    );
  }

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
  const showNavbar = !fullScreenPages.includes(activeTab) && !showWashFlow && !showVehicleSetup;

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            user={user}
            banners={banners}
            config={config}
            branchName={branchInfo?.name}
            vehicles={vehicles}
            onAddVehicle={handleAddVehicle}
            onOpenQR={() => setShowWashFlow(true)}
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
            onStartWash={() => setShowWashFlow(true)}
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
        return (
          <BranchesPage
            onSelectBranch={handleSelectBranch}
          />
        );
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
            vehicles={vehicles}
            onLogout={logout}
            onOpenCoupons={() => setActiveTab('coupons')}
            onOpenSettings={() => setActiveTab('settings')}
            onOpenBranches={() => setActiveTab('branches')}
            onAddVehicle={handleAddVehicle}
            onEditVehicle={handleEditVehicle}
            onRefreshVehicles={loadVehicles}
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
        return (
          <SettingsPage
            onBack={() => setActiveTab('profile')}
            onResetTour={handleResetTour}
            branchSlug={branchSlug}
            user={user}
            customerId={customer.id}
            onRefreshUser={refreshPoints}
          />
        );
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
          onScan={() => setShowWashFlow(true)}
        />
      )}

      {showWashFlow && (
        <WashFlow
          user={user}
          branchSlug={branchSlug}
          branchName={branchInfo?.name}
          availableCoupons={coupons.myCoupons || []}
          onClose={() => setShowWashFlow(false)}
          onComplete={handleWashComplete}
        />
      )}

      {showVehicleSetup && (
        <VehicleSetupPage
          onSave={handleSaveVehicle}
          onSkip={() => { setShowVehicleSetup(false); setEditingVehicle(null); }}
          editData={editingVehicle ? {
            make: editingVehicle.make,
            model: editingVehicle.model,
            color: editingVehicle.color,
            year: editingVehicle.year,
            licensePlate: editingVehicle.licensePlate,
          } : undefined}
          title={editingVehicle ? 'แก้ไขข้อมูลรถ' : undefined}
        />
      )}

      {showOnboarding && activeTab === 'home' && !showWashFlow && (
        <OnboardingTour
          onComplete={handleOnboardingDone}
          onSkip={handleOnboardingDone}
        />
      )}

      {showAdPopup && activeTab === 'home' && !showWashFlow && !showOnboarding && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAdPopup(false)} />
          <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-surface-dark shadow-2xl overflow-hidden">
            <div className="absolute top-3 right-3 z-20">
              <button
                onClick={() => setShowAdPopup(false)}
                className="w-9 h-9 rounded-full bg-black/50 border border-white/20 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-white text-[18px]">close</span>
              </button>
            </div>

            <div className="w-full relative">
              {adSlide === 0 ? (
                <img
                  src="/banners/wash-menu-car.png"
                  alt="Roboss wash menu car"
                  className="w-full h-auto object-cover"
                />
              ) : (
                <img
                  src="/banners/wash-menu-bike.png"
                  alt="Roboss wash menu bike"
                  className="w-full h-auto object-cover"
                />
              )}
            </div>

            <div className="p-3 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => setAdSlide((prev) => (prev === 0 ? 1 : 0))}
                className="px-3 py-2 rounded-xl bg-white/5 text-gray-300 text-xs font-bold border border-white/10"
              >
                ก่อนหน้า
              </button>
              <div className="flex items-center gap-2">
                {[0, 1].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setAdSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full ${adSlide === idx ? 'bg-primary' : 'bg-white/20'}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setAdSlide((prev) => (prev === 1 ? 0 : 1))}
                className="px-3 py-2 rounded-xl bg-primary text-white text-xs font-bold"
              >
                ถัดไป
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
