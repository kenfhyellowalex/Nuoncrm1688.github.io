
import { Product, ProductType, Customer, SalesData, CountryCode, SocialLink, DbExpense } from './types';

export const APP_NAME = "NOUN CRM";

// Database-driven Social Links Configuration
export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: '1',
    platform: 'telegram',
    linkUrl: 'https://t.me/nouncrm168',
    label: 'Telegram'
  },
  {
    id: '2',
    platform: 'line',
    linkUrl: 'https://line.me/R/ti/p/@444ynqdk',
    label: 'Line OA'
  },
  {
    id: '3',
    platform: 'whatsapp',
    linkUrl: 'https://wa.me/qr/n6izdnjtvieyo1',
    label: 'WhatsApp'
  },
  {
    id: '4',
    platform: 'facebook',
    linkUrl: 'https://web.facebook.com/Coffee.Noun',
    label: 'Facebook'
  }
];

// Map of keywords to high-quality Unsplash Image URLs to ensure reliability and aesthetics
const IMAGE_MAP: Record<string, string> = {
  // Hot Coffee
  "Hot Espresso": "https://images.unsplash.com/photo-1610889556283-1f1997327704?auto=format&fit=crop&w=600&q=80",
  "Hot Americano": "https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&w=600&q=80",
  "Hot Cappuccino": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80",
  "Hot Latte": "https://images.unsplash.com/photo-1570968992077-5c8c57e0b146?auto=format&fit=crop&w=600&q=80",
  "Hot Mocha": "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80",
  "Hot Flat White": "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80",

  // Iced Coffee
  "Iced Americano": "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80",
  "Iced Latte": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80",
  "Iced Mocha": "https://images.unsplash.com/photo-1499961024600-ad094dbc305f?auto=format&fit=crop&w=600&q=80",
  "Iced Caramel Macchiato": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
  "Iced Vanilla Latte": "https://images.unsplash.com/photo-1553909489-cd47e390c603?auto=format&fit=crop&w=600&q=80",
  
  // Noun Coffee (Signatures)
  "Noun Signature": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
  "Coconut Coffee": "https://images.unsplash.com/photo-1595928607633-364e23042823?auto=format&fit=crop&w=600&q=80",
  "Avocado Coffee": "https://images.unsplash.com/photo-1626078298441-53227a920336?auto=format&fit=crop&w=600&q=80",
  "Honey Lemon Coffee": "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=80",
  "Noun Special Blend": "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=600&q=80",

  // Mart - Beverages
  "Cola": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
  "Water": "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=600&q=80",
  "Energy": "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=600&q=80",
  "Tea": "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=600&q=80",
  "Fanta": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=600&q=80",
  "Canned Coffee": "https://images.unsplash.com/photo-1646753522408-077ef9839300?auto=format&fit=crop&w=600&q=80",

  // Mart - Snacks
  "Chips": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80",
  "Chocolate": "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80",
  "Nuts": "https://images.unsplash.com/photo-1536591375315-196000ea3678?auto=format&fit=crop&w=600&q=80",
  "Protein": "https://images.unsplash.com/photo-1622484214024-81f151c4c129?auto=format&fit=crop&w=600&q=80",
  "Cookie": "https://images.unsplash.com/photo-1499636138143-bd630f5cf446?auto=format&fit=crop&w=600&q=80",
  "Cracker": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80",

  // Mart - Dairy
  "Milk": "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80",
  "Yogurt": "https://images.unsplash.com/photo-1564149504817-d1378368526f?auto=format&fit=crop&w=600&q=80",
  "Cheese": "https://images.unsplash.com/photo-1618167297223-8b78f0d86921?auto=format&fit=crop&w=600&q=80",
  "Egg": "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80",
  "Butter": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80",

  // Mart - Bakery
  "Bread": "https://images.unsplash.com/photo-1598373182133-52452f7691f3?auto=format&fit=crop&w=600&q=80",
  "Bagel": "https://images.unsplash.com/photo-1639096120069-b1087822c25c?auto=format&fit=crop&w=600&q=80",
  "Muffin": "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=600&q=80",
  "Croissant": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
  "Donut": "https://images.unsplash.com/photo-1551024601-5637ade98889?auto=format&fit=crop&w=600&q=80",
  "Baguette": "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=600&q=80",

  // Mart - Prepared
  "Sandwich": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
  "Wrap": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80",
  "Hot Dog": "https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&w=600&q=80",
  "Sushi": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80",
  "Salad": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",

  // Mart - Pantry
  "Rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
  "Pasta": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80",
  "Soup": "https://images.unsplash.com/photo-1547592166-23acbe3a624b?auto=format&fit=crop&w=600&q=80",
  "Flour": "https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&w=600&q=80",
  "Sugar": "https://images.unsplash.com/photo-1615486511484-92e172cc416d?auto=format&fit=crop&w=600&q=80",
  "Oil": "https://images.unsplash.com/photo-1474979266404-7cadd259c308?auto=format&fit=crop&w=600&q=80",

  // Mart - Frozen
  "Ice Cream": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80",
  "Pizza": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
  "Peas": "https://images.unsplash.com/photo-1592394533824-9440e5d68530?auto=format&fit=crop&w=600&q=80",
  "Dumpling": "https://images.unsplash.com/photo-1541696490-8744a570242e?auto=format&fit=crop&w=600&q=80",
  "Nugget": "https://images.unsplash.com/photo-1569691105751-88df003de7a4?auto=format&fit=crop&w=600&q=80",

  // Mart - Produce
  "Banana": "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=600&q=80",
  "Apple": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
  "Onion": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80",
  "Potato": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
  "Tomato": "https://images.unsplash.com/photo-1546470427-227c73699212?auto=format&fit=crop&w=600&q=80",
  "Cucumber": "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=600&q=80",

  // Mart - Personal
  "Shampoo": "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=600&q=80",
  "Toothpaste": "https://images.unsplash.com/photo-1559591937-e1dc2c9769da?auto=format&fit=crop&w=600&q=80",
  "Pill": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
  "Soap": "https://images.unsplash.com/photo-1600857062241-98e5dba9959e?auto=format&fit=crop&w=600&q=80",

  // Mart - Household
  "Toilet Paper": "https://images.unsplash.com/photo-1584556812952-54161f6724e1?auto=format&fit=crop&w=600&q=80",
  "Towel": "https://images.unsplash.com/photo-1616616455956-652a92c0022d?auto=format&fit=crop&w=600&q=80",
  "Detergent": "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&q=80",
  "Bag": "https://images.unsplash.com/photo-1597348989645-46b190ce4918?auto=format&fit=crop&w=600&q=80",

  // Mart - Alcohol & Misc
  "Beer": "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=600&q=80",
  "Wine": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80",
  "Cigarette": "https://images.unsplash.com/photo-1561726715-c26643260c6d?auto=format&fit=crop&w=600&q=80",
  "Vape": "https://images.unsplash.com/photo-1563276686-22441c099c27?auto=format&fit=crop&w=600&q=80",
  "Battery": "https://images.unsplash.com/photo-1619672836253-1250280eb45a?auto=format&fit=crop&w=600&q=80",
  "Notebook": "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80",
  "Lottery": "https://images.unsplash.com/photo-1594950290913-9118c7c91f04?auto=format&fit=crop&w=600&q=80",

  // Restaurant
  "Pad Thai": "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=600&q=80",
  "Tom Yum": "https://images.unsplash.com/photo-1548943487-a2e4e43b485c?auto=format&fit=crop&w=600&q=80",
  "Curry": "https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&w=600&q=80",
  "Fried Rice": "https://images.unsplash.com/photo-1603133872878-684f208fb74b?auto=format&fit=crop&w=600&q=80",
  "Spring Roll": "https://images.unsplash.com/photo-1544510808-91bcbee1df55?auto=format&fit=crop&w=600&q=80",
  "Lok Lak": "https://images.unsplash.com/photo-1514516872020-53656c5bf7bd?auto=format&fit=crop&w=600&q=80",
  "Amok": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80",
  "Satay": "https://images.unsplash.com/photo-1529563021893-cc83c914d5d3?auto=format&fit=crop&w=600&q=80",
  "Pho": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=600&q=80",
  "Banh Mi": "https://images.unsplash.com/photo-1600454309261-3dc9b7594592?auto=format&fit=crop&w=600&q=80",
  "Chicken Rice": "https://images.unsplash.com/photo-1606756790138-261d2b21cd71?auto=format&fit=crop&w=600&q=80",
  "Laksa": "https://images.unsplash.com/photo-1558222043-a62799c77774?auto=format&fit=crop&w=600&q=80",
  "Dim Sum": "https://images.unsplash.com/photo-1496116218417-1a781b1c423c?auto=format&fit=crop&w=600&q=80",
  "Salmon": "https://images.unsplash.com/photo-1519708227418-c8fd9a3a2720?auto=format&fit=crop&w=600&q=80",
  "Steak": "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80",
  "Carbonara": "https://images.unsplash.com/photo-1612874742237-982867143804?auto=format&fit=crop&w=600&q=80",
  "Burger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
  "Fish & Chips": "https://images.unsplash.com/photo-1579208575657-c595a05383b7?auto=format&fit=crop&w=600&q=80",
  "Tiramisu": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80",
  "Cheesecake": "https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=600&q=80",
  "Papaya Salad": "https://images.unsplash.com/photo-1626804475297-411f7a0dc048?auto=format&fit=crop&w=600&q=80",
  "Gado-Gado": "https://images.unsplash.com/photo-1626804475314-22521f185c78?auto=format&fit=crop&w=600&q=80",
  "Summer Rolls": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
  "Morning Glory": "https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&w=600&q=80", // using curry/greens fallback
  "Rendang": "https://images.unsplash.com/photo-1609187786419-f06488d07062?auto=format&fit=crop&w=600&q=80",
  "Nasi Goreng": "https://images.unsplash.com/photo-1603133872878-684f208fb74b?auto=format&fit=crop&w=600&q=80",
};

