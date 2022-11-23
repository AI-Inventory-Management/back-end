import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

class NotificationContoller extends AbstractController {
  private static instance: NotificationContoller;

  public static getInstance(): AbstractController {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new NotificationContoller("notification");
    return this.instance;
  }

  protected initRoutes(): void {
    this.router.get(
      "/getAllNotifications",
      this.getAllNotifications.bind(this)
    );
  }

  private async getAllNotifications(req: Request, res: Response) {
    try {
      const notifications = await db["Notification"].findAll();
      res.status(200).send(notifications);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({ message: error.message });
      } else {
        res.status(501).send({ message: "External error" });
      }
    }
  }
}

export default NotificationContoller;
