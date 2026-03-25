import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";
import nodemailer from "nodemailer";

const db = new Database("hotel.db");

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendConfirmationEmail(guestEmail: string, guestName: string, checkIn: string) {
  const fromName = process.env.SMTP_FROM_NAME || "Luxor Palace Hotel";
  const fromEmail = process.env.SMTP_FROM_EMAIL || "noreply@luxorpalace.com";

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: guestEmail,
    subject: `Booking Confirmed - ${fromName}`,
    text: `Dear ${guestName},\n\nYour booking for ${checkIn} at ${fromName} has been confirmed. We look forward to seeing you!\n\nBest regards,\n${fromName} Team`,
    html: `
      <div style="font-family: serif; padding: 40px; background-color: #f5f2ed; color: #1a1a1a; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5;">
        <h1 style="text-transform: uppercase; letter-spacing: 0.2em; border-bottom: 1px solid #1a1a1a; padding-bottom: 20px; margin-bottom: 30px; font-size: 24px;">Booking Confirmed</h1>
        <p style="font-size: 16px; line-height: 1.6;">Dear <strong>${guestName}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.6;">We are pleased to inform you that your booking for <strong>${checkIn}</strong> at <strong>${fromName}</strong> has been confirmed.</p>
        <p style="font-size: 16px; line-height: 1.6;">We are preparing for your arrival and look forward to providing you with an exceptional experience.</p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; font-size: 14px; opacity: 0.6;">
          <p>Best regards,</p>
          <p><strong>${fromName} Team</strong></p>
        </div>
      </div>
    `,
  };

  if (!process.env.SMTP_HOST) {
    console.log(`[EMAIL SIMULATION] SMTP not configured. To: ${guestEmail}`);
    return;
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SENT] To: ${guestEmail}`);
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send email to ${guestEmail}:`, error);
  }
}

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    image_url TEXT,
    capacity INTEGER DEFAULT 2,
    category TEXT DEFAULT 'Standard'
  );

  CREATE TABLE IF NOT EXISTS dining_facilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    long_description TEXT,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS dining_menu (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    facility_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT,
    image_url TEXT,
    FOREIGN KEY (facility_id) REFERENCES dining_facilities (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS wellness_facilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    long_description TEXT,
    image_url TEXT,
    category TEXT DEFAULT 'wellness'
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guest_name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    check_in TEXT NOT NULL,
    check_out TEXT NOT NULL,
    adults INTEGER DEFAULT 1,
    children INTEGER DEFAULT 0,
    total_price REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms (id)
  );
`);

// Migration: Add adults, children, and notes columns if they don't exist
try {
  db.exec("ALTER TABLE bookings ADD COLUMN adults INTEGER DEFAULT 1");
} catch (e) {}
try {
  db.exec("ALTER TABLE bookings ADD COLUMN children INTEGER DEFAULT 0");
} catch (e) {}
try {
  db.exec("ALTER TABLE bookings ADD COLUMN notes TEXT");
} catch (e) {}

// Seed data if empty
const roomCount = db.prepare("SELECT COUNT(*) as count FROM rooms").get() as { count: number };
if (roomCount.count === 0) {
  const insertRoom = db.prepare("INSERT INTO rooms (name, type, price, description, image_url, capacity, category) VALUES (?, ?, ?, ?, ?, ?, ?)");
  insertRoom.run("Royal Nile Suite", "Suite", 1200, "Breathtaking views of the Nile with minimalist luxury and private balcony.", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80", 2, "Suite");
  insertRoom.run("Desert Oasis Villa", "Villa", 2500, "Private pool and secluded desert views for ultimate privacy.", "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80", 4, "Villa");
  insertRoom.run("Pharaoh Deluxe Room", "Deluxe", 800, "Modern comfort meets ancient inspiration with premium amenities.", "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80", 2, "Deluxe");
  insertRoom.run("Giza View Classic", "Standard", 500, "Classic elegance with a hint of the pyramids and city views.", "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80", 2, "Standard");
  insertRoom.run("Nile Horizon Room", "Standard", 450, "Wake up to the gentle flow of the Nile right outside your window.", "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80", 2, "Standard");
  insertRoom.run("Imperial Garden Villa", "Villa", 3200, "Lush private gardens and dedicated butler service.", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", 6, "Villa");
} else {
  // Update existing room images to ensure they work
  db.prepare("UPDATE rooms SET image_url = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80' WHERE name = 'Royal Nile Suite'").run();
  db.prepare("UPDATE rooms SET image_url = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80' WHERE name = 'Desert Oasis Villa'").run();
  db.prepare("UPDATE rooms SET image_url = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80' WHERE name = 'Pharaoh Deluxe Room'").run();
}

const diningCount = db.prepare("SELECT COUNT(*) as count FROM dining_facilities").get() as { count: number };
if (diningCount.count === 0) {
  const insertFacility = db.prepare("INSERT INTO dining_facilities (name, description, long_description, image_url) VALUES (?, ?, ?, ?)");
  const insertMenu = db.prepare("INSERT INTO dining_menu (facility_id, name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?, ?)");

  const f1 = insertFacility.run(
    'The Pharaoh’s Table', 
    'Fine dining with authentic Egyptian flavors.', 
    'The Pharaoh’s Table offers a sophisticated culinary journey through Egypt’s rich history. Our chefs use the finest local ingredients to create dishes that are both traditional and innovative.', 
    'https://images.unsplash.com/photo-1550966841-3ee7adac1ad8?auto=format&fit=crop&w=1200&q=80'
  );
  insertMenu.run(f1.lastInsertRowid, 'Hibiscus Iced Tea', 'Traditional Egyptian Karkadeh, chilled and refreshing.', 8, 'Drinks', 'https://images.unsplash.com/photo-1553531384-397c80973a0b?auto=format&fit=crop&w=800&q=80');
  insertMenu.run(f1.lastInsertRowid, 'Mint Lemonade', 'Freshly squeezed lemons with garden-fresh mint.', 7, 'Drinks', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80');
  insertMenu.run(f1.lastInsertRowid, 'Egyptian Coffee', 'Strong, aromatic coffee brewed with cardamom.', 6, 'Drinks', 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&w=800&q=80');
  insertMenu.run(f1.lastInsertRowid, 'Mango Lassi', 'Creamy yogurt drink with ripe Egyptian mangoes.', 9, 'Drinks', 'https://images.unsplash.com/photo-1571006682881-645828452331?auto=format&fit=crop&w=800&q=80');

  const f2 = insertFacility.run(
    'Nile Terrace', 
    'Al fresco dining under the stars.', 
    'Enjoy breathtaking views of the Nile at our al fresco terrace. Nile Terrace offers a relaxed atmosphere for breakfast, lunch, and dinner.', 
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
  );
  insertMenu.run(f2.lastInsertRowid, 'Ful Medames', 'Slow-cooked fava beans with olive oil, cumin, and fresh herbs.', 12, 'Breakfast', 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80');
  insertMenu.run(f2.lastInsertRowid, 'Shakshuka', 'Poached eggs in a spicy tomato and bell pepper sauce.', 14, 'Breakfast', 'https://images.unsplash.com/photo-1590412200988-a436bb7050a8?auto=format&fit=crop&w=800&q=80');
  insertMenu.run(f2.lastInsertRowid, 'Grilled Nile Perch', 'Freshly caught perch with lemon-garlic butter and roasted vegetables.', 28, 'International', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80');
  insertMenu.run(f2.lastInsertRowid, 'Lamb Kofta', 'Spiced minced lamb skewers served with tahini and flatbread.', 24, 'International', 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80');
}

const wellnessCount = db.prepare("SELECT COUNT(*) as count FROM wellness_facilities").get() as { count: number };
if (wellnessCount.count === 0) {
  const insertWellness = db.prepare("INSERT INTO wellness_facilities (name, description, long_description, image_url, category) VALUES (?, ?, ?, ?, ?)");
  insertWellness.run(
    'Elite Fitness Center', 
    'State-of-the-art equipment with panoramic Nile views.', 
    'Our fitness center is equipped with the latest Technogym technology, offering a comprehensive range of cardio and strength training equipment. Floor-to-ceiling windows provide inspiring views of the Nile River, making every workout an experience in itself. Personal trainers are available upon request to help you achieve your fitness goals.',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    'wellness'
  );
  insertWellness.run(
    'Infinity Pool', 
    'A serene oasis overlooking the ancient river.', 
    'Our infinity pool blends seamlessly with the horizon, offering a tranquil escape from the desert heat. Relax on our premium sun loungers, enjoy a refreshing cocktail from the pool bar, and watch the sunset over the Nile.',
    'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
    'wellness'
  );
  insertWellness.run(
    'Anubis Spa', 
    'Ancient healing rituals for modern rejuvenation.', 
    'Step into a world of pure indulgence at Anubis Spa. Our treatments are inspired by ancient Egyptian beauty rituals, using natural ingredients like lotus flower, honey, and essential oils to restore balance to your body and mind.',
    'https://images.unsplash.com/photo-1544161515-450ce4184694?auto=format&fit=crop&w=1200&q=80',
    'wellness'
  );
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  const PORT = process.env.PORT || 3000;

  // API Routes
  app.get("/api/rooms", (req, res) => {
    const rooms = db.prepare("SELECT * FROM rooms").all();
    res.json(rooms);
  });

  app.post("/api/admin/rooms", (req, res) => {
    const { name, type, price, description, image_url, capacity, category } = req.body;
    try {
      const result = db.prepare(`
        INSERT INTO rooms (name, type, price, description, image_url, capacity, category)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(name, type, price, description, image_url, capacity, category);
      res.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Failed to add room" });
    }
  });

  app.delete("/api/admin/rooms/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM rooms WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete room" });
    }
  });

  app.get("/api/dining", (req, res) => {
    const facilities = db.prepare("SELECT * FROM dining_facilities").all();
    const facilitiesWithMenu = facilities.map((f: any) => {
      const menu = db.prepare("SELECT * FROM dining_menu WHERE facility_id = ?").all(f.id);
      return { ...f, menu };
    });
    res.json(facilitiesWithMenu);
  });

  app.post("/api/admin/dining/facilities", (req, res) => {
    const { name, description, long_description, image_url } = req.body;
    try {
      const result = db.prepare(`
        INSERT INTO dining_facilities (name, description, long_description, image_url)
        VALUES (?, ?, ?, ?)
      `).run(name, description, long_description, image_url);
      res.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Failed to add dining facility" });
    }
  });

  app.delete("/api/admin/dining/facilities/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM dining_facilities WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete dining facility" });
    }
  });

  app.post("/api/admin/dining/menu", (req, res) => {
    const { facility_id, name, description, price, category, image_url } = req.body;
    try {
      const result = db.prepare(`
        INSERT INTO dining_menu (facility_id, name, description, price, category, image_url)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(facility_id, name, description, price, category, image_url);
      res.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Failed to add menu item" });
    }
  });

  app.delete("/api/admin/dining/menu/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM dining_menu WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete menu item" });
    }
  });

  app.get("/api/wellness", (req, res) => {
    const facilities = db.prepare("SELECT * FROM wellness_facilities").all();
    res.json(facilities);
  });

  app.post("/api/admin/wellness", (req, res) => {
    const { name, description, long_description, image_url, category } = req.body;
    try {
      const result = db.prepare(`
        INSERT INTO wellness_facilities (name, description, long_description, image_url, category)
        VALUES (?, ?, ?, ?, ?)
      `).run(name, description, long_description, image_url, category || 'wellness');
      res.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Failed to add wellness facility" });
    }
  });

  app.delete("/api/admin/wellness/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM wellness_facilities WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete wellness facility" });
    }
  });

  app.post("/api/bookings", (req, res) => {
    const { room_id, guest_name, guest_email, check_in, check_out, adults, children, total_price } = req.body;
    try {
      const result = db.prepare(`
        INSERT INTO bookings (room_id, guest_name, guest_email, check_in, check_out, adults, children, total_price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(room_id, guest_name, guest_email, check_in, check_out, adults, children, total_price);
      res.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Booking failed" });
    }
  });

  app.get("/api/bookings/availability", (req, res) => {
    const availability = db.prepare(`
      SELECT room_id, check_in, check_out 
      FROM bookings 
      WHERE status != 'cancelled'
    `).all();
    res.json(availability);
  });

  app.get("/api/bookings/my", (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });
    try {
      const bookings = db.prepare(`
        SELECT b.*, r.name as room_name 
        FROM bookings b 
        JOIN rooms r ON b.room_id = r.id 
        WHERE b.guest_email = ?
        ORDER BY b.created_at DESC
      `).all(email);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.get("/api/reviews", (req, res) => {
    try {
      const reviews = db.prepare("SELECT * FROM reviews ORDER BY created_at DESC LIMIT 10").all();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", (req, res) => {
    const { guest_name, rating, comment } = req.body;
    try {
      db.prepare("INSERT INTO reviews (guest_name, rating, comment) VALUES (?, ?, ?)").run(guest_name, rating, comment);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to post review" });
    }
  });

  // Admin Dashboard API
  app.get("/api/admin/stats", (req, res) => {
    const stats = {
      total_revenue: db.prepare("SELECT SUM(total_price) as total FROM bookings WHERE status != 'cancelled'").get() as any,
      total_bookings: db.prepare("SELECT COUNT(*) as count FROM bookings").get() as any,
      popular_rooms: db.prepare(`
        SELECT r.name, COUNT(b.id) as booking_count 
        FROM rooms r 
        LEFT JOIN bookings b ON r.id = b.room_id 
        GROUP BY r.id 
        ORDER BY booking_count DESC
      `).all(),
      recent_bookings: db.prepare(`
        SELECT b.*, r.name as room_name 
        FROM bookings b 
        JOIN rooms r ON b.room_id = r.id 
        ORDER BY b.created_at DESC 
        LIMIT 10
      `).all()
    };
    res.json(stats);
  });

  app.get("/api/admin/bookings", (req, res) => {
    const bookings = db.prepare(`
      SELECT b.*, r.name as room_name 
      FROM bookings b 
      JOIN rooms r ON b.room_id = r.id 
      ORDER BY b.created_at DESC
    `).all();
    res.json(bookings);
  });

  app.put("/api/admin/bookings/:id/confirm", async (req, res) => {
    const { id } = req.params;
    try {
      const booking = db.prepare("SELECT * FROM bookings WHERE id = ?").get(id) as any;
      if (!booking) return res.status(404).json({ error: "Booking not found" });

      db.prepare("UPDATE bookings SET status = 'confirmed' WHERE id = ?").run(id);
      
      // Send actual email
      await sendConfirmationEmail(booking.guest_email, booking.guest_name, booking.check_in);

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to confirm booking" });
    }
  });

  app.put("/api/admin/bookings/:id/notes", (req, res) => {
    const { id } = req.params;
    const { notes } = req.body;
    try {
      db.prepare("UPDATE bookings SET notes = ? WHERE id = ?").run(notes, id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update notes" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
