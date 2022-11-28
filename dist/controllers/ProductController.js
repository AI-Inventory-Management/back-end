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
class ProductController extends AbstractController_1.default {
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProductController("product");
        return this.instance;
    }
    initRoutes() {
        this.router.post("/postNewProduct", this.authMiddleware.verifyToken, this.postNewProduct.bind(this));
        this.router.get("/getAllProductsNames", this.authMiddleware.verifyToken, this.getAllProductsNames.bind(this));
        this.router.get('/getAllProducts', this.authMiddleware.verifyToken, this.getAllProducts.bind(this));
        this.router.get('/getProduct/:productID', this.authMiddleware.verifyToken, this.getProduct.bind(this));
    }
    postNewProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            try {
                yield models_1.default["Product"].create({
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price,
                    ean: req.body.ean,
                });
                res.send({ message: "success" });
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
    getAllProductsNames(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const names = yield models_1.default["Product"].findAll({
                    attributes: [["name", "label"]],
                });
                res.send(names);
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
    getAllProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stores = yield models_1.default.sequelize.query(`Select id_product,name, price from Product where id_product = ${req.query.id} and name = ${req.query.name} and ean = ${req.query.ean} and price = ${req.query.price}`, { type: sequelize_1.QueryTypes.SELECT });
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
    getProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield models_1.default.sequelize.query(`Select id_product,name, price, ean, description from Product where id_product = ${req.params.productID}`, { type: sequelize_1.QueryTypes.SELECT });
                res.status(200).send(product);
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
    ;
}
;
exports.default = ProductController;
//# sourceMappingURL=ProductController.js.map