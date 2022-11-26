"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
exports.default = {
    development: {
        username: index_1.DB_USER,
        password: index_1.DB_PASSWORD,
        host: index_1.DB_HOST,
        database: index_1.DB_NAME + '_dev',
        dialect: "mysql",
    },
    production: {
        username: index_1.DB_USER,
        password: index_1.DB_PASSWORD,
        host: index_1.DB_HOST,
        database: index_1.DB_NAME + '_prod',
        dialect: "mysql",
    },
};
//# sourceMappingURL=config.js.map