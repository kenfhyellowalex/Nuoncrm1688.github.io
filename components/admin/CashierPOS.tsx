import React, { useState, useEffect } from 'react';
import { 
  Coffee, ShoppingBasket, Utensils, Search, 
  Trash2, Plus, Minus, CreditCard, Banknote, QrCode, 
  Pause, RotateCcw, CheckCircle, Package, User, 
  Smartphone, Monitor, ChevronRight, Printer, X, Loader, ShieldCheck, AlertCircle, ShoppingCart, Star, Trophy, Phone, Bell
} from 'lucide-react';
import { Product, ProductType, Customer, DbOrder } from '../../types';
import { api } from '../../services/api';

const CashierPOS: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<ProductType>(ProductType.COFFEE);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Incoming Orders
  const [incomingOrders, setIncomingOrders] = useState<DbOrder[]>([]);
  const [showIncoming, setShowIncoming] = useState(false);

  // Payment & Animation State
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrState, setQrState] = useState<'loading' | 'waiting' | 'verifying' | 'success'>('loading');
  const [earnedPoints, setEarnedPoints] = useState(0);

  // Loyalty State
  const [customerPhone, setCustomerPhone] = useState('');
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  const [usePoints, setUsePoints] = useState(false);

  const fetchOnlineOrders = async () => {
    const res = await api.orders.list();
    if (res.status === 'success' && res.data) {
      // Filter for online orders that are pending
      const onlinePending = res.data.filter(o => o.source === 'online' && o.status === 'pending');
      setIncomingOrders(onlinePending);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const res = await api.products.list(activeSegment);
      if (res.status === 'success' && res.data) {
        const withStock = res.data.map(p => ({
          ...p,
          stock: p.stock ?? Math.floor(Math.random() * 20) + 1
        }));
        setProducts(withStock);
      }
      setLoading(false);
    };
    fetchProducts();
    
    // Poll for online orders
    fetchOnlineOrders();
    const interval = setInterval(fetchOnlineOrders, 10000);
    return () => clearInterval(interval);
  }, [activeSegment]);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.subCategory).filter(Boolean)))];
  
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCategory === 'All' || p.subCategory === activeCategory;
    return matchesSearch && matchesCat;
  });

  const lookupCustomer = async () => {
    if (!customerPhone) return;
    setIsSearchingCustomer(true);
    const res = await api.customers.findByPhone(customerPhone);
    if (res.status === 'success' && res.data) {
      setActiveCustomer(res.data);
    } else {
      setActiveCustomer(null);
      alert("Customer not found.");
    }
    setIsSearchingCustomer(false);
  };

  const addToCart = (product: Product) => {
    if ((product.stock || 0) <= 0) {
      alert(`OUT OF STOCK: ${product.name}`);
      return;
    }
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx > -1) {
        const newCart = [...prev];
        newCart[idx].quantity += 1;
        return newCart;
      }
      return [...prev, { product, quantity: 1 }];
    });
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: (p.stock || 0) - 1 } : p));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const item = prev.find(i => i.product.id === id);
      if (delta > 0) {
        const masterProd = products.find(p => p.id === id);
        if ((masterProd?.stock || 0) <= 0) {
           alert("No more stock available!");
           return prev;
        }
        setProducts(pList => pList.map(p => p.id === id ? { ...p, stock: (p.stock || 0) - 1 } : p));
      } else {
        setProducts(pList => pList.map(p => p.id === id ? { ...p, stock: (p.stock || 0) + 1 } : p));
      }
      return prev.map(item => {
        if (item.product.id === id) {
          return { ...item, quantity: Math.max(0, item.quantity + delta) };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discount = usePoints ? 5.00 : 0;
  const tax = Math.max(0, subtotal - discount) * 0.1;
  const total = Math.max(0, subtotal - discount + tax);

  const processFinish = async (method: string) => {
    if (cart.length === 0) return;
    setPaymentComplete(true);
    setIsPrinting(true);
    
    // Create actual order record with loyalty data (POS Source)
    const res = await api.orders.create({
      customerPhone: activeCustomer?.phone || customerPhone,
      totalAmount: total,
      redeemedPoints: usePoints ? 100 : 0,
      paymentMethod: method,
      source: 'pos',
      items: cart.map(i => ({ productId: i.product.id, quantity: i.quantity }))
    });

    if (res.status === 'success') {
      setEarnedPoints(res.earned_points);
    }
    
    setTimeout(() => {
      setIsPrinting(false);
      setTimeout(() => {
        setPaymentComplete(false);
        setCart([]);
        setCustomerPhone('');
        setActiveCustomer(null);
        setUsePoints(false);
      }, 3000);
    }, 2000);
  };

  const acceptOnlineOrder = async (order: DbOrder) => {
    await api.orders.updateStatus(order.id, 'preparing');
    // Force refresh
    fetchOnlineOrders();
  };

  const handleQRClick = () => {
    if (cart.length === 0) return;
    setQrState('loading');
    setShowQRModal(true);
    setTimeout(() => setQrState('waiting'), 1200);
  };

  const handleSimulatePayment = () => {
    setQrState('verifying');
    setTimeout(() => {
      setQrState('success');
      setTimeout(() => {
        setShowQRModal(false);
        processFinish('QR PAY');
      }, 1000);
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-gray-100 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white animate-fade-in relative">
      
      {/* LEFT: Menu Selection */}
      <div className="flex-grow flex flex-col min-w-0 bg-gray-50 border-r border-gray-200">
        
        {/* Top Bar */}
        <div className="bg-brand-blue p-6 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-yellow rounded-2xl flex items-center justify-center text-brand-blue font-black shadow-lg">N</div>
            <h1 className="text-xl font-heading font-black uppercase italic tracking-tighter">Cashier Terminal</h1>
          </div>
          <div className="flex gap-3 bg-black/20 p-1.5 rounded-2xl">
            {[ProductType.COFFEE, ProductType.RESTAURANT, ProductType.MART].map(seg => (
               <button 
                key={seg}
                onClick={() => setActiveSegment(seg)}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${activeSegment === seg ? 'bg-white text-brand-blue shadow-lg' : 'hover:bg-white/10'}`}
              >
                {seg === ProductType.COFFEE ? <Coffee size={14} /> : seg === ProductType.RESTAURANT ? <Utensils size={14} /> : <ShoppingBasket size={14} />}
                {seg === 'minimart' ? 'Mini Mart' : seg}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar & Search */}
        <div className="p-6 flex gap-4 shrink-0 justify-between">
          <div className="relative flex-grow max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <input 
              type="text"
              placeholder="Quick product lookup..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white border-2 border-gray-200 rounded-[2rem] text-xl font-medium focus:border-brand-blue outline-none transition-all shadow-sm"
            />
          </div>
          
          <button 
            onClick={() => setShowIncoming(!showIncoming)}
            className={`relative px-6 py-4 rounded-[2rem] font-bold flex items-center gap-3 transition-all ${incomingOrders.length > 0 ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200' : 'bg-white text-gray-500 border-2 border-gray-200'}`}
          >
             <Bell size={24} fill={incomingOrders.length > 0 ? "currentColor" : "none"} />
             <span>Web Orders</span>
             {incomingOrders.length > 0 && <span className="bg-white text-red-500 px-2 py-0.5 rounded-full text-xs font-black">{incomingOrders.length}</span>}
          </button>
        </div>

        <div className="flex flex-grow overflow-hidden px-6 pb-6 gap-6 relative">
          
          {/* Menu Categories */}
          <div className="w-48 shrink-0 flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat || 'All')}
                className={`w-full text-left p-4 rounded-2xl text-sm font-black uppercase tracking-tighter transition-all ${
                  activeCategory === cat ? 'bg-brand-blue text-white shadow-xl translate-x-2' : 'bg-white text-gray-500 hover:bg-gray-200'
                }`}
              >
                {cat || 'Uncategorized'}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="flex-grow overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => <div key={i} className="bg-gray-200 aspect-square rounded-3xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
                {filteredProducts.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => addToCart(p)}
                    className="aspect-square relative flex flex-col bg-white rounded-[2rem] shadow-sm border-4 border-transparent hover:border-brand-yellow hover:scale-[1.02] active:scale-95 transition-all text-left overflow-hidden group"
                  >
                    <div className="absolute inset-0">
                      <img src={p.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={p.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    </div>
                    <div className={`absolute top-4 right-4 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shadow-sm ${ (p.stock || 0) <= 0 ? 'bg-red-500 text-white' : 'bg-white/90 text-brand-blue' }`}>
                       { (p.stock || 0) <= 0 ? 'Out of Stock' : `Stock: ${p.stock}` }
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                       <p className="text-sm font-black text-white leading-tight line-clamp-2 h-10 mb-1">{p.name}</p>
                       <p className="text-xl font-black text-brand-yellow">${p.price.toFixed(2)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Incoming Orders Panel Overlay */}
          {showIncoming && (
             <div className="absolute top-0 right-0 bottom-6 w-96 bg-white shadow-2xl rounded-3xl z-20 border-2 border-gray-100 flex flex-col overflow-hidden animate-fade-in-right">
                <div className="p-6 bg-red-50 border-b border-red-100 flex justify-between items-center">
                   <h3 className="font-black text-red-600 uppercase tracking-widest flex items-center gap-2"><Bell size={18} fill="currentColor" /> Incoming Online</h3>
                   <button onClick={() => setShowIncoming(false)}><X size={20} className="text-gray-400" /></button>
                </div>
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                   {incomingOrders.length === 0 ? (
                      <div className="text-center py-10 opacity-50">
                         <p>No pending online orders.</p>
                      </div>
                   ) : (
                      incomingOrders.map(order => (
                         <div key={order.id} className="bg-white border-2 border-gray-100 rounded-2xl p-4 shadow-sm hover:border-brand-blue transition-colors">
                            <div className="flex justify-between items-start mb-2">
                               <span className="font-black text-brand-blue text-lg">{order.orderNumber}</span>
                               <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded capitalize">{order.orderType}</span>
                            </div>
                            <p className="text-sm font-bold text-gray-800 mb-1">{order.customerName}</p>
                            <p className="text-xs text-gray-500 mb-4">{order.items?.length} items • ${order.totalAmount.toFixed(2)}</p>
                            <button 
                              onClick={() => acceptOnlineOrder(order)}
                              className="w-full py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-md"
                            >
                               ACCEPT & SEND TO KITCHEN
                            </button>
                         </div>
                      ))
                   )}
                </div>
             </div>
          )}
        </div>
      </div>

      {/* RIGHT: Cart & Checkout Panel */}
      <div className="w-[450px] shrink-0 bg-white flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.05)] relative">
        <div className="p-8 border-b border-gray-100 space-y-4">
           <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Current Order</h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-1">
                  <User size={10} /> Counter Staff-01
                </p>
              </div>
              <button onClick={() => {
                cart.forEach(item => setProducts(pList => pList.map(p => p.id === item.product.id ? { ...p, stock: (p.stock || 0) + item.quantity } : p)));
                setCart([]);
                setUsePoints(false);
              }} className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all">
                <RotateCcw size={20} />
              </button>
           </div>

           {/* Customer Loyalty Input */}
           <div className={`p-4 rounded-2xl border-2 transition-all ${activeCustomer ? 'bg-blue-50 border-brand-blue' : 'bg-gray-50 border-gray-100'}`}>
              {!activeCustomer ? (
                <div className="flex gap-2">
                   <div className="relative flex-grow">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input 
                        type="text"
                        placeholder="Customer Phone..."
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-white rounded-xl text-xs font-bold border-none outline-none focus:ring-2 focus:ring-brand-blue"
                      />
                   </div>
                   <button 
                    onClick={lookupCustomer}
                    disabled={isSearchingCustomer || !customerPhone}
                    className="p-2 bg-brand-blue text-white rounded-xl hover:bg-blue-800 disabled:opacity-50"
                   >
                     {isSearchingCustomer ? <Loader className="animate-spin" size={16} /> : <Search size={16} />}
                   </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center text-white">
                         <Trophy size={20} />
                      </div>
                      <div>
                         <p className="text-xs font-black text-gray-900 leading-none">{activeCustomer.name}</p>
                         <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Balance: {activeCustomer.points || 0} pts</p>
                      </div>
                   </div>
                   <button onClick={() => { setActiveCustomer(null); setUsePoints(false); }} className="p-1 hover:bg-red-100 text-red-400 rounded-lg"><X size={16} /></button>
                </div>
              )}
           </div>

           {/* Redemption Banner */}
           {activeCustomer && (activeCustomer.points || 0) >= 100 && (
             <button 
              onClick={() => setUsePoints(!usePoints)}
              className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all border-2 ${usePoints ? 'bg-green-600 border-green-600 text-white shadow-lg' : 'bg-green-50 border-green-100 text-green-700'}`}
             >
                <div className="flex items-center gap-3">
                   <Star size={20} className={usePoints ? 'text-brand-yellow fill-brand-yellow' : 'text-green-600'} />
                   <div className="text-left leading-none">
                      <p className="text-[10px] font-black uppercase tracking-widest">Loyalty Reward</p>
                      <p className="text-sm font-black mt-1">Redeem 100 pts ($5.00 Off)</p>
                   </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${usePoints ? 'bg-white border-white text-green-600' : 'border-green-200'}`}>
                   {usePoints && <CheckCircle size={16} fill="currentColor" className="text-white" />}
                </div>
             </button>
           )}
        </div>

        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
               <ShoppingBasket size={80} className="mb-4" />
               <p className="text-xl font-black uppercase italic">Empty Terminal</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-center animate-fade-in-up bg-gray-50 p-4 rounded-3xl group">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-sm">
                  <img src={item.product.image} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-sm font-black text-gray-900 truncate uppercase leading-tight">{item.product.name}</h4>
                  <p className="text-xs font-black text-brand-blue">${item.product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-2xl shadow-sm">
                  <button onClick={() => updateQuantity(item.product.id, -1)} className="text-gray-400 hover:text-red-500 transition-colors"><Minus size={16} /></button>
                  <span className="w-6 text-center font-black text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, 1)} className="text-gray-400 hover:text-brand-blue transition-colors"><Plus size={16} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Payment Summary */}
        <div className="p-8 bg-gray-900 text-white space-y-6">
          <div className="space-y-2">
             <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
               <span>Subtotal</span>
               <span>${subtotal.toFixed(2)}</span>
             </div>
             {usePoints && (
               <div className="flex justify-between text-xs font-black text-green-400 uppercase tracking-widest animate-pulse">
                 <span>Points Applied</span>
                 <span>-$5.00</span>
               </div>
             )}
             <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
               <span>Vat (10%)</span>
               <span>${tax.toFixed(2)}</span>
             </div>
             <div className="flex justify-between items-end pt-4 border-t border-white/10">
               <span className="text-lg font-black uppercase italic text-brand-yellow">Grand Total</span>
               <span className="text-4xl font-heading font-black tracking-tighter">${total.toFixed(2)}</span>
             </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => processFinish('CASH')} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white text-gray-900 hover:bg-brand-yellow transition-all">
              <Banknote size={20} />
              <span className="text-[9px] font-black uppercase tracking-tight mt-1">Cash</span>
            </button>
            <button onClick={handleQRClick} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white text-gray-900 hover:bg-brand-yellow transition-all">
              <QrCode size={20} />
              <span className="text-[9px] font-black uppercase tracking-tight mt-1">Scan QR</span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white text-gray-900 hover:bg-brand-yellow transition-all">
              <CreditCard size={20} />
              <span className="text-[9px] font-black uppercase tracking-tight mt-1">Card</span>
            </button>
          </div>

          <button 
            onClick={() => processFinish('CASH')}
            disabled={cart.length === 0}
            className="w-full py-6 bg-green-500 hover:bg-green-400 active:scale-95 transition-all text-white font-black text-2xl uppercase tracking-tighter italic rounded-[2rem] shadow-[0_20px_50px_rgba(34,197,94,0.3)] flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {paymentComplete ? (
              <>
                <CheckCircle size={32} />
                PAID ✓
              </>
            ) : (
              <>
                PROCESS PAY
                <ChevronRight size={32} />
              </>
            )}
          </button>
        </div>

        {/* QR MODAL */}
        {showQRModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
             <div className="bg-white rounded-[3rem] w-full max-w-sm overflow-hidden animate-fade-in-up shadow-2xl relative">
                <button onClick={() => setShowQRModal(false)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><X size={20} /></button>
                <div className="p-10 text-center">
                   <div className="flex items-center justify-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-brand-blue rounded-xl flex items-center justify-center text-white"><QrCode size={24} /></div>
                      <div className="text-left">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Regional Hub Gateway</p>
                         <p className="text-lg font-black text-brand-blue uppercase tracking-tighter italic">Bank Dynamic QR</p>
                      </div>
                   </div>
                   <div className="relative aspect-square w-full bg-white border-8 border-gray-50 rounded-[2.5rem] shadow-inner mb-8 flex items-center justify-center overflow-hidden">
                      {qrState === 'loading' ? (
                         <div className="flex flex-col items-center gap-4">
                            <Loader size={48} className="animate-spin text-brand-blue" />
                            <p className="text-[10px] font-black uppercase text-gray-400">Requesting Token...</p>
                         </div>
                      ) : (
                         <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=NOUN-POS-TX-${Date.now()}&color=0047AB&bgcolor=ffffff`} className="w-56 h-56" alt="Payment QR" />
                      )}
                   </div>
                   <div className="bg-brand-light p-6 rounded-2xl mb-8">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payable Amount</p>
                      <h4 className="text-4xl font-heading font-black text-brand-blue">${total.toFixed(2)}</h4>
                   </div>
                   <button onClick={handleSimulatePayment} className="w-full py-4 bg-brand-blue hover:bg-blue-800 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 group">
                      <ShieldCheck size={18} className="group-hover:rotate-12 transition-transform" />
                      VERIFY PAYMENT
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* Payment Success Overlay */}
        {paymentComplete && (
          <div className="absolute inset-0 bg-green-500 z-50 flex flex-col items-center justify-center text-white animate-fade-in text-center p-10">
             <div className="relative mb-6">
                <CheckCircle size={100} className="animate-bounce" />
                <Star className="absolute -top-4 -right-4 text-brand-yellow fill-brand-yellow animate-spin-slow" size={40} />
             </div>
             <h3 className="text-4xl font-heading font-black uppercase italic tracking-tighter">
                {isPrinting ? 'Printing Receipt...' : 'Payment Successful'}
             </h3>
             
             {!isPrinting && (
                <div className="mt-8 bg-black/20 p-8 rounded-[2.5rem] border border-white/10 w-full animate-fade-in-up">
                   <p className="text-[10px] font-black uppercase tracking-widest text-green-100 mb-2">Loyalty Points Balance</p>
                   <div className="flex justify-center items-end gap-2 mb-4">
                      <span className="text-5xl font-black text-brand-yellow">+{earnedPoints}</span>
                      <span className="text-xs font-black uppercase mb-1">PTS EARNED</span>
                   </div>
                   <div className="h-px bg-white/10 w-full mb-4"></div>
                   <p className="text-sm font-black text-white">Updated Balance: { (activeCustomer?.points || 0) + earnedPoints - (usePoints ? 100 : 0) } pts</p>
                </div>
             )}

             <div className="mt-8 flex flex-col items-center gap-4">
                {isPrinting ? <Printer size={48} className="animate-pulse" /> : <div className="p-3 bg-white/20 rounded-2xl"><Smartphone size={32} /></div>}
                <p className="font-black uppercase tracking-widest text-green-100 text-xs">{isPrinting ? 'ESC/POS Signal Sent' : 'Terminal Idle'}</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CashierPOS;