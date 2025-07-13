const jwt = require("jsonwebtoken");
const config = require("../../config");

const authMiddleware = async (req, res, next) => {
  const accessToken = req.cookies.authToken;
  const refreshToken = req.cookies.refreshToken;

  // Access token kontrolü
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, config.token.access.secret);
      req.user = { id: decoded.id, email: decoded.email };
      return next(); // Access token geçerli, devam et
    } catch (error) {
      if (error.name !== "TokenExpiredError") {
        return res.status(401).json({ message: "Geçersiz access token" });
      }
      // Access token süresi dolmuş, refresh token'ı kontrol et
    }
  }

  // Refresh token kontrolü
  if (!refreshToken) {
    return res.status(401).json({ message: "Token sağlanmadı" });
  }

  try {
    const sequelize = req.app.get("sequelize");
    const { User } = require("../model/users")(sequelize);

    // Refresh token ile kullanıcıyı bul
    const user = await User.findOne({ where: { refresh_token: refreshToken } });
    if (!user) {
      return res.status(403).json({ message: "Geçersiz refresh token" });
    }

    // Refresh token'ı doğrula
    const decoded = jwt.verify(refreshToken, config.token.refresh.secret);
    if (decoded.id !== user.id || decoded.email !== user.email) {
      return res.status(403).json({ message: "Geçersiz refresh token" });
    }

    // Yeni access token üret
    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email },
      config.token.access.secret,
      { expiresIn: config.token.access.expiresIn }
    );

    // Yeni access token'ı cookie'ye yaz
    res.cookie("authToken", newAccessToken, config.token.access.cookie);

    req.user = { id: user.id, email: user.email };
    next();
  } catch (error) {
    return res.status(403).json({ message: `Refresh token hatası: ${error.message}` });
  }
};

module.exports = authMiddleware;