"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//'use strict';
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Inventory extends sequelize_1.Model {
        static associate(models) {
            // Associations
            Inventory.belongsTo(models.Product, {
                foreignKey: "id_product",
            });
            Inventory.belongsTo(models.Store, {
                foreignKey: "id_store",
            });
        }
    }
    Inventory.init({
        id_inventory: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        id_product: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        id_store: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        min_stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        max_stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: "Inventory",
    });
    return Inventory;
};
//# sourceMappingURL=inventory.js.map