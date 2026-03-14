const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const db = new Sequelize({
  dialect: "sqlite",
  storage: `database/music_library.db`,
  logging: console.log
});

async function setupDatabase() {
  try {
    await db.authenticate();
    console.log("Connection to database established successfully.");

    await db.sync({ force: true });
    console.log("Database created successfully.");

    await db.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { db };