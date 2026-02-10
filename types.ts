
export enum ProductType {
  COFFEE = 'coffee',
  MART = 'minimart',
  RESTAURANT = 'restaurant'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  costPrice?: number; // Cost of Goods Sold
  category: ProductType;
  subCategory?: string;
  image: string;
  description?: string;
  stock?: number;
  minStock?: number;
  companyId?: string; // Multi-tenant isolation
  branchId?: string; // Branch specific stock
}

export interface CartItem extends Product {
  quantity: number;
  options?: {
    sweetness?: string;
    extraShot?: boolean;
    noIce?: boolean;
    iceLevel?: string;
    spiciness?: string;
    notes?: string;
  };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: 'KH' | 'TH' | 'ID' | 'US';
  totalSpent: number;
  lastOrderDate: string;
  favoriteItem: string;
  points?: number;
  companyId?: string; // Belong to specific franchise
}

export interface LoyaltyLog {
  id: string;
  customerId: string;
  points: number;
  type: 'earn' | 'use';
  createdAt: string;
}

export interface SalesData {
  name: string;
  coffee: number;
  mart: number;
  total: number;
}

export enum CountryCode {
  US = 'US',
  KH = 'KH',
  TH = 'TH',
  ID = 'ID'
}

// --- DATABASE STRUCTURE INTERFACES ---

export interface DbCompany {
  id: string;
  name: string;
  ownerName: string;
  country: CountryCode;
  status: 'active' | 'trial' | 'suspended';
  plan: 'basic' | 'pro' | 'enterprise';
  expireDate: string;
  logoUrl?: string;
  currency: string;
  totalBranches: number;
  createdAt: string;
}

export interface DbBranch {
  id: string;
  companyId: string;
  name: string;
  address: string;
  phone: string;
  type: ProductType;
  status: 'open' | 'closed';
  managerId?: number;
}

export interface DbUser {
  id: number;
  name: string;
  email: string;
  role: 'super_admin' | 'company_admin' | 'branch_manager' | 'cashier' | 'kitchen' | 'rider';
  companyId?: string; // Null for super_admin
  branchId?: string; // Null for company_admin
  createdAt: string;
  avatar?: string;
}

export interface DbCategory {
  id: number;
  name: string;
  type: 'restaurant' | 'coffee' | 'minimart';
  companyId?: string;
  createdAt: string;
}

export interface DbProduct {
  id: number;
  categoryId: number;
  companyId: string;
  name: string;
  description?: string;
  price: number;
  costPrice?: number;
  imageUrl?: string;
  status: 'available' | 'out_of_stock';
  stock: number;
  minStock: number;
  createdAt: string;
}

export interface DbRider {
  id: string;
  name: string;
  phone: string;
  status: 'offline' | 'online' | 'busy';
  currentOrderId?: string;
  totalDeliveries: number;
  earnings: number;
  vehicleType: 'motorcycle' | 'bicycle';
  avatar?: string;
  companyId?: string;
  branchId?: string;
}

export interface DbOrder {
  id: string;
  customerId: string;
  companyId?: string;
  branchId?: string;
  orderNumber: string;
  totalAmount: number;
  totalCost?: number;
  status: 'pending' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'completed' | 'canceled';
  orderType: 'pickup' | 'delivery';
  source?: 'online' | 'pos';
  riderId?: string;
  deliveryAddress?: string;
  deliveryFee?: number;
  createdAt: string;
  items?: DbOrderItem[]; 
  customerName?: string; 
  customerPhone?: string;
  earnedPoints?: number;
  redeemedPoints?: number;
}

export interface DbOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string; 
  quantity: number;
  price: number;
  costPrice?: number;
  options?: any;
}

export interface DbExpense {
  id: string;
  companyId?: string;
  branchId?: string;
  name: string;
  amount: number;
  date: string;
  category: 'rent' | 'utilities' | 'salary' | 'marketing' | 'other';
  note?: string;
}

export interface AccountingStats {
  totalRevenue: number;
  totalCOGS: number;
  grossProfit: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
}

export interface DbBooking {
  id: number;
  customerId: string;
  companyId?: string;
  date: string;
  time: string;
  peopleCount: number;
  message?: string;
  status: 'pending' | 'confirmed' | 'canceled';
  createdAt: string;
}

