//'use strict';
import { Model } from "sequelize";

interface NotificationAttributes {
  id_notification: number;
  id_store: number;
  new_status: number;
  timestamp: string;
  read: boolean;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Notification
    extends Model<NotificationAttributes>
    implements NotificationAttributes
  {
    id_notification!: number;
    id_store!: number;
    new_status!: number;
    timestamp!: string;
    read!: boolean;

    static associate(models: any) {
      // Associations
      Notification.belongsTo(models.Store, {
        foreignKey: "id_store",
      });
    }
  }
  Notification.init(
    {
      id_notification: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_store: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      new_status: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      timestamp: {
        type: "TIMESTAMP",
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: "Notification",
    }
  );
  return Notification;
};
