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
const express_validator_1 = require("express-validator");
class StoreContoller extends AbstractController_1.default {
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new StoreContoller("sale");
        return this.instance;
    }
    validateBody(type) {
        switch (type) {
            case "createSale":
                return (0, express_validator_1.checkSchema)({
                    id_product: {
                        isInt: {
                            errorMessage: "Must be an Int",
                        },
                    },
                    id_store: {
                        isInt: {
                            errorMessage: "Must be an Int",
                        },
                    },
                });
        }
    }
    initRoutes() {
        this.router.post("/postCreateSale", this.validateBody("createSale"), this.handleErrors, this.postCreateSale.bind(this));
    }
    postCreateSale(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                yield models_1.default["Sale"].create(req.body);
                res.status(201).send("Registro exitoso");
            }
            catch (err) {
                console.log("Error");
                res.status(500).json({ error: err });
            }
        });
    }
}
exports.default = StoreContoller;
//# sourceMappingURL=SaleController.js.map