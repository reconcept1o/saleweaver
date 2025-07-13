const express = require("express");
const authMiddleware = require("../middleware/auth");
const admin = require("../../firebaseAdmin");
const router = express.Router();

// A single function to initialize our model
const initModels = (sequelize) => {
  const Notification = require("../model/notification")(sequelize);
  return { Notification };
};

// Update FCM Token Endpoint (This part was already correct)
router.post("/update-fcm-token", authMiddleware, async (req, res, next) => {
  try {
    const sequelize = req.app.get("sequelize");
    const { Notification } = initModels(sequelize);

    const { fcmToken, deviceInfo } = req.body;
    const userId = req.user.id;

    if (!fcmToken) {
      return res.status(400).json({ message: "fcmToken zorunlu" });
    }

    const notification = await Notification.upsertToken({
      userId,
      fcmToken,
      deviceInfo,
    });

    res.status(200).json({
      message: "FCM token başarıyla güncellendi",
      notification: {
        id: notification.id,
        userId: notification.userId,
        fcmToken: notification.fcmToken,
        deviceInfo: notification.deviceInfo,
        created_at: notification.created_at,
      },
    });
  } catch (error) {
    console.error("FCM GÜNCELLEME HATASI:", error);
    next(error);
  }
});

// Push Notification Endpoint (This part is now fixed)
router.post("/send-notification", authMiddleware, async (req, res, next) => {
  try {
    // THIS IS THE FIX: Load the model correctly, same as the other endpoint
    const sequelize = req.app.get("sequelize");
    const { Notification } = initModels(sequelize);

    const { title, body } = req.body;
    const userId = req.user.id;

    if (!title || !body) {
      return res.status(400).json({ message: "title ve body zorunlu" });
    }

    const tokens = await Notification.findByUserId(userId);
    if (!tokens || tokens.length === 0) {
      return res
        .status(404)
        .json({ message: "Kullanıcıya ait FCM token bulunamadı" });
    }

    const messages = tokens.map((token) => ({
      notification: {
        title,
        body,
      },
      token: token.fcmToken,
    }));

    const results = await Promise.all(
      messages.map((message) =>
        admin
          .messaging()
          .send(message)
          .catch((error) => ({
            error: `Bildirim gönderilemedi: ${error.message}`,
          }))
      )
    );

    res.status(200).json({
      message: "Bildirimler gönderildi",
      results,
    });
  } catch (error) {
    console.error("BİLDİRİM GÖNDERME HATASI:", error);
    next(error);
  }
});

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const sequelize = req.app.get("sequelize");
    const { Notification } = initModels(sequelize);
    const userId = req.user.id;

    const notifications = await Notification.findAll({
      where: { userId },
      order: [["created_at", "DESC"]], // En yeni bildirimler üstte
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("BİLDİRİMLER GETİRİLİRKEN HATA:", error);
    next(error);
  }
});


module.exports = router;
