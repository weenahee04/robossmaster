export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`/api/loyalty${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  return res.json();
}

export async function apiFetchRaw(path: string, options?: RequestInit) {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  return res;
}

export const api = {
  // Branch
  getBranch: async (slug: string) => {
    const res = await apiFetchRaw(`/branches/${slug}`);
    if (!res.ok) return null;
    return res.json();
  },

  // Customer
  getCustomer: (phone: string, branch: string) =>
    apiFetch(`/customers?phone=${phone}&branch=${branch}`),
  registerCustomer: (data: { phone: string; name?: string; lineId?: string }) =>
    apiFetch('/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (data: { id: string; name?: string; profileImage?: string }) =>
    apiFetch('/customers', { method: 'PATCH', body: JSON.stringify(data) }),

  // Points
  getPoints: (customerId: string, branch: string) =>
    apiFetch(`/points?customerId=${customerId}&branch=${branch}`),

  // Coupons
  getCoupons: (branch: string, customerId?: string) =>
    apiFetch(`/coupons?branch=${branch}${customerId ? `&customerId=${customerId}` : ''}`),
  redeemCoupon: (data: { customerId: string; couponTemplateId: string; branchSlug: string }) =>
    apiFetch('/coupons', { method: 'POST', body: JSON.stringify(data) }),

  // Banners
  getBanners: (branch: string) => apiFetch(`/banners?branch=${branch}`),

  // Config
  getConfig: (branch: string) => apiFetch(`/config?branch=${branch}`),

  // Vehicles
  getVehicles: (customerId: string) => apiFetch(`/vehicles?customerId=${customerId}`),
  addVehicle: (data: { customerId: string; make: string; model?: string; licensePlate: string }) =>
    apiFetch('/vehicles', { method: 'POST', body: JSON.stringify(data) }),
  deleteVehicle: (id: string) => apiFetch(`/vehicles?id=${id}`, { method: 'DELETE' }),
};
