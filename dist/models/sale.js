"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//'use strict';
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Sale extends sequelize_1.Model {
        static associate(models) {
            // Associations
            Sale.belongsTo(models.Product, {
                foreignKey: "id_product",
            });
            Sale.belongsTo(models.Store, {
                foreignKey: "id_store",
            });
        }
    }
    Sale.init({
        id_sale: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        timestamp: {
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
            allowNull: false,
        },
        id_product: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        id_store: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: "Sale",
    });
    return Sale;
};
//# sourceMappingURL=sale.js.map