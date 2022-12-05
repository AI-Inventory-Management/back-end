// Definir todas las variables de entorno

// App
export const PORT: number = process.env.PORT ? +process.env.PORT : 8080;
export const NODE_ENV = process.env.NODE_ENV
  ? (process.env.NODE_ENV as string)
  : "";
export const AWS_REGION: string = process.env.AWS_REGION
  ? process.env.AWS_REGION
  : "";
// RDS
export const DB_HOST: string = process.env.DB_HOST ? process.env.DB_HOST : "";
export const DB_USER: string = process.env.DB_USER ? process.env.DB_USER : "";
export const DB_PASSWORD: string = process.env.DB_PASSWORD
  ? process.env.DB_PASSWORD
  : "";
export const DB_NAME: string = process.env.DB_NAME ? process.env.DB_NAME : "";
// COGNITO
export const COGNITO_USER_POOL_ID: string = process.env.COGNITO_USER_POOL_ID
  ? process.env.COGNITO_USER_POOL_ID
  : "";
export const COGNITO_APP_CLIENT_ID = process.env.COGNITO_APP_CLIENT_ID
  ? process.env.COGNITO_APP_CLIENT_ID
  : "";
export const COGNITO_APP_SECRET_HASH = process.env.COGNITO_APP_SECRET_HASH
  ? process.env.COGNITO_APP_SECRET_HASH
  : "";
