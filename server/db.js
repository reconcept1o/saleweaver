const { Pool } = require("pg");
const config = require("./config");

if (!config.databaseUrl) {
  console.error("❌ DATABASE_URL ortam değişkeni tanımlı değil!");
  process.exit(1);
}

const poolConfig = {
  connectionString: config.databaseUrl,
  ssl: config.env === "production" ? { rejectUnauthorized: false } : false,
};

const pool = new Pool(poolConfig);

pool.on("connect", () => {
  console.log("🔗 PostgreSQL veritabanına başarıyla bağlanıldı.");
});

pool.on("error", (err) => {
  console.error("❌ Veritabanı bağlantı hatası:", err.stack);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
