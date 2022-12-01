"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = __importDefault(require("./providers/Server"));
const config_1 = require("./config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const StoreController_1 = __importDefault(require("./controllers/StoreController"));
const SaleController_1 = __importDefault(require("./controllers/SaleController"));
const AuthenticationController_1 = __importDefault(require("./controllers/AuthenticationController"));
const NotificationController_1 = __importDefault(require("./controllers/NotificationController"));
const ProductController_1 = __importDefault(require("./controllers/ProductController"));
const app = new Server_1.default({
    port: config_1.PORT,
    middlewares: [express_1.default.json(), express_1.default.urlencoded({ extended: true }), (0, cors_1.default)()],
    controllers: [StoreController_1.default.getInstance(), SaleController_1.default.getInstance(), NotificationController_1.default.getInstance(), AuthenticationController_1.default.getInstance(), ProductController_1.default.getInstance()],
    env: config_1.NODE_ENV,
});
app.init();
//# sourceMappingURL=index.js.map