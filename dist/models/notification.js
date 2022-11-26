"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//'use strict';
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Notification extends sequelize_1.Model {
        static associate(models) {
            // Associations
            Notification.belongsTo(models.Store, {
                foreignKey: "id_store",
            });
        }
    }
    Notification.init({
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
    }, {
        sequelize,
        modelName: "Notification",
    });
    return Notification;
};
//# sourceMappingURL=notification.js.map