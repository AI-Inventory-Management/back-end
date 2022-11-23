import Server from "./providers/Server";
import { PORT, NODE_ENV } from "./config";
import express from "express";
import cors from "cors";
import StoreContoller from "./controllers/StoreController";
import SaleController from "./controllers/SaleController";
import NotificationContoller from "./controllers/NotificationController";

const app = new Server({
  port: PORT,
  middlewares: [express.json(), express.urlencoded({ extended: true }), cors()],
  controllers: [StoreContoller.getInstance(), SaleController.getInstance(), NotificationContoller.getInstance()],
  env: NODE_ENV,
});

declare global {
  namespace Express {
    interface Request {
      user: string;
      token: string;
    }
  }
}

app.init();
