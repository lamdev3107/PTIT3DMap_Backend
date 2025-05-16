const { Sequelize } = require("sequelize");
import dotenv from "dotenv";
dotenv.config();

// Use environment variables for database configuration
const dbName = process.env.DB_NAME ;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD 
const dbHost = process.env.DB_HOST 
const sequelize = new Sequelize(
    dbName, 
    dbUser,
    dbPassword,
  {
    host:  dbHost,
    dialect:  "mysql",
    logging: false,
  }
);

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB Connection has been established successfully.");
    // Sync database
    await sequelize.sync({ force: false });
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { sequelize, connectDatabase as default };
