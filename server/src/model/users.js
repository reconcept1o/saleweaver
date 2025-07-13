const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      surname: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      tckn: {
        type: DataTypes.STRING(11),
        allowNull: true,
        validate: {
          len: [11, 11],
          isNumeric: true,
        },
      },
      phone: {
        type: DataTypes.STRING(15),
        allowNull: true,
        validate: {
          is: /^\+?\d{10,15}$/,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          isStrongPassword(value) {
            if (
              value &&
              (value.length < 12 ||
                !/[A-Z]/.test(value) ||
                !/[!@#$%^&*(),.?":{}|<>]/.test(value))
            ) {
              throw new Error(
                "Şifre en az 12 karakter, 1 büyük harf ve 1 özel karakter içermeli"
              );
            }
          },
        },
      },
      device_info: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      refresh_token: {
        // Yeni alan: refresh_token
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );

  // Şifreyi hash'leme
  User.beforeCreate(async (user) => {
    if (user.password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(user.password, saltRounds);
    }
  });

  // Kullanıcı oluşturma
  User.createUser = async ({
    name,
    surname,
    email,
    tckn,
    phone,
    password,
    deviceInfo,
  }) => {
    try {
      if (!name || !surname || !email) {
        throw new Error("Ad, soyad ve email zorunlu");
      }

      const existingUser = await User.findOne({
        where: {
          [sequelize.Sequelize.Op.or]: [{ email }, tckn ? { tckn } : {}],
        },
      });
      if (existingUser) {
        throw new Error("Bu email veya TCKN ile kayıtlı kullanıcı zaten var");
      }

      const user = await User.create({
        name,
        surname,
        email,
        tckn: tckn || null,
        phone: phone || null,
        password: password || null,
        device_info: deviceInfo || null,
      });

      // Hem Sequelize model örneğini hem de filtelenmiş veriyi döndür
      return {
        instance: user, // Sequelize model örneği
        data: {
          id: user.id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          tckn: user.tckn,
          phone: user.phone,
          created_at: user.created_at,
        },
      };
    } catch (error) {
      throw new Error(`Kullanıcı oluşturulamadı: ${error.message}`);
    }
  };

  // Email ile kullanıcı bulma
  User.findByEmail = async (email) => {
    try {
      const user = await User.findOne({ where: { email } });
      return user;
    } catch (error) {
      throw new Error(`Kullanıcı bulunamadı: ${error.message}`);
    }
  };

  // ID ile kullanıcı bulma
  User.findById = async (id) => {
    try {
      const user = await User.findByPk(id);
      return user;
    } catch (error) {
      throw new Error(`Kullanıcı bulunamadı: ${error.message}`);
    }
  };

  return User;
};
