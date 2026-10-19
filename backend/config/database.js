import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const databaseUrl =
  process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
const databaseOptions = {
  dialect: "postgres",
  logging: false,
};

if (databaseUrl) {
  databaseOptions.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

const databaseConfig = databaseUrl
  ? [databaseUrl, databaseOptions]
  : [
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        ...databaseOptions,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
      },
    ];

if (
  !databaseUrl &&
  ["DB_NAME", "DB_USER", "DB_PASSWORD", "DB_HOST", "DB_PORT"].some(
    (key) => !process.env[key],
  )
) {
  throw new Error(
    "Database configuration is missing. Set DATABASE_URL_UNPOOLED or DB_HOST, DB_PORT, DB_NAME, DB_USER, and DB_PASSWORD.",
  );
}

const sequelize = new Sequelize(...databaseConfig);

const migrateJournalColumns = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const tables = await queryInterface.showAllTables();
  const hasJournalTable = tables.some((table) =>
    (typeof table === "string" ? table : table.tableName) === "Journals",
  );
  if (!hasJournalTable) return;

  const columns = await queryInterface.describeTable("Journals");
  for (const [oldName, newName] of [
    ["publisher", "responsible"],
    ["publishedDate", "date"],
  ]) {
    if (columns[oldName] && !columns[newName]) {
      await queryInterface.renameColumn("Journals", oldName, newName);
      columns[newName] = columns[oldName];
      delete columns[oldName];
    }
  }
};

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL!");
    await migrateJournalColumns();
    await sequelize.sync({
      alter: process.env.NODE_ENV === "development",
    });
    console.log("Table Synchronized!");
  } catch (error) {
    console.error("Connection failed", error);
    process.exit(1);
  }
};
export { sequelize, connectDB };