const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const env = process.env.NODE_ENV || "development";

const storage =
  env === "production"
    ? process.env.DB_STORAGE_PROD
    : process.env.DB_STORAGE_DEV;

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve(storage),
  logging: false,
});

const Track = sequelize.define(
  "Track",
  {
    trackId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    songTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    artistName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    albumName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    releaseYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "tracks",
    timestamps: false,
  }
);

async function setupDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful.");

    await sequelize.sync({ force: false });
    console.log("Database and tables created.");

    await sequelize.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Database setup failed:", error);
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = { sequelize, Track };