import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";
import { timeStamp } from "console";
import { checkSchema } from "express-validator";
import { QueryTypes } from "sequelize";

class StoreContoller extends AbstractController {
  private static instance: StoreContoller;

  public static getInstance(): AbstractController {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new StoreContoller("store");
    return this.instance;
  }

  protected validateBody(type:|"createStore") {
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
            isFloat:{
              errorMessage: "Must be a float"
            }
          },
          longitude: {
            isFloat:{
              errorMessage: "Must be a float"
            }
          },
          state: {
            isString:{
              errorMessage: "Must be a string"
            }
          },
          municipality: {
            isString:{
              errorMessage: "Must be a string"
            }
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

  protected initRoutes(): void {
    this.router.post("/createStore", this.validateBody("createStore"), this.handleErrors, this.postCreateStore.bind(this)); // Create
    this.router.get("/getStoreCoordinates",this.getStoreCoordinates.bind(this));
    this.router.get("/getStoreData/:storeId", this.getStoreData.bind(this));
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

  private async getStoreData(req: Request, res: Response) {
    try {
      const storeData = await db["Store"].findOne({
        where: { id: req.params.storeId },
        attributes: ["id", "status", "address"],
      });
      if (!storeData) {
        res.status(400).send({message: "No store associated to id"});
        return;
      }
      const stock = await db.sequelize.query(`SELECT Inventory.id_product, Product.name, Inventory.stock
                                    FROM Inventory, Product
                                    WHERE Inventory.id_store = ${req.params.storeId} AND Inventory.id_product = Product.id`,
                                    { type: QueryTypes.SELECT });

      const top_sales = await db.sequelize.query(`SELECT Sale.id_product, Product.name, count(Sale.id) as sales
                                        FROM Sale, Product
                                        WHERE Sale.id_store = ${req.params.storeId} AND Product.id = Sale.id_product
                                        GROUP BY Sale.id_product
                                        ORDER BY count(Sale.id_product) desc
                                        LIMIT 10`,
                                    { type: QueryTypes.SELECT })
      const data = {
        id: storeData.id,
        status: storeData.status,
        address: storeData.address,
        stock: stock,
        sales: top_sales
      };
      res.status(200).send(data);
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
