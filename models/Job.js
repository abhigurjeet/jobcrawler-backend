const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Job = sequelize.define("Job", {
  title: { type: DataTypes.STRING, allowNull: false },
  company: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING},
  role_type: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },
  url: { type: DataTypes.STRING, unique: true, allowNull: false }
}, {
  tableName: "jobs"
});

module.exports = Job;
