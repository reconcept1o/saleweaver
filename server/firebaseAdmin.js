const admin = require("firebase-admin");
const config = require("./config");

try {
  const serviceAccount = require(config.firebaseCredentialsPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("🔥 Firebase Admin başarıyla başlatıldı.");
} catch (error) {
  console.error("❌ Firebase Admin başlatılamadı:", error.message);
  process.exit(1);
}

module.exports = admin;
