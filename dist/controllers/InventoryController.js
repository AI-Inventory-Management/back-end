"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractController_1 = __importDefault(require("./AbstractController"));
const express_validator_1 = require("express-validator");
class InventoryController extends AbstractController_1.default {
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new InventoryController("inventory");
        return this.instance;
    }
    validateBody(type) {
        switch (type) {
            case "createStore":
                return (0, express_validator_1.checkSchema)({
                    status: {
                        isInt: {
                            options: { min: 1, max: 3 },
                            errorMessage: "Value must be between 1 and 3",
                        },
                    },
                    latitude: {
                        isFloat: {
                            errorMessage: "Must be a float",
                        },
                    },
                    longitude: {
                        isFloat: {
                            errorMessage: "Must be a float",
                        },
                    },
                    state: {
                        isString: {
                            errorMessage: "Must be a string",
                        },
                    },
                    municipality: {
                        isString: {
                            errorMessage: "Must be a string",
                        },
                    },
                    zip_code: {
                        isPostalCode: {
                            options: "MX",
                            errorMessage: "Must be a valid Zip Code",
                        },
                    },
                });
        }
    }
    initRoutes() { }
}
exports.default = InventoryController;
//# sourceMappingURL=InventoryController.js.map