/*
store.ts
Autores:
- Edna Jacqueline Zavala Ortega

Modelo que representa una instancia de cada tienda.
*/
import { Model } from "sequelize";

interface StoreAttributes {
  id_store: number;
  name:string;
  status: number;
  latitude: number;
  longitude: number;
  state: string;
  municipality: string;
  zip_code: string;
  address: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Store extends Model<StoreAttributes> implements StoreAttributes {
    id_store!: number;
    name!:string;
    status!: number;
    latitude!: number;
    longitude!: number;
    state!: string;
    municipality!: string;
    zip_code!: string;
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
      id_store: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name:{
        type:DataTypes.STRING(100),
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
    },
    {
      sequelize,
      modelName: "Store",
    }
  );
  return Store;
};
