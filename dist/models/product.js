"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//'use strict';
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Product extends sequelize_1.Model {
        static associate(models) {
            // Associations
            Product.hasMany(models.Sale, {
                foreignKey: "id_product",
            });
            Product.hasMany(models.Inventory, {
                foreignKey: "id_product",
            });
        }
    }
    Product.init({
        id_product: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        ean: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        diameter: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: "Product",
    });
    return Product;
};
//# sourceMappingURL=product.js.map