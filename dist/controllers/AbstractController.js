"use strict";
/*
AgentController.ts
Authors:
-
Creation date: 28/04/2022
Last modification date: 01/06/2022

Program that defines the controller for the Agent, its routes and functionalities
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validationError_1 = __importDefault(require("../middlewares/validationError"));
//Services
const cognitoService_1 = __importDefault(require("../services/cognitoService"));
class AbstractController {
    constructor(prefix) {
        this._router = (0, express_1.Router)();
        this.handleErrors = validationError_1.default.handleErrors;
        this.cognitoService = cognitoService_1.default.getInstance();
        this._prefix = prefix;
        this.initRoutes();
    }
    get prefix() {
        return this._prefix;
    }
    get router() {
        return this._router;
    }
}
exports.default = AbstractController;
//# sourceMappingURL=AbstractController.js.map