// Fallbacks for when a specific image isn't found
const DEFAULT_IMAGES = {
  coffee: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
  mart: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
  food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"
};

// Helper to get image based on product name/keywords
const getImageUrl = (keyword: string, type: 'food' | 'mart' | 'coffee') => {
  // Check for exact matches first (partial string check)
  const keys = Object.keys(IMAGE_MAP);
  const match = keys.find(key => keyword.toLowerCase().includes(key.toLowerCase()));
  
  if (match) {
    return IMAGE_MAP[match];
  }

  // Fallback based on category
  if (type === 'coffee') return DEFAULT_IMAGES.coffee;
  if (type === 'mart') return DEFAULT_IMAGES.mart;
  return DEFAULT_IMAGES.food;
};

const generateRestaurantItems = (): Product[] => {
  const items: Product[] = [];
  const baseDishes = [
    "Pad Thai", "Tom Yum Goong", "Green Curry", "Fried Rice", "Spring Rolls",
    "Beef Lok Lak", "Fish Amok", "Khmer Curry", "Nasi Goreng", "Satay",
    "Beef Rendang", "Gado-Gado", "Pho", "Banh Mi", "Summer Rolls",
    "Chicken Rice", "Laksa", "Char Kway Teow", "Roti Canai", "Dim Sum",
    "Grilled Salmon", "Steak Frites", "Carbonara", "Burger", "Caesar Salad",
    "Mushroom Risotto", "Duck Confit", "Lamb Chops", "Seafood Paella", "Lobster Bisque",
    "Truffle Pasta", "Wagyu Beef", "Pork Belly", "Roasted Chicken", "Fish & Chips",
    "Beef Wellington", "Tuna Tartare", "Oysters", "Clam Chowder", "Shrimp Scampi",
    "Mango Sticky Rice", "Crème Brûlée", "Tiramisu", "Cheesecake", "Chocolate Lava",
    "Spicy Basil Chicken", "Papaya Salad", "Massaman Curry", "Panang Curry", "Morning Glory"
  ];
  
  for (let i = 0; i < 100; i++) {
    const baseName = baseDishes[i % baseDishes.length];
    const variation = Math.floor(i / baseDishes.length) + 1;
    const name = variation > 1 ? `${baseName} (Set ${variation})` : baseName;
    const price = 8.00 + (i % 25) + parseFloat(Math.random().toFixed(2));
    
    // Use baseName for image mapping
    const image = getImageUrl(baseName, 'food');

    items.push({
      id: `r${i + 1}`,
      name: name,
      price: price,
      costPrice: Number((price * 0.4).toFixed(2)), // Approx 40% food cost
      category: ProductType.RESTAURANT,
      image: image,
      description: `Delicious chef-prepared ${baseName}. Fresh ingredients and authentic taste.`
    });
  }
  return items;
};

