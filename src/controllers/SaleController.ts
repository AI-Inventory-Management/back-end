import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";
import { timeStamp } from "console";
import { checkSchema } from "express-validator";

class StoreContoller extends AbstractController {
  private static instance: StoreContoller;

  public static getInstance(): AbstractController {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new StoreContoller("sale");
    return this.instance;
  }

  protected validateBody(type: "createSale") {
    switch (type) {
      case "createSale":
        return checkSchema({
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

  protected initRoutes(): void {
    this.router.post(
      "/postCreateSale",
      this.validateBody("createSale"),
      this.handleErrors,
      this.postCreateSale.bind(this)
    );
  }

  private async postCreateSale(req: Request, res: Response) {
    try {
      console.log(req.body);
      await db["Sale"].create(req.body);
      res.status(201).send("Registro exitoso");
    } catch (err: any) {
      console.log("Error");
      res.status(500).json({ error: err });
    }
  }
}
export default StoreContoller;
