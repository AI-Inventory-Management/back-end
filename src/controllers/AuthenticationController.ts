/*
AuthenticationController.ts
Autores:
- Víctor Adrián Sosa Hernández
- Edna Jacqueline Zavala Ortega

Controlador que maneja la autenticación en la aplicación web
Para más información consultat la documentación de la API
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

  // Definir rutas 
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
  }

  // Sign Up
  private async signUp(req: Request, res: Response) {
    // Se reciben los datos
    const { email, first_name, last_name, password, phone_number } = req.body;
    console.log("gg");
    try {
      // Se crea el usuario de cognito
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

      //   Se guarda el usuario en la base de datos
      await db["User"].create(userData);
      console.log("Registro exitoso");
      

      return res.status(200).send({ message: `User created successfully` });
    } catch (error: any) {
      console.log("failed auth controller", error);
      console.log(req.body);
      res.status(500).send({errors: [{ code: error.code, msg: error.message }]});
    }
  }

  // Verificación de la cuenta mediante el código que se envía por correo electrónico
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

  // Iniciar sesión
  private async signin(req: Request, res: Response) {
    // Recibir usuario y contraseña
    const { email, password } = req.body;
    try {
      const login = await this.cognitoService.signInUser(email, password);

      // Seleccionar de la base de datos la información del usuario
      const userData = await db["User"].findOne({
        where: { email }, 
        attributes: ["first_name", "last_name", "role", "profile_picture"],
      });

      res
        .status(200)
        .send({ ...userData.dataValues, ...login.AuthenticationResult });
    } catch (error: any) {
      res.status(500).send({errors: [{ code: error.code, msg: error.message }]});
    }
  }

  // Validar el body del JSON para cada caso
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
