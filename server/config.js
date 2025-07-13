const path = require("path");
const dotenv = require("dotenv");

// Ortam dosyalarını dinamik olarak yükle
const loadEnv = () => {
  const env = process.env.NODE_ENV || "development";
  const envFile = `.env.${env}`;
  
  const envPath = path.resolve(__dirname, envFile);
  const result = dotenv.config({ path: envPath });

  if (result.error) {
    console.error(`❌ ${envFile} dosyası yüklenemedi:`, result.error.message);
    process.exit(1);
  }

  console.log(`✔️ ${envFile} başarıyla yüklendi`);
  return env;
};

// Ortam değişkenlerini yükle
const env = loadEnv();

// Zorunlu değişkenleri kontrol et
const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_SECRET",
  "REFRESH_TOKEN_SECRET",
  "FRONTEND_URL",
];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.error(`❌ Eksik ortam değişkenleri: ${missingVars.join(", ")}`);
  process.exit(1);
}

// Config nesnesi
const config = {
  env,
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  frontendUrl: process.env.FRONTEND_URL,
  firebaseCredentialsPath: process.env.FIREBASE_CREDENTIALS_PATH || "./serviceAccountKey.json",
  token: {
    access: {
      secret: process.env.JWT_SECRET,
      expiresIn: "1h",
      cookie: {
        maxAge: 60 * 60 * 1000, // 1 saat
        httpOnly: true,
        secure: env === "production",
        sameSite: env === "production" ? "none" : "strict",
        path: "/",
      },
    },
    refresh: {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: "7d",
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
        httpOnly: true,
        secure: env === "production",
        sameSite: env === "production" ? "none" : "strict",
        path: "/",
      },
    },
  },
};

// Config değerlerini logla (hassas bilgileri gizle)
console.log("Yüklenen Konfigürasyon:", {
  env: config.env,
  port: config.port,
  databaseUrl: "****",
  frontendUrl: config.frontendUrl,
  firebaseCredentialsPath: config.firebaseCredentialsPath ? "****" : undefined,
  token: {
    access: {
      expiresIn: config.token.access.expiresIn,
      cookie: config.token.access.cookie,
      secret: "****",
    },
    refresh: {
      expiresIn: config.token.refresh.expiresIn,
      cookie: config.token.refresh.cookie,
      secret: "****",
    },
  },
});

module.exports = config;