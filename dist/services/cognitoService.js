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
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("../config");
class CognitoService {
    constructor() {
        // Conectar la aplicación a cognito
        this.clientId = config_1.COGNITO_APP_CLIENT_ID;
        this.secretHash = config_1.COGNITO_APP_SECRET_HASH;
        this.config = {
            region: config_1.AWS_REGION,
        };
        this.cognitoIdentity = new aws_sdk_1.default.CognitoIdentityServiceProvider(this.config);
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new CognitoService();
        return this.instance;
    }
    //Metodo de registro
    signUpUser(email, password, userAttr) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                ClientId: this.clientId /* required App data*/,
                Password: password /* required User data*/,
                Username: email /* required User data*/,
                SecretHash: this.hashSecret(email) /* required App data*/,
                UserAttributes: userAttr, //User data
            };
            return yield this.cognitoIdentity.signUp(params).promise();
        });
    }
    //Método de verificación de nuevos usuarios
    verifyUser(email, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                ClientId: this.clientId,
                ConfirmationCode: code,
                Username: email,
                SecretHash: this.hashSecret(email) /* required */,
            };
            return yield this.cognitoIdentity.confirmSignUp(params).promise();
        });
    }
    //Autenticación de usuarios
    signInUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                AuthFlow: 'USER_PASSWORD_AUTH',
                ClientId: this.clientId,
                AuthParameters: {
                    USERNAME: email,
                    PASSWORD: password,
                    SECRET_HASH: this.hashSecret(email),
                },
            };
            return yield this.cognitoIdentity.initiateAuth(params).promise();
        });
    }
    getUser(accesstoken) {
        return __awaiter(this, void 0, void 0, function* () {
            var params = {
                AccessToken: accesstoken
            };
            const user = yield this.cognitoIdentity.getUser(params).promise();
            console.log(user);
        });
    }
    signOut(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            Method that signs out user with Cognito
    
            Parameters:
            accessToken - user's access token
            Returns:
            Invalidation of user's tokens
            */
            const params = {
                AccessToken: accessToken
            };
            return yield this.cognitoIdentity.globalSignOut(params).promise();
        });
    }
    hashSecret(username) {
        return crypto_1.default
            .createHmac('SHA256', this.secretHash)
            .update(username + this.clientId)
            .digest('base64');
    }
}
exports.default = CognitoService;
//# sourceMappingURL=cognitoService.js.map