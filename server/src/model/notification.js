const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Notification = sequelize.define(
    "Notification",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: require("uuid").v4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "user_id", // Veritabanındaki sütun adı. Sorgularda 'userId' kullanacağız.
        references: {
          model: "users",
          key: "id",
        },
      },
      fcmToken: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deviceInfo: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "notifications",
      timestamps: false,
    }
  );

  // FCM token oluşturma veya güncelleme
  Notification.upsertToken = async ({ userId, fcmToken, deviceInfo }) => {
    try {
      if (!userId || !fcmToken) {
        throw new Error("userId ve fcmToken zorunlu");
      }

      // 1. DÜZELTME: Sorguda modeldeki alan adı 'userId' kullanıldı.
      const existingToken = await Notification.findOne({
        where: { userId: userId, fcmToken },
      });

      if (existingToken) {
        // 2. DÜZELTME: 'created_at' güncellenirken 'new Date()' kullanıldı.
        await existingToken.update({
          deviceInfo: deviceInfo || existingToken.deviceInfo,
          created_at: new Date(),
        });
        return existingToken;
      }

      // 3. DÜZELTME: Yeni kayıt oluşturulurken 'userId' alanı kullanıldı.
      const notification = await Notification.create({
        userId: userId,
        fcmToken,
        deviceInfo: deviceInfo || null,
      });

      return notification;
    } catch (error) {
      throw new Error(`FCM token oluşturulamadı: ${error.message}`);
    }
  };

  // Kullanıcıya ait tüm tokenları bulma
  Notification.findByUserId = async (userId) => {
    try {
      // 4. DÜZELTME: Sorguda modeldeki alan adı 'userId' kullanıldı.
      const tokens = await Notification.findAll({ where: { userId: userId } });
      return tokens;
    } catch (error) {
      throw new Error(`Tokenlar bulunamadı: ${error.message}`);
    }
  };

  return Notification;
};
