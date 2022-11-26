"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
class ValidationErrorMiddleware {
    static handleErrors(req, res, next) {
        const result = (0, express_validator_1.validationResult)(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() });
        }
        return next();
    }
}
exports.default = ValidationErrorMiddleware;
//# sourceMappingURL=validationError.js.map