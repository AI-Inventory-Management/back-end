"use strict";
"use-strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Sequelize = require("sequelize");
const basename = path_1.default.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config_1 = __importDefault(require("../config/config"));
const db = {};
// Define Sequelize params
let sequelize;
console.log(env);
if (env === "development") {
    sequelize = new Sequelize(config_1.default.development.database, config_1.default.development.username, config_1.default.development.password, {
        dialect: config_1.default.development.dialect,
        host: config_1.default.development.host,
        define: {
            timestamps: false,
            freezeTableName: true,
        },
    });
}
else if (env === "production") {
    sequelize = new Sequelize(config_1.default.production.database, config_1.default.production.username, config_1.default.production.password, {
        dialect: config_1.default.production.dialect,
        host: config_1.default.production.host,
        define: {
            timestamps: false,
            freezeTableName: true,
        },
    });
}
// Read each model from model directory
fs_1.default.readdirSync(__dirname)
    .filter((file) => {
    return (file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js");
})
    .forEach((file) => {
    const model = require(path_1.default.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model; // Add model to models list
});
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
exports.default = db;
//# sourceMappingURL=index.js.map