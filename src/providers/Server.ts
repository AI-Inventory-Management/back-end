/*
Server.ts
Autores: Benjamín Ruiz
- 


Clase que inicializa sequelize y el servidor de ExpressJS con sus middlewares y controladores
*/

import express, { Request, Response, NextFunction } from "express";
import db from "../models";
import AbstractController from "../controllers/AbstractController";

class Server {
  private app: express.Application;
  private port: number;
  private env: string;

  constructor(appInit: {
    port: number;
    middlewares: any[];
    controllers: AbstractController[];
    env: string;
  }) {
    this.app = express();
    this.port = appInit.port;
    this.env = appInit.env;
    this.loadMiddlewares(appInit.middlewares);
    this.loadRoutes(appInit.controllers);
  }

  private loadRoutes(controllers: AbstractController[]): void {
    this.app.get("/", (_: any, res: Response) => {
      res.status(200).send({
        message: "The back is working",
      });
    });
    controllers.forEach((controller: AbstractController) => {
      this.app.use(`/${controller.prefix}`, controller.router);
    });
  }

  private loadMiddlewares(middlewares: any[]): void {
    middlewares.forEach((middleware: any) => {
      this.app.use(middleware);
    });
  }

  public async init() {
    await db.sequelize
      .sync({ force: false })
      .then(() =>
        this.app.listen(this.port, () => {
          console.log(`Server running on port: ${this.port}`);
        })
      )
      .catch((err: any) => console.log(err));
  }
}

export default Server;
