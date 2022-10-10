//'use strict';
import { Model } from "sequelize";

interface StoreAttributes {
  id: number;
  status: number;
  latitude: number;
  longitude: number;
  state: string;
  municipality: string;
  zip_code: number;
  address: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Store extends Model<StoreAttributes> implements StoreAttributes {
    id!: number;
    status!: number;
    latitude!: number;
    longitude!: number;
    state!: string;
    municipality!: string;
    zip_code!: number;
    address!: string;

    static associate(models: any) {
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
  Store.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Store",
    }
  );
  return Store;
};