export interface DbPayment {
  id: number;
  orderId: number;
  paymentMethod: 'cash' | 'qr' | 'card';
  paymentStatus: 'paid' | 'unpaid';
  amount: number;
  createdAt: string;
}

export type SocialPlatform = 'telegram' | 'line' | 'whatsapp' | 'facebook';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  linkUrl: string;
  label: string;
}

export interface DbSettings {
  id: number;
  siteName: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  currency?: string;
  languageDefault?: string;
  menuLayout?: 'grid' | 'list' | 'focus';
}

export interface DbCountry {
  id: number;
  name: string;
  code: string;
}

export interface DbReport {
  id: number;
  reportType: 'daily' | 'monthly';
  totalSales: number;
  totalOrders: number;
  createdAt: string;
}

export interface PredictionStats {
  tomorrowRevenue: number;
  tomorrowProfit: number;
  weeklyForecast: { day: string; revenue: number; traffic: 'low'|'medium'|'high' }[];
  topProducts: { name: string; predictedQty: number; trend: 'up'|'down' }[];
  restockAlerts: { productName: string; currentStock: number; predictedDemand: number }[];
}

export type CampaignChannel = 'sms' | 'telegram' | 'line' | 'whatsapp' | 'facebook';
export type CampaignRule = 'no_order_7_days' | 'birthday' | 'points_over_100' | 'slow_day' | 'new_customer';

export interface DbCampaign {
  id: string;
  name: string;
  message: string;
  channel: CampaignChannel;
  rule: CampaignRule;
  status: 'active' | 'paused' | 'completed';
  sentCount: number;
  clickCount: number;
  revenue: number;
  lastRun?: string;
}

// --- API RESPONSE INTERFACES ---

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  [key: string]: any; 
}

export interface AuthResponse extends ApiResponse {
  token?: string;
  user?: DbUser;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

// --- END DATABASE STRUCTURE INTERFACES ---

export interface Translations {
  nav: {
    home: string;
    menu: string;
    booking: string;
    about: string;
    contact: string;
    crm: string;
    orderNow: string;
    login: string;
    logout: string;
  };
  hero: {
    slogan: string;
    subSlogan: string;
    btnOrder: string;
    btnBook: string;
  };
  home: {
    servicesTitle: string;
    service1: string;
    service1Desc: string;
    service2: string;
    service2Desc: string;
    service3: string;
    service3Desc: string;
    howTitle: string;
    how1: string;
    how2: string;
    how3: string;
    howTagline: string;
    featTitle: string;
    feat1: string;
    feat2: string;
    feat3: string;
    feat4: string;
    feat5: string;
    feat6: string;
    ctaTitle: string;
    ctaBtn: string;
  };
  shop: {
    pageTitle: string;
    pageDesc: string;
    cafeTab: string;
    martTab: string;
    restaurantTab: string;
    cafeTitle: string;
    cafeDesc: string;
    martTitle: string;
    martDesc: string;
    restaurantTitle: string;
    restaurantDesc: string;
    addToCart: string;
    customize: string;
    inStock: string;
    available: string;
    categories: string;
    cart: string;
    checkout: string;
    total: string;
  };
  booking: {
    title: string;
    desc: string;
    successTitle: string;
    successDesc: string;
    makeAnother: string;
    labels: {
      name: string;
      email: string;
      phone: string;
      date: string;
      time: string;
      guests: string;
      message: string;
      submit: string;
    };
    info: {
      hoursTitle: string;
      hours: string;
      groupTitle: string;
      groupDesc: string;
    }
  };
  about: {
    title: string;
    whoWeAre: string;
    whoWeAreDesc: string;
    mission: string;
    missionDesc: string;
    countries: string;
  };
  contact: {
    title: string;
    desc: string;
    formTitle: string;
    socialTitle: string;
    socialText: string;
    name: string;
    email: string;
    message: string;
    send: string;
  };
  crm: {
    dashboard: string;
    orders: string;
    products: string;
    customers: string;
    settings: string;
    title: string;
    subtitle: string;
    analyzeBtn: string;
    analyzing: string;
    revenue: string;
    activeCust: string;
    topPerforming: string;
    salesPerf: string;
    customerActivity: string;
    customerCols: {
      name: string;
      region: string;
      fav: string;
      spent: string;
    }
  };
  footer: {
    desc: string;
    quickLinks: string;
    social: string;
    rights: string;
  };
}
