"use strict";
// Define all environment variables
Object.defineProperty(exports, "__esModule", { value: true });
exports.COGNITO_APP_SECRET_HASH = exports.COGNITO_APP_CLIENT_ID = exports.COGNITO_USER_POOL_ID = exports.DB_NAME = exports.DB_PASSWORD = exports.DB_USER = exports.DB_HOST = exports.AWS_REGION = exports.NODE_ENV = exports.PORT = void 0;
// App
exports.PORT = process.env.PORT ? +process.env.PORT : 8080;
exports.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "";
exports.AWS_REGION = process.env.AWS_REGION ? process.env.AWS_REGION : "";
// RDS
exports.DB_HOST = process.env.DB_HOST ? process.env.DB_HOST : "";
exports.DB_USER = process.env.DB_USER ? process.env.DB_USER : "";
exports.DB_PASSWORD = process.env.DB_PASSWORD ? process.env.DB_PASSWORD : "";
exports.DB_NAME = process.env.DB_NAME ? process.env.DB_NAME : "";
// COGNITO
exports.COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID ? process.env.COGNITO_USER_POOL_ID : "";
exports.COGNITO_APP_CLIENT_ID = process.env.COGNITO_APP_CLIENT_ID ? process.env.COGNITO_APP_CLIENT_ID : "";
exports.COGNITO_APP_SECRET_HASH = process.env.COGNITO_APP_SECRET_HASH ? process.env.COGNITO_APP_SECRET_HASH : "";
//# sourceMappingURL=index.js.map