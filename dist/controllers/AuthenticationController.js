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
const express_validator_1 = require("express-validator");
const AbstractController_1 = __importDefault(require("./AbstractController"));
const models_1 = __importDefault(require("../models"));
class AuthenticationController extends AbstractController_1.default {
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new AuthenticationController("auth");
        return this.instance;
    }
    initRoutes() {
        this.router.post("/signup", this.validateBody("signup"), this.handleErrors, this.signUp.bind(this));
        this.router.post("/signin", this.validateBody("signin"), this.handleErrors, this.signin.bind(this));
        this.router.post("/verify", this.validateBody("verify"), this.handleErrors, this.verify.bind(this));
        this.router.post("/signout", this.signout.bind(this));
        //this.router.get('/getUser', this.getuser.bing(this));
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, first_name, last_name, password, phone_number } = req.body;
            console.log("gg");
            try {
                // Create Cognito User
                const user = yield this.cognitoService.signUpUser(email, password, [
                    {
                        Name: "email",
                        Value: email,
                    },
                    {
                        Name: "name",
                        Value: first_name + last_name,
                    },
                    {
                        Name: "phone_number",
                        Value: phone_number,
                    },
                ]);
                console.log("Cognito user created!", user);
                const userData = Object.assign(Object.assign({}, req.body), { cognito_uuid: user.UserSub });
                //   Save user in database
                yield models_1.default["User"].create(userData);
                console.log("Registro exitoso");
                //
                return res.status(200).send({ message: `User created successfully` });
            }
            catch (error) {
                console.log("failed auth controller", error);
                console.log(req.body);
                res.status(500).send({ errors: [{ code: error.code, msg: error.message }] });
            }
        });
    }
    verify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, code } = req.body;
            try {
                yield this.cognitoService.verifyUser(email, code);
                return res.status(200).send({ message: `User verified successfully` });
            }
            catch (error) {
                console.log("failed auth controller", error);
                res.status(500).send({ errors: [{ code: error.code, msg: error.message }] }).end();
            }
        });
    }
    signin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const login = yield this.cognitoService.signInUser(email, password);
                // Select info of the user
                const userData = yield models_1.default["User"].findOne({
                    where: { email },
                    attributes: ["first_name", "last_name", "role", "profile_picture"],
                });
                res
                    .status(200)
                    .send(Object.assign(Object.assign({}, userData.dataValues), login.AuthenticationResult));
            }
            catch (error) {
                res.status(500).send({ errors: [{ code: error.code, msg: error.message }] });
            }
        });
    }
    signout(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const token = (_a = req.get("authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            console.log(token);
            try {
                //Sign out using Cognito
                yield this.cognitoService.signOut(token);
                res.status(200).send({ message: `User signed out successfully` });
            }
            catch (error) {
                //If exception occurs inform
                res.status(500).send({ errors: [{ code: error.code, msg: error.message }] });
            }
        });
    }
    // private async getuser(req:Request, res:Response) {
    //     const {} = req.body;
    // }
    validateBody(type) {
        switch (type) {
            case "signup":
                return (0, express_validator_1.checkSchema)({
                    email: {
                        in: "body",
                        isEmail: {
                            errorMessage: "Please enter a valid email",
                        },
                    },
                    password: {
                        isString: {
                            errorMessage: "Password must be a string",
                        },
                        isLength: {
                            options: {
                                min: 8,
                            },
                            errorMessage: "Password must have at least 8 characters",
                        },
                    },
                    first_name: {
                        isString: {
                            errorMessage: "First name must be a string",
                        },
                        isLength: {
                            options: {
                                min: 2,
                                max: 40,
                            },
                            errorMessage: "First name must be between 2 and 40 characters",
                        },
                    },
                    last_name: {
                        isString: {
                            errorMessage: "Last name must be a string",
                        },
                        isLength: {
                            options: {
                                min: 2,
                                max: 40,
                            },
                            errorMessage: "Last name must be between 2 and 40 characters",
                        },
                    },
                    phone_number: {
                        isMobilePhone: {
                            options: "es-MX",
                            errorMessage: "Phone number must be valid in Mexico",
                        },
                    },
                });
            case "signin":
                return (0, express_validator_1.checkSchema)({
                    email: {
                        in: "body",
                        isEmail: {
                            errorMessage: "Please enter a valid email",
                        },
                    },
                    password: {
                        isString: {
                            errorMessage: "Password must be a string",
                        },
                        isLength: {
                            options: {
                                min: 8,
                            },
                            errorMessage: "Password must have at least 8 characters",
                        },
                    },
                });
            case "verify":
                return (0, express_validator_1.checkSchema)({
                    email: {
                        in: "body",
                        isEmail: {
                            errorMessage: "Please enter a valid email",
                        },
                    },
                    code: {
                        isString: {
                            errorMessage: "Code must be a string",
                        },
                        isLength: {
                            options: {
                                min: 6,
                                max: 6,
                            },
                            errorMessage: "Verification code must be 6 characters long",
                        },
                    },
                });
        }
    }
}
exports.default = AuthenticationController;
//# sourceMappingURL=AuthenticationController.js.map