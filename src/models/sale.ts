//'use strict';
import { Model } from "sequelize";

interface SaleAttributes {
  id: number;
  timestamp: string;
  id_product: number;
  id_store: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Sale extends Model<SaleAttributes> implements SaleAttributes {
    id!: number;
    timestamp!: string;
    id_product!: number;
    id_store!: number;

    static associate(models: any) {
      // Associations
      Sale.belongsTo(models.Product, {
        foreignKey: "id",
      });
      Sale.belongsTo(models.Store, {
        foreignKey: "id",
      });
    }
  }
  Sale.init(
    {
      id: {
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
    },
    {
      sequelize,
      modelName: "Sale",
    }
  );
  return Sale;
};
