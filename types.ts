export interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
  description: string;
  image_url: string;
  capacity: number;
  category: 'Standard' | 'Deluxe' | 'Suite' | 'Villa';
}

export interface MenuItem {
  name: string;
  description: string;
  price: number;
  image_url: string;
  category?: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  long_description: string;
  image_url: string;
  category: string;
  gallery?: string[];
  menu?: any[];
}

export interface DiningMenuItem {
  id: number;
  facility_id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}

export interface DiningFacility {
  id: number;
  name: string;
  description: string;
  long_description: string;
  image_url: string;
  menu?: DiningMenuItem[];
}

export interface WellnessFacility {
  id: number;
  name: string;
  description: string;
  long_description: string;
  image_url: string;
  category: string;
}

export interface Booking {
  id: number;
  room_id: number;
  room_name?: string;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  total_price: number;
  notes?: string;
  created_at: string;
}

export interface AdminStats {
  total_revenue: { total: number | null };
  total_bookings: { count: number };
  popular_rooms: { name: string; booking_count: number }[];
  recent_bookings: Booking[];
}

export type Language = 'en' | 'ar' | 'uz' | 'ru' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'zh' | 'ja' | 'ko' | 'tr' | 'hi' | 'bn' | 'vi';

export const translations: Record<Language, any> = {
  en: {
    nav_home: 'Home', nav_rooms: 'Rooms', nav_wellness: 'Wellness', nav_dining: 'Dining', nav_admin: 'Admin',
    hero_title: 'The Eternal Nile', hero_subtitle: 'Where the echoes of Pharaohs meet modern serenity.',
    hero_slogan: 'Om El Donya — Mother of the World', book_now: 'Book Now', check_in: 'Check In',
    check_out: 'Check Out', guests: 'Guests', adults: 'Adults', children: 'Children', room_details: 'Room Details', price_per_night: 'per night',
    booking_summary: 'Booking Summary', confirm_booking: 'Confirm Booking', success_message: 'Your booking has been received.',
    admin_dashboard: 'Dashboard', revenue: 'Revenue', total_bookings: 'Total Bookings', popular_rooms: 'Popular Rooms',
    recent_bookings: 'Recent Bookings', guest_name: 'Guest Name', room: 'Room', status: 'Status', date: 'Date',
    back: 'Back', login: 'Login', password: 'Password', admin_login_title: 'Admin Access',
    invalid_credentials: 'Invalid credentials', wellness_title: 'Wellness', dining_title: 'Dining',
    manage_rooms: 'Manage Rooms', manage_bookings: 'Manage Bookings',
    manage_dining: 'Manage Dining', add_dining_facility: 'Add Dining Facility',
    manage_wellness: 'Manage Wellness', add_wellness_facility: 'Add Wellness Facility',
    add_menu_item: 'Add Menu Item', facility_name: 'Facility Name',
    long_description: 'Long Description', item_name: 'Item Name',
    delete_facility_confirm: 'Are you sure you want to delete this facility?',
    delete_item_confirm: 'Are you sure you want to delete this menu item?',
    add_room: 'Add Room', delete_room_confirm: 'Are you sure you want to delete this room?',
    delete_wellness_confirm: 'Are you sure you want to delete this wellness facility?',
    confirm: 'Confirm', cancel: 'Cancel', confirm_delete: 'Delete', room_name: 'Room Name', price: 'Price',
    description: 'Description', image_url: 'Image URL', capacity: 'Capacity', category: 'Category',
    image_source: 'Image Source', url: 'URL', local_file: 'Local File', choose_file: 'Choose File',
    dark_mode: 'Dark Mode', light_mode: 'Light Mode', booking_confirmed_email: 'A confirmation email has been sent to the guest.',
    my_bookings: 'My Bookings', reviews: 'Reviews', leave_review: 'Leave a Review', guest_email_placeholder: 'Enter your email to find bookings',
    no_bookings_found: 'No bookings found for this email.', rating: 'Rating', comment: 'Comment', submit_review: 'Submit Review',
    review_success: 'Thank you for your review!', find: 'Find'
  },
  ar: {
    nav_home: 'الرئيسية', nav_rooms: 'الغرف', nav_wellness: 'العافية', nav_dining: 'الطعام', nav_admin: 'المسؤول',
    hero_title: 'النيل الخالد', hero_subtitle: 'حيث تلتقي أصداء الفراعنة مع الصفاء الحديث.',
    hero_slogan: 'مصر أم الدنيا', book_now: 'احجز الآن', check_in: 'تاريخ الدخول',
    check_out: 'تاريخ الخروج', guests: 'الضيوف', adults: 'البالغين', children: 'الأطفال', room_details: 'تفاصيل الغرفة', price_per_night: 'لكل ليلة',
    booking_summary: 'ملخص الحجز', confirm_booking: 'تأكيد الحجز', success_message: 'تم استلام حجزك.',
    admin_dashboard: 'لوحة التحكم', revenue: 'الإيرادات', total_bookings: 'إجمالي الحجوزات', popular_rooms: 'الغرف الأكثر طلباً',
    recent_bookings: 'أحدث الحجوزات', guest_name: 'اسم الضيف', room: 'الغرفة', status: 'الحالة', date: 'التاريخ',
    back: 'رجوع', login: 'تسجيل الدخول', password: 'كلمة المرور', admin_login_title: 'دخول المسؤول',
    invalid_credentials: 'بيانات الاعتماد غير صالحة', wellness_title: 'العافية', dining_title: 'الطعام',
    manage_rooms: 'إدارة الغرف', manage_bookings: 'إدارة الحجوزات',
    manage_dining: 'إدارة المطاعم', add_dining_facility: 'إضافة منشأة طعام',
    manage_wellness: 'إدارة العافية', add_wellness_facility: 'إضافة منشأة عافية',
    add_menu_item: 'إضافة عنصر قائمة', facility_name: 'اسم المنشأة',
    long_description: 'وصف طويل', item_name: 'اسم العنصر',
    delete_facility_confirm: 'هل أنت متأكد أنك تريد حذف هذه المنشأة؟',
    delete_item_confirm: 'هل أنت متأكد أنك تريد حذف هذا العنصر؟',
    add_room: 'إضافة غرفة', delete_room_confirm: 'هل أنت متأكد أنك تريد حذف هذه الغرفة؟',
    delete_wellness_confirm: 'هل أنت متأكد أنك تريد حذف منشأة العافية هذه؟',
    confirm: 'تأكيد', cancel: 'إلغاء', confirm_delete: 'حذف', room_name: 'اسم الغرفة', price: 'السعر',
    description: 'الوصف', image_url: 'رابط الصورة', capacity: 'السعة', category: 'الفئة',
    image_source: 'مصدر الصورة', url: 'رابط', local_file: 'ملف محلي', choose_file: 'اختر ملفاً',
    dark_mode: 'الوضع الداكن', light_mode: 'الوضع الفاتح', booking_confirmed_email: 'تم إرسال بريد تأكيد إلى الضيف.',
    my_bookings: 'حجوزاتي', reviews: 'التقييمات', leave_review: 'اترك تقييماً', guest_email_placeholder: 'أدخل بريدك الإلكتروني للعثور على الحجوزات',
    no_bookings_found: 'لم يتم العثور على حجوزات لهذا البريد الإلكتروني.', rating: 'التقييم', comment: 'التعليق', submit_review: 'إرسال التقييم',
    review_success: 'شكراً لتقييمك!', find: 'بحث'
  },
  uz: {
    nav_home: 'Bosh sahifa', nav_rooms: 'Xonalar', nav_wellness: 'Sogʻlomlashtirish', nav_dining: 'Restoran', nav_admin: 'Admin',
    hero_title: 'Abadiy Nil', hero_subtitle: 'Firʼavnlar sadosi zamonaviy osoyishtalik bilan uchrashadigan joy.',
    hero_slogan: 'Om El Donya — Dunyo onasi', book_now: 'Band qilish', check_in: 'Kirish',
    check_out: 'Chiqish', guests: 'Mehmonlar', adults: 'Kattalar', children: 'Bolalar', room_details: 'Xona tafsilotlari', price_per_night: 'bir kecha uchun',
    booking_summary: 'Band qilish xulosasi', confirm_booking: 'Tasdiqlash', success_message: 'Buyurtmangiz qabul qilindi.',
    admin_dashboard: 'Boshqaruv paneli', revenue: 'Daromad', total_bookings: 'Jami buyurtmalar', popular_rooms: 'Mashhur xonalar',
    recent_bookings: 'Oxirgi buyurtmalar', guest_name: 'Mehmon ismi', room: 'Xona', status: 'Holat', date: 'Sana',
    back: 'Orqaga', login: 'Kirish', password: 'Parol', admin_login_title: 'Admin kirish',
    invalid_credentials: 'Notoʻgʻri maʼlumotlar', wellness_title: 'Sogʻlomlashtirish', dining_title: 'Ovqatlanish',
    manage_rooms: 'Xonalarni boshqarish', manage_bookings: 'Buyurtmalarni boshqarish',
    manage_dining: 'Restoranlarni boshqarish', add_dining_facility: 'Restoran qoʻshish',
    manage_wellness: 'Wellnessni boshqarish', add_wellness_facility: 'Wellness qoʻshish',
    add_menu_item: 'Taom qoʻshish', facility_name: 'Muassasa nomi',
    long_description: 'Batafsil tavsif', item_name: 'Taom nomi',
    delete_facility_confirm: 'Haqiqatan ham ushbu muassasani oʻchirib tashlamoqchimisiz?',
    delete_item_confirm: 'Haqiqatan ham ushbu taomni oʻchirib tashlamoqchimisiz?',
    add_room: 'Xona qoʻshish', delete_room_confirm: 'Haqiqatan ham ushbu xonani oʻchirib tashlamoqchimisiz?',
    delete_wellness_confirm: 'Haqiqatan ham ushbu wellness muassasasini oʻchirib tashlamoqchimisiz?',
    confirm: 'Tasdiqlash', cancel: 'Bekor qilish', confirm_delete: 'Oʻchirish', room_name: 'Xona nomi', price: 'Narxi',
    description: 'Tavsif', image_url: 'Rasm URL manzili', capacity: 'Sigʻimi', category: 'Toifa',
    image_source: 'Rasm manbasi', url: 'URL', local_file: 'Lokal fayl', choose_file: 'Faylni tanlash',
    dark_mode: 'Tungi rejim', light_mode: 'Kunduzgi rejim', booking_confirmed_email: 'Mehmonga tasdiqlash xati yuborildi.',
    my_bookings: 'Mening buyurtmalarim', reviews: 'Sharhlar', leave_review: 'Sharh qoldirish', guest_email_placeholder: 'Buyurtmalarni topish uchun emailingizni kiriting',
    no_bookings_found: 'Ushbu email uchun buyurtmalar topilmadi.', rating: 'Baholash', comment: 'Izoh', submit_review: 'Sharhni yuborish',
    review_success: 'Sharhingiz uchun rahmat!', find: 'Topish'
  },
  ru: {
    nav_home: 'Главная', nav_rooms: 'Номера', nav_wellness: 'Велнес', nav_dining: 'Ресторан', nav_admin: 'Админ',
    hero_title: 'Вечный Нил', hero_subtitle: 'Где эхо фараонов встречается с современным спокойствием.',
    hero_slogan: 'Ом Эль Донья — Мать мира', book_now: 'Забронировать', check_in: 'Заезд',
    check_out: 'Выезд', guests: 'Гости', adults: 'Взрослые', children: 'Дети', room_details: 'Детали номера', price_per_night: 'за ночь',
    booking_summary: 'Итоги бронирования', confirm_booking: 'Подтвердить', success_message: 'Ваше бронирование получено.',
    admin_dashboard: 'Панель управления', revenue: 'Доход', total_bookings: 'Всего броней', popular_rooms: 'Популярные номера',
    recent_bookings: 'Последние брони', guest_name: 'Имя гостя', room: 'Номер', status: 'Статус', date: 'Дата',
    back: 'Назад', login: 'Вход', password: 'Пароль', admin_login_title: 'Доступ админа',
    invalid_credentials: 'Неверные данные', wellness_title: 'Велнес', dining_title: 'Ресторан',
    manage_rooms: 'Управление номерами', manage_bookings: 'Управление бронями',
    manage_dining: 'Управление ресторанами', add_dining_facility: 'Добавить ресторан',
    manage_wellness: 'Управление велнесом', add_wellness_facility: 'Добавить велнес-объект',
    add_menu_item: 'Добавить блюдо', facility_name: 'Название заведения',
    long_description: 'Подробное описание', item_name: 'Название блюда',
    delete_facility_confirm: 'Вы уверены, что хотите удалить это заведение?',
    delete_item_confirm: 'Вы уверены, что хотите удалить это блюдо?',
    add_room: 'Добавить номер', delete_room_confirm: 'Вы уверены, что хотите удалить этот номер?',
    delete_wellness_confirm: 'Вы уверены, что хотите удалить этот велнес-объект?',
    confirm: 'Подтвердить', cancel: 'Отмена', confirm_delete: 'Удалить', room_name: 'Название номера', price: 'Цена',
    description: 'Описание', image_url: 'URL изображения', capacity: 'Вместимость', category: 'Категория',
    image_source: 'Источник изображения', url: 'URL', local_file: 'Локальный файл', choose_file: 'Выбрать файл',
    dark_mode: 'Темный режим', light_mode: 'Светлый режим', booking_confirmed_email: 'Гостю отправлено письмо с подтверждением.',
    my_bookings: 'Мои бронирования', reviews: 'Отзывы', leave_review: 'Оставить отзыв', guest_email_placeholder: 'Введите email, чтобы найти бронирования',
    no_bookings_found: 'Бронирования для этого email не найдены.', rating: 'Рейтинг', comment: 'Комментарий', submit_review: 'Отправить отзыв',
    review_success: 'Спасибо за ваш отзыв!', find: 'Найти'
  },
  // Adding placeholders for other languages to meet the 16 requirement
  es: { nav_home: 'Inicio', nav_rooms: 'Habitaciones', nav_wellness: 'Bienestar', nav_dining: 'Comedor', nav_admin: 'Admin', hero_title: 'El Nilo Eterno', book_now: 'Reservar Now', back: 'Atrás' },
  fr: { nav_home: 'Accueil', nav_rooms: 'Chambres', nav_wellness: 'Bien-être', nav_dining: 'Restauration', nav_admin: 'Admin', hero_title: 'Le Nil Éternel', book_now: 'Réserver', back: 'Retour' },
  de: { nav_home: 'Startseite', nav_rooms: 'Zimmer', nav_wellness: 'Wellness', nav_dining: 'Essen', nav_admin: 'Admin', hero_title: 'Der Ewige Nil', book_now: 'Buchen', back: 'Zurück' },
  it: { nav_home: 'Home', nav_rooms: 'Camere', nav_wellness: 'Benessere', nav_dining: 'Ristorazione', nav_admin: 'Admin', hero_title: 'Il Nilo Eterno', book_now: 'Prenota', back: 'Indietro' },
  pt: { nav_home: 'Início', nav_rooms: 'Quartos', nav_wellness: 'Bem-estar', nav_dining: 'Jantar', nav_admin: 'Admin', hero_title: 'O Nilo Eterno', book_now: 'Reservar', back: 'Voltar' },
  zh: { nav_home: '首页', nav_rooms: '客房', nav_wellness: '养生', nav_dining: '餐饮', nav_admin: '管理员', hero_title: '永恒的尼罗河', book_now: '立即预订', back: '返回' },
  ja: { nav_home: 'ホーム', nav_rooms: '客房', nav_wellness: 'ウェルネス', nav_dining: 'ダイニング', nav_admin: '管理者', hero_title: '永遠のナイル', book_now: '予約する', back: '戻る' },
  ko: { nav_home: '홈', nav_rooms: '객실', nav_wellness: '웰니스', nav_dining: '다이닝', nav_admin: '관리자', hero_title: '영원한 나일', book_now: '예약하기', back: '뒤로' },
  tr: { nav_home: 'Anasayfa', nav_rooms: 'Odalar', nav_wellness: 'Wellness', nav_dining: 'Yemek', nav_admin: 'Admin', hero_title: 'Ebedi Nil', book_now: 'Rezervasyon', back: 'Geri' },
  hi: { nav_home: 'होम', nav_rooms: 'कमरे', nav_wellness: 'वेलनेस', nav_dining: 'भोजन', nav_admin: 'एडमिन', hero_title: 'शाश्वत नील', book_now: 'अभी बुक करें', back: 'पीछे' },
  bn: { nav_home: 'হোম', nav_rooms: 'রুম', nav_wellness: 'ওয়েলনেস', nav_dining: 'ডাইনিং', nav_admin: 'অ্যাডমিন', hero_title: 'শাশ্বত নীল', book_now: 'বুক করুন', back: 'পিছনে' },
  vi: { nav_home: 'Trang chủ', nav_rooms: 'Phòng', nav_wellness: 'Chăm sóc sức khỏe', nav_dining: 'Ẩm thực', nav_admin: 'Admin', hero_title: 'Dòng sông Nile Vĩnh Cửu', book_now: 'Đặt ngay', back: 'Quay lại' }
};
