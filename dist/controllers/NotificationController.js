"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractController_1 = __importDefault(require("./AbstractController"));
const models_1 = __importDefault(require("../models"));
const sequelize_1 = require("sequelize");
class NotificationController extends AbstractController_1.default {
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new NotificationController("notification");
        return this.instance;
    }
    initRoutes() {
        this.router.get("/getAllNotifications", this.getAllNotifications.bind(this));
        this.router.get("/getNewNotifications", this.getNewNotifications.bind(this));
        this.router.post("/markAsRead", this.markNotificationAsRead.bind(this));
    }
    getAllNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifications = yield models_1.default.sequelize.query(`SELECT Notification.id_notification, Notification.id_store, Store.name, Notification.new_status, Notification.timestamp, Notification.read FROM Notification, Store WHERE Notification.id_store = Store.id_store;`, { type: sequelize_1.QueryTypes.SELECT });
                res.status(200).send(notifications);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).send({ message: error.message });
                }
                else {
                    res.status(501).send({ message: "External error" });
                }
            }
        });
    }
    getNewNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.query || !req.query.newest_notification) {
                    res.status(400).send({ message: "Bad request" });
                    return;
                }
                const notifications = yield models_1.default.sequelize.query(`SELECT Notification.id_notification, Notification.id_store, Store.name, Notification.new_status, Notification.timestamp, Notification.read FROM Notification, Store WHERE Notification.id_notification > ${req.query.newest_notification} AND Notification.id_store = Store.id_store;`, { type: sequelize_1.QueryTypes.SELECT });
                res.status(200).send(notifications);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).send({ message: error.message });
                }
                else {
                    res.status(501).send({ message: "External error" });
                }
            }
        });
    }
    markNotificationAsRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notificationExists = yield models_1.default["Notification"].findOne({ where: { id_notification: req.body.id_notification } });
                if (!notificationExists) {
                    res.status(400).send({ message: "Bad request." });
                    return;
                }
                const result = yield models_1.default["Notification"].update({ read: true }, { where: { id_notification: req.body.id_notification } });
                if (!result || result == 0) {
                    res.status(400).send({ message: "Bad request." });
                }
                res.status(200).send(result);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).send({ message: error.message });
                }
                else {
                    res.status(501).send({ message: "External error" });
                }
            }
        });
    }
}
exports.default = NotificationController;
//# sourceMappingURL=NotificationController.js.map