import { Product, Customer, SalesData, ProductType, LoginCredentials, AuthResponse, DbUser, DbCategory, DbOrder, DbOrderItem, DbBooking, DbPayment, SocialLink, DbSettings, ApiResponse, CountryCode, DbExpense, AccountingStats, DbRider, DbCompany, DbBranch, PredictionStats, DbCampaign } from '../types';
import { MOCK_PRODUCTS, MOCK_CUSTOMERS, SALES_DATA, SOCIAL_LINKS, MOCK_EXPENSES } from '../constants';

// Mock API Service with Country Segmentation Logic
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_SUPER_ADMIN: DbUser = {
  id: 1,
  name: "System Owner",
  email: "super@nouncrm.com",
  role: "super_admin",
  createdAt: new Date().toISOString()
};

const MOCK_COMPANY_ADMIN: DbUser = {
  id: 2,
  name: "Franchise Owner",
  email: "owner@coffeex.com",
  role: "company_admin",
  companyId: "c1",
  createdAt: new Date().toISOString()
};

const MOCK_BRANCH_MANAGER: DbUser = {
  id: 3,
  name: "Branch Manager",
  email: "manager@coffeex-b1.com",
  role: "branch_manager",
  companyId: "c1",
  branchId: "b1",
  createdAt: new Date().toISOString()
};

let _users: DbUser[] = [MOCK_SUPER_ADMIN, MOCK_COMPANY_ADMIN, MOCK_BRANCH_MANAGER];

// Mock Companies (Tenants)
let _companies: DbCompany[] = [
  { 
    id: "c1", name: "CoffeeX Franchise", ownerName: "Sokha Vong", country: CountryCode.KH, 
    status: "active", plan: "pro", expireDate: "2026-12-31", currency: "៛", totalBranches: 2, createdAt: "2024-01-15" 
  },
  { 
    id: "c2", name: "BurgerPro", ownerName: "John Doe", country: CountryCode.TH, 
    status: "active", plan: "basic", expireDate: "2025-06-30", currency: "฿", totalBranches: 1, createdAt: "2024-02-20" 
  },
  { 
    id: "c3", name: "MiniGo Mart", ownerName: "Budi Santoso", country: CountryCode.ID, 
    status: "trial", plan: "basic", expireDate: "2024-12-31", currency: "Rp", totalBranches: 3, createdAt: "2024-03-10" 
  },
];

// Mock Branches
let _branches: DbBranch[] = [
  { id: "b1", companyId: "c1", name: "CoffeeX - Toul Kork", address: "St 315, TK", phone: "012333444", type: ProductType.COFFEE, status: "open" },
  { id: "b2", companyId: "c1", name: "CoffeeX - BKK1", address: "St 51, BKK", phone: "012555666", type: ProductType.COFFEE, status: "open" },
  { id: "b3", companyId: "c2", name: "BurgerPro - Siam", address: "Siam Paragon", phone: "0812345678", type: ProductType.RESTAURANT, status: "open" },
];

let _products: (Product & { country?: string })[] = MOCK_PRODUCTS.map((p, idx) => {
  const countries = [CountryCode.KH, CountryCode.TH, CountryCode.ID, CountryCode.US];
  return {
    ...p,
    companyId: 'c1', // Assign mock data to CoffeeX for demo
    branchId: 'b1',
    country: countries[idx % countries.length],
    stock: p.stock ?? Math.floor(Math.random() * 50) + 10,
    minStock: p.minStock ?? 5
  };
});

let _orders: DbOrder[] = [
  {
    id: '1001',
    customerId: '1',
    companyId: 'c1',
    branchId: 'b1',
    customerName: 'Sokha Chan',
    orderNumber: 'ORD-1001',
    totalAmount: 12.50,
    totalCost: 5.50,
    status: 'completed',
    orderType: 'pickup',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    items: [],
    earnedPoints: 12
  }
];