const generateMartItems = (): Product[] => {
  const items: Product[] = [];
  const categories = [
    { name: "Beverages", items: ["Coca Cola", "Mineral Water Bottle", "Red Bull Energy", "Iced Tea Bottle", "Orange Fanta", "Canned Coffee"] },
    { name: "Snacks", items: ["Lay's Potato Chips", "Chocolate Bar", "Mixed Nuts Pack", "Protein Bar", "Oreo Cookies", "Ritz Crackers"] },
    { name: "Dairy", items: ["Whole Milk Carton", "Yogurt Cup", "Cheddar Cheese Block", "Fresh Eggs Carton", "Butter Stick", "Cream Cheese"] },
    { name: "Bakery", items: ["Sliced Bread Loaf", "Bagel", "Blueberry Muffin", "Croissant", "Glazed Donut", "French Baguette"] },
    { name: "Prepared", items: ["Club Sandwich", "Chicken Wrap", "Hot Dog", "Sushi Roll Pack", "Pasta Salad Bowl"] },
    { name: "Pantry", items: ["Jasmine Rice Bag", "Pasta Box", "Tomato Soup Can", "Flour Bag", "Sugar Bag", "Cooking Oil Bottle"] },
    { name: "Frozen", items: ["Vanilla Ice Cream Tub", "Frozen Pizza Box", "Frozen Peas Bag", "Frozen Dumplings", "Chicken Nuggets Bag"] },
    { name: "Produce", items: ["Fresh Bananas", "Red Apples", "Red Onions", "Potatoes", "Fresh Tomatoes", "Cucumber"] },
    { name: "Personal Care", items: ["Shampoo Bottle", "Toothpaste Box", "Pain Reliever Pills", "Band-Aids Box", "Hand Soap Bottle"] },
    { name: "Household", items: ["Toilet Paper Roll", "Paper Towels", "Dish Soap Bottle", "Trash Bags Box", "Laundry Detergent"] },
    { name: "Tobacco & Alcohol", items: ["Beer Can", "Red Wine Bottle", "Cigarettes Pack", "Vape Pen", "Lighter"] },
    { name: "Auto & Misc", items: ["Motor Oil Bottle", "Windshield Fluid", "Phone Charger", "AA Batteries Pack", "Notebook"] },
    { name: "Services", items: ["Mobile Top-up Card", "Scratch Lottery Ticket"] }
  ];

  let idCounter = 1;
  
  categories.forEach(cat => {
    cat.items.forEach((itemName) => {
      const price = 1.00 + (Math.random() * 10);
      items.push({
        id: `m${idCounter++}`,
        name: itemName,
        price: price,
        costPrice: Number((price * 0.6).toFixed(2)), // Higher Cost for Mart items (60%)
        category: ProductType.MART,
        subCategory: cat.name,
        image: getImageUrl(itemName, 'mart'),
        stock: Math.floor(Math.random() * 50) + 5,
        description: `${cat.name} essential. High quality ${itemName}.`
      });
    });
  });

  return items;
};

