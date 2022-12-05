/*
config.ts
Autores: Benjamín Ruiz
- 


Archivo en donde se inicia el servidor con sus middlewares y sus controladores
*/

import Server from "./providers/Server";
import { PORT, NODE_ENV } from "./config";
import express from "express";
import cors from "cors";
import StoreContoller from "./controllers/StoreController";
import SaleController from "./controllers/SaleController";
import AuthenticationController from "./controllers/AuthenticationController";
import NotificationController from "./controllers/NotificationController";
import ProductController from "./controllers/ProductController";

const app = new Server({
  port: PORT,
  middlewares: [express.json(), express.urlencoded({ extended: true }), cors()],
  controllers: [
    StoreContoller.getInstance(),
    SaleController.getInstance(),
    NotificationController.getInstance(),
    AuthenticationController.getInstance(),
    ProductController.getInstance(),
  ],
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
