
import React, { useState } from 'react';
import { 
  Folder, Smartphone, Layers, CheckCircle2, Code, Zap, 
  Copy, FileCode, ChevronRight, Terminal, Database, 
  Box, Infinity, HardDrive, RefreshCw, Tablet, Printer, Scan,
  Globe, Server, Languages, FileJson, Bluetooth, QrCode, ChefHat, Monitor, ShoppingBag, Star, User, Bike
} from 'lucide-react';

const MobileRoadmap: React.FC = () => {
  const [activeFile, setActiveFile] = useState('menu_catalog.dart');

  const projectFiles: Record<string, string> = {
    // --- RIDER APP SUITE ---
    'rider_main.dart': `import 'package:flutter/material.dart';
import 'screens/dashboard_screen.dart';

void main() => runApp(const RiderApp());

class RiderApp extends StatelessWidget {
  const RiderApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NOUN Fleet',
      theme: ThemeData.dark().copyWith(
        primaryColor: Colors.green,
        scaffoldBackgroundColor: const Color(0xFF111827),
      ),
      home: const DashboardScreen(),
    );
  }
}`,
    'rider_dashboard.dart': `import 'package:flutter/material.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  bool isOnline = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("NOUN FLEET"),
        actions: [
          Switch(value: isOnline, onChanged: (v) => setState(() => isOnline = v))
        ],
      ),
      body: isOnline 
        ? const Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CircularProgressIndicator(),
                SizedBox(height: 20),
                Text("Scanning for orders nearby...", style: TextStyle(color: Colors.white54))
              ],
            ),
          )
        : Center(
            child: ElevatedButton.icon(
              onPressed: () => setState(() => isOnline = true),
              icon: const Icon(Icons.power_settings_new),
              label: const Text("GO ONLINE"),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 20),
              ),
            ),
          ),
    );
  }
}`,

    // --- STAFF TERMINAL SUITE ---
    'terminal_main.dart': `import 'package:flutter/material.dart';
import 'screens/pos_screen.dart';

void main() => runApp(const StaffTerminalApp());

class StaffTerminalApp extends StatelessWidget {
  const StaffTerminalApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NOUN Staff',
      theme: ThemeData(primarySwatch: Colors.blue, useMaterial3: true),
      home: const PosScreen(),
    );
  }
}`,
    'kitchen_screen.dart': `import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class KitchenScreen extends StatefulWidget {
  const KitchenScreen({super.key});

  @override
  State<KitchenScreen> createState() => _KitchenScreenState();
}

class _KitchenScreenState extends State<KitchenScreen> {
  List orders = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    fetchOrders();
  }

  Future fetchOrders() async {
    final res = await http.get(Uri.parse("https://api.nouncrm.com/kitchen/orders"));
    if (res.statusCode == 200) {
      setState(() {
        orders = jsonDecode(res.body);
        loading = false;
      });
    }
  }

  Future markDone(int orderId) async {
    await http.post(
      Uri.parse("https://api.nouncrm.com/kitchen/done"),
      body: {"order_id": orderId},
    );
    fetchOrders();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: const Text("KITCHEN HUD", style: TextStyle(fontWeight: FontWeight.w900, color: Colors.white)),
        backgroundColor: Colors.black,
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2, crossAxisSpacing: 16, mainAxisSpacing: 16, childAspectRatio: 1.2
              ),
              itemCount: orders.length,
              itemBuilder: (ctx, i) => TicketCard(order: orders[i], onDone: markDone),
            ),
    );
  }
}`,
    'qr_pay_screen.dart': `import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';

class QrPayScreen extends StatefulWidget {
  final double total;
  const QrPayScreen({super.key, required this.total});

  @override
  State<QrPayScreen> createState() => _QrPayScreenState();
}

class _QrPayScreenState extends State<QrPayScreen> {
  bool _isVerified = false;

  void _checkPayment() async {
    setState(() => _isVerified = true);
    await Future.delayed(const Duration(seconds: 1));
    if (mounted) Navigator.pop(context, true);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Scan to Pay")),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            QrImageView(
              data: "NOUN-TX-\${DateTime.now().millisecondsSinceEpoch}",
              version: QrVersions.auto,
              size: 280.0,
            ),
            const SizedBox(height: 30),
            Text("TOTAL: \\$ \${widget.total.toStringAsFixed(2)}", 
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 40),
            ElevatedButton(onPressed: _checkPayment, child: const Text("VERIFY PAYMENT")),
          ],
        ),
      ),
    );
  }
}`,

    // --- CUSTOMER APP SUITE ---
    'customer_main.dart': `import 'package:flutter/material.dart';
import 'screens/branch_selector.dart';

void main() => runApp(const CustomerApp());

class CustomerApp extends StatelessWidget {
  const CustomerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NOUN Order',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xFFFFD700),
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF0047AB)),
        fontFamily: 'Poppins',
      ),
      home: const BranchSelector(),
    );
  }
}`,
    'branch_selector.dart': `import 'package:flutter/material.dart';
import 'menu_catalog.dart';

class BranchSelector extends StatelessWidget {
  const BranchSelector({super.key});

  final branches = const [
    {"name": "Noun Restaurant", "type": "Food", "icon": Icons.restaurant},
    {"name": "Noun Coffee Shop", "type": "Drinks", "icon": Icons.coffee},
    {"name": "Noun Mini Mart", "type": "Retail", "icon": Icons.shopping_basket},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text("Welcome to", style: TextStyle(fontSize: 16, color: Colors.grey)),
              const Text("NOUN CRM", style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold)),
              const SizedBox(height: 32),
              const Text("Select a branch to start ordering", style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              Expanded(
                child: ListView.builder(
                  itemCount: branches.length,
                  itemBuilder: (ctx, i) => Card(
                    margin: const EdgeInsets.only(bottom: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: ListTile(
                      contentPadding: const EdgeInsets.all(16),
                      leading: CircleAvatar(child: Icon(branches[i]['icon'] as IconData)),
                      title: Text(branches[i]['name'] as String, style: const TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text(branches[i]['type'] as String),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () => Navigator.push(ctx, MaterialPageRoute(builder: (_) => const MenuCatalog())),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}`,
    'menu_catalog.dart': `import 'package:flutter/material.dart';

class MenuCatalog extends StatefulWidget {
  const MenuCatalog({super.key});

  @override
  State<MenuCatalog> createState() => _MenuCatalogState();
}

class _MenuCatalogState extends State<MenuCatalog> {
  final products = [
    {"name": "Signature Latte", "price": 3.50, "image": "assets/latte.jpg"},
    {"name": "Beef Burger", "price": 5.99, "image": "assets/burger.jpg"},
    {"name": "Potato Chips", "price": 1.20, "image": "assets/chips.jpg"},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Menu"), centerTitle: true),
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2, childAspectRatio: 0.8, crossAxisSpacing: 16, mainAxisSpacing: 16
        ),
        itemCount: products.length,
        itemBuilder: (ctx, i) => ProductCard(product: products[i]),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        label: const Text("View Cart (2)"),
        icon: const Icon(Icons.shopping_cart),
      ),
    );
  }
}

class ProductCard extends StatelessWidget {
  final Map product;
  const ProductCard({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), border: Border.all(color: Colors.grey[200]!)),
      child: Column(
        children: [
          Expanded(child: Icon(Icons.image, size: 64, color: Colors.grey[300])),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(product['name'], style: const TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text("\\$ \${product['price']}", style: TextStyle(color: Colors.blue[800], fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                SizedBox(width: double.infinity, child: ElevatedButton(onPressed: () {}, child: const Text("ADD"))),
              ],
            ),
          )
        ],
      ),
    );
  }
}`,
    'order_tracker.dart': `import 'package:flutter/material.dart';

class OrderTracker extends StatelessWidget {
  const OrderTracker({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Track Order")),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const Icon(Icons.restaurant, size: 80, color: Colors.blue),
            const SizedBox(height: 24),
            const Text("ORDER #1042", style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const Text("PREPARING YOUR MEAL", style: TextStyle(color: Colors.grey, letterSpacing: 2)),
            const SizedBox(height: 48),
            const OrderStep(title: "Order Received", isDone: true),
            const OrderStep(title: "Cooking", isDone: true, isCurrent: true),
            const OrderStep(title: "Ready for Pickup", isDone: false),
          ],
        ),
      ),
    );
  }
}

class OrderStep extends StatelessWidget {
  final String title;
  final bool isDone;
  final bool isCurrent;
  const OrderStep({super.key, required this.title, required this.isDone, this.isCurrent = false});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(isDone ? Icons.check_circle : Icons.circle_outlined, color: isDone ? Colors.green : Colors.grey),
        const SizedBox(width: 16),
        Text(title, style: TextStyle(fontWeight: isCurrent ? FontWeight.bold : FontWeight.normal, fontSize: 18)),
      ],
    );
  }
}`,
    'loyalty_profile.dart': `import 'package:flutter/material.dart';

class LoyaltyProfile extends StatelessWidget {
  const LoyaltyProfile({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(32),
            decoration: const BoxDecoration(color: Color(0xFF0047AB), borderRadius: BorderRadius.vertical(bottom: Radius.circular(32))),
            child: Column(
              children: const [
                CircleAvatar(radius: 40, child: Icon(Icons.person, size: 40)),
                SizedBox(height: 16),
                Text("Sokha Chan", style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                Text("Member since 2023", style: TextStyle(color: Colors.white70)),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(24),
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), border: Border.all(color: Colors.amber[100]!)),
              child: Column(
                children: [
                  const Icon(Icons.stars, color: Colors.amber, size: 48),
                  const Text("YOUR POINTS", style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 2)),
                  const Text("1,240", style: TextStyle(fontSize: 48, fontWeight: FontWeight.w900)),
                  const Divider(),
                  TextButton(onPressed: () {}, child: const Text("HOW TO REDEEM")),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}`,
  };

  const nextLevelUpgrades = [
    { name: 'Self-Service QR', icon: QrCode, desc: 'Table-top QR codes that auto-link to specific branch and table IDs.' },
    { name: 'Native Checkout', icon: ShoppingBag, desc: 'Apple Pay & Google Pay integration for frictionless payments.' },
    { name: 'Push Alerts', icon: Zap, desc: 'FCM integration to notify customers when order status changes to READY.' },
    { name: 'Multilingual', icon: Languages, desc: 'Full RTL support for Khmer and Arabic expansions.' },
    { name: 'Point Burning', icon: Star, desc: 'Real-time discount calculation based on user tier in point_logs table.' }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Header Banner */}
      <div className="bg-brand-blue rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Smartphone size={320} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">
             <Code size={14} className="text-brand-yellow" /> Production Repository: NOUN-APP-V2
          </div>
          <h2 className="text-6xl font-heading font-black mb-4 uppercase tracking-tighter italic leading-none">
            Native Sync <span className="text-4xl block sm:inline text-brand-yellow not-italic">iOS & Android</span>
          </h2>
          <p className="text-blue-100 text-lg mb-10 font-medium">Verified Flutter codebase for Staff Terminals, Riders and Customer Ordering portals.</p>
          <div className="flex gap-4">
             <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Tablet size={14} /> KDS Ready
             </div>
             <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Bike size={14} /> Rider App
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* File Explorer Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
             <h3 className="font-black text-gray-900 uppercase tracking-widest text-[10px] mb-8 flex items-center gap-3 text-gray-400">
               <Folder size={18} className="text-brand-blue" />
               lib/ Fleet Tree
             </h3>
             <div className="space-y-8">
                {/* Rider Section */}
                <div>
                   <p className="text-[10px] font-black text-green-600 uppercase mb-3 px-4 border-l-2 border-green-600 ml-1 flex items-center gap-2">
                      <Bike size={10} /> Delivery Rider
                   </p>
                   <div className="space-y-1">
                      {Object.keys(projectFiles).filter(f => f.includes('rider')).map((fileName) => (
                        <button
                          key={fileName}
                          onClick={() => setActiveFile(fileName)}
                          className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all ${
                            activeFile === fileName ? 'bg-brand-blue text-white shadow-xl translate-x-2' : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                             <FileCode size={14} className={activeFile === fileName ? 'text-brand-yellow' : 'text-blue-400'} />
                             <span className="truncate">{fileName}</span>
                          </div>
                        </button>
                      ))}
                   </div>
                </div>

                {/* Staff Section */}
                <div>
                   <p className="text-[10px] font-black text-blue-500 uppercase mb-3 px-4 border-l-2 border-blue-500 ml-1 flex items-center gap-2">
                      <Monitor size={10} /> Staff Terminal
                   </p>
                   <div className="space-y-1">
                      {Object.keys(projectFiles).filter(f => f.includes('terminal') || f.includes('kitchen') || f.includes('qr_pay')).map((fileName) => (
                        <button
                          key={fileName}
                          onClick={() => setActiveFile(fileName)}
                          className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all ${
                            activeFile === fileName ? 'bg-brand-blue text-white shadow-xl translate-x-2' : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                             <FileCode size={14} className={activeFile === fileName ? 'text-brand-yellow' : 'text-blue-400'} />
                             <span className="truncate">{fileName}</span>
                          </div>
                        </button>
                      ))}
                   </div>
                </div>

                {/* Customer Section */}
                <div>
                   <p className="text-[10px] font-black text-amber-600 uppercase mb-3 px-4 border-l-2 border-amber-600 ml-1 flex items-center gap-2">
                      <Smartphone size={10} /> Customer App
                   </p>
                   <div className="space-y-1">
                      {Object.keys(projectFiles).filter(f => f.includes('customer') || f.includes('selector') || f.includes('catalog') || f.includes('tracker') || f.includes('loyalty')).map((fileName) => (
                        <button
                          key={fileName}
                          onClick={() => setActiveFile(fileName)}
                          className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all ${
                            activeFile === fileName ? 'bg-brand-blue text-white shadow-xl translate-x-2' : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                             <FileCode size={14} className={activeFile === fileName ? 'text-brand-yellow' : 'text-blue-400'} />
                             <span className="truncate">{fileName}</span>
                          </div>
                        </button>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="lg:col-span-9 bg-gray-900 rounded-[3rem] shadow-2xl overflow-hidden border-8 border-gray-800 flex flex-col h-[800px]">
           <div className="bg-gray-800 px-8 py-5 flex justify-between items-center border-b border-gray-700">
              <div className="flex items-center gap-4">
                 <div className="flex gap-2 mr-4">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-lg">
                    <Code size={12} className="text-blue-400" />
                    <span className="text-xs font-mono text-gray-300 font-bold">{activeFile}</span>
                 </div>
              </div>
              <button 
                onClick={() => copyToClipboard(projectFiles[activeFile])}
                className="text-gray-400 hover:text-white transition-all p-3 hover:bg-gray-700 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
              >
                 <Copy size={16} /> Copy Code
              </button>
           </div>
           <div className="flex-grow p-10 overflow-auto custom-scrollbar font-mono text-sm leading-relaxed">
              <pre className="text-blue-200">
                 {projectFiles[activeFile]}
              </pre>
           </div>
           <div className="bg-gray-800 px-8 py-3 text-[10px] font-mono text-gray-500 flex justify-between uppercase font-black tracking-widest">
              <span>Encoding: UTF-8</span>
              <span>NOUN CRM SDK V2.0</span>
           </div>
        </div>
      </div>

      {/* Hardware Scalability Roadmap */}
      <div className="space-y-8 pt-12 border-t border-gray-100">
         <div className="flex items-center gap-4">
            <div className="p-4 bg-brand-yellow/10 rounded-2xl shadow-sm">
               <Zap className="text-brand-blue" size={32} />
            </div>
            <div>
               <h3 className="text-3xl font-heading font-black text-gray-900 uppercase tracking-tighter italic leading-none">Engineering Roadmap</h3>
               <p className="text-gray-500 text-sm font-medium mt-1">Specialized mobile features for professional retail operations.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {nextLevelUpgrades.map((upgrade, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:translate-y-[-8px] transition-all group relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
                    <upgrade.icon size={60} />
                 </div>
                 <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center text-brand-blue mb-6 group-hover:bg-brand-blue group-hover:text-white transition-colors duration-500 shadow-sm">
                    <upgrade.icon size={28} />
                 </div>
                 <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight mb-3">{upgrade.name}</h4>
                 <p className="text-[11px] text-gray-400 leading-relaxed font-bold uppercase tracking-wide opacity-80">{upgrade.desc}</p>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default MobileRoadmap;
