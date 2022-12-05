/*
AbstractController.ts
Autores:
- Benjamín Ruiz


Clase abstracta para definir metodos y atributos comunes entre todos los controladores
*/

import { Router } from "express";

import ValidationErrorMiddleware from "../middlewares/validationError";
import AuthMiddleware from "../middlewares/authorization";

//Services
import CognitoService from "../services/cognitoService";

export default abstract class AbstractController {
  private _router: Router = Router();
  private _prefix: string;

  protected handleErrors = ValidationErrorMiddleware.handleErrors;
  protected authMiddleware = AuthMiddleware.getInstance();
  protected cognitoService = CognitoService.getInstance();

  public get prefix(): string {
    return this._prefix;
  }

  public get router(): Router {
    return this._router;
  }

  protected constructor(prefix: string) {
    this._prefix = prefix;
    this.initRoutes();
  }

  protected abstract initRoutes(): void;
}
