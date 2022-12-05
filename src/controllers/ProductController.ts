/*
ProductController.ts
Autores:
- Javier Moreno
- Andrea Díaz

Controlador que maneja los requests y lógica relativos a los productos
Para más información consultat la documentación de la API
*/

import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";
import { QueryTypes } from "sequelize";

class ProductController extends AbstractController {
  private static instance: ProductController;

  public static getInstance(): AbstractController {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProductController("product");
    return this.instance;
  }

  protected initRoutes(): void {
    this.router.post("/postNewProduct", this.authMiddleware.verifyToken, this.postNewProduct.bind(this));
    this.router.get(
      "/getAllProductsNames",
      this.authMiddleware.verifyToken,
      this.getAllProductsNames.bind(this)
    );
    this.router.get('/getAllProducts', this.authMiddleware.verifyToken, this.getAllProducts.bind(this));
    this.router.get('/getProduct/:productID', this.authMiddleware.verifyToken, this.getProduct.bind(this));
  }

  private async postNewProduct(req: Request, res: Response) {
    console.log(req.body);
    try {
      await db["Product"].create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        ean: req.body.ean,
      });
      res.send({ message: "success" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({ message: error.message });
      } else {
        res.status(501).send({ message: "External error" });
      }
    }
  }

  private async getAllProductsNames(req: Request, res: Response) {
    try {
      const names = await db["Product"].findAll({
        attributes: [["name", "label"]],
      });
      res.send(names);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({ message: error.message });
      } else {
        res.status(501).send({ message: "External error" });
      }
    }
  }
  
  private async getAllProducts(req: Request, res: Response) {
    try {
      const stores = await db.sequelize.query(
        `Select id_product,name, price from Product where id_product = ${req.query.id} and name = ${req.query.name} and ean = ${req.query.ean} and price = ${req.query.price}`,
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

  private async getProduct(req: Request, res: Response) {
    try {
      const product = await db.sequelize.query(
        `Select id_product,name, price, ean, description from Product where id_product = ${req.params.productID}`,
        { type: QueryTypes.SELECT }
      );
      res.status(200).send(product);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({ message: error.message });
      } else {
        res.status(501).send({ message: "External error" });
      }
    }
  };
};

export default ProductController;
