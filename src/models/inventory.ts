//'use strict';
import { Model } from "sequelize";

interface InventoryAttributes {
  id: number;
  id_product: number;
  id_store: number;
  stock: number;
  min_stock: number;
  max_stock: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Inventory
    extends Model<InventoryAttributes>
    implements InventoryAttributes
  {
    id!: number;
    id_product!: number;
    id_store!: number;
    stock!: number;
    min_stock!: number;
    max_stock!: number;

    static associate(models: any) {
      // Associations
      Inventory.belongsTo(models.Product, {
        foreignKey: "id",
      });
      Inventory.belongsTo(models.Store, {
        foreignKey: "id",
      });
    }
  }
  Inventory.init(
    {
      id: {
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
    },
    {
      sequelize,
      modelName: "Inventory",
    }
  );
  return Inventory;
};