let _riders: DbRider[] = [
  { id: 'r1', name: 'Dara Driver', phone: '012333444', status: 'online', totalDeliveries: 124, earnings: 156.50, vehicleType: 'motorcycle', companyId: 'c1' },
  { id: 'r2', name: 'Sambo Rider', phone: '012555666', status: 'busy', currentOrderId: '1002', totalDeliveries: 89, earnings: 92.00, vehicleType: 'motorcycle', companyId: 'c1' },
];

// Local mutable state
let _customers: Customer[] = MOCK_CUSTOMERS.map(c => ({ ...c, companyId: 'c1', points: Math.floor(Math.random() * 150) }));
let _bookings: DbBooking[] = [];
let _payments: DbPayment[] = [];
let _expenses: DbExpense[] = [...MOCK_EXPENSES.map(e => ({...e, companyId: 'c1', branchId: 'b1'}))];
let _socialLinks = [...SOCIAL_LINKS];
let _categories: DbCategory[] = [
  { id: 1, name: 'Hot Coffee', type: 'coffee', companyId: 'c1', createdAt: new Date().toISOString() },
  { id: 2, name: 'Snacks', type: 'minimart', companyId: 'c1', createdAt: new Date().toISOString() },
];

// Mock Campaigns
let _campaigns: DbCampaign[] = [
  { id: '1', name: 'Come Back Promo', message: 'We miss you! 10% OFF today 🍔', channel: 'telegram', rule: 'no_order_7_days', status: 'active', sentCount: 142, clickCount: 45, revenue: 210.50, lastRun: new Date(Date.now() - 86400000).toISOString() },
  { id: '2', name: 'Birthday Reward', message: 'Happy Birthday 🎉 Free coffee for you!', channel: 'sms', rule: 'birthday', status: 'active', sentCount: 12, clickCount: 8, revenue: 0, lastRun: new Date().toISOString() },
  { id: '3', name: 'VIP Bonus', message: 'You earned a free burger 🍔', channel: 'line', rule: 'points_over_100', status: 'paused', sentCount: 56, clickCount: 20, revenue: 150.00 },
];

let _settings: DbSettings = { 
  id: 1,
  siteName: 'NOUN CRM', 
  currency: '$',
  menuLayout: 'grid' // Default Layout
};

const success = <T>(data: T, message: string = 'Success', extras: any = {}): ApiResponse<T> => ({
  status: 'success',
  message,
  data,
  ...extras
});

