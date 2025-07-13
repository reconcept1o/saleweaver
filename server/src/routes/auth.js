const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Sequelize modelini yükle
const initModels = (sequelize) => {
  const User = require("../model/users")(sequelize);
  return { User };
};

// Register Endpoint
router.post("/register", async (req, res, next) => {
  try {
    const sequelize = req.app.get("sequelize");
    const { User } = initModels(sequelize);

    const { name, surname, email, tckn, phone, password, deviceInfo } = req.body;

    const { instance: user, data: userData } = await User.createUser({
      name,
      surname,
      email,
      tckn,
      phone,
      password,
      deviceInfo,
    });

    // Access Token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      config.token.access.secret,
      { expiresIn: config.token.access.expiresIn }
    );

    // Refresh Token
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      config.token.refresh.secret,
      { expiresIn: config.token.refresh.expiresIn }
    );

    // Refresh token'ı veritabanına kaydet
    await user.update({ refresh_token: refreshToken });

    // Cookie'lere yaz
    res.cookie("authToken", accessToken, config.token.access.cookie);
    res.cookie("refreshToken", refreshToken, config.token.refresh.cookie);

    res.status(201).json({
      message: "Kullanıcı başarıyla kaydedildi",
      user: userData,
    });
  } catch (error) {
    next(error);
  }
});

// Login Endpoint
router.post("/login", async (req, res, next) => {
  try {
    const sequelize = req.app.get("sequelize");
    const { User } = initModels(sequelize);

    const { email, password, deviceInfo } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email ve şifre zorunlu" });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Geçersiz kimlik bilgileri" });
    }

    if (deviceInfo) {
      await user.update({
        device_info: deviceInfo || user.device_info,
      });
    }

    // Access Token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      config.token.access.secret,
      { expiresIn: config.token.access.expiresIn }
    );

    // Refresh Token
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      config.token.refresh.secret,
      { expiresIn: config.token.refresh.expiresIn }
    );

    // Refresh token'ı veritabanına kaydet
    await user.update({ refresh_token: refreshToken });

    // Cookie'lere yaz
    res.cookie("authToken", accessToken, config.token.access.cookie);
    res.cookie("refreshToken", refreshToken, config.token.refresh.cookie);

    res.status(200).json({
      message: "Giriş başarılı",
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        tckn: user.tckn,
        phone: user.phone,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Check Auth Status Endpoint
router.get("/check", authMiddleware, async (req, res, next) => {
  try {
    const sequelize = req.app.get("sequelize");
    const { User } = initModels(sequelize);

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    res.status(200).json({
      isAuthenticated: true,
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        tckn: user.tckn,
        phone: user.phone,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Logout Endpoint
router.post("/logout", authMiddleware, async (req, res, next) => {
  try {
    const sequelize = req.app.get("sequelize");
    const { User } = initModels(sequelize);

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    await user.update({ refresh_token: null });

    // Cookie'leri temizle, maxAge olmadan
    res.clearCookie("authToken", {
      httpOnly: config.token.access.cookie.httpOnly,
      secure: config.token.access.cookie.secure,
      sameSite: config.token.access.cookie.sameSite,
    });
    res.clearCookie("refreshToken", {
      httpOnly: config.token.refresh.cookie.httpOnly,
      secure: config.token.refresh.cookie.secure,
      sameSite: config.token.refresh.cookie.sameSite,
    });

    res.status(200).json({ message: "Çıkış başarıyla yapıldı" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;