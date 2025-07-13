const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const { Sequelize } = require("sequelize");
const config = require("./config");
const authRoutes = require("./src/routes/auth");
const NotificationRoutes = require("./src/routes/notification");

const app = express();

// Sequelize ile veritabanı bağlantısı
const sequelize = new Sequelize(config.databaseUrl, {
  dialect: "postgres",
  logging: config.env === "development" ? console.log : false,
  dialectOptions: {
    ssl: config.env === "production" ? { rejectUnauthorized: false } : false,
  },
});

// Veritabanı bağlantısını ve tabloları test et
(async () => {
  try {
    await sequelize.authenticate();
    console.log("🔗 PostgreSQL veritabanına başarıyla bağlanıldı.");
    await sequelize.sync({ force: false }); // Tabloları senkronize et, mevcut veriyi koru
    console.log("✔️ Veritabanı tabloları senkronize edildi.");
  } catch (error) {
    console.error("❌ Veritabanı bağlantı hatası:", error.message);
    process.exit(1);
  }
})();

// CORS whitelist
const whitelist = [config.frontendUrl, "http://localhost:3000", "http://localhost:3001"];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Bu kaynak CORS tarafından izin verilmiyor."));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Güvenlik başlıkları
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
      },
    },
    xssFilter: true,
    noSniff: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging (sadece development)
if (config.env === "development") {
  app.use(morgan("dev"));
}

// Genel rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100,
  message: "Bu IP'den çok fazla istek gönderildi, lütfen 15 dakika sonra tekrar deneyin.",
});
app.use(limiter);

// Auth için rate limit
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 dakika
  max: config.env === "development" ? 1000 : 10, // Geliştirme için yüksek sınır
  message: "Çok fazla kimlik doğrulama denemesi, lütfen 5 dakika sonra tekrar deneyin.",
});

// Rotalar
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/notification", authLimiter, NotificationRoutes);


// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🚀 API çalışıyor",
    environment: config.env,
  });
});

// 404 Hatası
app.use((req, res, next) => {
  const error = new Error(`Bulunamadı - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Hata işleme
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (err.message === "Bu kaynak CORS tarafından izin verilmiyor.") {
    return res.status(403).json({ message: err.message });
  }

  console.error("🔥 HATA:", err.message);
  res.status(statusCode).json({
    message: err.message,
    stack: config.env === "production" ? "🥞" : err.stack,
  });
});

// Sequelize örneğini rotalara geçir
app.set("sequelize", sequelize);

// Sunucuyu başlat
app.listen(config.port, () => {
  console.log(`🚀 Sunucu '${config.env}' modunda ${config.port} portunda çalışıyor`);
});