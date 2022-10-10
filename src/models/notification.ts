//'use strict';
import { Model } from "sequelize";

interface NotificationAttributes {
  id: number;
  id_store: number;
  notification_text: string;
  timestamp: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Notification
    extends Model<NotificationAttributes>
    implements NotificationAttributes
  {
    id!: number;
    id_store!: number;
    notification_text!: string;
    timestamp!: string;

    static associate(models: any) {
      // Associations
      Notification.belongsTo(models.Store, {
        foreignKey: "id",
      });
    }
  }
  Notification.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_store: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      notification_text: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      timestamp: {
        type: "TIMESTAMP",
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Notification",
    }
  );
  return Notification;
};
