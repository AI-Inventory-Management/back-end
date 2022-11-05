//'use strict';
import { Model } from "sequelize";

interface UserAttributes {
  id_user: number;
  first_name: string;
  last_name: string;
  cognito_uuid: string;
  email: string;
  role: string;
  profile_picture: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    id_user!: number;
    first_name!: string;
    last_name!: string;
    cognito_uuid!: string;
    email!: string;
    role!: string;
    profile_picture!: string;

    // static associate(models: any) {
    //   // Associations
    //   Store.hasMany(models.Inventory, {
    //     foreignKey: "id_store",
    //   });
    //   Store.hasMany(models.Sale, {
    //     foreignKey: "id_store",
    //   });
    //   Store.hasMany(models.Notification, {
    //     foreignKey: "id_store",
    //   });
    // }
  }
  User.init(
    {
      id_user: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name:{
        type:DataTypes.STRING(100),
        allowNull: false
      },
      last_name:{
        type:DataTypes.STRING(100),
        allowNull: false
      },
      cognito_uuid:{
        type:DataTypes.STRING(255),
        allowNull: false
      },
      email:{
        type:DataTypes.STRING(100),
        allowNull: false
      },
      role:{
        type:DataTypes.STRING(20),
        allowNull: false
      },
      profile_picture:{
        type:DataTypes.STRING(512),
        allowNull: false
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
