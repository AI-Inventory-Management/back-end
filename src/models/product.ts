//'use strict';
import { Model } from "sequelize";

interface ProductAttributes {
  id_product: number;
  ean: string;
  name: string;
  price: number;
  description: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Product extends Model<ProductAttributes> implements ProductAttributes {
    id_product!: number;
    ean!: string;
    name!: string;
    price!: number;
    description!: string;

    static associate(models: any) {
      // Associations
      Product.hasMany(models.Sale, {
        foreignKey: "id_product",
      });
      Product.hasMany(models.Inventory, {
        foreignKey: "id_product",
      });
    }
  }
  Product.init(
    {
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
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
