import React, { useState } from 'react';
import { CartItem, Translations, CountryCode } from '../types';
import { api } from '../services/api';
import { 
  ArrowLeft, CreditCard, Banknote, QrCode, User, Phone, 
  MapPin, ShoppingBag, CheckCircle, Loader, ShieldCheck,
  Truck, Clock, X, Smartphone, Lock
} from 'lucide-react';

interface CheckoutProps {
  cart: CartItem[];
  t: Translations;
  onNavigate: (page: string, params?: any) => void;
  currencySymbol: string;
  onOrderSuccess: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, t, onNavigate, currencySymbol, onOrderSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState<{number: string} | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qr' | 'card'>('cash');
  const [showQRModal, setShowQRModal] = useState(false);
  
  // Verification State
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [verificationLoading, setVerificationLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'KH' as CountryCode,
    orderType: 'pickup' as 'pickup' | 'delivery'
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = formData.orderType === 'delivery' ? 2.00 : 0.00;
  const total = subtotal + deliveryFee;

  const initiateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    // Trigger OTP Flow
    setShowVerifyModal(true);
  };

  const handleVerifyAndPlaceOrder = async () => {
    setVerificationLoading(true);
    // Simulate API verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setVerificationLoading(false);
    setShowVerifyModal(false);
    
    // Proceed to place actual order
    handlePlaceOrder();
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // 1. Create Order in DB
      const orderRes = await api.orders.create({
        customerId: '1',
        customerName: formData.name,
        totalAmount: total,
        status: 'pending',
        orderType: formData.orderType,
        source: 'online', // Mark as online order
        items: cart.map(item => ({
          id: `tmp-${Math.random()}`,
          orderId: '',
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          options: item.options
        }))
      });

      if (orderRes.status === 'success' && orderRes.order_number) {
        if (paymentMethod === 'qr') {
          // If QR, show the payment interface before confirming
          setShowQRModal(true);
          setOrderComplete({ number: orderRes.order_number });
        } else {
          // If Cash, just record the intent and finish
          await api.payments.create({
            orderId: parseInt(orderRes.order_number.replace('ORD-', '')),
            paymentMethod: paymentMethod,
            amount: total
          });
          setOrderComplete({ number: orderRes.order_number });
          onOrderSuccess();
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong with your order.");
    } finally {
      if (paymentMethod !== 'qr') setLoading(false);
    }
  };

  const confirmQRPayment = async () => {
    setLoading(true);
    // Simulate API storing the payment and marking order as paid
    if (orderComplete) {
       await api.payments.create({
          orderId: parseInt(orderComplete.number.replace('ORD-', '')),
          paymentMethod: 'qr',
          amount: total
        });
    }
    setLoading(false);
    setShowQRModal(false);
    onOrderSuccess();
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  if (orderComplete && !showQRModal) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center animate-fade-in-up">
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-8 border-4 border-white shadow-sm">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Order Sent to Shop!</h2>
        <p className="text-gray-600 mb-2">Thank you, {formData.name}. We've received your order.</p>
        <p className="text-lg font-bold text-brand-blue mb-8">Order Ref: {orderComplete.number}</p>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-10 text-left">
           <h4 className="font-bold text-gray-900 mb-2 border-b pb-2">Status: Pending Acceptance</h4>
           <ul className="space-y-3 text-sm text-gray-600">
             <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></div> Waiting for shop to accept your order.</li>
             <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></div> {formData.orderType === 'pickup' ? "Estimated pickup in 15-20 mins." : "Driver will be assigned shortly."}</li>
             <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></div> {paymentMethod === 'qr' ? 'Payment Verified ✓' : 'Please prepare cash.'}</li>
           </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => onNavigate('order-status', { orderNumber: orderComplete.number })}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-blue text-white font-bold rounded-full hover:bg-blue-800 transition-all shadow-lg min-w-[200px]"
          >
            <Clock size={20} />
            Track Order
          </button>
          <button 
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-brand-blue text-brand-blue font-bold rounded-full hover:bg-gray-50 transition-all min-w-[200px]"
          >
            <ShoppingBag size={20} />
            Order More
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <button 
        onClick={() => onNavigate('shop')}
        className="mb-6 flex items-center text-gray-600 hover:text-brand-blue font-medium transition-colors"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Menu
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Shipping & Payment */}
        <div className="lg:col-span-7">
          <form onSubmit={initiateOrder} className="space-y-8">
            
