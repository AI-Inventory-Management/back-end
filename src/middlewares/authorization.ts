/*
AuthenticationController.ts
Autores:
- Víctor Adrián Sosa Hernández
- Edna Jacqueline Zavala Ortega
- Benjamín Ruiz

Middleware que permite la interacción con AWS cognito.
*/

import { Response, Request, NextFunction } from 'express';
import { COGNITO_USER_POOL_ID, AWS_REGION } from '../config';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import fetch from 'node-fetch';

const pems: { [key: string]: string } = {};
class AuthMiddleware {
	private poolRegion = AWS_REGION;
	private userPoolId = COGNITO_USER_POOL_ID;

	// Singleton
	private static instance: AuthMiddleware;
	public static getInstance(): AuthMiddleware {
		if (this.instance) {
			return this.instance;
		}
		this.instance = new AuthMiddleware();
		return this.instance;
	}

	private constructor() {
		this.getAWSCognitoPems();
	}

	// Método que permite verificar la validez del token para una sesión.
	public verifyToken(req: Request, res: Response, next: NextFunction) {
		if (req.headers.authorization) {
			const token = req.headers.authorization.replace('Bearer ', '');
			const decodedJWT:any = jwt.decode(token, { complete: true });
			if (!decodedJWT) {
				res.status(401).send({ code: 'InvalidTokenException', message: 'The token is not valid' });
			}
			const kid = decodedJWT.header.kid;
			if(kid !== undefined){
				if (Object.keys(pems).includes(kid)) {
					console.log("Verificado")
				}
				const pem = pems[kid];
				jwt.verify(token, pem, { algorithms: ['RS256'] }, function (err:any) {
					if (err) {
						res.status(401).send({ code: 'InvalidTokenException', message: 'The token is not valid' });
						console.log("Error 2")
					} else {
						req.user = decodedJWT.payload.username;
						req.token = token;	
						console.log("Next");			
						next();
					}				
				});
				return;
			}else{
				res.status(401).send({ code: 'InvalidTokenException', message: 'The token is not valid' });
			}		
			
		} else {
			res.status(401).send({ code: 'NoTokenFound', message: 'The token is not present in the request' });
		}
	}

	private async getAWSCognitoPems() {
		const URL = `https://cognito-idp.${this.poolRegion}.amazonaws.com/${this.userPoolId}/.well-known/jwks.json`;
		try {
			const response = await fetch(URL);
			if (response.status !== 200) {
				throw 'COGNITO PEMS ERROR';
			}
			
			const data :any= await response.json();
			// "kid": "1234example=",
			// "alg": "RS256",
			// "kty": "RSA",
			// "e": "AQAB",
			// "n": "1234567890",
			// "use": "sig"
			
			const { keys } = data;

			keys.forEach((key: any) => {
				pems[key.kid] = jwkToPem({
					kty: key.kty,
					n: key.n,
					e: key.e,
				});
			});
			console.log(Object.keys(pems));
		} catch (error) {
			console.log('Auth Middleware getAWSCognitoPems() error', error);
		}
	}
}

export default AuthMiddleware;