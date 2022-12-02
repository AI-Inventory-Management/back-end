import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";
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

  protected initRoutes(): void {
    this.router.post(
      "/createStore",
      this.validateBody("createStore"),
      this.handleErrors,
      this.postCreateStore.bind(this)
    ); // Create
    this.router.get(
      "/getStoreCoordinates",
      this.getStoreCoordinates.bind(this)
    );
    this.router.get("/getStoreData/:storeId", this.getStoreData.bind(this));

    //Filter
    this.router.get("/getAllStores", this.getAllStores.bind(this));

    this.router.get('/getStoreNames', this.getStoreNames.bind(this));
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
        attributes: ["id_store", "status", "latitude", "longitude"],
      });

      let response_stores: any[] = [];
      stores.forEach(
        (store: {
          id_store: any;
          status: any;
          latitude: any;
          longitude: any;
        }) => {
          response_stores.push({
            id_store: store.id_store,
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
        where: { id_store: req.params.storeId },
        attributes: ["id_store", "status", "address", "name", "latitude", "longitude"],
      });
      if (!storeData) {
        res.status(400).send({ message: "No store associated to id" });
        return;
      }
      const stock = await db.sequelize.query(
        `SELECT Inventory.id_product, Product.name, Inventory.stock
          FROM Inventory, Product
          WHERE Inventory.id_store = ${req.params.storeId} AND Inventory.id_product = Product.id_product
          ORDER BY Inventory.stock DESC`,
        { type: QueryTypes.SELECT }
      );

      const top_sales = await db.sequelize.query(
        `SELECT Sale.id_product, Product.name, count(Sale.id_sale) as sales
                                        FROM Sale, Product
                                        WHERE Sale.id_store = ${req.params.storeId} AND Product.id_product = Sale.id_product
                                        GROUP BY Sale.id_product
                                        ORDER BY count(Sale.id_product) DESC
                                        LIMIT 10`,
        { type: QueryTypes.SELECT }
      );
      const data = {
        id: storeData.id_store,
        status: storeData.status,
        address: storeData.address,
        name: storeData.name,
        position: { lat: storeData.latitude, lng: storeData.longitude },
        stock: stock,
        sales: top_sales,
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

  private async getAllStores(req: Request, res: Response) {
    try {
      const stores = await db.sequelize.query(
        `Select id_store,name from Store where status = ${req.query.status} and id_store = ${req.query.id} and name = ${req.query.name} and state = ${req.query.state} and municipality = ${req.query.municipality}`,
        { type: QueryTypes.SELECT }
      );
      res.status(200).send(stores);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({ message: error.message });
      } else {
        res.status(501).send({ message: "External error" });
      }
    }
  }

  private async getStoreNames(req: Request, res: Response) {
    try {
      const names = await db["Store"].findAll({
        attributes: ["id_store", "name"]});
      res.status(200).send(names);
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
