import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";
import { timeStamp } from "console";
import { checkSchema } from "express-validator";

class StoreContoller extends AbstractController {
  protected validateBody(type: "createStore" | "updateStore" | "deleteStore") {
    switch (type) {
      case "createStore":
        return checkSchema({
          status: {
            in: "body",
            isInt: {
              options: { min: 1, max: 3 },
              errorMessage: "Value must be between 1 and 3",
            },
          },
          latitude: {
            in: "body",
            isFloat: true,
            errorMessage: "Must be a float",
          },
          longitude: {
            in: "body",
            isFloat: true,
            errorMessage: "Must be a float",
          },
          state: {
            in: "body",
            isString: true,
            errorMessage: "Must be a string",
          },
          municipality: {
            in: "body",
            isString: true,
            errorMessage: "Must be a string",
          },
          zip_code: {
            isPostalCode: {
              options: "MX",
            },
            errorMessage: "Must be a valid Zip Code",
          },
        });
    }
  }

  private static instance: StoreContoller;

  public static getInstance(): AbstractController {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new StoreContoller("store");
    return this.instance;
  }

  protected initRoutes(): void {
    this.router.post("/createStore", this.postCreateStore.bind(this)); // Create
    this.router.get(
      "/getStoreCoordinates",
      this.getStoreCoordinates.bind(this)
    );
  }

  // Create Store
  private async postCreateStore(req: Request, res: Response) {
    try {
      console.log(req.body);
      await db["Store"].create(req.body);
      console.log("Registro exitoso");
      res.status(200).send("Registro exitoso");
    } catch (err: any) {
      console.log("Error");
      console.log(req.body);
      res.status(500).send("Error fatal:" + err);
    }
  }

  private async getStoreCoordinates(req: Request, res: Response) {
    try {
      const stores = await db["Store"].findAll({
        attributes: ["id", "status", "latitude", "longitude"],
      });

      let response_stores: any[] = [];
      stores.forEach(
        (store: { id: any; status: any; latitude: any; longitude: any }) => {
          response_stores.push({
            id: store.id,
            status: store.status,
            position: { lat: store.latitude, lng: store.longitude },
          });
        }
      );
      res.status(200).send(response_stores);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({ message: error.message });
      } else {
        res.status(501).send({ message: "External error" });
      }
    }
  }
}
export default StoreContoller;