export const api = {
  auth: {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      await delay(600);
      const user = _users.find(u => u.email === credentials.email);
      if (user) {
        // Password check omitted for mock demo simplicity, accepting the correct emails.
        // In real app, check hash.
        return { status: 'success', token: "jwt-secure-session-token", user };
      }
      return { status: 'error', message: 'Invalid credentials' };
    },
    logout: async () => success(undefined),
    profile: async () => success(MOCK_SUPER_ADMIN)
  },

  companies: {
    list: async (): Promise<ApiResponse<DbCompany[]>> => success(_companies),
    create: async (data: any): Promise<ApiResponse<DbCompany>> => {
      const newCompany = { ...data, id: `c${Date.now()}`, createdAt: new Date().toISOString(), status: 'active', totalBranches: 0 };
      _companies.push(newCompany);
      return success(newCompany);
    },
    update: async (id: string, data: any): Promise<ApiResponse<DbCompany>> => {
      const idx = _companies.findIndex(c => c.id === id);
      if (idx > -1) {
        _companies[idx] = { ..._companies[idx], ...data };
        return success(_companies[idx]);
      }
      return { status: 'error', message: 'Company not found' };
    }
  },

  branches: {
    list: async (companyId?: string): Promise<ApiResponse<DbBranch[]>> => {
        let list = _branches;
        if (companyId) list = list.filter(b => b.companyId === companyId);
        return success(list);
    },
    create: async (data: any): Promise<ApiResponse<DbBranch>> => {
      const newBranch = { ...data, id: `b${Date.now()}` };
      _branches.push(newBranch);
      return success(newBranch);
    }
  },

  riders: {
    list: async (): Promise<ApiResponse<DbRider[]>> => success(_riders),
    create: async (data: any): Promise<ApiResponse<DbRider>> => {
      const newRider = { ...data, id: `r${Date.now()}`, totalDeliveries: 0, earnings: 0, status: 'offline' };
      _riders.push(newRider);
      return success(newRider);
    },
    updateStatus: async (id: string, status: DbRider['status']): Promise<ApiResponse<DbRider>> => {
      const idx = _riders.findIndex(r => r.id === id);
      if (idx > -1) {
        _riders[idx].status = status;
        return success(_riders[idx]);
      }
      return { status: 'error', message: 'Rider not found' };
    },
    acceptOrder: async (riderId: string, orderId: string): Promise<ApiResponse<DbOrder>> => {
      const rIdx = _riders.findIndex(r => r.id === riderId);
      const oIdx = _orders.findIndex(o => o.id === orderId);
      
      if (rIdx > -1 && oIdx > -1) {
        _riders[rIdx].status = 'busy';
        _riders[rIdx].currentOrderId = orderId;
        _orders[oIdx].status = 'out_for_delivery';
        _orders[oIdx].riderId = riderId;
        return success(_orders[oIdx]);
      }
      return { status: 'error', message: 'Assignment failed' };
    },
    completeOrder: async (riderId: string, orderId: string): Promise<ApiResponse<DbOrder>> => {
      const rIdx = _riders.findIndex(r => r.id === riderId);
      const oIdx = _orders.findIndex(o => o.id === orderId);
      
      if (rIdx > -1 && oIdx > -1) {
        _riders[rIdx].status = 'online';
        _riders[rIdx].currentOrderId = undefined;
        _riders[rIdx].totalDeliveries += 1;
        _riders[rIdx].earnings += 1.00;
        
        _orders[oIdx].status = 'completed';
        
        return success(_orders[oIdx]);
      }
      return { status: 'error', message: 'Completion failed' };
    }
  },

  products: {
    list: async (type?: ProductType, country?: CountryCode): Promise<ApiResponse<Product[]>> => {
      await delay(300);
      let filtered = [..._products];
      if (type) filtered = filtered.filter(p => p.category === type);
      if (country) filtered = filtered.filter(p => p.country === country);
      
      if (filtered.length === 0 && type) {
        filtered = _products.filter(p => p.category === type).slice(0, 10);
      }
      
      return success(filtered);
    },
    create: async (data: any): Promise<ApiResponse<Product>> => {
      const newProduct = { 
        ...data, 
        id: `p-${Math.floor(Math.random() * 100000)}`, 
        price: Number(data.price) || 0,
        costPrice: Number(data.costPrice) || 0,
        stock: data.stock ?? 10, 
        minStock: data.minStock ?? 5,
        country: data.country || 'KH'
      };
      _products.unshift(newProduct);
      return success(newProduct);
    },
    update: async (id: string, data: any): Promise<ApiResponse<Product>> => {
      const idx = _products.findIndex(p => p.id === id);
      if (idx > -1) {
        const updatedProduct = { 
          ..._products[idx], 
          ...data,
          price: Number(data.price) ?? _products[idx].price,
          costPrice: Number(data.costPrice) ?? _products[idx].costPrice,
          country: data.country || _products[idx].country
        };
        _products[idx] = updatedProduct;
        return success(updatedProduct as Product);
      }
      return { status: 'error', message: 'Product not found' };
    },
    delete: async (id: string): Promise<ApiResponse<undefined>> => {
      _products = _products.filter(p => p.id !== id);
      return success(undefined);
    }
  },

  categories: {
    list: async (): Promise<ApiResponse<DbCategory[]>> => success(_categories),
    create: async (data: any): Promise<ApiResponse<DbCategory>> => {
      const newCat = { ...data, id: Math.floor(Math.random() * 10000), createdAt: new Date().toISOString() };
      _categories.push(newCat);
      return success(newCat);
    },
    update: async (id: number, data: any): Promise<ApiResponse<DbCategory>> => {
      const idx = _categories.findIndex(c => c.id === id);
      if (idx > -1) {
        _categories[idx] = { ..._categories[idx], ...data };
        return success(_categories[idx]);
      }
      return { status: 'error', message: 'Category not found' };
    },
    delete: async (id: number): Promise<ApiResponse<undefined>> => {
      _categories = _categories.filter(c => c.id !== id);
      return success(undefined);
    }
  },

  orders: {
    list: async (): Promise<ApiResponse<DbOrder[]>> => {
      await delay(500);
      return success(_orders);
    },
    updateStatus: async (id: string, status: DbOrder['status']): Promise<ApiResponse<DbOrder>> => {
      const idx = _orders.findIndex(o => o.id === id);
      if (idx > -1) {
        _orders[idx].status = status;
        return success(_orders[idx]);
      }
      return { status: 'error', message: 'Order not found' };
    },
    assignRider: async (orderId: string, riderId: string): Promise<ApiResponse<DbOrder>> => {
      const orderIdx = _orders.findIndex(o => o.id === orderId);
      const riderIdx = _riders.findIndex(r => r.id === riderId);
      
      if (orderIdx > -1 && riderIdx > -1) {
        _orders[orderIdx].riderId = riderId;
        _orders[orderIdx].status = 'ready_for_pickup';
        return success(_orders[orderIdx]);
      }
      return { status: 'error', message: 'Assignment failed' };
    },
    create: async (data: any): Promise<ApiResponse<DbOrder>> => {
      let totalOrderCost = 0;

      if (data.items && Array.isArray(data.items)) {
         data.items.forEach((item: any) => {
            const pIdx = _products.findIndex(p => p.id === item.productId);
            if (pIdx > -1) {
                _products[pIdx].stock = Math.max(0, (_products[pIdx].stock || 0) - item.quantity);
                const costPerItem = _products[pIdx].costPrice || (_products[pIdx].price * 0.5); 
                totalOrderCost += (costPerItem * item.quantity);
            }
         });
      }

      let earnedPoints = Math.floor(data.totalAmount || 0);
      let redeemedPoints = data.redeemedPoints || 0;
      let finalTotal = data.totalAmount;

      if (data.customerPhone) {
         const cIdx = _customers.findIndex(c => c.phone.replace(/\s+/g, '') === data.customerPhone.replace(/\s+/g, ''));
         if (cIdx > -1) {
            if (redeemedPoints > 0) {
               _customers[cIdx].points = Math.max(0, (_customers[cIdx].points || 0) - redeemedPoints);
            }
            _customers[cIdx].points = (_customers[cIdx].points || 0) + earnedPoints;
            _customers[cIdx].totalSpent += finalTotal;
            data.customerName = _customers[cIdx].name;
            data.customerId = _customers[cIdx].id;
         }
      }

      const orderNum = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder = { 
        ...data, 
        id: String(Math.floor(Math.random() * 10000)), 
        orderNumber: orderNum, 
        createdAt: new Date().toISOString(),
        totalCost: totalOrderCost,
        earnedPoints
      };
      _orders.unshift(newOrder);
      return success(newOrder, 'Order placed', { order_number: orderNum, earned_points: earnedPoints });
    },
    delete: async (id: string): Promise<ApiResponse<undefined>> => {
      _orders = _orders.filter(o => o.id !== id);
      return success(undefined);
    }
  },

  customers: {
    list: async (country?: string): Promise<ApiResponse<Customer[]>> => success(_customers.filter(c => !country || c.country === country)),
    findByPhone: async (phone: string): Promise<ApiResponse<Customer | null>> => {
      const found = _customers.find(c => c.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, ''));
      return success(found || null);
    },
    create: async (data: any): Promise<ApiResponse<Customer>> => {
      const newCust = { ...data, id: String(Math.floor(Math.random() * 10000)), totalSpent: 0, points: data.points || 0, lastOrderDate: new Date().toISOString().split('T')[0] } as Customer;
      _customers.push(newCust);
      return success(newCust);
    },
    update: async (id: string, data: any): Promise<ApiResponse<Customer>> => {
      const idx = _customers.findIndex(c => c.id === id);
      if (idx > -1) {
        _customers[idx] = { ..._customers[idx], ...data };
        return success(_customers[idx]);
      }
      return { status: 'error', message: 'Customer not found' };
    },
    delete: async (id: string): Promise<ApiResponse<undefined>> => {
      _customers = _customers.filter(c => c.id !== id);
      return success(undefined);
    }
  },

  marketing: {
    list: async (): Promise<ApiResponse<DbCampaign[]>> => success(_campaigns),
    create: async (data: any): Promise<ApiResponse<DbCampaign>> => {
      const newCampaign = { 
        ...data, 
        id: `cmp${Date.now()}`, 
        status: 'active', 
        sentCount: 0, 
        clickCount: 0, 
        revenue: 0 
      };
      _campaigns.unshift(newCampaign);
      return success(newCampaign);
    },
    toggleStatus: async (id: string): Promise<ApiResponse<DbCampaign>> => {
      const idx = _campaigns.findIndex(c => c.id === id);
      if (idx > -1) {
        _campaigns[idx].status = _campaigns[idx].status === 'active' ? 'paused' : 'active';
        return success(_campaigns[idx]);
      }
      return { status: 'error', message: 'Campaign not found' };
    },
    trigger: async (id: string): Promise<ApiResponse<{sent: number}>> => {
      await delay(1500); // Simulate processing
      const idx = _campaigns.findIndex(c => c.id === id);
      if (idx > -1) {
        const sent = Math.floor(Math.random() * 50) + 10; // Mock sent count
        _campaigns[idx].sentCount += sent;
        _campaigns[idx].lastRun = new Date().toISOString();
        return success({ sent });
      }
      return { status: 'error', message: 'Campaign not found' };
    }
  },

  bookings: {
    list: async (): Promise<ApiResponse<DbBooking[]>> => success(_bookings),
    create: async (data: any): Promise<ApiResponse<DbBooking>> => {
      const newBooking = { ...data, id: Math.floor(Math.random() * 9000), status: 'pending', createdAt: new Date().toISOString() };
      _bookings.push(newBooking);
      return success(newBooking, 'Booking saved', { booking_id: newBooking.id });
    },
    confirm: async (id: number): Promise<ApiResponse<DbBooking>> => {
      const idx = _bookings.findIndex(b => b.id === id);
      if (idx > -1) {
        _bookings[idx].status = 'confirmed';
        return success(_bookings[idx]);
      }
      return { status: 'error', message: 'Booking not found' };
    },
    delete: async (id: number): Promise<ApiResponse<undefined>> => {
      _bookings = _bookings.filter(b => b.id !== id);
      return success(undefined);
    }
  },

  payments: {
    list: async (): Promise<ApiResponse<DbPayment[]>> => success(_payments),
    create: async (data: any): Promise<ApiResponse<DbPayment>> => {
      const newPayment = { ...data, id: Math.floor(Math.random() * 10000), paymentStatus: 'paid', createdAt: new Date().toISOString() };
      _payments.push(newPayment);
      return success(newPayment, 'Paid', { payment_status: 'paid' });
    }
  },

  expenses: {
    list: async (): Promise<ApiResponse<DbExpense[]>> => {
      await delay(300);
      return success(_expenses);
    },
    create: async (data: any): Promise<ApiResponse<DbExpense>> => {
      const newExpense = { ...data, id: `exp-${Date.now()}` };
      _expenses.push(newExpense);
      return success(newExpense);
    },
    delete: async (id: string): Promise<ApiResponse<undefined>> => {
      _expenses = _expenses.filter(e => e.id !== id);
      return success(undefined);
    }
  },

  reports: {
    daily: async (country?: string): Promise<ApiResponse<SalesData[]>> => success(SALES_DATA),
    monthly: async (): Promise<ApiResponse<SalesData[]>> => success([]),
    topProducts: async (): Promise<ApiResponse<any[]>> => success([]),
    financials: async (): Promise<ApiResponse<AccountingStats>> => {
      await delay(500);
      
      const totalRevenue = _orders.reduce((acc, o) => acc + o.totalAmount, 0);
      const totalCOGS = _orders.reduce((acc, o) => acc + (o.totalCost || (o.totalAmount * 0.4)), 0);
      const totalExpenses = _expenses.reduce((acc, e) => acc + e.amount, 0);
      
      const grossProfit = totalRevenue - totalCOGS;
      const netProfit = grossProfit - totalExpenses;
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

      return success({
        totalRevenue,
        totalCOGS,
        grossProfit,
        totalExpenses,
        netProfit,
        profitMargin
      });
    }
  },

  predictions: {
    get: async (): Promise<ApiResponse<PredictionStats>> => {
      await delay(800);
      // Mock logic: generate a realistic forecast based on "historical" trends (static mock for demo)
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date().getDay();
      
      const forecast = [];
      for(let i=1; i<=7; i++) {
        const idx = (today + i) % 7;
        const dayName = days[idx];
        // Weekend boost logic for demo
        const isWeekend = idx === 0 || idx === 6 || idx === 5;
        const base = 300 + Math.floor(Math.random() * 200);
        const revenue = isWeekend ? base * 1.4 : base;
        
        forecast.push({
            day: dayName,
            revenue: Math.floor(revenue),
            traffic: (revenue > 600 ? 'high' : revenue > 400 ? 'medium' : 'low') as 'high'|'medium'|'low'
        });
      }

      return success({
        tomorrowRevenue: forecast[0].revenue,
        tomorrowProfit: Math.floor(forecast[0].revenue * 0.32), // 32% margin
        weeklyForecast: forecast,
        topProducts: [
            { name: 'Iced Latte', predictedQty: 42, trend: 'up' },
            { name: 'Beef Burger', predictedQty: 35, trend: 'up' },
            { name: 'Green Curry', predictedQty: 18, trend: 'down' },
            { name: 'Coke Zero', predictedQty: 55, trend: 'up' },
        ],
        restockAlerts: [
            { productName: 'Burger Buns', currentStock: 10, predictedDemand: 35 },
            { productName: 'Whole Milk', currentStock: 4, predictedDemand: 20 },
            { productName: 'Avocados', currentStock: 2, predictedDemand: 15 },
        ]
      });
    }
  },

  users: {
    list: async (): Promise<ApiResponse<DbUser[]>> => success(_users),
    delete: async (id: number): Promise<ApiResponse<undefined>> => { _users = _users.filter(u => u.id !== id); return success(undefined); },
    create: async (data: any): Promise<ApiResponse<DbUser>> => {
      const newUser = { ...data, id: Math.floor(Math.random() * 10000), createdAt: new Date().toISOString() };
      _users.push(newUser);
      return success(newUser);
    },
    update: async (id: number, data: any): Promise<ApiResponse<DbUser>> => {
      const idx = _users.findIndex(u => u.id === id);
      if (idx > -1) {
        _users[idx] = { ..._users[idx], ...data };
        return success(_users[idx]);
      }
      return { status: 'error', message: 'User not found' };
    }
  },

  settings: {
    get: async (): Promise<ApiResponse<DbSettings>> => success(_settings),
    update: async (data: any): Promise<ApiResponse<DbSettings>> => {
        _settings = { ..._settings, ...data };
        return success(_settings);
    }
  },

  socialLinks: {
    list: async (): Promise<ApiResponse<SocialLink[]>> => success(_socialLinks),
    create: async (data: any): Promise<ApiResponse<SocialLink>> => {
      const newLink = { ...data, id: String(Math.floor(Math.random() * 10000)) };
      _socialLinks.push(newLink);
      return success(newLink);
    },
    update: async (id: string, data: any): Promise<ApiResponse<SocialLink>> => {
      const idx = _socialLinks.findIndex(l => l.id === id);
      if (idx > -1) {
        _socialLinks[idx] = { ..._socialLinks[idx], ...data };
        return success(_socialLinks[idx]);
      }
      return { status: 'error', message: 'Social link not found' };
    },
    delete: async (id: string): Promise<ApiResponse<undefined>> => {
      _socialLinks = _socialLinks.filter(l => l.id !== id);
      return success(undefined);
    }
  }
};