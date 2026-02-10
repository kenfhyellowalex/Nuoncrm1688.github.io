import { Translations } from "./types";

export const TRANSLATIONS: Record<string, Translations> = {
  US: {
    nav: {
      home: "Home",
      menu: "Menu/Order",
      booking: "Booking",
      about: "About",
      contact: "Contact",
      crm: "Admin",
      orderNow: "Order Now",
      login: "Login",
      logout: "Logout"
    },
    hero: {
      slogan: "Order Smart. Manage Smart.",
      subSlogan: "NOUN CRM is an all-in-one ordering and customer management system for restaurants, coffee shops, and mini marts.",
      btnOrder: "Order Now",
      btnBook: "Book a Table"
    },
    home: {
      servicesTitle: "Our Services",
      service1: "Restaurant Ordering",
      service1Desc: "Easy online menu and fast ordering system for restaurants.",
      service2: "Coffee Shop Orders",
      service2Desc: "Let customers order drinks quickly from their phone.",
      service3: "Mini Mart Products",
      service3Desc: "Sell daily products online with simple checkout.",
      howTitle: "How It Works",
      how1: "Choose your menu",
      how2: "Place your order",
      how3: "Pickup or delivery",
      howTagline: "Fast. Simple. Smart.",
      featTitle: "Features",
      feat1: "Online ordering system",
      feat2: "Booking & reservation",
      feat3: "Customer database (CRM)",
      feat4: "Social media integration",
      feat5: "Multi-country support",
      feat6: "Mobile friendly",
      ctaTitle: "Start managing your business smarter today.",
      ctaBtn: "Order with NOUN CRM now."
    },
    shop: {
      pageTitle: "Our Menu",
      pageDesc: "Choose from our restaurant dishes, coffee drinks, or mini mart products. Add to cart and order easily online.",
      cafeTab: "Coffee Shop",
      martTab: "Mini Mart",
      restaurantTab: "Restaurant",
      cafeTitle: "Handcrafted Coffee",
      cafeDesc: "Premium beans.",
      martTitle: "Mini Mart",
      martDesc: "Daily essentials.",
      restaurantTitle: "Restaurant",
      restaurantDesc: "Delicious meals.",
      addToCart: "Add",
      customize: "Customize",
      inStock: "in stock",
      available: "Avail.",
      categories: "Categories",
      cart: "Your Cart",
      checkout: "Checkout",
      total: "Total"
    },
    booking: {
      title: "Table Reservation",
      desc: "Book your table easily using the form below. We will confirm your booking shortly.",
      successTitle: "Received!",
      successDesc: "Thank you! Your reservation has been received.",
      makeAnother: "Book Another",
      labels: {
        name: "Full Name",
        email: "Email",
        phone: "Phone / WhatsApp",
        date: "Date",
        time: "Time",
        guests: "Number of People",
        message: "Message",
        submit: "Submit Booking"
      },
      info: {
        hoursTitle: "Opening Hours",
        hours: "Mon-Sun: 7am - 10pm",
        groupTitle: "Groups",
        groupDesc: "Contact for 10+ people"
      }
    },
    about: {
      title: "About NOUN CRM",
      whoWeAre: "Who We Are",
      whoWeAreDesc: "NOUN CRM is a smart ordering and customer management system designed for restaurants, coffee shops, and mini marts.",
      mission: "Our Mission",
      missionDesc: "Our mission is to help businesses manage orders, customers, and bookings easily in one platform. We support businesses in Thailand, Indonesia, and Cambodia with modern technology and simple tools. With NOUN CRM, you can sell more, manage faster, and serve customers better.",
      countries: "Operating In"
    },
    contact: {
      title: "Contact Us",
      desc: "Have questions or need support? Contact us anytime.",
      formTitle: "Get in Touch",
      socialTitle: "Connect With Us",
      socialText: "You can also reach us via:",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send Message"
    },
    crm: {
      dashboard: "Dashboard",
      orders: "Orders",
      products: "Products",
      customers: "Customers",
      settings: "Settings",
      title: "Welcome to NOUN CRM Dashboard",
      subtitle: "Manage your orders, customers, and products in one place.",
      analyzeBtn: "Ask AI",
      analyzing: "Thinking...",
      revenue: "Total Sales",
      activeCust: "New Customers",
      topPerforming: "Today's Bookings",
      salesPerf: "Sales Overview",
      customerActivity: "Recent Orders",
      customerCols: {
        name: "Customer",
        region: "Region",
        fav: "Item",
        spent: "Total"
      }
    },
    footer: {
      desc: "NOUN CRM – Smart Ordering System for Restaurants, Coffee Shops & Mini Marts. Serving Thailand, Indonesia, and Cambodia.",
      quickLinks: "Quick Links",
      social: "Follow Us",
      rights: "© 2026 NOUN CRM. All rights reserved."
    }
  },
  // Other languages are kept consistent with structure but original translations are used where appropriate
  // or placeholders to avoid breaking typescript. 
  KH: {
    nav: {
      home: "ទំព័រដើម",
      menu: "បញ្ជីមុខទំនិញ",
      booking: "ការកក់",
      about: "អំពីយើង",
      contact: "ទំនាក់ទំនង",
      crm: "Admin",
      orderNow: "កម្មង់ឥឡូវ",
      login: "ចូល",
      logout: "ចាកចេញ"
    },
    hero: {
      slogan: "បញ្ជាទិញឆ្លាតវៃ។ គ្រប់គ្រងឆ្លាតវៃ។",
      subSlogan: "បទពិសោធន៍កូនកាត់សម្រាប់កាហ្វេ អាហារ និងម៉ាត។",
      btnOrder: "កម្មង់ទិញ",
      btnBook: "កក់តុ"
    },
    home: {
      servicesTitle: "សេវាកម្មរបស់យើង",
      service1: "កម្មង់អាហារ",
      service1Desc: "ម៉ឺនុយអនឡាញងាយស្រួល",
      service2: "កម្មង់កាហ្វេ",
      service2Desc: "កម្មង់ភេសជ្ជៈបានរហ័ស",
      service3: "ទំនិញម៉ាត",
      service3Desc: "លក់ទំនិញប្រចាំថ្ងៃ",
      howTitle: "របៀបប្រើប្រាស់",
      how1: "ជ្រើសរើស",
      how2: "កម្មង់អនឡាញ",
      how3: "ដឹកជញ្ជូន",
      howTagline: "រហ័ស។ ងាយស្រួល។ ឆ្លាតវៃ។",
      featTitle: "លក្ខណៈពិសេស",
      feat1: "ប្រព័ន្ធអនឡាញ",
      feat2: "ប្រព័ន្ធកក់",
      feat3: "ទិន្នន័យអតិថិជន",
      feat4: "បណ្តាញសង្គម",
      feat5: "គាំទ្រច្រើនប្រទេស",
      feat6: "ប្រើបានលើទូរស័ព្ទ",
      ctaTitle: "ចាប់ផ្តើមឥឡូវនេះ?",
      ctaBtn: "ចាប់ផ្តើមកម្មង់"
    },
    shop: {
      pageTitle: "បញ្ជីមុខទំនិញ",
      pageDesc: "ជ្រើសរើសពីមុខម្ហូប កាហ្វេ ឬទំនិញម៉ាត។",
      cafeTab: "ហាងកាហ្វេ",
      martTab: "ផ្សារទំនើប",
      restaurantTab: "ភោជនីយដ្ឋាន",
      cafeTitle: "កាហ្វេ",
      cafeDesc: "កាហ្វេឆ្ងាញ់",
      martTitle: "ម៉ាត",
      martDesc: "ទំនិញទូទៅ",
      restaurantTitle: "អាហារ",
      restaurantDesc: "អាហារឆ្ងាញ់",
      addToCart: "ទិញ",
      customize: "រើស",
      inStock: "ស្តុក",
      available: "មាន",
      categories: "ប្រភេទ",
      cart: "កន្ត្រក",
      checkout: "គិតលុយ",
      total: "សរុប"
    },
    booking: {
      title: "កក់តុ",
      desc: "កក់កន្លែងរបស់អ្នក។",
      successTitle: "ជោគជ័យ!",
      successDesc: "បានទទួលការកក់។",
      makeAnother: "កក់ម្តងទៀត",
      labels: {
        name: "ឈ្មោះ",
        email: "អ៊ីមែល",
        phone: "ទូរស័ព្ទ",
        date: "កាលបរិច្ឆេទ",
        time: "ម៉ោង",
        guests: "ចំនួនភ្ញៀវ",
        message: "សារ",
        submit: "បញ្ជាក់ការកក់"
      },
      info: {
        hoursTitle: "ម៉ោងបើក",
        hours: "7ព្រឹក-10យប់",
        groupTitle: "ក្រុម",
        groupDesc: "ទាក់ទងសម្រាប់ 10+ នាក់"
      }
    },
    about: {
      title: "អំពី NOUN",
      whoWeAre: "យើងជានរណា",
      whoWeAreDesc: "NOUN CRM គឺជាដំណោះស្រាយលក់រាយកូនកាត់។",
      mission: "បេសកកម្ម",
      missionDesc: "ដើម្បីសម្រួលការគ្រប់គ្រងការលក់។",
      countries: "ប្រតិបត្តិការនៅ"
    },
    contact: {
      title: "ទាក់ទងយើង",
      desc: "មានសំណួរឬត្រូវការជំនួយ?",
      formTitle: "ផ្ញើសារ",
      socialTitle: "បណ្តាញសង្គម",
      socialText: "ទាក់ទងតាម៖",
      name: "ឈ្មោះ",
      email: "អ៊ីមែល",
      message: "សារ",
      send: "ផ្ញើ"
    },
    crm: {
      dashboard: "ផ្ទាំងគ្រប់គ្រង",
      orders: "ការកម្មង់",
      products: "ផលិតផល",
      customers: "អតិថិជន",
      settings: "ការកំណត់",
      title: "Admin",
      subtitle: "គ្រប់គ្រងអាជីវកម្ម",
      analyzeBtn: "សួរ AI",
      analyzing: "កំពុងគិត...",
      revenue: "ការលក់សរុប",
      activeCust: "អតិថិជនថ្មី",
      topPerforming: "ការកក់ថ្ងៃនេះ",
      salesPerf: "ទិដ្ឋភាពទូទៅ",
      customerActivity: "ការកម្មង់ថ្មីៗ",
      customerCols: {
        name: "អតិថិជន",
        region: "តំបន់",
        fav: "ទំនិញ",
        spent: "សរុប"
      }
    },
    footer: {
      desc: "ដំណោះស្រាយ CRM",
      quickLinks: "តំណភ្ជាប់រហ័ស",
      social: "តាមដានយើង",
      rights: "រក្សាសិទ្ធិ © 2024"
    }
  },
  TH: {
    nav: {
      home: "หน้าหลัก",
      menu: "เมนู/สั่งซื้อ",
      booking: "จองโต๊ะ",
      about: "เกี่ยวกับเรา",
      contact: "ติดต่อ",
      crm: "ผู้ดูแล",
      orderNow: "สั่งเลย",
      login: "เข้าสู่ระบบ",
      logout: "ออกจากระบบ"
    },
    hero: {
      slogan: "สั่งง่าย จัดการฉลาด NOUN CRM",
      subSlogan: "ประสบการณ์ไฮบริดสำหรับกาแฟ อาหาร และมาร์ท",
      btnOrder: "สั่งซื้อ",
      btnBook: "จองโต๊ะ"
    },
    home: {
      servicesTitle: "บริการของเรา",
      service1: "สั่งอาหาร",
      service1Desc: "สั่งอาหารออนไลน์ง่ายๆ",
      service2: "สั่งกาแฟ",
      service2Desc: "สั่งเครื่องดื่มรวดเร็ว",
      service3: "มินิมาร์ท",
      service3Desc: "สินค้าประจำวัน",
      howTitle: "ขั้นตอนการใช้งาน",
      how1: "เลือกเมนู",
      how2: "สั่งออนไลน์",
      how3: "รับสินค้า/จัดส่ง",
      howTagline: "รวดเร็ว. ง่ายดาย. ฉลาด.",
      featTitle: "ฟีเจอร์",
      feat1: "ระบบสั่งซื้อ",
      feat2: "ระบบจอง",
      feat3: "ฐานข้อมูลลูกค้า",
      feat4: "เชื่อมต่อโซเชียล",
      feat5: "รองรับหลายประเทศ",
      feat6: "รองรับมือถือ",
      ctaTitle: "พร้อมเริ่มต้นหรือยัง?",
      ctaBtn: "เริ่มสั่งซื้อเลย"
    },
    shop: {
      pageTitle: "เมนูของเรา",
      pageDesc: "เลือกอาหาร กาแฟ หรือสินค้ามาร์ท",
      cafeTab: "คาเฟ่",
      martTab: "มาร์ท",
      restaurantTab: "ร้านอาหาร",
      cafeTitle: "กาแฟสด",
      cafeDesc: "กาแฟพรีเมียม",
      martTitle: "มินิมาร์ท",
      martDesc: "ของใช้จำเป็น",
      restaurantTitle: "ร้านอาหาร",
      restaurantDesc: "อาหารอร่อย",
      addToCart: "เพิ่ม",
      customize: "ปรับแต่ง",
      inStock: "มีสินค้า",
      available: "พร้อมขาย",
      categories: "หมวดหมู่",
      cart: "ตะกร้า",
      checkout: "ชำระเงิน",
      total: "รวม"
    },
    booking: {
      title: "จองโต๊ะ",
      desc: "สำรองที่นั่งของคุณง่ายๆ",
      successTitle: "สำเร็จ!",
      successDesc: "ได้รับการจองแล้ว",
      makeAnother: "จองเพิ่ม",
      labels: {
        name: "ชื่อ",
        email: "อีเมล",
        phone: "โทรศัพท์",
        date: "วันที่",
        time: "เวลา",
        guests: "จำนวนคน",
        message: "ข้อความ",
        submit: "ยืนยัน"
      },
      info: {
        hoursTitle: "เวลาทำการ",
        hours: "07:00 - 22:00",
        groupTitle: "กลุ่ม",
        groupDesc: "ติดต่อสำหรับ 10+ ท่าน"
      }
    },
    about: {
      title: "เกี่ยวกับ NOUN",
      whoWeAre: "เราคือใคร",
      whoWeAreDesc: "NOUN CRM คือโซลูชันค้าปลีกแบบไฮบริด",
      mission: "พันธกิจ",
      missionDesc: "เพื่อลดความซับซ้อนในการจัดการร้านค้า",
      countries: "ดำเนินการใน"
    },
    contact: {
      title: "ติดต่อเรา",
      desc: "มีคำถามหรือต้องการความช่วยเหลือ?",
      formTitle: "ส่งข้อความ",
      socialTitle: "เชื่อมต่อกับเรา",
      socialText: "ติดต่อผ่าน:",
      name: "ชื่อ",
      email: "อีเมล",
      message: "ข้อความ",
      send: "ส่ง"
    },
    crm: {
      dashboard: "แดชบอร์ด",
      orders: "คำสั่งซื้อ",
      products: "สินค้า",
      customers: "ลูกค้า",
      settings: "ตั้งค่า",
      title: "ผู้ดูแลระบบ",
      subtitle: "จัดการธุรกิจของคุณ",
      analyzeBtn: "ถาม AI",
      analyzing: "กำลังคิด...",
      revenue: "ยอดขายรวม",
      activeCust: "ลูกค้าใหม่",
      topPerforming: "การจองวันนี้",
      salesPerf: "ภาพรวมยอดขาย",
      customerActivity: "คำสั่งซื้อล่าสุด",
      customerCols: {
        name: "ลูกค้า",
        region: "ภูมิภาค",
        fav: "รายการ",
        spent: "รวม"
      }
    },
    footer: {
      desc: "โซลูชัน CRM ไฮบริด",
      quickLinks: "ลิงก์ด่วน",
      social: "ติดตามเรา",
      rights: "สงวนลิขสิทธิ์ © 2024"
    }
  },
  ID: {
    nav: {
      home: "Beranda",
      menu: "Menu/Pesan",
      booking: "Reservasi",
      about: "Tentang",
      contact: "Kontak",
      crm: "Admin",
      orderNow: "Pesan",
      login: "Masuk",
      logout: "Keluar"
    },
    hero: {
      slogan: "Pesan Cerdas. Kelola Cerdas.",
      subSlogan: "Pengalaman hybrid untuk Kopi, Makanan, dan Mart.",
      btnOrder: "Pesan Sekarang",
      btnBook: "Pesan Meja"
    },
    home: {
      servicesTitle: "Layanan Kami",
      service1: "Pesan Makanan",
      service1Desc: "Menu online mudah",
      service2: "Pesan Kopi",
      service2Desc: "Pesan minuman cepat",
      service3: "Produk Mart",
      service3Desc: "Jual produk harian",
      howTitle: "Cara Kerja",
      how1: "Pilih Menu",
      how2: "Pesan Online",
      how3: "Ambil/Antar",
      howTagline: "Cepat. Simpel. Cerdas.",
      featTitle: "Fitur",
      feat1: "Sistem Online",
      feat2: "Sistem Booking",
      feat3: "Database Pelanggan",
      feat4: "Koneksi Medsos",
      feat5: "Multi-negara",
      feat6: "Ramah Mobile",
      ctaTitle: "Siap mencoba?",
      ctaBtn: "Mulai Pesan"
    },
    shop: {
      pageTitle: "Menu Kami",
      pageDesc: "Pilih dari makanan, kopi, atau produk mart kami.",
      cafeTab: "Kafe",
      martTab: "Mart",
      restaurantTab: "Restoran",
      cafeTitle: "Kopi",
      cafeDesc: "Biji premium",
      martTitle: "Minimarket",
      martDesc: "Kebutuhan harian",
      restaurantTitle: "Restoran",
      restaurantDesc: "Makanan lezat",
      addToCart: "Tambah",
      customize: "Ubah",
      inStock: "stok",
      available: "Ada",
      categories: "Kategori",
      cart: "Keranjang",
      checkout: "Bayar",
      total: "Total"
    },
    booking: {
      title: "Reservasi Meja",
      desc: "Amankan tempatmu dengan mudah.",
      successTitle: "Diterima!",
      successDesc: "Reservasi diterima.",
      makeAnother: "Reservasi Lagi",
      labels: {
        name: "Nama",
        email: "Email",
        phone: "Telepon",
        date: "Tanggal",
        time: "Waktu",
        guests: "Jumlah Tamu",
        message: "Pesan",
        submit: "Kirim"
      },
      info: {
        hoursTitle: "Jam Buka",
        hours: "07:00 - 22:00",
        groupTitle: "Grup",
        groupDesc: "Hubungi untuk 10+ orang"
      }
    },
    about: {
      title: "Tentang NOUN",
      whoWeAre: "Siapa Kami",
      whoWeAreDesc: "NOUN CRM adalah solusi ritel hybrid.",
      mission: "Misi",
      missionDesc: "Menyederhanakan manajemen ritel.",
      countries: "Beroperasi Di"
    },
    contact: {
      title: "Kontak Kami",
      desc: "Ada pertanyaan?",
      formTitle: "Kirim Pesan",
      socialTitle: "Sosial Media",
      socialText: "Hubungi kami via:",
      name: "Nama",
      email: "Email",
      message: "Pesan",
      send: "Kirim"
    },
    crm: {
      dashboard: "Dashboard",
      orders: "Pesanan",
      products: "Produk",
      customers: "Pelanggan",
      settings: "Pengaturan",
      title: "Admin Dashboard",
      subtitle: "Kelola bisnis",
      analyzeBtn: "Tanya AI",
      analyzing: "Berpikir...",
      revenue: "Total Penjualan",
      activeCust: "Pelanggan Baru",
      topPerforming: "Booking Hari Ini",
      salesPerf: "Ringkasan",
      customerActivity: "Pesanan Baru",
      customerCols: {
        name: "Pelanggan",
        region: "Wilayah",
        fav: "Item",
        spent: "Total"
      }
    },
    footer: {
      desc: "Solusi CRM Hybrid",
      quickLinks: "Tautan Cepat",
      social: "Ikuti Kami",
      rights: "Hak Cipta © 2024"
    }
  }
};