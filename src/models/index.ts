"use-strict";

import fs from "fs";
import path from "path";
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
import config from "../config/config";
const db: any = {};

// Define Sequelize params
let sequelize: any;
if (env === "development") {
  sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    {
      dialect: config.development.dialect,
      host: config.development.host,
      define: {
        timestamps: false,
        freezeTableName: true,
      },
    }
  );
} else if (env === "production") {
  sequelize = new Sequelize(
    config.production.database,
    config.production.username,
    config.production.password,
    {
      dialect: config.production.dialect,
      host: config.production.host,
      define: {
        timestamps: false,
        freezeTableName: true,
      },
    }
  );
}

// Read each model from model directory
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model; // Add model to models list
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
