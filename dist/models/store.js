"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//'use strict';
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Store extends sequelize_1.Model {
        static associate(models) {
            // Associations
            Store.hasMany(models.Inventory, {
                foreignKey: "id_store",
            });
            Store.hasMany(models.Sale, {
                foreignKey: "id_store",
            });
            Store.hasMany(models.Notification, {
                foreignKey: "id_store",
            });
        }
    }
    Store.init({
        id_store: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        municipality: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        zip_code: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: "Store",
    });
    return Store;
};
//# sourceMappingURL=store.js.map