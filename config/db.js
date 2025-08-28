const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,               
  process.env.DB_PASSWORD,              
  {
    host: process.env.DB_ENDPOINT,       
    dialect: "mysql",
    logging: false             
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
    const Job = require("../models/Job");
    await sequelize.sync({ alter: true }); 
    console.log("Tables synced.");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); 
  }
})();

module.exports = sequelize;
