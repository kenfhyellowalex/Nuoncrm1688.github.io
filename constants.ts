
import { Product, ProductType, Customer, SalesData, CountryCode, SocialLink, DbExpense } from './types.ts';

export const APP_NAME = "NOUN CRM";

// Fix: Exporting COUNTRIES which is missing
export const COUNTRIES = [
  { code: CountryCode.KH, name: 'Cambodia', flag: '🇰🇭', currency: '៛' },
  { code: CountryCode.TH, name: 'Thailand', flag: '🇹🇭', currency: '฿' },
  { code: CountryCode.ID, name: 'Indonesia', flag: '🇮🇩', currency: 'Rp' },
  { code: CountryCode.US, name: 'USA', flag: '🇺🇸', currency: '$' },
];

// Fix: Exporting SOCIAL_LINKS which is missing
export const SOCIAL_LINKS: SocialLink[] = [
  { id: '1', platform: 'telegram', linkUrl: 'https://t.me/nouncrm', label: 'Telegram' },
  { id: '2', platform: 'whatsapp', linkUrl: 'https://wa.me/12345678', label: 'WhatsApp' },
  { id: '3', platform: 'facebook', linkUrl: 'https://facebook.com/nouncrm', label: 'Facebook' },
];

// Fix: Exporting MOCK_PRODUCTS which is missing
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Signature Iced Latte',
    price: 3.5,
    costPrice: 1.2,
    category: ProductType.COFFEE,
    subCategory: 'ICED COFFEE',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80',
    description: 'Smooth espresso mixed with cold milk and our secret syrup.',
    stock: 45,
    minStock: 10
  },
  {
    id: 'p2',
    name: 'Angkor Burger',
    price: 6.0,
    costPrice: 2.5,
    category: ProductType.RESTAURANT,
    subCategory: 'Main Course',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
    description: 'Premium beef with local spices and fresh vegetables.',
    stock: 25,
    minStock: 5
  },
  {
    id: 'p3',
    name: 'Salted Egg Chips',
    price: 2.5,
    costPrice: 1.1,
    category: ProductType.MART,
    subCategory: 'Snacks',
    image: 'https://images.unsplash.com/photo-1566478431375-7042f10ce938?auto=format&fit=crop&w=400&q=80',
    description: 'Crispy chips coated with rich salted egg yolk.',
    stock: 120,
    minStock: 20
  }
];

// Fix: Exporting MOCK_CUSTOMERS which is missing
export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Sokha Chan',
    email: 'sokha.chan@example.kh',
    phone: '012 345 678',
    country: 'KH',
    totalSpent: 450,
    lastOrderDate: '2024-03-20',
    favoriteItem: 'Signature Iced Latte',
    points: 150
  },
  {
    id: 'c2',
    name: 'Vannak Lim',
    email: 'vannak@example.kh',
    phone: '011 999 888',
    country: 'KH',
    totalSpent: 85,
    lastOrderDate: '2024-03-18',
    favoriteItem: 'Angkor Burger',
    points: 30
  }
];

// Fix: Exporting SALES_DATA which is missing
export const SALES_DATA: SalesData[] = [
  { name: 'Mon', coffee: 450, mart: 210, total: 660 },
  { name: 'Tue', coffee: 520, mart: 240, total: 760 },
  { name: 'Wed', coffee: 480, mart: 310, total: 790 },
  { name: 'Thu', coffee: 610, mart: 380, total: 990 },
  { name: 'Fri', coffee: 580, mart: 420, total: 1000 },
  { name: 'Sat', coffee: 720, mart: 510, total: 1230 },
  { name: 'Sun', coffee: 680, mart: 490, total: 1170 },
];

// Fix: Exporting MOCK_EXPENSES which is missing
export const MOCK_EXPENSES: DbExpense[] = [
  { id: 'exp1', name: 'Coffee Beans Restock', amount: 350, date: '2024-03-15', category: 'other' },
  { id: 'exp2', name: 'Monthly Rent - BKK1', amount: 1200, date: '2024-03-01', category: 'rent' },
  { id: 'exp3', name: 'Staff Salary - March', amount: 2800, date: '2024-03-25', category: 'salary' },
  { id: 'exp4', name: 'Internet Subscription', amount: 45, date: '2024-03-05', category: 'utilities' },
];
