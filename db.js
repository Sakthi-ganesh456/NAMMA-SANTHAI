const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sqliteStoragePath = process.env.SQLITE_PATH || path.join(__dirname, '..', 'data', 'namm_sandei.sqlite');
const useSqlite = process.env.USE_SQLITE === 'true' || process.env.DB_DIALECT === 'sqlite';

const sequelize = new Sequelize(
  useSqlite
    ? sqliteStoragePath
    : (process.env.DB_NAME || 'namm_sandei'),
  useSqlite
    ? undefined
    : (process.env.DB_USER || 'root'),
  useSqlite
    ? undefined
    : (process.env.DB_PASS || ''),
  useSqlite
    ? {
        dialect: 'sqlite',
        storage: sqliteStoragePath,
        logging: false,
      }
    : {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
);

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log(`${sequelize.getDialect()} connected successfully.`);
    await sequelize.sync({ force: false });
    const queryInterface = sequelize.getQueryInterface();
    const orderColumns = await queryInterface.describeTable('Orders');
    if (!orderColumns.paymentTiming) {
      await queryInterface.addColumn('Orders', 'paymentTiming', {
        type: DataTypes.ENUM('before_order', 'after_order'),
        allowNull: false,
        defaultValue: 'before_order',
      });
    }
    if (!orderColumns.paymentReference) {
      await queryInterface.addColumn('Orders', 'paymentReference', {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      });
    }
    console.log('Database synced successfully.');
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to the configured database:', error.message);
    if (sequelize.getDialect() !== 'sqlite') {
      try {
        const sqliteSequelize = new Sequelize({
          dialect: 'sqlite',
          storage: sqliteStoragePath,
          logging: false,
        });
        await sqliteSequelize.authenticate();
        await sqliteSequelize.sync({ force: false });
        console.log('SQLite fallback database initialized successfully.');
        return sqliteSequelize;
      } catch (sqliteError) {
        console.error('SQLite fallback failed:', sqliteError.message);
      }
    }
    process.exit(1);
  }
};

if (useSqlite) {
  fs.mkdirSync(path.dirname(sqliteStoragePath), { recursive: true });
}

sequelize.syncDatabase = syncDatabase;
module.exports = sequelize;
