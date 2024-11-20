const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true } },
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
});

const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId: { type: DataTypes.INTEGER, allowNull: false },
    deviceId: { type: DataTypes.INTEGER, allowNull: false },
});


const Device = sequelize.define('device', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    img: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
    typeId: { type: DataTypes.INTEGER, allowNull: false },
    brandId: { type: DataTypes.INTEGER, allowNull: false },
});

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
});

const Brand = sequelize.define('brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
});

const Purchases = sequelize.define('purchase', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    deviceId: { type: DataTypes.INTEGER, allowNull: false },
});


User.hasOne(Basket);
Basket.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Purchases);
Purchases.belongsTo(User, { foreignKey: 'userId' });

Basket.hasMany(Device);
Basket.belongsTo(Device, { foreignKey: 'deviceId' });

Type.hasMany(Device);
Device.belongsTo(Type, { foreignKey: 'typeId' });

Brand.hasMany(Device);
Device.belongsTo(Brand, { foreignKey: 'brandId' });

Purchases.hasMany(Device);
Purchases.belongsTo(Device, { foreignKey: 'deviceId' });



module.exports = {
    User,
    Basket,
    Device,
    Type,
    Brand,
    Purchases
};