            {/* Customer Information */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <User size={18} className="text-brand-blue" />
                <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wider">Contact Information</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                  <input 
                    type="text" required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                    <input 
                      type="email" required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                    <input 
                      type="tel" required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue outline-none"
                      placeholder="+855 12 345 678"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Delivery/Pickup Selection */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <MapPin size={18} className="text-brand-blue" />
                <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wider">Order Type</h3>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                 <button
                   type="button"
                   onClick={() => setFormData({...formData, orderType: 'pickup'})}
                   className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${formData.orderType === 'pickup' ? 'border-brand-blue bg-blue-50' : 'border-gray-100 hover:bg-gray-50'}`}
                 >
                   <ShoppingBag size={24} className={formData.orderType === 'pickup' ? 'text-brand-blue' : 'text-gray-400'} />
                   <span className={`mt-2 font-bold ${formData.orderType === 'pickup' ? 'text-brand-blue' : 'text-gray-600'}`}>Store Pickup</span>
                   <span className="text-xs text-gray-400">Ready in 15 mins</span>
                 </button>
                 <button
                   type="button"
                   onClick={() => setFormData({...formData, orderType: 'delivery'})}
                   className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${formData.orderType === 'delivery' ? 'border-brand-blue bg-blue-50' : 'border-gray-100 hover:bg-gray-50'}`}
                 >
                   <Truck size={24} className={formData.orderType === 'delivery' ? 'text-brand-blue' : 'text-gray-400'} />
                   <span className={`mt-2 font-bold ${formData.orderType === 'delivery' ? 'text-brand-blue' : 'text-gray-600'}`}>Delivery</span>
                   <span className="text-xs text-gray-400">+ ${deliveryFee.toFixed(2)} Fee</span>
                 </button>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <CreditCard size={18} className="text-brand-blue" />
                <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wider">Payment Method</h3>
              </div>
              <div className="p-6 space-y-3">
                 <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'qr' ? 'border-brand-blue bg-blue-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <input type="radio" name="payment" className="hidden" onChange={() => setPaymentMethod('qr')} checked={paymentMethod === 'qr'} />
                    <QrCode className={`mr-4 ${paymentMethod === 'qr' ? 'text-brand-blue' : 'text-gray-400'}`} />
                    <div className="flex-grow">
                       <p className={`font-bold ${paymentMethod === 'qr' ? 'text-brand-blue' : 'text-gray-700'}`}>KHQR / Mobile Banking</p>
                       <p className="text-xs text-gray-500">Scan QR for instant secure payment</p>
                    </div>
                 </label>
                 <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-brand-blue bg-blue-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <input type="radio" name="payment" className="hidden" onChange={() => setPaymentMethod('cash')} checked={paymentMethod === 'cash'} />
                    <Banknote className={`mr-4 ${paymentMethod === 'cash' ? 'text-brand-blue' : 'text-gray-400'}`} />
                    <div className="flex-grow">
                       <p className={`font-bold ${paymentMethod === 'cash' ? 'text-brand-blue' : 'text-gray-700'}`}>Cash on Delivery/Pickup</p>
                       <p className="text-xs text-gray-500">Pay when you receive your order</p>
                    </div>
                 </label>
              </div>
            </section>

            <button 
              type="submit" 
              disabled={loading || cart.length === 0}
              className="w-full py-4 bg-brand-yellow hover:bg-yellow-400 text-brand-blue font-bold text-xl rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader className="animate-spin" /> : <ShieldCheck />}
              {loading ? "Processing..." : `Complete Order - ${currencySymbol}${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5">
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-24 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wider">Order Summary</h3>
              </div>
              <div className="p-6">
                 <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6 pr-2">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-grow">
                          <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{currencySymbol}{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                 </div>

                 <div className="space-y-2 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>{currencySymbol}{subtotal.toFixed(2)}</span>
                    </div>
                    {formData.orderType === 'delivery' && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Delivery Fee</span>
                        <span>{currencySymbol}{deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                      <span>Total</span>
                      <span className="text-brand-blue">{currencySymbol}{total.toFixed(2)}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
           <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden animate-fade-in-up shadow-2xl relative">
              <button onClick={() => setShowVerifyModal(false)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><X size={20} /></button>
              <div className="p-8 text-center">
                 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="text-brand-blue" size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Verify Phone Number</h3>
                 <p className="text-sm text-gray-500 mb-6">
                    To prevent fake orders, we sent a 4-digit code to <strong>{formData.phone}</strong>
                 </p>
                 
                 <div className="flex justify-center gap-3 mb-8">
                    {otpCode.map((digit, i) => (
                      <input 
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        className="w-12 h-14 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold focus:border-brand-blue focus:ring-0 outline-none transition-all"
                      />
                    ))}
                 </div>

                 <button 
                   onClick={handleVerifyAndPlaceOrder}
                   disabled={verificationLoading || otpCode.some(d => !d)}
                   className="w-full py-3 bg-brand-blue text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                 >
                   {verificationLoading ? <Loader className="animate-spin" size={18} /> : "Verify & Place Order"}
                 </button>
                 <p className="text-xs text-gray-400 mt-4 cursor-pointer hover:text-brand-blue">Resend Code</p>
              </div>
           </div>
        </div>
      )}

      {/* QR Payment Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
           <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden animate-fade-in-up shadow-2xl relative">
              <div className="bg-brand-blue p-6 text-center relative">
                 <button onClick={() => setShowQRModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white">
                    <X size={24} />
                 </button>
                 <div className="bg-white w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-3">
                    <Smartphone className="text-brand-blue" size={32} />
                 </div>
                 <h3 className="text-white font-bold text-xl uppercase tracking-wider">KHQR Payment</h3>
                 <p className="text-blue-200 text-xs">Scan the QR code with your bank app</p>
              </div>

              <div className="p-10 text-center">
                 <div className="relative inline-block p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-inner mb-6">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=NOUN-CRM-MOCK-PAYMENT" 
                      alt="Payment QR" 
                      className="w-48 h-48"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <div className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center p-1">
                          <CheckCircle className="text-brand-blue" size={24} />
                       </div>
                    </div>
                 </div>
                 
                 <div className="space-y-1 mb-8">
                    <p className="text-gray-400 text-xs uppercase font-bold tracking-widest">Total Amount</p>
                    <p className="text-3xl font-heading font-extrabold text-brand-blue">{currencySymbol}{total.toFixed(2)}</p>
                 </div>

                 <button 
                   onClick={confirmQRPayment}
                   disabled={loading}
                   className="w-full py-4 bg-brand-yellow hover:bg-yellow-400 text-brand-blue font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                 >
                   {loading ? <Loader className="animate-spin" /> : <ShieldCheck />}
                   {loading ? "Verifying..." : "I've Completed the Payment"}
                 </button>
                 
                 <p className="mt-4 text-[10px] text-gray-400 uppercase font-medium">Encrypted & Secure Transaction</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;