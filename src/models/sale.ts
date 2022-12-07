/*
sale.ts
Autores:
- Edna Jacqueline Zavala Ortega

Modelo que representa una instancia de una venta de un producto.
*/
import { Model } from "sequelize";

interface SaleAttributes {
  id_sale: number;
  timestamp: string;
  id_product: number;
  id_store: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Sale extends Model<SaleAttributes> implements SaleAttributes {
    id_sale!: number;
    timestamp!: string;
    id_product!: number;
    id_store!: number;

    static associate(models: any) {
      // Associations
      Sale.belongsTo(models.Product, {
        foreignKey: "id_product",
      });
      Sale.belongsTo(models.Store, {
        foreignKey: "id_store",
      });
    }
  }
  Sale.init(
    {
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
    },
    {
      sequelize,
      modelName: "Sale",
    }
  );
  return Sale;
};
