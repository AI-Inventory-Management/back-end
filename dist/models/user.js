"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//'use strict';
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends sequelize_1.Model {
    }
    User.init({
        id_user: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        first_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        cognito_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        role: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        profile_picture: {
            type: DataTypes.STRING(512),
            allowNull: false
        },
    }, {
        sequelize,
        modelName: "User",
    });
    return User;
};
//# sourceMappingURL=user.js.map