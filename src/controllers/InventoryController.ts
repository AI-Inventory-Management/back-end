/*
InventoryController.ts
Autores:
- 

Controlador que maneja la lógica y web requests relativos al inventario
Para más información consultat la documentación de la API
*/

import AbstractController from "./AbstractController";
import { checkSchema } from "express-validator";

class InventoryController extends AbstractController {
  private static instance: InventoryController;

  public static getInstance(): AbstractController {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new InventoryController("inventory");
    return this.instance;
  }

  protected validateBody(type: "createStore") {
    switch (type) {
      case "createStore":
        return checkSchema({
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

  protected initRoutes(): void {}
}
export default InventoryController;
