import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } from "./index";

export default {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    database: DB_NAME,
    dialect: "mysql",
  },
};
