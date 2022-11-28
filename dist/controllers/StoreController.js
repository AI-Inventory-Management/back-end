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
const sequelize_1 = require("sequelize");
class StoreContoller extends AbstractController_1.default {
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new StoreContoller("store");
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
    initRoutes() {
        this.router.post("/createStore", this.authMiddleware.verifyToken, this.validateBody("createStore"), this.handleErrors, this.postCreateStore.bind(this)); // Create
        this.router.get("/getStoreCoordinates", this.authMiddleware.verifyToken, this.getStoreCoordinates.bind(this));
        this.router.get("/getStoreData/:storeId", this.authMiddleware.verifyToken, this.getStoreData.bind(this));
        //Filter
        this.router.get("/getAllStores", this.authMiddleware.verifyToken, this.getAllStores.bind(this));
        this.router.get('/getStoreNames', this.authMiddleware.verifyToken, this.getStoreNames.bind(this));
    }
    // Create Store
    postCreateStore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                yield models_1.default["Store"].create(req.body);
                console.log("Registro exitoso");
                res.status(200).send("Registro exitoso");
            }
            catch (err) {
                console.log("Error");
                console.log(req.body);
                res.status(500).send("Error fatal:" + err);
            }
        });
    }
    getStoreCoordinates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stores = yield models_1.default["Store"].findAll({
                    attributes: ["id_store", "status", "latitude", "longitude"],
                });
                let response_stores = [];
                stores.forEach((store) => {
                    response_stores.push({
                        id_store: store.id_store,
                        status: store.status,
                        position: { lat: store.latitude, lng: store.longitude },
                    });
                });
                res.status(200).send(response_stores);
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
    getStoreData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const storeData = yield models_1.default["Store"].findOne({
                    where: { id_store: req.params.storeId },
                    attributes: ["id_store", "status", "address", "name"],
                });
                if (!storeData) {
                    res.status(400).send({ message: "No store associated to id" });
                    return;
                }
                const stock = yield models_1.default.sequelize.query(`SELECT Inventory.id_product, Product.name, Inventory.stock
          FROM Inventory, Product
          WHERE Inventory.id_store = ${req.params.storeId} AND Inventory.id_product = Product.id_product
          ORDER BY Inventory.stock DESC`, { type: sequelize_1.QueryTypes.SELECT });
                const top_sales = yield models_1.default.sequelize.query(`SELECT Sale.id_product, Product.name, count(Sale.id_sale) as sales
                                        FROM Sale, Product
                                        WHERE Sale.id_store = ${req.params.storeId} AND Product.id_product = Sale.id_product
                                        GROUP BY Sale.id_product
                                        ORDER BY count(Sale.id_product) DESC
                                        LIMIT 10`, { type: sequelize_1.QueryTypes.SELECT });
                const data = {
                    id: storeData.id_store,
                    status: storeData.status,
                    address: storeData.address,
                    name: storeData.name,
                    stock: stock,
                    sales: top_sales,
                };
                res.status(200).send(data);
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
    getAllStores(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stores = yield models_1.default.sequelize.query(`Select id_store,name from Store where status = ${req.query.status} and id_store = ${req.query.id} and name = ${req.query.name} and state = ${req.query.state} and municipality = ${req.query.municipality}`, { type: sequelize_1.QueryTypes.SELECT });
                res.status(200).send(stores);
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
    getStoreNames(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const names = yield models_1.default["Store"].findAll({
                    attributes: ["id_store", "name"]
                });
                res.status(200).send(names);
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
exports.default = StoreContoller;
//# sourceMappingURL=StoreController.js.map