const generateCoffeeItems = (): Product[] => {
  const items: Product[] = [];
  const categories = [
    { name: "HOT COFFEE", items: ["Hot Espresso", "Hot Americano", "Hot Cappuccino", "Hot Latte", "Hot Mocha", "Hot Flat White"] },
    { name: "ICED COFFEE", items: ["Iced Americano", "Iced Latte", "Iced Mocha", "Iced Caramel Macchiato", "Iced Vanilla Latte"] },
    { name: "NOUN COFFEE", items: ["Noun Signature", "Coconut Coffee", "Avocado Coffee", "Honey Lemon Coffee", "Noun Special Blend"] }
  ];
  
  let idCounter = 1;
  categories.forEach(cat => {
    cat.items.forEach(itemName => {
      const price = 3.00 + Math.floor(Math.random() * 3);
      items.push({
        id: `c${idCounter++}`,
        name: itemName,
        price: price,
        costPrice: Number((price * 0.25).toFixed(2)), // Lower cost for coffee (25%)
        category: ProductType.COFFEE,
        subCategory: cat.name,
        image: getImageUrl(itemName, 'coffee'),
        description: `Premium ${itemName}, brewed to perfection.`
      });
    });
  });
  return items;
};

export const MOCK_PRODUCTS: Product[] = [
  // Coffee Shop Items
  ...generateCoffeeItems(),
  
  // Generate Mart Items
  ...generateMartItems(),
  
  // Generate Restaurant Items
  ...generateRestaurantItems()
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Sokha Chan', email: 'sokha@example.com', phone: '+855 12 345 678', country: 'KH', totalSpent: 120.50, lastOrderDate: '2023-10-25', favoriteItem: 'Noun Signature' },
  { id: '2', name: 'Somchai Dee', email: 'somchai@example.com', phone: '+66 81 234 5678', country: 'TH', totalSpent: 85.00, lastOrderDate: '2023-10-24', favoriteItem: 'Iced Americano' },
  { id: '3', name: 'Budi Santoso', email: 'budi@example.com', phone: '+62 812 3456 7890', country: 'ID', totalSpent: 210.00, lastOrderDate: '2023-10-26', favoriteItem: 'Potato Chips' },
];

