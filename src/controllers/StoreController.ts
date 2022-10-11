import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";
import { timeStamp } from "console";

class StoreContoller extends AbstractController {
  private static instance: StoreContoller;

  public static getInstance(): AbstractController {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new StoreContoller("store");
    return this.instance;
  }

  protected initRoutes(): void {
    this.router.get("/getStoreCoordinates", this.getStoreCoordinates.bind(this));
  }

  private async getStoreCoordinates(req: Request, res: Response) {
    try {
      const stores = await db["Store"].findAll({
        attributes: ["id", "status", "latitude", "longitude"],
      });

      let response_stores:any[] = [];
      stores.forEach((store: { id: any; status: any; latitude: any; longitude: any; }) => {
        response_stores.push(
          {
            id: store.id, 
            status: store.status, 
            position: {lat: store.latitude, lng: store.longitude},
          });
      });
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
