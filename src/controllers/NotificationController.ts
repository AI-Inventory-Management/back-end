import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";
import { Op } from "sequelize";

class NotificationController extends AbstractController {
  private static instance: NotificationController;

  public static getInstance(): AbstractController {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new NotificationController("notification");
    return this.instance;
  }

  protected initRoutes(): void {
    this.router.get(
      "/getAllNotifications",
      this.getAllNotifications.bind(this)
    );
    this.router.get(
      "/getNewNotifications",
      this.getNewNotifications.bind(this)
    );
    this.router.post("/markAsRead", this.markNotificationAsRead.bind(this))
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

  private async getNewNotifications(req: Request, res: Response) {
    try {
      const notifications = await db["Notification"].findAll(
        {where: { id_notification: {[Op.gt]: req.query.newest_notification}}}
      );
      res.status(200).send(notifications);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({ message: error.message });
      } else {
        res.status(501).send({ message: "External error" });
      }
    }
  }

  private async markNotificationAsRead(req: Request, res: Response) {
    try {
      const notificationExists = await db["Notification"].findOne(
        {where : { id_notification : req.body.id_notification }}
      );
      if (!notificationExists) {
        res.status(400).send({ message: "Bad request." });
        return;
      }
      const result = await db["Notification"].update(
        {read: true},
        {where: {id_notification: req.body.id_notification}}
      );
      if (!result || result == 0) {
        res.status(400).send({ message: "Bad request." });
      }
      res.status(200).send(result);
    }
    catch (error) {
      if (error instanceof Error) {
        res.status(500).send({ message: error.message });
      } else {
        res.status(501).send({ message: "External error" });
      }
    }
  }
}

export default NotificationController;
