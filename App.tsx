import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, Globe, Calendar, Users, ChevronRight, ChevronLeft,
  LayoutDashboard, Bed, BookOpen, TrendingUp, LogOut,
  ArrowLeft, Utensils, Sparkles, Dumbbell, Waves, Wind,
  Plus, Minus, Pyramid, Check, Sun, Moon, Upload, Star
} from 'lucide-react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, addDays, parseISO } from 'date-fns';
import 'react-day-picker/dist/style.css';
import { Room, Booking, AdminStats, Language, translations, Facility, DiningFacility, DiningMenuItem, WellnessFacility } from './types';

const FACILITIES: Facility[] = [
  { 
    id: 'gym', 
    name: 'Elite Fitness Center', 
    description: 'State-of-the-art equipment with panoramic Nile views.', 
    long_description: 'Our fitness center is equipped with the latest Technogym technology, offering a comprehensive range of cardio and strength training equipment. Floor-to-ceiling windows provide inspiring views of the Nile River, making every workout an experience in itself. Personal trainers are available upon request to help you achieve your fitness goals.',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80', 
    category: 'wellness',
    gallery: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=800&q=80'
    ]
  },
  { 
    id: 'pool', 
    name: 'Infinity Pool', 
    description: 'A serene oasis overlooking the ancient landscape.', 
    long_description: 'Perched on the edge of the property, our infinity pool creates the illusion of merging with the Nile. Surrounded by comfortable daybeds and attentive service, it is the perfect place to unwind after a day of exploration. The pool is heated during the winter months to ensure year-round comfort.',
    image_url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80', 
    category: 'wellness',
    gallery: [
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ]
  },
  { 
    id: 'sauna', 
    name: 'Royal Spa & Sauna', 
    description: 'Traditional Egyptian treatments and modern relaxation.', 
    long_description: 'Step into a world of tranquility at our Royal Spa. Drawing inspiration from ancient Egyptian beauty rituals, we offer a range of treatments using natural ingredients like honey, milk, and essential oils. Our facilities include a traditional hammam, a dry sauna, and steam rooms, all designed to rejuvenate your body and mind.',
    image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80', 
    category: 'wellness',
    gallery: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1591343395582-99bf4eb11abc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?auto=format&fit=crop&w=800&q=80'
    ]
  },
  { 
    id: 'dining1', 
    name: 'The Pharaoh’s Table', 
    description: 'Fine dining with authentic Egyptian flavors.', 
    long_description: 'The Pharaoh’s Table offers a sophisticated culinary journey through Egypt’s rich history. Our chefs use the finest local ingredients to create dishes that are both traditional and innovative. The elegant setting, inspired by ancient palaces, provides the perfect backdrop for an unforgettable dining experience.',
    image_url: 'https://images.unsplash.com/photo-1550966841-3ee7adac1ad8?auto=format&fit=crop&w=1200&q=80', 
    category: 'dining',
    menu: [
      { name: 'Hibiscus Iced Tea', description: 'Traditional Egyptian Karkadeh, chilled and refreshing.', price: 8, category: 'Drinks', image_url: 'https://images.unsplash.com/photo-1553531384-397c80973a0b?auto=format&fit=crop&w=800&q=80' },
      { name: 'Mint Lemonade', description: 'Freshly squeezed lemons with garden-fresh mint.', price: 7, category: 'Drinks', image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80' },
      { name: 'Egyptian Coffee', description: 'Strong, aromatic coffee brewed with cardamom.', price: 6, category: 'Drinks', image_url: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&w=800&q=80' },
      { name: 'Mango Lassi', description: 'Creamy yogurt drink with ripe Egyptian mangoes.', price: 9, category: 'Drinks', image_url: 'https://images.unsplash.com/photo-1571006682881-645828452331?auto=format&fit=crop&w=800&q=80' }
    ]
  },
  { 
    id: 'dining2', 
    name: 'Nile Terrace', 
    description: 'Al fresco dining under the stars.', 
    long_description: 'Enjoy breathtaking views of the Nile at our al fresco terrace. Nile Terrace offers a relaxed atmosphere for breakfast, lunch, and dinner. Our menu features a variety of international cuisines and local favorites, all prepared with the freshest seasonal ingredients.',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', 
    category: 'dining',
    menu: [
      { name: 'Ful Medames', description: 'Slow-cooked fava beans with olive oil, cumin, and fresh herbs.', price: 12, category: 'Breakfast', image_url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80' },
      { name: 'Shakshuka', description: 'Poached eggs in a spicy tomato and bell pepper sauce.', price: 14, category: 'Breakfast', image_url: 'https://images.unsplash.com/photo-1590412200988-a436bb7050a8?auto=format&fit=crop&w=800&q=80' },
      { name: 'Grilled Nile Perch', description: 'Freshly caught perch with lemon-garlic butter and roasted vegetables.', price: 28, category: 'International', image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80' },
      { name: 'Lamb Kofta', description: 'Spiced minced lamb skewers served with tahini and flatbread.', price: 24, category: 'International', image_url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80' }
    ]
  },
];

const LANGUAGES: { code: Language; label: string; flag: string; abbr: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸', abbr: 'USA' },
  { code: 'ar', label: 'العربية', flag: '🇪🇬', abbr: 'EGY' },
  { code: 'uz', label: 'Oʻzbek', flag: '🇺🇿', abbr: 'UZB' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺', abbr: 'RUS' },
  { code: 'es', label: 'Español', flag: '🇪🇸', abbr: 'ESP' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', abbr: 'FRA' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', abbr: 'DEU' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹', abbr: 'ITA' },
  { code: 'pt', label: 'Português', flag: '🇵🇹', abbr: 'PRT' },
  { code: 'zh', label: '中文', flag: '🇨🇳', abbr: 'CHN' },
  { code: 'ja', label: '日本語', flag: '🇯🇵', abbr: 'JPN' },
  { code: 'ko', label: '한국어', flag: '🇰🇷', abbr: 'KOR' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷', abbr: 'TUR' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳', abbr: 'IND' },
  { code: 'bn', label: 'বাংলা', flag: '🇧🇩', abbr: 'BGD' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳', abbr: 'VNM' },
];

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [view, setView] = useState<'guest' | 'admin'>('guest');
  const [section, setSection] = useState<'home' | 'rooms' | 'wellness' | 'dining'>('home');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [dining, setDining] = useState<DiningFacility[]>([]);
  const [wellness, setWellness] = useState<WellnessFacility[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [bookingStep, setBookingStep] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState('');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [adminActiveTab, setAdminActiveTab] = useState<'dashboard' | 'rooms' | 'bookings' | 'dining' | 'wellness'>('dashboard');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3)
  });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLangSidebarOpen, setIsLangSidebarOpen] = useState(false);
  const [availability, setAvailability] = useState<any[]>([]);
  const [selectedBookingForNotes, setSelectedBookingForNotes] = useState<Booking | null>(null);
  const [isConfirming, setIsConfirming] = useState<number | null>(null);
  const [adminPressProgress, setAdminPressProgress] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [isMyBookingsModalOpen, setIsMyBookingsModalOpen] = useState(false);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [myBookingsEmail, setMyBookingsEmail] = useState('');
  const [isSearchingBookings, setIsSearchingBookings] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const pressTimerRef = useRef<any>(null);
  const startTimeRef = useRef<number | null>(null);

  const startAdminPress = () => {
    setAdminPressProgress(0);
    startTimeRef.current = Date.now();
    pressTimerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Date.now() - startTimeRef.current;
        const progress = Math.min(elapsed / 2000, 1);
        setAdminPressProgress(progress);
        if (progress >= 1) {
          stopAdminPress();
          setView('admin');
        }
      }
    }, 50);
  };

  const stopAdminPress = () => {
    if (pressTimerRef.current) {
      clearInterval(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setAdminPressProgress(0);
    startTimeRef.current = null;
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const t = translations[lang];
  const isRTL = lang === 'ar';

  useEffect(() => {
    fetchRooms();
    fetchDining();
    fetchWellness();
    fetchAvailability();
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  const fetchMyBookings = async (email: string) => {
    setIsSearchingBookings(true);
    try {
      const res = await fetch(`/api/bookings/my?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setMyBookings(data);
      }
    } catch (error) {
      console.error("Failed to fetch my bookings", error);
    } finally {
      setIsSearchingBookings(false);
    }
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const reviewData = {
      guest_name: formData.get('guest_name'),
      rating: Number(formData.get('rating')),
      comment: formData.get('comment')
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      if (res.ok) {
        fetchReviews();
        setIsReviewModalOpen(false);
        alert(translations[lang].review_success);
      }
    } catch (error) {
      console.error("Failed to post review", error);
    }
  };

  const fetchWellness = async () => {
    try {
      const res = await fetch('/api/wellness');
      const data = await res.json();
      setWellness(data);
    } catch (error) {
      console.error("Failed to fetch wellness", error);
    }
  };

  const fetchDining = async () => {
    try {
      const res = await fetch('/api/dining');
      const data = await res.json();
      setDining(data);
    } catch (error) {
      console.error("Failed to fetch dining", error);
    }
  };

  const fetchAvailability = async () => {
    try {
      const res = await fetch('/api/bookings/availability');
      const data = await res.json();
      setAvailability(data);
    } catch (error) {
      console.error("Failed to fetch availability", error);
    }
  };

  useEffect(() => {
    if (view === 'admin' && isAdminLoggedIn) {
      fetchAdminData();
    }
  }, [view, isAdminLoggedIn]);

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/rooms');
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error("Failed to fetch rooms", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      const statsRes = await fetch('/api/admin/stats');
      const statsData = await statsRes.json();
      setStats(statsData);

      const bookingsRes = await fetch('/api/admin/bookings');
      const bookingsData = await bookingsRes.json();
      setAllBookings(bookingsData);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const login = formData.get('login');
    const password = formData.get('password');

    if (login === 'admin' && password === '0231975') {
      setIsAdminLoggedIn(true);
      setAdminLoginError('');
    } else {
      setAdminLoginError(t.invalid_credentials);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final check for date overlaps
    if (dateRange?.from && dateRange?.to) {
      const selectedDates: Date[] = [];
      let curr = new Date(dateRange.from);
      while (curr < dateRange.to) {
        selectedDates.push(new Date(curr));
        curr.setDate(curr.getDate() + 1);
      }

      const isOverlap = selectedDates.some(sd => 
        availability.some((b: any) => 
          b.room_id === selectedRoom?.id &&
          new Date(sd) >= parseISO(b.check_in) && 
          new Date(sd) < parseISO(b.check_out)
        )
      );

      if (isOverlap) {
        alert("Sorry, some of the selected dates are already booked.");
        return;
      }
    }

    const formData = new FormData(e.target as HTMLFormElement);
    const bookingData = {
      room_id: selectedRoom?.id,
      guest_name: formData.get('name'),
      guest_email: formData.get('email'),
      check_in: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : '',
      check_out: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : '',
      adults: adults,
      children: children,
      total_price: selectedRoom?.price
    };

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });

    if (res.ok) {
      setBookingStep(2);
      fetchAvailability(); // Refresh booked dates immediately
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-luxury-bg flex items-center justify-center">
        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-xl font-serif tracking-widest uppercase"
        >
          Eternal Nile
        </motion.div>
      </div>
    );
  }

  if (view === 'admin') {
    return isAdminLoggedIn ? (
      <AdminDashboard 
        t={t} 
        stats={stats} 
        allBookings={allBookings} 
        adminActiveTab={adminActiveTab} 
        setAdminActiveTab={setAdminActiveTab} 
        rooms={rooms} 
        setIsAdminLoggedIn={setIsAdminLoggedIn} 
        setView={setView} 
        setSection={setSection}
        fetchAdminData={fetchAdminData}
        fetchRooms={fetchRooms}
        fetchDining={fetchDining}
        fetchWellness={fetchWellness}
        dining={dining}
        wellness={wellness}
        darkMode={darkMode}
      />
    ) : (
      <AdminLogin 
        t={t} 
        handleAdminLogin={handleAdminLogin} 
        adminLoginError={adminLoginError} 
        setView={setView} 
        darkMode={darkMode}
      />
    );
  }

  return (
    <GuestView 
      t={t}
      lang={lang}
      setLang={setLang}
      isRTL={isRTL}
      section={section}
      setSection={setSection}
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
      rooms={rooms}
      dining={dining}
      wellness={wellness}
      selectedRoom={selectedRoom}
      setSelectedRoom={setSelectedRoom}
      selectedFacility={selectedFacility}
      setSelectedFacility={setSelectedFacility}
      bookingStep={bookingStep}
      setBookingStep={setBookingStep}
      dateRange={dateRange}
      setDateRange={setDateRange}
      adults={adults}
      setAdults={setAdults}
      childrenCount={children}
      setChildrenCount={setChildren}
      handleBooking={handleBooking}
      setView={setView}
      isLangSidebarOpen={isLangSidebarOpen}
      setIsLangSidebarOpen={setIsLangSidebarOpen}
      availability={availability}
      startAdminPress={startAdminPress}
      stopAdminPress={stopAdminPress}
      adminPressProgress={adminPressProgress}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      isMyBookingsModalOpen={isMyBookingsModalOpen}
      setIsMyBookingsModalOpen={setIsMyBookingsModalOpen}
      myBookings={myBookings}
      fetchMyBookings={fetchMyBookings}
      isSearchingBookings={isSearchingBookings}
      reviews={reviews}
      isReviewModalOpen={isReviewModalOpen}
      setIsReviewModalOpen={setIsReviewModalOpen}
      handlePostReview={handlePostReview}
    />
  );
}

const GuestView = ({ 
  t, lang, setLang, isRTL, section, setSection, isMenuOpen, setIsMenuOpen, 
  rooms, dining, wellness, selectedRoom, setSelectedRoom, selectedFacility, setSelectedFacility, 
  bookingStep, setBookingStep, dateRange, setDateRange, adults, setAdults, 
  childrenCount, setChildrenCount, handleBooking, setView,
  isLangSidebarOpen, setIsLangSidebarOpen, availability,
  startAdminPress, stopAdminPress, adminPressProgress, darkMode, setDarkMode,
  isMyBookingsModalOpen, setIsMyBookingsModalOpen, myBookings, fetchMyBookings, isSearchingBookings,
  reviews, isReviewModalOpen, setIsReviewModalOpen, handlePostReview
}: any) => {
  const getBookedDatesForSelectedRoom = () => {
    if (!selectedRoom) return [];
    const roomBookings = availability.filter((b: any) => b.room_id === selectedRoom.id);
    const dates: Date[] = [];
    
    roomBookings.forEach((booking: any) => {
      let start = parseISO(booking.check_in);
      let end = parseISO(booking.check_out);
      
      let current = new Date(start);
      while (current < end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });
    return dates;
  };

  const bookedDates = getBookedDatesForSelectedRoom();

  return (
    <div className={`min-h-screen bg-luxury-bg ${darkMode ? 'text-white' : 'text-luxury-ink'} font-sans ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="fixed w-full z-50 px-4 md:px-8 py-4 md:py-6 flex justify-between items-center bg-luxury-cream/80 backdrop-blur-md border-b border-luxury-ink/5"
      >
        <div className="flex items-center space-x-3 md:space-x-6 rtl:space-x-reverse">
          {section !== 'home' && (
            <button 
              onClick={() => setSection('home')}
              className="p-1.5 md:p-2 hover:bg-luxury-ink/5 rounded-full transition-colors"
            >
              <ArrowLeft size={18} className="md:w-5 md:h-5" />
            </button>
          )}
          <div 
            className="flex items-center space-x-2 md:space-x-3 cursor-pointer group relative"
            onMouseDown={startAdminPress}
            onMouseUp={stopAdminPress}
            onMouseLeave={stopAdminPress}
            onTouchStart={startAdminPress}
            onTouchEnd={stopAdminPress}
          >
            <div className={`p-1.5 md:p-2 ${darkMode ? 'bg-luxury-gold text-black' : 'bg-luxury-ink text-white'} rounded-sm group-hover:rotate-[360deg] transition-transform duration-1000 relative overflow-hidden shadow-lg`}>
              <Pyramid size={20} className="md:w-6 md:h-6 relative z-10" />
              {adminPressProgress > 0 && (
                <div className="absolute inset-0 bg-black/20 flex items-end z-0">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${adminPressProgress * 100}%` }}
                    className="w-full bg-luxury-gold"
                  />
                </div>
              )}
            </div>
            <div className="text-lg md:text-2xl font-serif tracking-widest uppercase" onClick={(e) => { e.stopPropagation(); setSection('home'); }}>
              {t.hero_title}
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex space-x-4 items-center rtl:space-x-reverse">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-luxury-ink/5 rounded-full transition-colors flex items-center space-x-2"
            title={darkMode ? t.light_mode : t.dark_mode}
          >
            {darkMode ? <Sun size={20} className="text-neon-cyan" /> : <Moon size={20} />}
          </button>
          {['home', 'rooms', 'wellness', 'dining'].map((sec) => (
            <button 
              key={sec}
              onClick={() => setSection(sec as any)} 
              className={`text-[10px] uppercase tracking-[0.2em] transition-all relative px-6 py-2.5 rounded-full ${section === sec ? (darkMode ? 'text-black font-bold' : 'text-white') : 'hover:bg-luxury-ink/5'}`}
            >
              <span className="relative z-10">{t[`nav_${sec}`]}</span>
              {section === sec && (
                <motion.div 
                  layoutId="nav-pill"
                  className={`absolute inset-0 ${darkMode ? 'bg-luxury-gold' : 'bg-luxury-ink'} rounded-full shadow-md`}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
          
          <div className="w-px h-4 bg-luxury-ink/10 mx-4" />
          <button 
            onClick={() => setIsMyBookingsModalOpen(true)}
            className="text-[10px] uppercase tracking-widest hover:text-luxury-gold transition-colors"
          >
            {t.my_bookings}
          </button>
          <div className="w-px h-4 bg-luxury-ink/10 mx-4" />
          <button 
            onClick={() => setIsLangSidebarOpen(true)}
            className={`flex items-center space-x-2 rtl:space-x-reverse text-xs uppercase tracking-widest hover:opacity-50 transition-opacity group px-4 py-2 border ${darkMode ? 'border-luxury-gold/30 text-luxury-gold' : 'border-luxury-ink/10'} rounded-full`}
          >
            <Globe size={14} className="group-hover:rotate-12 transition-transform" />
            <span>{LANGUAGES.find(l => l.code === lang)?.abbr || lang.toUpperCase()}</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="md:hidden p-2 hover:bg-luxury-ink/5 rounded-full transition-colors"
            title={darkMode ? t.light_mode : t.dark_mode}
          >
            {darkMode ? <Sun size={18} className="text-neon-cyan" /> : <Moon size={18} />}
          </button>
          <button className="md:hidden p-2 hover:bg-luxury-ink/5 rounded-full" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-luxury-cream pt-24 px-8 md:hidden"
          >
            <div className="flex flex-col space-y-8">
              {['home', 'rooms', 'wellness', 'dining'].map((sec) => (
                <button 
                  key={sec}
                  onClick={() => { setSection(sec as any); setIsMenuOpen(false); }}
                  className="text-2xl font-serif uppercase tracking-widest text-left rtl:text-right"
                >
                  {t[`nav_${sec}`]}
                </button>
              ))}
              <div className="h-px bg-luxury-ink/10 w-full" />
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center space-x-4 text-xl font-serif uppercase tracking-widest"
              >
                {darkMode ? <Sun size={24} className="text-neon-cyan" /> : <Moon size={24} />}
                <span>{darkMode ? t.light_mode : t.dark_mode}</span>
              </button>
              <button 
                onClick={() => { setIsLangSidebarOpen(true); setIsMenuOpen(false); }}
                className="flex items-center space-x-4 rtl:space-x-reverse text-xl uppercase tracking-widest"
              >
                <Globe size={24} />
                <span>Language: {LANGUAGES.find(l => l.code === lang)?.label}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Sidebar Drawer */}
      <AnimatePresence>
        {isLangSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLangSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: isRTL ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 bottom-0 ${isRTL ? 'left-0' : 'right-0'} w-full max-w-sm bg-luxury-cream z-[101] shadow-2xl p-8 flex flex-col`}
            >
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-xl font-serif uppercase tracking-widest">Select Language</h3>
                <button onClick={() => setIsLangSidebarOpen(false)} className="p-2 hover:bg-luxury-ink/5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-2">
                {LANGUAGES.map((l) => (
                  <button 
                    key={l.code} 
                    onClick={() => { setLang(l.code); setIsLangSidebarOpen(false); }}
                    className={`flex items-center space-x-4 rtl:space-x-reverse p-4 rounded-sm border transition-all ${lang === l.code ? (darkMode ? 'border-luxury-gold bg-luxury-gold text-black' : 'border-luxury-ink bg-luxury-ink text-white') : 'border-luxury-ink/5 hover:border-luxury-ink/20 hover:bg-luxury-ink/5'}`}
                  >
                    <span className="text-2xl">{l.flag}</span>
                    <div className="text-left rtl:text-right">
                      <div className="text-[10px] uppercase tracking-widest opacity-60">{l.abbr}</div>
                      <div className="text-sm font-medium">{l.label}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-auto pt-8 border-t border-luxury-ink/5 opacity-40 text-[10px] uppercase tracking-widest text-center">
                Eternal Nile — Global Hospitality
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        {section === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
              <motion.img 
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 3, ease: "easeOut" }}
                src="https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1920&q=80" 
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative text-center text-white px-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.5em] mb-4 block opacity-80">{t.hero_slogan}</span>
                  <h1 className="text-5xl sm:text-7xl md:text-9xl font-serif mb-6 tracking-tighter">
                    {t.hero_title}
                  </h1>
                  <p className="text-base md:text-xl font-light tracking-wide max-w-2xl mx-auto opacity-90 mb-8 md:mb-12 px-4">
                    {t.hero_subtitle}
                  </p>
                  <button 
                    onClick={() => setSection('rooms')}
                    className="group relative px-16 sm:px-24 pt-16 sm:pt-24 pb-6 sm:pb-8 transition-all duration-1000 ease-in-out"
                    style={{ 
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                    }}
                  >
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-none group-hover:backdrop-blur-2xl group-hover:bg-white/10 transition-all duration-1000" />
                    <div className="absolute inset-0 border-b-2 border-white/10 group-hover:border-luxury-gold/60 transition-all duration-1000" />
                    
                    <div className="relative z-10 flex flex-col items-center space-y-2">
                      <Pyramid size={20} className="text-luxury-gold/40 group-hover:text-luxury-gold group-hover:scale-110 transition-all duration-700" />
                      <span className="text-xs uppercase tracking-[0.4em] group-hover:tracking-[0.6em] transition-all duration-1000 text-white/70 group-hover:text-white font-medium">
                        {t.book_now}
                      </span>
                    </div>
                  </button>
                </motion.div>
              </div>
            </section>

            <ReviewsSection t={t} reviews={reviews} onOpenReviewModal={() => setIsReviewModalOpen(true)} darkMode={darkMode} />
          </motion.div>
        )}

        {section === 'rooms' && (
          <motion.div 
            key="rooms"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-24 md:pt-32 pb-24 md:pb-32 px-4 md:px-8 max-w-7xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 text-center">{t.nav_rooms}</h2>
            <p className="text-center opacity-40 uppercase tracking-widest text-[10px] md:text-xs mb-12 md:mb-24 px-4">Select your sanctuary</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              {rooms.map((room) => (
                <motion.div 
                  key={room.id}
                  layoutId={`room-${room.id}`}
                  className="group cursor-pointer"
                  onClick={() => { setSelectedRoom(room); setBookingStep(0); }}
                >
                  <div className="aspect-[16/9] overflow-hidden mb-4 md:mb-8 rounded-sm relative">
                    <img 
                      src={room.image_url} 
                      alt={room.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 md:top-6 right-4 md:right-6 bg-luxury-cream/90 backdrop-blur px-3 md:px-4 py-1.5 md:py-2 text-[8px] md:text-[10px] uppercase tracking-widest">
                      {room.category}
                    </div>
                  </div>
                  <div className="flex justify-between items-end px-2 md:px-0">
                    <div>
                      <h3 className="text-xl md:text-2xl font-serif mb-1 md:mb-2">{room.name}</h3>
                      <p className="text-xs md:text-sm opacity-50">{room.capacity} {t.guests} — {room.type}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg md:text-xl font-serif">${room.price}</span>
                      <span className="text-[8px] md:text-[10px] uppercase tracking-widest block opacity-40">{t.price_per_night}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {(section === 'wellness' || section === 'dining') && (
          <motion.div 
            key={section}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-24 md:pt-32 pb-24 md:pb-32 px-4 md:px-8 max-w-7xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-12 md:mb-24 text-center">{section === 'wellness' ? t.wellness_title : t.dining_title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {section === 'wellness' ? (
                wellness.map((facility: any) => (
                  <motion.div 
                    key={facility.id} 
                    className="group cursor-pointer"
                    onClick={() => setSelectedFacility({
                      id: facility.id.toString(),
                      name: facility.name,
                      description: facility.description,
                      long_description: facility.long_description,
                      image_url: facility.image_url,
                      category: 'wellness'
                    })}
                    whileHover={{ y: -5 }}
                  >
                    <div className="aspect-[16/9] overflow-hidden mb-4 md:mb-8 rounded-sm">
                      <img src={facility.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif mb-2 md:mb-4">{facility.name}</h3>
                    <p className="text-xs md:text-sm opacity-60 leading-relaxed max-w-md">{facility.description}</p>
                    <button className="mt-4 md:mt-6 text-[8px] md:text-[10px] uppercase tracking-widest border-b border-black/20 pb-1 hover:border-black transition-colors">
                      Explore Details
                    </button>
                  </motion.div>
                ))
              ) : (
                dining.map((facility) => (
                  <motion.div 
                    key={facility.id} 
                    className="group cursor-pointer"
                    onClick={() => setSelectedFacility({
                      id: facility.id.toString(),
                      name: facility.name,
                      description: facility.description,
                      long_description: facility.long_description,
                      image_url: facility.image_url,
                      category: 'dining',
                      menu: facility.menu?.map(m => ({
                        name: m.name,
                        description: m.description,
                        price: m.price,
                        image_url: m.image_url,
                        category: m.category
                      }))
                    })}
                    whileHover={{ y: -5 }}
                  >
                    <div className="aspect-[16/9] overflow-hidden mb-4 md:mb-8 rounded-sm">
                      <img src={facility.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif mb-2 md:mb-4">{facility.name}</h3>
                    <p className="text-xs md:text-sm opacity-60 leading-relaxed max-w-md">{facility.description}</p>
                    <button className="mt-4 md:mt-6 text-[8px] md:text-[10px] uppercase tracking-widest border-b border-black/20 pb-1 hover:border-black transition-colors">
                      Explore Details
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Facility Details Modal */}
      <AnimatePresence>
        {selectedFacility && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-luxury-bg w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl"
            >
              <div className="relative">
                <div className={`sticky top-0 z-50 flex ${isRTL ? 'justify-start' : 'justify-end'} p-4 md:p-8 pointer-events-none mb-[-48px] md:mb-[-64px]`}>
                  <button 
                    onClick={() => setSelectedFacility(null)} 
                    className="pointer-events-auto p-2 bg-luxury-cream/80 backdrop-blur hover:bg-luxury-cream transition-colors rounded-full shadow-lg"
                  >
                    <X size={20} className="md:w-6 md:h-6" />
                  </button>
                </div>
                
                <div className="h-[30vh] md:h-[40vh] w-full relative">
                  <img src={selectedFacility.image_url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-bg to-transparent" />
                  <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 right-6 md:right-12">
                    <span className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] opacity-60 mb-1 md:mb-2 block">{selectedFacility.category}</span>
                    <h2 className="text-3xl md:text-5xl font-serif">{selectedFacility.name}</h2>
                  </div>
                </div>

                <div className="p-6 md:p-12">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16">
                    <div className="lg:col-span-2 space-y-8 md:space-y-12">
                      <section>
                        <h4 className="text-[10px] uppercase tracking-widest opacity-40 mb-4 md:mb-6">About</h4>
                        <p className="text-base md:text-lg font-light leading-relaxed opacity-80">
                          {selectedFacility.long_description || selectedFacility.description}
                        </p>
                      </section>

                      {selectedFacility.gallery && (
                        <section>
                          <h4 className="text-[10px] uppercase tracking-widest opacity-40 mb-4 md:mb-6">Gallery</h4>
                          <div className="grid grid-cols-2 gap-2 md:gap-4">
                            {selectedFacility.gallery.map((img, i) => (
                              <div key={i} className={`overflow-hidden rounded-sm ${i === 0 ? 'col-span-2 aspect-[21/9]' : 'aspect-square'}`}>
                                <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                    </div>

                    <div className="space-y-8 md:space-y-12">
                      {selectedFacility.menu && (
                        <section>
                          <h4 className="text-[10px] uppercase tracking-widest opacity-40 mb-6 md:mb-8">Menu Highlights</h4>
                          <div className="space-y-8 md:space-y-12">
                            {Array.from(new Set(selectedFacility.menu.map(m => m.category))).map(cat => (
                              <div key={cat}>
                                <h5 className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold mb-4 md:mb-6 border-b border-black/10 pb-2">{cat}</h5>
                                <div className="space-y-6 md:space-y-8">
                                  {selectedFacility.menu?.filter(m => m.category === cat).map((item, i) => (
                                    <div key={i} className="group">
                                      <div className="aspect-video overflow-hidden mb-3 md:mb-4 rounded-sm">
                                        <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                                      </div>
                                      <div className="flex justify-between items-start mb-2">
                                        <h6 className="font-serif text-base md:text-lg">{item.name}</h6>
                                        <span className="font-serif text-base md:text-lg">${item.price}</span>
                                      </div>
                                      <p className="text-xs opacity-50 leading-relaxed">{item.description}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                      
                      <section className="bg-luxury-cream p-6 md:p-8 rounded-sm border border-luxury-ink/5">
                        <h4 className="text-[10px] uppercase tracking-widest opacity-40 mb-4 md:mb-6">Information</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between text-[10px] md:text-xs">
                            <span className="opacity-40 uppercase tracking-widest">Hours</span>
                            <span>07:00 — 22:00</span>
                          </div>
                          <div className="flex justify-between text-[10px] md:text-xs">
                            <span className="opacity-40 uppercase tracking-widest">Access</span>
                            <span>Hotel Guests Only</span>
                          </div>
                          <div className="flex justify-between text-[10px] md:text-xs">
                            <span className="opacity-40 uppercase tracking-widest">Dress Code</span>
                            <span>Smart Casual</span>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal (Same as before but with minor design tweaks) */}
      <AnimatePresence>
        {selectedRoom && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-luxury-bg w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm flex flex-col md:flex-row"
            >
              <div className="md:w-1/2 h-48 md:h-auto">
                <img src={selectedRoom.image_url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="md:w-1/2 p-6 md:p-12 relative">
                <div className={`sticky top-0 z-50 flex ${isRTL ? 'justify-start' : 'justify-end'} mb-[-24px] md:mb-[-32px] pointer-events-none`}>
                  <button 
                    onClick={() => setSelectedRoom(null)} 
                    className="pointer-events-auto p-2 bg-luxury-cream/80 backdrop-blur hover:bg-luxury-cream transition-colors rounded-full shadow-lg opacity-80 hover:opacity-100"
                  >
                    <X size={20} className="md:w-6 md:h-6" />
                  </button>
                </div>
                
                {bookingStep === 0 && (
                  <div>
                    <h2 className="text-2xl md:text-3xl font-serif mb-3 md:mb-4">{selectedRoom.name}</h2>
                    <p className="text-xs md:text-sm opacity-60 mb-6 md:mb-8">{selectedRoom.description}</p>
                    <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
                      <div className="flex items-center space-x-3 md:space-x-4 rtl:space-x-reverse opacity-70">
                        <Users size={16} className="md:w-[18px] md:h-[18px]" />
                        <span className="text-xs md:text-sm uppercase tracking-widest">{selectedRoom.capacity} {t.guests}</span>
                      </div>
                      <div className="flex items-center space-x-3 md:space-x-4 rtl:space-x-reverse opacity-70">
                        <Bed size={16} className="md:w-[18px] md:h-[18px]" />
                        <span className="text-xs md:text-sm uppercase tracking-widest">{selectedRoom.type}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setBookingStep(1)}
                      className="group relative w-full py-3 md:py-4 overflow-hidden transition-all duration-500"
                    >
                      <div className="absolute inset-0 bg-luxury-ink group-hover:bg-luxury-gold/80 group-hover:backdrop-blur-md transition-all duration-500" />
                      <span className="relative z-10 text-white text-xs md:text-sm font-medium uppercase tracking-[0.2em] transition-colors duration-500">
                        {t.book_now} — ${selectedRoom.price}
                      </span>
                    </button>
                  </div>
                )}

                {bookingStep === 1 && (
                  <form onSubmit={handleBooking} className="space-y-6 md:space-y-8">
                    <h2 className="text-xl md:text-2xl font-serif mb-6 md:mb-8">{t.booking_summary}</h2>
                    
                    {/* Date Picker */}
                    <div className="bg-luxury-cream p-3 md:p-4 rounded-sm border border-luxury-ink/5 overflow-x-auto">
                      <label className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-40 mb-3 md:mb-4 block">{t.check_in} — {t.check_out}</label>
                      <div className="flex justify-center flex-col items-center scale-90 md:scale-100 origin-top">
                        <style>{`
                          .rdp-day_booked { 
                            color: #ef4444 !important;
                            background-color: rgba(239, 68, 68, 0.1) !important;
                            font-weight: 800 !important;
                            text-decoration: line-through;
                          }
                          .rdp-day_booked:hover {
                            background-color: rgba(239, 68, 68, 0.2) !important;
                          }
                        `}</style>
                        <DayPicker
                          mode="range"
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={1}
                          modifiers={{
                            booked: bookedDates
                          }}
                          modifiersClassNames={{
                            booked: 'rdp-day_booked'
                          }}
                          disabled={[
                            { before: new Date() },
                            ...bookedDates
                          ]}
                          className="rdp-minimal"
                        />
                        <div className="mt-4 flex items-center space-x-4 text-[9px] uppercase tracking-widest opacity-60">
                          <div className="flex items-center space-x-1.5">
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            <span>{t.booked || 'Occupied'}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <div className="w-2 h-2 border border-luxury-ink/20 rounded-full" />
                            <span>{t.available || 'Available'}</span>
                          </div>
                        </div>
                      </div>
                      {dateRange?.from && dateRange?.to && (
                        <div className="mt-4 text-center text-xs opacity-60">
                          {format(dateRange.from, 'MMM d, yyyy')} — {format(dateRange.to, 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>

                    {/* Guest Selectors */}
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest opacity-40 block">{t.adults}</label>
                        <div className="flex items-center justify-between border-b border-luxury-ink/20 pb-2">
                          <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} className="p-1 hover:opacity-50"><Minus size={14} /></button>
                          <span className="text-sm font-medium">{adults}</span>
                          <button type="button" onClick={() => setAdults(Math.min(10, adults + 1))} className="p-1 hover:opacity-50"><Plus size={14} /></button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest opacity-40 block">{t.children}</label>
                        <div className="flex items-center justify-between border-b border-luxury-ink/20 pb-2">
                          <button type="button" onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))} className="p-1 hover:opacity-50"><Minus size={14} /></button>
                          <span className="text-sm font-medium">{childrenCount}</span>
                          <button type="button" onClick={() => setChildrenCount(Math.min(10, childrenCount + 1))} className="p-1 hover:opacity-50"><Plus size={14} /></button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <input required name="name" placeholder={t.guest_name} className="w-full bg-transparent border-b border-luxury-ink/20 py-3 text-sm focus:outline-none focus:border-luxury-ink" />
                      <input required type="email" name="email" placeholder="Email" className="w-full bg-transparent border-b border-luxury-ink/20 py-3 text-sm focus:outline-none focus:border-luxury-ink" />
                    </div>

                    <button 
                      type="submit"
                      disabled={!dateRange?.from || !dateRange?.to}
                      className={`w-full ${darkMode ? 'bg-luxury-gold text-black' : 'bg-luxury-ink text-white'} py-4 text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all duration-500 mt-8 disabled:opacity-20 shadow-lg`}
                    >
                      {t.confirm_booking}
                    </button>
                    <button type="button" onClick={() => setBookingStep(0)} className="w-full text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100">Back</button>
                  </form>
                )}

                {bookingStep === 2 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ChevronRight size={32} className={isRTL ? 'rotate-180' : ''} />
                    </div>
                    <h2 className="text-2xl font-serif mb-4">Success</h2>
                    <p className="text-sm opacity-60 mb-12">{t.success_message}</p>
                    <button 
                      onClick={() => setSelectedRoom(null)}
                      className={`w-full ${darkMode ? 'bg-luxury-gold text-black' : 'bg-luxury-ink text-white'} py-4 text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all duration-500 shadow-lg`}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MyBookingsModal 
        isOpen={isMyBookingsModalOpen} 
        onClose={() => setIsMyBookingsModalOpen(false)}
        t={t}
        lang={lang}
        isRTL={isRTL}
        myBookings={myBookings}
        fetchMyBookings={fetchMyBookings}
        isSearchingBookings={isSearchingBookings}
        darkMode={darkMode}
      />

      <AnimatePresence>
        {isReviewModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-luxury-bg w-full max-w-md rounded-sm shadow-2xl p-6 md:p-12"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif">{t.leave_review}</h2>
                <button onClick={() => setIsReviewModalOpen(false)} className="p-2 hover:bg-luxury-cream rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handlePostReview} className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">Name</label>
                  <input name="guest_name" required className="w-full bg-transparent border-b border-luxury-ink/20 py-2 text-sm focus:outline-none focus:border-luxury-ink" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.rating}</label>
                  <select name="rating" required className="w-full bg-transparent border-b border-luxury-ink/20 py-2 text-sm focus:outline-none focus:border-luxury-ink dark:bg-luxury-bg">
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.comment}</label>
                  <textarea name="comment" required rows={4} className="w-full bg-transparent border border-luxury-ink/20 p-3 text-sm focus:outline-none focus:border-luxury-ink rounded-sm" />
                </div>
                <button 
                  type="submit"
                  className={`w-full ${darkMode ? 'bg-luxury-gold text-black' : 'bg-luxury-ink text-white'} py-4 text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all duration-500 rounded-sm shadow-lg`}
                >
                  {t.submit_review}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-luxury-cream py-16 md:py-24 px-6 md:px-8 border-t border-luxury-ink/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl md:text-2xl font-serif mb-4 md:mb-6 tracking-widest">{t.hero_title}</h2>
            <p className="text-xs md:text-sm opacity-50 max-w-sm leading-relaxed">
              Experience the timeless beauty of Egypt through the lens of our minimalist luxury.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-widest mb-4 md:mb-6 opacity-40">Contact</h4>
            <p className="text-xs md:text-sm opacity-60">info@eternal-nile.com</p>
            <p className="text-xs md:text-sm opacity-60">+20 123 456 789</p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-widest mb-4 md:mb-6 opacity-40">Location</h4>
            <p className="text-xs md:text-sm opacity-60">Nile Corniche, Luxor</p>
            <p className="text-xs md:text-sm opacity-60">Egypt</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const MyBookingsModal = ({ isOpen, onClose, t, lang, isRTL, myBookings, fetchMyBookings, isSearchingBookings, darkMode }: any) => {
  const [email, setEmail] = useState('');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-luxury-bg w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-sm shadow-2xl p-6 md:p-12"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-serif">{t.my_bookings}</h2>
              <button onClick={onClose} className="p-2 hover:bg-luxury-cream rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex space-x-4 rtl:space-x-reverse mb-8">
              <input 
                type="email" 
                placeholder={t.guest_email_placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent border-b border-luxury-ink/20 py-2 text-sm focus:outline-none focus:border-luxury-ink"
              />
              <button 
                onClick={() => fetchMyBookings(email)}
                disabled={isSearchingBookings}
                className={`px-6 py-2 ${darkMode ? 'bg-luxury-gold text-black' : 'bg-luxury-ink text-white'} text-[10px] uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 shadow-md`}
              >
                {isSearchingBookings ? '...' : t.find}
              </button>
            </div>

            <div className="space-y-6">
              {myBookings.length > 0 ? (
                myBookings.map((booking: any) => (
                  <div key={booking.id} className="p-4 border border-luxury-ink/10 rounded-sm bg-luxury-cream/30">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-serif text-lg">{booking.room_name}</h4>
                      <span className={`text-[8px] uppercase tracking-widest px-2 py-1 rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-[10px] md:text-xs opacity-60">
                      <div>
                        <span className="block uppercase tracking-widest mb-1">{t.check_in}</span>
                        <span>{booking.check_in}</span>
                      </div>
                      <div>
                        <span className="block uppercase tracking-widest mb-1">{t.check_out}</span>
                        <span>{booking.check_out}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center opacity-40 py-12 text-sm">{t.no_bookings_found}</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ReviewsSection = ({ t, reviews, onOpenReviewModal, darkMode }: any) => {
  return (
    <section className={`py-24 md:py-32 ${darkMode ? 'bg-black' : 'bg-luxury-cream/30'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-3xl md:text-5xl font-serif mb-4">{t.reviews}</h2>
            <p className="text-[10px] md:text-xs uppercase tracking-widest opacity-40">What our guests say</p>
          </div>
          <button 
            onClick={onOpenReviewModal}
            className={`text-[10px] uppercase tracking-widest border-b ${darkMode ? 'border-luxury-gold text-luxury-gold' : 'border-luxury-ink/20 hover:border-luxury-ink'} pb-1 transition-colors`}
          >
            {t.leave_review}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {reviews.length > 0 ? (
            reviews.map((review: any) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`p-8 ${darkMode ? 'bg-luxury-cream border-luxury-gold/10' : 'bg-luxury-bg border-luxury-ink/5'} border rounded-sm shadow-sm`}
              >
                <div className="flex mb-4 text-luxury-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <p className="text-sm md:text-base italic opacity-80 mb-6 leading-relaxed">"{review.comment}"</p>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className={`w-8 h-8 ${darkMode ? 'bg-luxury-gold text-black' : 'bg-luxury-ink/10'} rounded-full flex items-center justify-center text-[10px] font-bold`}>
                    {review.guest_name.charAt(0)}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold">{review.guest_name}</span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 opacity-40 italic">No reviews yet. Be the first to share your experience.</div>
          )}
        </div>
      </div>
    </section>
  );
};

const AdminLogin = ({ t, handleAdminLogin, adminLoginError, setView, darkMode }: any) => (
    <div className="min-h-screen bg-luxury-bg flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-luxury-cream p-6 md:p-12 rounded-sm shadow-xl w-full max-w-md ${darkMode ? 'border border-luxury-gold/20' : ''}`}
      >
        <h2 className="text-2xl md:text-3xl font-serif mb-6 md:mb-8 text-center">{t.admin_login_title}</h2>
        <form onSubmit={handleAdminLogin} className="space-y-6">
          <div>
            <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.login}</label>
            <input name="login" required className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-3 text-sm focus:outline-none`} />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.password}</label>
            <input name="password" type="password" required className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-3 text-sm focus:outline-none`} />
          </div>
          {adminLoginError && <p className="text-red-500 text-xs">{adminLoginError}</p>}
          <button 
            type="submit"
            className={`w-full ${darkMode ? 'bg-luxury-gold text-black' : 'bg-luxury-ink text-white'} py-4 text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all duration-500 shadow-lg`}
          >
            {t.login}
          </button>
          <button 
            type="button"
            onClick={() => setView('guest')}
            className={`w-full text-[10px] uppercase tracking-widest ${darkMode ? 'text-luxury-gold hover:text-white' : 'opacity-40 hover:opacity-100'} transition-colors`}
          >
            {t.back}
          </button>
        </form>
      </motion.div>
    </div>
  );

const AdminDashboard = ({ 
  t, stats, allBookings, adminActiveTab, setAdminActiveTab, rooms, setIsAdminLoggedIn, setView, setSection, fetchAdminData, fetchRooms, fetchDining, fetchWellness, dining, wellness, darkMode 
}: any) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [selectedRoomForCalendar, setSelectedRoomForCalendar] = React.useState<any>(null);
  const [selectedBookingForNotes, setSelectedBookingForNotes] = React.useState<Booking | null>(null);
  const [isConfirming, setIsConfirming] = React.useState<number | null>(null);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = React.useState(false);
  const [isAddDiningModalOpen, setIsAddDiningModalOpen] = React.useState(false);
  const [isAddWellnessModalOpen, setIsAddWellnessModalOpen] = React.useState(false);
  const [isAddMenuItemModalOpen, setIsAddMenuItemModalOpen] = React.useState<number | null>(null);
  const [roomToDelete, setRoomToDelete] = React.useState<Room | null>(null);
  const [diningToDelete, setDiningToDelete] = React.useState<DiningFacility | null>(null);
  const [wellnessToDelete, setWellnessToDelete] = React.useState<WellnessFacility | null>(null);
  const [menuItemToDelete, setMenuItemToDelete] = React.useState<DiningMenuItem | null>(null);
  const [imageSourceType, setImageSourceType] = React.useState<'url' | 'file'>('url');
  const [localImageBase64, setLocalImageBase64] = React.useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const imageUrl = imageSourceType === 'url' ? formData.get('image_url') : localImageBase64;

    if (!imageUrl) {
      alert("Please provide an image");
      return;
    }

    const newRoom = {
      name: formData.get('name'),
      price: Number(formData.get('price')),
      description: formData.get('description'),
      image_url: imageUrl,
      capacity: Number(formData.get('capacity')),
      category: formData.get('category'),
      type: formData.get('category') // using category as type for simplicity
    };

    try {
      const res = await fetch('/api/admin/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoom)
      });
      if (res.ok) {
        fetchRooms();
        setIsAddRoomModalOpen(false);
        setLocalImageBase64(null);
      }
    } catch (error) {
      console.error("Failed to add room", error);
    }
  };

  const handleDeleteRoom = async () => {
    if (!roomToDelete) return;
    try {
      const res = await fetch(`/api/admin/rooms/${roomToDelete.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchRooms();
        setRoomToDelete(null);
      }
    } catch (error) {
      console.error("Failed to delete room", error);
    }
  };

  const handleAddDining = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const imageUrl = imageSourceType === 'url' ? formData.get('image_url') : localImageBase64;

    if (!imageUrl) {
      alert("Please provide an image");
      return;
    }

    const newFacility = {
      name: formData.get('name'),
      description: formData.get('description'),
      long_description: formData.get('long_description'),
      image_url: imageUrl
    };

    try {
      const res = await fetch('/api/admin/dining/facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFacility)
      });
      if (res.ok) {
        fetchDining();
        setIsAddDiningModalOpen(false);
        setLocalImageBase64(null);
      }
    } catch (error) {
      console.error("Failed to add dining facility", error);
    }
  };

  const handleDeleteDining = async () => {
    if (!diningToDelete) return;
    try {
      const res = await fetch(`/api/admin/dining/facilities/${diningToDelete.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchDining();
        setDiningToDelete(null);
      }
    } catch (error) {
      console.error("Failed to delete dining facility", error);
    }
  };

  const handleAddWellness = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const imageUrl = imageSourceType === 'url' ? formData.get('image_url') : localImageBase64;

    if (!imageUrl) {
      alert("Please provide an image");
      return;
    }

    const newFacility = {
      name: formData.get('name'),
      category: formData.get('category'),
      description: formData.get('description'),
      long_description: formData.get('long_description'),
      image_url: imageUrl
    };

    try {
      const res = await fetch('/api/admin/wellness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFacility)
      });
      if (res.ok) {
        fetchWellness();
        setIsAddWellnessModalOpen(false);
        setLocalImageBase64(null);
      }
    } catch (error) {
      console.error("Failed to add wellness facility", error);
    }
  };

  const handleDeleteWellness = async () => {
    if (!wellnessToDelete) return;
    try {
      const res = await fetch(`/api/admin/wellness/${wellnessToDelete.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchWellness();
        setWellnessToDelete(null);
      }
    } catch (error) {
      console.error("Failed to delete wellness facility", error);
    }
  };

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddMenuItemModalOpen) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const imageUrl = imageSourceType === 'url' ? formData.get('image_url') : localImageBase64;

    if (!imageUrl) {
      alert("Please provide an image");
      return;
    }

    const newItem = {
      facility_id: isAddMenuItemModalOpen,
      name: formData.get('name'),
      description: formData.get('description'),
      price: Number(formData.get('price')),
      category: formData.get('category'),
      image_url: imageUrl
    };

    try {
      const res = await fetch('/api/admin/dining/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      if (res.ok) {
        fetchDining();
        setIsAddMenuItemModalOpen(null);
        setLocalImageBase64(null);
      }
    } catch (error) {
      console.error("Failed to add menu item", error);
    }
  };

  const handleDeleteMenuItem = async () => {
    if (!menuItemToDelete) return;
    try {
      const res = await fetch(`/api/admin/dining/menu/${menuItemToDelete.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchDining();
        setMenuItemToDelete(null);
      }
    } catch (error) {
      console.error("Failed to delete menu item", error);
    }
  };

  const handleConfirmBooking = async (id: number) => {
    setIsConfirming(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}/confirm`, {
        method: 'PUT'
      });
      if (res.ok) {
        fetchAdminData();
        // Mock email confirmation
        alert(t.booking_confirmed_email);
      }
    } catch (error) {
      console.error("Failed to confirm booking", error);
    } finally {
      setIsConfirming(null);
    }
  };

  const handleSaveNotes = async (id: number, notes: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}/notes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });
      if (res.ok) {
        fetchAdminData();
        setSelectedBookingForNotes(null);
      }
    } catch (error) {
      console.error("Failed to save notes", error);
    }
  };

  const BookingNotesModal = ({ booking, onClose, onSave }: { booking: Booking, onClose: () => void, onSave: (id: number, notes: string) => void }) => {
    const [notes, setNotes] = React.useState(booking.notes || '');

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-luxury-ink/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className={`bg-luxury-cream w-full max-w-md p-4 md:p-8 rounded-sm shadow-2xl border ${darkMode ? 'border-luxury-gold/20' : 'border-luxury-ink/10'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-serif">Booking Notes</h3>
            <button onClick={onClose} className={`p-2 ${darkMode ? 'hover:bg-luxury-gold/10' : 'hover:bg-luxury-ink/5'} rounded-full transition-colors`}>
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-xs uppercase tracking-widest opacity-40 mb-2">Guest</p>
            <p className="text-sm font-medium">{booking.guest_name}</p>
          </div>

          <div className="mb-8">
            <label className="text-xs uppercase tracking-widest opacity-40 block mb-2">Internal Comments</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`w-full h-32 bg-transparent border ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/10 focus:border-luxury-ink'} p-4 text-sm focus:outline-none transition-colors resize-none`}
              placeholder="Add notes about this booking..."
            />
          </div>

          <button 
            onClick={() => onSave(booking.id, notes)}
            className={`w-full ${darkMode ? 'bg-luxury-gold text-black' : 'bg-luxury-ink text-white'} py-4 text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-lg`}
          >
            Save Notes
          </button>
        </motion.div>
      </motion.div>
    );
  };

  const getBookedDates = (roomId: number) => {
    const roomBookings = allBookings.filter((b: any) => b.room_id === roomId);
    const dates: Date[] = [];
    
    roomBookings.forEach((booking: any) => {
      let start = parseISO(booking.check_in);
      let end = parseISO(booking.check_out);
      
      let current = new Date(start);
      while (current < end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });
    return dates;
  };

  const CalendarModal = ({ room, onClose }: any) => {
    const bookedDates = getBookedDates(room.id);
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    const isBooked = (day: number) => {
      const date = new Date(year, month, day);
      return bookedDates.some(bd => 
        bd.getFullYear() === date.getFullYear() && 
        bd.getMonth() === date.getMonth() && 
        bd.getDate() === date.getDate()
      );
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-luxury-ink/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-luxury-cream w-full max-w-md p-4 md:p-8 rounded-sm shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="sticky top-0 z-50 bg-luxury-cream flex justify-between items-center mb-8 pb-4 border-b border-luxury-ink/5">
            <div>
              <h3 className="text-xl font-serif">{room.name}</h3>
              <p className="text-[10px] uppercase tracking-widest opacity-40">{t.availability}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-luxury-ink/5 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => setCurrentMonth(new Date(year, month - 1))}
              className="p-1 hover:text-luxury-gold transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-serif uppercase tracking-widest">
              {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentMonth)}
            </span>
            <button 
              onClick={() => setCurrentMonth(new Date(year, month + 1))}
              className="p-1 hover:text-luxury-gold transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center text-[10px] uppercase opacity-40 font-bold py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10" />
            ))}
            {Array.from({ length: totalDays }).map((_, i) => {
              const day = i + 1;
              const booked = isBooked(day);
              return (
                <div 
                  key={day} 
                  className={`h-10 flex items-center justify-center text-sm rounded-sm transition-colors ${
                    booked 
                      ? 'bg-red-500 text-white font-bold' 
                      : 'hover:bg-luxury-ink/5'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-center space-x-4 text-[10px] uppercase tracking-widest opacity-60">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-sm" />
              <span>{t.booked || 'Booked'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 border border-luxury-ink/10 rounded-sm" />
              <span>{t.available || 'Available'}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-luxury-bg flex flex-col md:flex-row relative overflow-hidden">
      {/* Mobile Header */}
      <div className={`md:hidden ${darkMode ? 'bg-luxury-gold text-black' : 'bg-luxury-ink text-white'} p-4 flex justify-between items-center sticky top-0 z-[60] shadow-md`}>
        <div className="flex items-center space-x-3">
          <Pyramid size={20} className={darkMode ? 'text-black' : 'text-luxury-gold'} />
          <span className="text-sm font-serif tracking-widest uppercase">Admin</span>
        </div>
        <button 
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className={`p-2 ${darkMode ? 'hover:bg-black/10' : 'hover:bg-white/10'} rounded-sm transition-colors`}
        >
          {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isExpanded ? (typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : 288) : 64,
          x: isMobileSidebarOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 768 ? -288 : 0)
        }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`${darkMode ? 'bg-luxury-gold text-black' : 'bg-luxury-ink text-white'} flex flex-col border-r ${darkMode ? 'border-black/10' : 'border-white/5'} fixed md:sticky top-0 left-0 z-50 h-screen transition-transform md:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0 w-full md:w-auto' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className={`flex flex-col h-full ${isExpanded ? 'p-6' : 'py-6 px-0'}`}>
          {/* Header Section */}
          <div className="h-16 flex items-center justify-center mb-12 relative">
            <AnimatePresence mode="wait">
              {!isExpanded ? (
                <motion.div
                  key="logo"
                  initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
                  className={`p-3 ${darkMode ? 'bg-black text-luxury-gold' : 'bg-white text-luxury-ink'} rounded-sm shadow-lg cursor-pointer hover:scale-110 transition-transform`}
                  onClick={() => { setView('guest'); setSection('home'); }}
                >
                  <Pyramid size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="admin-text"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`text-xl font-serif tracking-[0.3em] uppercase whitespace-nowrap cursor-pointer hover:opacity-70 transition-opacity ${darkMode ? 'text-black' : 'text-white'}`}
                  onClick={() => { setView('guest'); setSection('home'); }}
                >
                  ADMIN
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Navigation Items */}
          <nav className="space-y-8 flex-1">
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                  className="space-y-6"
                >
                  {[
                    { id: 'dashboard', icon: LayoutDashboard, label: t.admin_dashboard },
                    { id: 'rooms', icon: Bed, label: t.manage_rooms },
                    { id: 'dining', icon: Utensils, label: t.manage_dining },
                    { id: 'wellness', icon: Dumbbell, label: t.manage_wellness },
                    { id: 'bookings', icon: BookOpen, label: t.manage_bookings }
                  ].map((item) => (
                    <motion.button 
                      key={item.id}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 }
                      }}
                      onClick={() => {
                        setAdminActiveTab(item.id as any);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`flex items-center space-x-4 text-sm uppercase tracking-widest transition-all whitespace-nowrap w-full ${adminActiveTab === item.id ? (darkMode ? 'text-black font-bold scale-105' : 'text-luxury-gold') : (darkMode ? 'text-black/60 hover:text-black' : 'opacity-40 hover:opacity-100')}`}
                    >
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </nav>

          {/* Logout Section */}
          <AnimatePresence>
            {isExpanded && (
              <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => { setIsAdminLoggedIn(false); setView('guest'); }}
                className={`flex items-center space-x-4 text-sm uppercase tracking-widest transition-opacity pt-8 border-t ${darkMode ? 'border-black/10 text-black/60 hover:text-black' : 'border-white/10 opacity-40 hover:opacity-100'} whitespace-nowrap`}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-12 overflow-y-auto">
        {adminActiveTab === 'dashboard' && (
          <>
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 md:mb-12">
              <h1 className="text-2xl md:text-3xl font-serif">{t.admin_dashboard}</h1>
              <div className="flex flex-wrap gap-3 md:gap-4 w-full sm:w-auto">
                <div className={`flex-1 sm:flex-none bg-luxury-cream px-4 md:px-6 py-4 rounded-sm shadow-sm min-w-[120px] border ${darkMode ? 'border-luxury-gold/20' : 'border-luxury-ink/5'}`}>
                  <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-1">{t.revenue}</span>
                  <span className="text-lg md:text-xl font-serif">${stats?.total_revenue?.total || 0}</span>
                </div>
                <div className={`flex-1 sm:flex-none bg-luxury-cream px-4 md:px-6 py-4 rounded-sm shadow-sm min-w-[120px] border ${darkMode ? 'border-luxury-gold/20' : 'border-luxury-ink/5'}`}>
                  <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-1">{t.total_bookings}</span>
                  <span className="text-lg md:text-xl font-serif">{stats?.total_bookings?.count || 0}</span>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className={`lg:col-span-1 bg-luxury-cream p-8 rounded-sm shadow-sm border ${darkMode ? 'border-luxury-gold/20' : 'border-luxury-ink/5'}`}>
                <h3 className="text-sm uppercase tracking-widest mb-8 flex items-center space-x-2">
                  <TrendingUp size={16} className="text-emerald-500" />
                  <span>{t.popular_rooms}</span>
                </h3>
                <div className="space-y-6">
                  {stats?.popular_rooms?.map((room, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{room.name}</span>
                      <span className="text-xs bg-luxury-gold/10 px-2 py-1 rounded-full">{room.booking_count} bookings</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`lg:col-span-2 bg-luxury-cream p-4 md:p-8 rounded-sm shadow-sm border ${darkMode ? 'border-luxury-gold/20' : 'border-luxury-ink/5'}`}>
                <h3 className="text-sm uppercase tracking-widest mb-8">{t.recent_bookings}</h3>
                
                {/* Mobile View: Cards */}
                <div className="md:hidden space-y-4">
                  {allBookings.slice(0, 5).map((booking: any) => (
                    <div 
                      key={booking.id}
                      className={`p-4 rounded-sm border transition-all ${booking.status === 'confirmed' ? 'opacity-60' : ''} ${darkMode ? 'bg-luxury-cream border-luxury-gold/10 shadow-lg' : 'bg-white border-luxury-ink/5 shadow-sm'} active:scale-[0.98]`}
                      onClick={() => setSelectedBookingForNotes(booking)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-sm font-serif">{booking.guest_name}</h4>
                          <p className="text-[10px] opacity-40">{booking.guest_email}</p>
                        </div>
                        <span className={`text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full ${
                          booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-[10px] opacity-60">
                          {booking.room_name} • {new Date(booking.check_in).toLocaleDateString()}
                        </div>
                        {booking.status === 'pending' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConfirmBooking(booking.id);
                            }}
                            disabled={isConfirming === booking.id}
                            className="bg-emerald-500 text-white p-2 rounded-sm hover:bg-emerald-600 transition-colors disabled:opacity-50"
                          >
                            <Check size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View: Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-luxury-ink/5">
                        <th className="pb-4 text-[10px] uppercase tracking-widest opacity-40">{t.guest_name}</th>
                        <th className="pb-4 text-[10px] uppercase tracking-widest opacity-40">{t.room}</th>
                        <th className="pb-4 text-[10px] uppercase tracking-widest opacity-40">{t.date}</th>
                        <th className="pb-4 text-[10px] uppercase tracking-widest opacity-40">{t.status}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-luxury-ink/5">
                      {allBookings.slice(0, 5).map((booking: any) => (
                        <tr 
                          key={booking.id} 
                          className={`transition-all ${darkMode ? 'hover:bg-luxury-gold/5' : 'hover:bg-luxury-ink/[0.02]'} cursor-pointer ${booking.status === 'confirmed' ? 'opacity-40' : ''}`}
                          onClick={() => setSelectedBookingForNotes(booking)}
                        >
                          <td className="py-4">
                            <div className="text-sm font-medium">{booking.guest_name}</div>
                            <div className="text-[10px] opacity-40">{booking.guest_email}</div>
                          </td>
                          <td className="py-4 text-sm">{booking.room_name}</td>
                          <td className="py-4 text-sm">{new Date(booking.check_in).toLocaleDateString()}</td>
                          <td className="py-4">
                            <div className="flex items-center space-x-3">
                              <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full ${
                                booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                              }`}>
                                {booking.status}
                              </span>
                              {booking.status === 'pending' && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleConfirmBooking(booking.id);
                                  }}
                                  disabled={isConfirming === booking.id}
                                  className="p-1.5 bg-emerald-500 text-white rounded-sm hover:bg-emerald-600 transition-colors disabled:opacity-50"
                                  title="Confirm Booking"
                                >
                                  <Check size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {adminActiveTab === 'rooms' && (
          <div className="bg-luxury-cream p-4 md:p-8 rounded-sm shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-xl md:text-2xl font-serif">{t.manage_rooms}</h2>
              <button 
                onClick={() => setIsAddRoomModalOpen(true)}
                className={`w-full sm:w-10 h-10 ${darkMode ? 'bg-luxury-gold text-black' : 'bg-luxury-ink text-white'} rounded-sm flex items-center justify-center hover:opacity-90 transition-all shadow-md`}
              >
                <Plus size={20} className="mr-2 sm:mr-0" />
                <span className="sm:hidden text-[10px] uppercase tracking-widest">{t.add_room}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {rooms.map((room: any) => (
                <div 
                  key={room.id} 
                  className={`relative border ${darkMode ? 'bg-luxury-cream border-luxury-gold/10 shadow-lg' : 'border-luxury-ink/5'} p-4 rounded-sm cursor-pointer hover:border-luxury-gold/30 transition-all hover:shadow-md group`}
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setRoomToDelete(room);
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center z-10 shadow-lg opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <Minus size={16} />
                  </button>
                  <div 
                    onClick={() => setSelectedRoomForCalendar(room)}
                    className="h-full"
                  >
                    <div className="relative overflow-hidden rounded-sm mb-4">
                      <img src={room.image_url} className="w-full h-32 object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-luxury-ink/0 group-hover:bg-luxury-ink/20 transition-colors flex items-center justify-center">
                        <Calendar className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                      </div>
                    </div>
                    <h4 className="font-serif text-base md:text-lg">{room.name}</h4>
                    <p className="text-[10px] opacity-40 uppercase tracking-widest mb-2">{room.category}</p>
                    <p className="text-sm font-medium">${room.price} / night</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {adminActiveTab === 'dining' && (
          <div className="bg-luxury-cream p-4 md:p-8 rounded-sm shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
              <h2 className="text-xl md:text-2xl font-serif">{t.manage_dining}</h2>
              <button 
                onClick={() => setIsAddDiningModalOpen(true)}
                className={`w-full sm:w-10 h-10 ${darkMode ? 'bg-luxury-gold text-black' : 'bg-luxury-ink text-white'} rounded-sm flex items-center justify-center hover:opacity-90 transition-all shadow-md`}
              >
                <Plus size={20} className="mr-2 sm:mr-0" />
                <span className="sm:hidden text-[10px] uppercase tracking-widest">{t.add_dining_facility}</span>
              </button>
            </div>
            
            <div className="space-y-16">
              {dining.map((facility: DiningFacility) => (
                <motion.div 
                  key={facility.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${darkMode ? 'bg-luxury-cream border-luxury-gold/10' : 'bg-white border-luxury-ink/5'} p-4 md:p-8 rounded-sm relative group border shadow-sm`}
                >
                  <button 
                    onClick={() => setDiningToDelete(facility)}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center z-10 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <Minus size={16} />
                  </button>
 
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    <div className="lg:col-span-1">
                      <div className="aspect-video sm:aspect-square overflow-hidden mb-6 rounded-sm">
                        <img src={facility.image_url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-serif mb-2">{facility.name}</h3>
                      <p className="text-xs md:text-sm opacity-60 leading-relaxed mb-4">{facility.description}</p>
                    </div>
                    
                    <div className="lg:col-span-2">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h4 className="text-[10px] uppercase tracking-widest opacity-40">Menu Items</h4>
                        <button 
                          onClick={() => setIsAddMenuItemModalOpen(facility.id)}
                          className={`w-full sm:w-auto text-[10px] uppercase tracking-widest ${darkMode ? 'bg-luxury-gold text-black' : 'bg-luxury-ink text-white'} px-4 py-2 rounded-sm hover:opacity-90 transition-all shadow-md`}
                        >
                          {t.add_menu_item}
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {facility.menu?.map((item: DiningMenuItem) => (
                          <div key={item.id} className="flex items-center space-x-4 p-4 bg-luxury-bg rounded-sm group/item relative">
                            <div className="w-12 h-12 md:w-16 md:h-16 overflow-hidden rounded-sm flex-shrink-0">
                              <img src={item.image_url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs md:text-sm font-medium truncate">{item.name}</p>
                              <p className="text-[10px] md:text-xs opacity-40 truncate">{item.description}</p>
                              <p className="text-[10px] md:text-xs font-serif mt-1">${item.price}</p>
                            </div>
                            <button 
                              onClick={() => setMenuItemToDelete(item)}
                              className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-100 md:opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <Minus size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {adminActiveTab === 'wellness' && (
          <div className="bg-luxury-cream p-4 md:p-8 rounded-sm shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-xl md:text-2xl font-serif">{t.manage_wellness}</h2>
              <button 
                onClick={() => setIsAddWellnessModalOpen(true)}
                className={`w-full sm:w-10 h-10 ${darkMode ? 'bg-luxury-gold text-black' : 'bg-luxury-ink text-white'} rounded-sm flex items-center justify-center hover:opacity-90 transition-all shadow-md`}
              >
                <Plus size={20} className="mr-2 sm:mr-0" />
                <span className="sm:hidden text-[10px] uppercase tracking-widest">{t.add_wellness_facility}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {wellness.map((facility: any) => (
                  <div 
                    key={facility.id} 
                    className={`relative border ${darkMode ? 'bg-luxury-cream border-luxury-gold/10 shadow-lg' : 'border-luxury-ink/5'} p-4 rounded-sm cursor-pointer hover:border-luxury-gold/30 transition-all hover:shadow-md group`}
                  >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setWellnessToDelete(facility);
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center z-10 shadow-lg opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="h-full">
                    <div className="relative overflow-hidden rounded-sm mb-4">
                      <img src={facility.image_url} className="w-full h-32 object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                    </div>
                    <h4 className="font-serif text-base md:text-lg">{facility.name}</h4>
                    <p className="text-[10px] opacity-40 uppercase tracking-widest mb-2">{facility.category}</p>
                    <p className="text-xs md:text-sm opacity-60 line-clamp-2">{facility.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isAddRoomModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-luxury-ink/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-luxury-cream w-full max-w-lg p-6 md:p-8 rounded-sm shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-serif">{t.add_room}</h3>
                <button onClick={() => setIsAddRoomModalOpen(false)} className="p-2 hover:bg-luxury-ink/5 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddRoom} className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.room_name}</label>
                  <input name="name" required className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none`} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.price}</label>
                    <input name="price" type="number" required className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none`} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.capacity}</label>
                    <input name="capacity" type="number" required className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none`} />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.category}</label>
                  <select name="category" required className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none`}>
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Villa">Villa</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.description}</label>
                  <textarea name="description" required className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none h-20 resize-none`} />
                </div>
                
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest opacity-40 block">{t.image_source}</label>
                  <div className="flex space-x-4">
                    <button 
                      type="button"
                      onClick={() => setImageSourceType('url')}
                      className={`flex-1 py-2 text-[10px] uppercase tracking-widest border transition-all ${imageSourceType === 'url' ? (darkMode ? 'bg-luxury-gold text-black border-luxury-gold' : 'bg-luxury-ink text-white border-luxury-ink') : (darkMode ? 'border-luxury-gold/20 text-luxury-gold/60' : 'border-luxury-ink/20 opacity-60')}`}
                    >
                      {t.url}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setImageSourceType('file')}
                      className={`flex-1 py-2 text-[10px] uppercase tracking-widest border transition-all ${imageSourceType === 'file' ? (darkMode ? 'bg-luxury-gold text-black border-luxury-gold' : 'bg-luxury-ink text-white border-luxury-ink') : (darkMode ? 'border-luxury-gold/20 text-luxury-gold/60' : 'border-luxury-ink/20 opacity-60')}`}
                    >
                      {t.local_file}
                    </button>
                  </div>

                  {imageSourceType === 'url' ? (
                    <div>
                      <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.image_url}</label>
                      <input name="image_url" required={imageSourceType === 'url'} className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none`} />
                    </div>
                  ) : (
                    <div>
                      <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.choose_file}</label>
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange}
                          required={imageSourceType === 'file'}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className={`w-full border-b ${darkMode ? 'border-luxury-gold/20' : 'border-luxury-ink/20'} py-2 text-sm opacity-60 flex justify-between items-center`}>
                          <span>{localImageBase64 ? 'Image selected' : t.choose_file}</span>
                          <Sparkles size={14} />
                        </div>
                      </div>
                      {localImageBase64 && (
                        <div className={`mt-4 h-32 w-full overflow-hidden rounded-sm border ${darkMode ? 'border-luxury-gold/10' : 'border-luxury-ink/10'}`}>
                          <img src={localImageBase64} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button type="submit" className={`w-full ${darkMode ? 'bg-luxury-gold text-black' : 'bg-luxury-ink text-white'} py-4 text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all mt-4 shadow-lg`}>
                  {t.add_room}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {isAddWellnessModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-luxury-ink/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-luxury-cream w-full max-w-lg p-8 rounded-sm shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-serif">{t.add_wellness_facility}</h3>
                <button onClick={() => setIsAddWellnessModalOpen(false)} className="p-2 hover:bg-luxury-ink/5 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddWellness} className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.facility_name}</label>
                  <input name="name" required className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none`} />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.category}</label>
                  <input name="category" required className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none`} placeholder="e.g., Spa, Fitness, Pool" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.description}</label>
                  <textarea name="description" required className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none h-20`} />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.long_description}</label>
                  <textarea name="long_description" required className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none h-32`} />
                </div>
                
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.image_source}</label>
                  <div className="flex space-x-4 mb-4">
                    <button 
                      type="button"
                      onClick={() => setImageSourceType('url')}
                      className={`flex-1 py-2 text-[10px] uppercase tracking-widest border transition-all ${imageSourceType === 'url' ? (darkMode ? 'bg-luxury-gold text-black border-luxury-gold' : 'bg-luxury-ink text-white border-luxury-ink') : (darkMode ? 'border-luxury-gold/20 text-luxury-gold/60' : 'border-luxury-ink/20 opacity-60')}`}
                    >
                      URL
                    </button>
                    <button 
                      type="button"
                      onClick={() => setImageSourceType('file')}
                      className={`flex-1 py-2 text-[10px] uppercase tracking-widest border transition-all ${imageSourceType === 'file' ? (darkMode ? 'bg-luxury-gold text-black border-luxury-gold' : 'bg-luxury-ink text-white border-luxury-ink') : (darkMode ? 'border-luxury-gold/20 text-luxury-gold/60' : 'border-luxury-ink/20 opacity-60')}`}
                    >
                      File
                    </button>
                  </div>
                  
                  {imageSourceType === 'url' ? (
                    <input name="image_url" placeholder="https://..." className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none`} />
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange} 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className={`w-full border-2 border-dashed ${darkMode ? 'border-luxury-gold/20 hover:border-luxury-gold/40' : 'border-luxury-ink/20 hover:border-luxury-ink/40'} rounded-sm py-8 flex flex-col items-center justify-center space-y-2 transition-colors`}>
                          <Upload size={24} className="opacity-40" />
                          <span className="text-[10px] uppercase tracking-widest opacity-60">{t.choose_file}</span>
                        </div>
                      </div>
                      {localImageBase64 && (
                        <div className={`aspect-video w-full overflow-hidden rounded-sm border ${darkMode ? 'border-luxury-gold/10' : 'border-luxury-ink/10'} relative group`}>
                          <img src={localImageBase64} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button type="submit" className={`w-full ${darkMode ? 'bg-luxury-gold text-black' : 'bg-luxury-ink text-white'} py-4 text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg`}>
                  {t.add_wellness_facility}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {selectedRoomForCalendar && (
          <CalendarModal 
            room={selectedRoomForCalendar} 
            onClose={() => setSelectedRoomForCalendar(null)} 
          />
        )}

        {selectedBookingForNotes && (
          <BookingNotesModal 
            booking={selectedBookingForNotes}
            onClose={() => setSelectedBookingForNotes(null)}
            onSave={handleSaveNotes}
          />
        )}

        {adminActiveTab === 'bookings' && (
          <div className="bg-luxury-cream p-4 md:p-8 rounded-sm shadow-sm">
            <h2 className="text-xl md:text-2xl font-serif mb-8">{t.manage_bookings}</h2>
            
            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-4">
              {allBookings.map((booking) => (
                <div 
                  key={booking.id}
                  onClick={() => setSelectedBookingForNotes(booking)}
                  className={`${darkMode ? 'bg-luxury-cream border-luxury-gold/10' : 'bg-white border-luxury-ink/5'} p-6 rounded-sm border shadow-sm active:scale-[0.98] transition-transform`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">ID #{booking.id}</p>
                      <h3 className="text-base font-serif">{booking.guest_name}</h3>
                      <p className="text-xs opacity-50">{booking.guest_email}</p>
                    </div>
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full ${
                      booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">{t.room}</p>
                      <p className="text-xs font-medium">{booking.room_name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Total</p>
                      <p className="text-xs font-medium">${booking.total_price}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Check In</p>
                      <p className="text-xs">{booking.check_in}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Check Out</p>
                      <p className="text-xs">{booking.check_out}</p>
                    </div>
                  </div>

                  {booking.status === 'pending' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmBooking(booking.id);
                      }}
                      className="w-full bg-emerald-600 text-white py-3 text-[10px] uppercase tracking-widest rounded-sm hover:bg-emerald-700 transition-colors"
                    >
                      Confirm Booking
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-luxury-ink/5">
                    <th className="pb-4 text-[10px] uppercase tracking-widest opacity-40">ID</th>
                    <th className="pb-4 text-[10px] uppercase tracking-widest opacity-40">{t.guest_name}</th>
                    <th className="pb-4 text-[10px] uppercase tracking-widest opacity-40">{t.room}</th>
                    <th className="pb-4 text-[10px] uppercase tracking-widest opacity-40">Check In</th>
                    <th className="pb-4 text-[10px] uppercase tracking-widest opacity-40">Check Out</th>
                    <th className="pb-4 text-[10px] uppercase tracking-widest opacity-40">Total</th>
                    <th className="pb-4 text-[10px] uppercase tracking-widest opacity-40">Status</th>
                    <th className="pb-4 text-[10px] uppercase tracking-widest opacity-40">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-ink/5">
                  {allBookings.map((booking) => (
                    <tr 
                      key={booking.id}
                      className={`transition-all ${darkMode ? 'hover:bg-luxury-gold/5' : 'hover:bg-luxury-ink/[0.02]'} cursor-pointer`}
                      onClick={() => setSelectedBookingForNotes(booking)}
                    >
                      <td className="py-4 text-xs">#{booking.id}</td>
                      <td className="py-4">
                        <div className="text-sm font-medium">{booking.guest_name}</div>
                        <div className="text-[10px] opacity-40">{booking.guest_email}</div>
                      </td>
                      <td className="py-4 text-sm">{booking.room_name}</td>
                      <td className="py-4 text-sm">{booking.check_in}</td>
                      <td className="py-4 text-sm">{booking.check_out}</td>
                      <td className="py-4 text-sm font-medium">${booking.total_price}</td>
                      <td className="py-4">
                        <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full ${
                          booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4">
                        {booking.status === 'pending' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConfirmBooking(booking.id);
                            }}
                            className="text-[10px] uppercase tracking-widest bg-emerald-600 text-white px-3 py-1 rounded-sm hover:bg-emerald-700 transition-colors"
                          >
                            Confirm
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {isAddRoomModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-luxury-ink/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-luxury-cream w-full max-w-lg p-4 md:p-8 rounded-sm shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-serif">{t.add_room}</h3>
                <button onClick={() => setIsAddRoomModalOpen(false)} className="p-2 hover:bg-luxury-ink/5 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddRoom} className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.room_name}</label>
                  <input name="name" required className="w-full bg-transparent border-b border-luxury-ink/20 py-2 text-sm focus:outline-none focus:border-luxury-gold" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.price}</label>
                    <input name="price" type="number" required className="w-full bg-transparent border-b border-luxury-ink/20 py-2 text-sm focus:outline-none focus:border-luxury-gold" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.capacity}</label>
                    <input name="capacity" type="number" required className="w-full bg-transparent border-b border-luxury-ink/20 py-2 text-sm focus:outline-none focus:border-luxury-gold" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.category}</label>
                  <select name="category" required className="w-full bg-transparent border-b border-luxury-ink/20 py-2 text-sm focus:outline-none focus:border-luxury-gold">
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Villa">Villa</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.description}</label>
                  <textarea name="description" required className="w-full bg-transparent border-b border-luxury-ink/20 py-2 text-sm focus:outline-none focus:border-luxury-gold h-20 resize-none" />
                </div>
                
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest opacity-40 block">{t.image_source}</label>
                  <div className="flex space-x-4">
                    <button 
                      type="button"
                      onClick={() => setImageSourceType('url')}
                      className={`flex-1 py-2 text-[10px] uppercase tracking-widest border ${imageSourceType === 'url' ? 'bg-luxury-ink text-white border-luxury-ink' : 'border-luxury-ink/20 opacity-60'}`}
                    >
                      URL
                    </button>
                    <button 
                      type="button"
                      onClick={() => setImageSourceType('file')}
                      className={`flex-1 py-2 text-[10px] uppercase tracking-widest border ${imageSourceType === 'file' ? 'bg-luxury-ink text-white border-luxury-ink' : 'border-luxury-ink/20 opacity-60'}`}
                    >
                      Local File
                    </button>
                  </div>
                  
                  {imageSourceType === 'url' ? (
                    <input name="image_url" placeholder="https://..." className="w-full bg-transparent border-b border-luxury-ink/20 py-2 text-sm focus:outline-none focus:border-luxury-gold" />
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange} 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className="w-full border-2 border-dashed border-luxury-ink/20 rounded-sm py-8 flex flex-col items-center justify-center space-y-2 hover:border-luxury-gold transition-colors">
                          <Upload size={24} className="opacity-40" />
                          <span className="text-[10px] uppercase tracking-widest opacity-60">{t.choose_file}</span>
                        </div>
                      </div>
                      {localImageBase64 && (
                        <div className="aspect-video w-full overflow-hidden rounded-sm border border-luxury-ink/10 relative group">
                          <img src={localImageBase64} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-[10px] uppercase tracking-widest">Preview</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button type="submit" className={`w-full ${darkMode ? 'bg-luxury-gold text-black' : 'bg-luxury-ink text-white'} py-4 text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg`}>
                  {t.add_room}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {isAddDiningModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-luxury-ink/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-luxury-cream w-full max-w-lg p-4 md:p-8 rounded-sm shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-serif">{t.add_dining_facility}</h3>
                <button onClick={() => setIsAddDiningModalOpen(false)} className="p-2 hover:bg-luxury-ink/5 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddDining} className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.facility_name}</label>
                  <input name="name" required className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none`} />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.description}</label>
                  <input name="description" required className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none`} />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.long_description}</label>
                  <textarea name="long_description" required className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none h-24 resize-none`} />
                </div>
                
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest opacity-40 block">{t.image_source}</label>
                  <div className="flex space-x-4">
                    <button 
                      type="button"
                      onClick={() => setImageSourceType('url')}
                      className={`flex-1 py-2 text-[10px] uppercase tracking-widest border transition-all ${imageSourceType === 'url' ? (darkMode ? 'bg-luxury-gold text-black border-luxury-gold' : 'bg-luxury-ink text-white border-luxury-ink') : (darkMode ? 'border-luxury-gold/20 text-luxury-gold/60' : 'border-luxury-ink/20 opacity-60')}`}
                    >
                      URL
                    </button>
                    <button 
                      type="button"
                      onClick={() => setImageSourceType('file')}
                      className={`flex-1 py-2 text-[10px] uppercase tracking-widest border transition-all ${imageSourceType === 'file' ? (darkMode ? 'bg-luxury-gold text-black border-luxury-gold' : 'bg-luxury-ink text-white border-luxury-ink') : (darkMode ? 'border-luxury-gold/20 text-luxury-gold/60' : 'border-luxury-ink/20 opacity-60')}`}
                    >
                      Local File
                    </button>
                  </div>
                  
                  {imageSourceType === 'url' ? (
                    <input name="image_url" placeholder="https://..." className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none`} />
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange} 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className={`w-full border-2 border-dashed ${darkMode ? 'border-luxury-gold/20 hover:border-luxury-gold/40' : 'border-luxury-ink/20 hover:border-luxury-ink/40'} rounded-sm py-8 flex flex-col items-center justify-center space-y-2 transition-colors`}>
                          <Upload size={24} className="opacity-40" />
                          <span className="text-[10px] uppercase tracking-widest opacity-60">{t.choose_file}</span>
                        </div>
                      </div>
                      {localImageBase64 && (
                        <div className={`aspect-video w-full overflow-hidden rounded-sm border ${darkMode ? 'border-luxury-gold/10' : 'border-luxury-ink/10'} relative group`}>
                          <img src={localImageBase64} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button type="submit" className={`w-full ${darkMode ? 'bg-luxury-gold text-black' : 'bg-luxury-ink text-white'} py-4 text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg`}>
                  {t.add_dining_facility}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {isAddWellnessModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-luxury-ink/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-luxury-cream w-full max-w-lg p-4 md:p-8 rounded-sm shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-serif">{t.add_wellness_facility}</h3>
                <button onClick={() => setIsAddWellnessModalOpen(false)} className="p-2 hover:bg-luxury-ink/5 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddWellness} className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.facility_name}</label>
                  <input name="name" required className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none`} />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.description}</label>
                  <input name="description" required className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none`} />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.long_description}</label>
                  <textarea name="long_description" required className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none h-24 resize-none`} />
                </div>
                
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest opacity-40 block">{t.image_source}</label>
                  <div className="flex space-x-4">
                    <button 
                      type="button"
                      onClick={() => setImageSourceType('url')}
                      className={`flex-1 py-2 text-[10px] uppercase tracking-widest border transition-all ${imageSourceType === 'url' ? (darkMode ? 'bg-luxury-gold text-black border-luxury-gold' : 'bg-luxury-ink text-white border-luxury-ink') : (darkMode ? 'border-luxury-gold/20 text-luxury-gold/60' : 'border-luxury-ink/20 opacity-60')}`}
                    >
                      URL
                    </button>
                    <button 
                      type="button"
                      onClick={() => setImageSourceType('file')}
                      className={`flex-1 py-2 text-[10px] uppercase tracking-widest border transition-all ${imageSourceType === 'file' ? (darkMode ? 'bg-luxury-gold text-black border-luxury-gold' : 'bg-luxury-ink text-white border-luxury-ink') : (darkMode ? 'border-luxury-gold/20 text-luxury-gold/60' : 'border-luxury-ink/20 opacity-60')}`}
                    >
                      Local File
                    </button>
                  </div>
                  
                  {imageSourceType === 'url' ? (
                    <input name="image_url" placeholder="https://..." className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none`} />
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange} 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className={`w-full border-2 border-dashed ${darkMode ? 'border-luxury-gold/20 hover:border-luxury-gold/40' : 'border-luxury-ink/20 hover:border-luxury-ink/40'} rounded-sm py-8 flex flex-col items-center justify-center space-y-2 transition-colors`}>
                          <Upload size={24} className="opacity-40" />
                          <span className="text-[10px] uppercase tracking-widest opacity-60">{t.choose_file}</span>
                        </div>
                      </div>
                      {localImageBase64 && (
                        <div className={`aspect-video w-full overflow-hidden rounded-sm border ${darkMode ? 'border-luxury-gold/10' : 'border-luxury-ink/10'} relative group`}>
                          <img src={localImageBase64} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className={`w-full ${darkMode ? 'bg-luxury-gold text-black' : 'bg-luxury-ink text-white'} py-4 text-[10px] uppercase tracking-widest hover:opacity-90 transition-all font-bold shadow-lg`}
                >
                  {t.add_wellness_facility}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {isAddMenuItemModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-luxury-ink/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-luxury-cream w-full max-w-lg p-4 md:p-8 rounded-sm shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-serif">{t.add_menu_item}</h3>
                <button onClick={() => setIsAddMenuItemModalOpen(null)} className="p-2 hover:bg-luxury-ink/5 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddMenuItem} className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.item_name}</label>
                  <input name="name" required className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none`} />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.price}</label>
                  <input name="price" type="number" required className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none`} />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.category}</label>
                  <input name="category" required className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none`} />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">{t.description}</label>
                  <textarea name="description" required className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none h-20 resize-none`} />
                </div>
                
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest opacity-40 block">{t.image_source}</label>
                  <div className="flex space-x-4">
                    <button 
                      type="button"
                      onClick={() => setImageSourceType('url')}
                      className={`flex-1 py-2 text-[10px] uppercase tracking-widest border transition-all ${imageSourceType === 'url' ? (darkMode ? 'bg-luxury-gold text-black border-luxury-gold' : 'bg-luxury-ink text-white border-luxury-ink') : (darkMode ? 'border-luxury-gold/20 text-luxury-gold/60' : 'border-luxury-ink/20 opacity-60')}`}
                    >
                      URL
                    </button>
                    <button 
                      type="button"
                      onClick={() => setImageSourceType('file')}
                      className={`flex-1 py-2 text-[10px] uppercase tracking-widest border transition-all ${imageSourceType === 'file' ? (darkMode ? 'bg-luxury-gold text-black border-luxury-gold' : 'bg-luxury-ink text-white border-luxury-ink') : (darkMode ? 'border-luxury-gold/20 text-luxury-gold/60' : 'border-luxury-ink/20 opacity-60')}`}
                    >
                      Local File
                    </button>
                  </div>
                  
                  {imageSourceType === 'url' ? (
                    <input name="image_url" placeholder="https://..." className={`w-full bg-transparent border-b ${darkMode ? 'border-luxury-gold/20 focus:border-luxury-gold' : 'border-luxury-ink/20 focus:border-luxury-ink'} py-2 text-sm focus:outline-none`} />
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange} 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className={`w-full border-2 border-dashed ${darkMode ? 'border-luxury-gold/20 hover:border-luxury-gold/40' : 'border-luxury-ink/20 hover:border-luxury-ink/40'} rounded-sm py-8 flex flex-col items-center justify-center space-y-2 transition-colors`}>
                          <Upload size={24} className="opacity-40" />
                          <span className="text-[10px] uppercase tracking-widest opacity-60">{t.choose_file}</span>
                        </div>
                      </div>
                      {localImageBase64 && (
                        <div className={`aspect-video w-full overflow-hidden rounded-sm border ${darkMode ? 'border-luxury-gold/10' : 'border-luxury-ink/10'} relative group`}>
                          <img src={localImageBase64} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button type="submit" className={`w-full ${darkMode ? 'bg-luxury-gold text-black' : 'bg-luxury-ink text-white'} py-4 text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg`}>
                  {t.add_menu_item}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Confirmations */}
        {roomToDelete && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-luxury-ink/80 backdrop-blur-sm p-4">
            <div className={`bg-luxury-cream p-8 rounded-sm max-w-sm w-full shadow-2xl border ${darkMode ? 'border-luxury-gold/20' : 'border-luxury-ink/10'}`}>
              <h3 className="text-xl font-serif mb-4">{t.delete_room_confirm}</h3>
              <p className="text-sm opacity-60 mb-8">Are you sure you want to remove {roomToDelete.name}?</p>
              <div className="flex space-x-4">
                <button onClick={() => setRoomToDelete(null)} className={`flex-1 py-3 text-[10px] uppercase tracking-widest border ${darkMode ? 'border-luxury-gold/20 hover:bg-luxury-gold/10' : 'border-luxury-ink/20 hover:bg-luxury-ink/5'} transition-colors font-medium`}>
                  {t.cancel}
                </button>
                <button onClick={handleDeleteRoom} className="flex-1 py-3 text-[10px] uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 transition-colors font-bold shadow-lg">
                  {t.confirm_delete}
                </button>
              </div>
            </div>
          </div>
        )}

        {diningToDelete && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-luxury-ink/80 backdrop-blur-sm p-4">
            <div className={`bg-luxury-cream p-8 rounded-sm max-w-sm w-full shadow-2xl border ${darkMode ? 'border-luxury-gold/20' : 'border-luxury-ink/10'}`}>
              <h3 className="text-xl font-serif mb-4">{t.delete_facility_confirm}</h3>
              <p className="text-sm opacity-60 mb-8">Are you sure you want to remove {diningToDelete.name}?</p>
              <div className="flex space-x-4">
                <button onClick={() => setDiningToDelete(null)} className={`flex-1 py-3 text-[10px] uppercase tracking-widest border ${darkMode ? 'border-luxury-gold/20 hover:bg-luxury-gold/10' : 'border-luxury-ink/20 hover:bg-luxury-ink/5'} transition-colors font-medium`}>
                  {t.cancel}
                </button>
                <button onClick={handleDeleteDining} className="flex-1 py-3 text-[10px] uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 transition-colors font-bold shadow-lg">
                  {t.confirm_delete}
                </button>
              </div>
            </div>
          </div>
        )}

        {wellnessToDelete && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-luxury-ink/80 backdrop-blur-sm p-4">
            <div className={`bg-luxury-cream p-8 rounded-sm max-w-sm w-full shadow-2xl border ${darkMode ? 'border-luxury-gold/20' : 'border-luxury-ink/10'}`}>
              <h3 className="text-xl font-serif mb-4">{t.delete_wellness_confirm}</h3>
              <p className="text-sm opacity-60 mb-8">Are you sure you want to remove {wellnessToDelete.name}?</p>
              <div className="flex space-x-4">
                <button onClick={() => setWellnessToDelete(null)} className={`flex-1 py-3 text-[10px] uppercase tracking-widest border ${darkMode ? 'border-luxury-gold/20 hover:bg-luxury-gold/10' : 'border-luxury-ink/20 hover:bg-luxury-ink/5'} transition-colors font-medium`}>
                  {t.cancel}
                </button>
                <button onClick={handleDeleteWellness} className="flex-1 py-3 text-[10px] uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 transition-colors font-bold shadow-lg">
                  {t.confirm_delete}
                </button>
              </div>
            </div>
          </div>
        )}

        {menuItemToDelete && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-luxury-ink/80 backdrop-blur-sm p-4">
            <div className={`bg-luxury-cream p-8 rounded-sm max-w-sm w-full shadow-2xl border ${darkMode ? 'border-luxury-gold/20' : 'border-luxury-ink/10'}`}>
              <h3 className="text-xl font-serif mb-4">{t.delete_item_confirm}</h3>
              <p className="text-sm opacity-60 mb-8">Are you sure you want to remove {menuItemToDelete.name}?</p>
              <div className="flex space-x-4">
                <button onClick={() => setMenuItemToDelete(null)} className={`flex-1 py-3 text-[10px] uppercase tracking-widest border ${darkMode ? 'border-luxury-gold/20 hover:bg-luxury-gold/10' : 'border-luxury-ink/20 hover:bg-luxury-ink/5'} transition-colors font-medium`}>
                  {t.cancel}
                </button>
                <button onClick={handleDeleteMenuItem} className="flex-1 py-3 text-[10px] uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 transition-colors font-bold shadow-lg">
                  {t.confirm_delete}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
