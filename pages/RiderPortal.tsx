import React, { useState } from 'react';
import { 
  MapPin, Phone, Package, CheckCircle, Navigation, 
  Menu, Bell, Power, ChevronRight, DollarSign, Bike, User 
} from 'lucide-react';
import Logo from '../components/Logo';

// Mock active job data
const MOCK_JOB = {
  id: '1002',
  shopName: 'Noun Coffee - Phnom Penh',
  shopAddress: 'St 2004, Borey Peng Huoth',
  customerName: 'Sokha Chan',
  customerAddress: 'Building 12, Street 315, Toul Kork',
  customerPhone: '012 345 678',
  items: [
    { name: 'Iced Latte', qty: 2 },
    { name: 'Croissant', qty: 1 }
  ],
  totalCod: 8.50,
  deliveryFee: 1.50
};

const RiderPortal: React.FC = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [hasJob, setHasJob] = useState(false);
  const [jobStep, setJobStep] = useState<0 | 1 | 2>(0); // 0: To Shop, 1: Picked Up, 2: Delivered

  // View logic
  if (!isOnline) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8 text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
           <Bike size={400} className="absolute -bottom-20 -right-20 text-white" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
           <div className="mb-10 scale-150"><Logo variant="white" /></div>
           <h1 className="text-2xl font-black uppercase tracking-widest mb-2">Rider Connect</h1>
           <p className="text-gray-400 text-sm mb-12 text-center">Noun Logistics Fleet V2.0</p>
           
           <button 
             onClick={() => setIsOnline(true)}
             className="w-full h-20 bg-green-500 hover:bg-green-400 active:scale-95 transition-all rounded-3xl flex items-center justify-center gap-4 shadow-[0_0_40px_rgba(34,197,94,0.3)]"
           >
              <Power size={32} />
              <span className="text-xl font-black uppercase tracking-tighter">Go Online</span>
           </button>
        </div>
      </div>
    );
  }

  // Active Job View
  if (hasJob) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
         {/* Map Placeholder */}
         <div className="h-1/3 bg-blue-100 relative overflow-hidden flex items-center justify-center border-b-4 border-white shadow-sm">
            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Phnom_Penh_Map.png')] bg-cover bg-center opacity-30"></div>
            <div className="flex gap-8 items-center relative z-10">
               <div className={`p-3 rounded-full shadow-xl border-4 border-white ${jobStep === 0 ? 'bg-red-500 animate-bounce' : 'bg-gray-400'}`}>
                  <MapPin className="text-white" size={24} />
               </div>
               <div className="h-1 w-16 bg-gray-300 flex justify-between items-center">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
               </div>
               <div className={`p-3 rounded-full shadow-xl border-4 border-white ${jobStep > 0 ? 'bg-green-500 animate-bounce' : 'bg-gray-400'}`}>
                  <User className="text-white" size={24} />
               </div>
            </div>
         </div>

         <div className="flex-grow bg-white -mt-6 rounded-t-[2.5rem] relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] p-8 flex flex-col">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
            
            <div className="flex justify-between items-start mb-8">
               <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Job</span>
                  <h2 className="text-2xl font-black text-gray-900 mt-1">{jobStep === 0 ? 'Pickup at Shop' : 'Deliver to Customer'}</h2>
               </div>
               <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Collect</span>
                  <p className="text-xl font-black text-brand-blue">${MOCK_JOB.totalCod.toFixed(2)}</p>
               </div>
            </div>

            <div className="space-y-6 mb-8">
               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-brand-blue">
                     <MapPin size={20} />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{jobStep === 0 ? 'Pickup Address' : 'Dropoff Address'}</p>
                     <p className="font-bold text-gray-900 leading-tight">
                        {jobStep === 0 ? MOCK_JOB.shopAddress : MOCK_JOB.customerAddress}
                     </p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
                     <Phone size={20} />
                  </div>
                  <div className="flex-grow">
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Contact</p>
                     <div className="flex justify-between items-center">
                        <p className="font-bold text-gray-900">{MOCK_JOB.customerName}</p>
                        <a href={`tel:${MOCK_JOB.customerPhone}`} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Call</a>
                     </div>
                  </div>
               </div>
            </div>

            {/* Swipe Action Simulation */}
            <button 
               onClick={() => {
                  if (jobStep === 0) setJobStep(1);
                  else if (jobStep === 1) {
                     setJobStep(2);
                     setTimeout(() => {
                        alert("Great Job! Delivery Complete. Earning +$1.00");
                        setHasJob(false);
                        setJobStep(0);
                     }, 500);
                  }
               }}
               className="mt-auto w-full py-5 bg-brand-blue text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-3"
            >
               {jobStep === 0 ? 'CONFIRM PICKUP' : 'CONFIRM DELIVERY'}
               <ChevronRight />
            </button>
         </div>
      </div>
    );
  }

  // Online Dashboard (Scanning)
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       <div className="bg-gray-900 p-6 pb-20 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center text-white mb-8 relative z-10">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                   <Bike size={20} className="text-white" />
                </div>
                <div>
                   <p className="text-xs text-green-400 font-bold uppercase tracking-widest">Status: Online</p>
                   <p className="font-bold">Dara Driver</p>
                </div>
             </div>
             <button onClick={() => setIsOnline(false)} className="bg-white/10 p-2 rounded-xl text-white"><Power size={20} /></button>
          </div>
          
          <div className="flex justify-between gap-4 relative z-10">
             <div className="flex-1 bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/5">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Today</p>
                <p className="text-2xl font-black text-white mt-1">$12.50</p>
             </div>
             <div className="flex-1 bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/5">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Trips</p>
                <p className="text-2xl font-black text-white mt-1">8</p>
             </div>
          </div>
       </div>

       <div className="flex-grow flex flex-col items-center justify-center px-8 -mt-10">
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-xl p-8 text-center relative z-10 animate-fade-in-up">
             
             {/* Scanning Animation */}
             <div className="relative w-40 h-40 mx-auto mb-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-brand-blue/10 rounded-full animate-ping"></div>
                <div className="absolute inset-4 bg-brand-blue/20 rounded-full animate-pulse"></div>
                <div className="relative bg-white p-4 rounded-full shadow-sm z-10">
                   <Navigation size={48} className="text-brand-blue" />
                </div>
             </div>

             <h2 className="text-2xl font-black text-gray-900 mb-2">Scanning Area...</h2>
             <p className="text-gray-500 text-sm mb-8">Looking for orders near Phnom Penh HQ.</p>

             <button 
               onClick={() => setHasJob(true)}
               className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg hover:bg-gray-800 transition-all text-xs uppercase tracking-widest"
             >
               Simulate Incoming Job
             </button>
          </div>
       </div>
    </div>
  );
};

export default RiderPortal;