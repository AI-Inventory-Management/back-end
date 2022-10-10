// Define all environment variables

export const PORT: number = process.env.PORT ? +process.env.PORT : 8080;
export const NODE_ENV = process.env.NODE_ENV
  ? (process.env.NODE_ENV as string)
  : "";
export const DB_HOST: string = process.env.DB_HOST ? process.env.DB_HOST : "";
export const DB_USER: string = process.env.DB_USER ? process.env.DB_USER : "";
export const DB_PASSWORD: string = process.env.DB_PASSWORD
  ? process.env.DB_PASSWORD
  : "";
export const DB_NAME: string = process.env.DB_NAME ? process.env.DB_NAME : "";