export const MOCK_EXPENSES: DbExpense[] = [
  { id: 'exp1', name: 'Monthly Rent', amount: 1200, date: '2023-10-01', category: 'rent', note: 'Shop space' },
  { id: 'exp2', name: 'Electricity Bill', amount: 350, date: '2023-10-05', category: 'utilities' },
  { id: 'exp3', name: 'Staff Salaries', amount: 2500, date: '2023-10-01', category: 'salary', note: '5 employees' },
  { id: 'exp4', name: 'Internet', amount: 45, date: '2023-10-02', category: 'utilities' },
  { id: 'exp5', name: 'Facebook Ads', amount: 150, date: '2023-10-10', category: 'marketing' },
  { id: 'exp6', name: 'Cleaning Supplies', amount: 85, date: '2023-10-12', category: 'other' },
];

export const SALES_DATA: SalesData[] = [
  { name: 'Mon', coffee: 400, mart: 240, total: 640 },
  { name: 'Tue', coffee: 300, mart: 139, total: 439 },
  { name: 'Wed', coffee: 200, mart: 980, total: 1180 },
  { name: 'Thu', coffee: 278, mart: 390, total: 668 },
  { name: 'Fri', coffee: 189, mart: 480, total: 669 },
  { name: 'Sat', coffee: 239, mart: 380, total: 619 },
  { name: 'Sun', coffee: 349, mart: 430, total: 779 },
];

export const COUNTRIES = [
  { code: CountryCode.US, name: 'English', flag: '🇺🇸', currency: '$' },
  { code: CountryCode.KH, name: 'Cambodia', flag: '🇰🇭', currency: '$' },
  { code: CountryCode.TH, name: 'Thailand', flag: '🇹🇭', currency: '฿' },
  { code: CountryCode.ID, name: 'Indonesia', flag: '🇮🇩', currency: 'Rp' },
];
