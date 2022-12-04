/*
AuthenticationController.ts
Authors:
- 
Creation date: 11/10/2022
Last modification date: 01/12/2022

Handles authentication for the web app
For more detailed info look at the API documentation
*/

import { Request, Response } from "express";
import { checkSchema } from "express-validator";
import AbstractController from "./AbstractController";
import db from "../models";

class AuthenticationController extends AbstractController {
  //Singleton
  private static instance: AuthenticationController;
  public static getInstance(): AbstractController {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new AuthenticationController("auth");
    return this.instance;
  }

  protected initRoutes(): void {
    this.router.post(
      "/signup",
      this.validateBody("signup"),
      this.handleErrors,
      this.signUp.bind(this)
    );
    this.router.post(
      "/signin",
      this.validateBody("signin"),
      this.handleErrors,
      this.signin.bind(this)
    );
    this.router.post(
      "/verify",
      this.validateBody("verify"),
      this.handleErrors,
      this.verify.bind(this)
    );
    this.router.post("/signout", this.signout.bind(this));
    //this.router.get('/getUser', this.getuser.bing(this));
  }

  private async signUp(req: Request, res: Response) {
    const { email, first_name, last_name, password, phone_number } = req.body;
    console.log("gg");
    try {
      // Create Cognito User
      const user = await this.cognitoService.signUpUser(email, password, [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "name",
          Value: first_name + last_name,
        },
        {
          Name: "phone_number",
          Value: phone_number,
        },
      ]);
      console.log("Cognito user created!", user);
      const userData = { ...req.body, cognito_uuid: user.UserSub };

      //   Save user in database
      await db["User"].create(userData);
      console.log("Registro exitoso");
      //

      return res.status(200).send({ message: `User created successfully` });
    } catch (error: any) {
      console.log("failed auth controller", error);
      console.log(req.body);
      res.status(500).send({errors: [{ code: error.code, msg: error.message }]});
    }
  }

  private async verify(req: Request, res: Response) {
    const { email, code } = req.body;
    try {
      await this.cognitoService.verifyUser(email, code);
      return res.status(200).send({ message: `User verified successfully` });
    } catch (error: any) {
      console.log("failed auth controller", error);
      res.status(500).send({errors: [{ code: error.code, msg: error.message }]}).end();
    }
  }

  private async signin(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const login = await this.cognitoService.signInUser(email, password);

      // Select info of the user
      const userData = await db["User"].findOne({
        where: { email }, //email: email
        attributes: ["first_name", "last_name", "role", "profile_picture"],
      });

      res
        .status(200)
        .send({ ...userData.dataValues, ...login.AuthenticationResult });
    } catch (error: any) {
      res.status(500).send({errors: [{ code: error.code, msg: error.message }]});
    }
  }

  private async signout(req: Request, res: Response) {
    const token = req.get("authorization")?.split(" ")[1];
    console.log(token);
    try {
      //Sign out using Cognito
      await this.cognitoService.signOut(token);
      res.status(200).send({ message: `User signed out successfully` });
    } catch (error: any) {
      //If exception occurs inform
      res.status(500).send({errors: [{ code: error.code, msg: error.message }]});
    }
  }
  // private async getuser(req:Request, res:Response) {
  //     const {} = req.body;

  // }
  protected validateBody(type: "signup" | "signin" | "verify") {
    switch (type) {
      case "signup":
        return checkSchema({
          email: {
            in: "body",
            isEmail: {
              errorMessage: "Please enter a valid email",
            },
          },
          password: {
            isString: {
              errorMessage: "Password must be a string",
            },
            isLength: {
              options: {
                min: 8,
              },
              errorMessage: "Password must have at least 8 characters",
            },
          },
          first_name: {
            isString: {
              errorMessage: "First name must be a string",
            },
            isLength: {
              options: {
                min: 2,
                max: 40,
              },
              errorMessage: "First name must be between 2 and 40 characters",
            },
          },
          last_name: {
            isString: {
              errorMessage: "Last name must be a string",
            },
            isLength: {
              options: {
                min: 2,
                max: 40,
              },
              errorMessage: "Last name must be between 2 and 40 characters",
            },
          },
          phone_number: {
            isMobilePhone: {
              options: "es-MX",
              errorMessage: "Phone number must be valid in Mexico",
            },
          },
        });
      case "signin":
        return checkSchema({
          email: {
            in: "body",
            isEmail: {
              errorMessage: "Please enter a valid email",
            },
          },
          password: {
            isString: {
              errorMessage: "Password must be a string",
            },
            isLength: {
              options: {
                min: 8,
              },
              errorMessage: "Password must have at least 8 characters",
            },
          },
        });
      case "verify":
        return checkSchema({
          email: {
            in: "body",
            isEmail: {
              errorMessage: "Please enter a valid email",
            },
          },
          code: {
            isString: {
              errorMessage: "Code must be a string",
            },
            isLength: {
              options: {
                min: 6,
                max: 6,
              },
              errorMessage: "Verification code must be 6 characters long",
            },
          },
        });
    }
  }
}

export default AuthenticationController;
