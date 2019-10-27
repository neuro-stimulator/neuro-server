module.exports = {
  "type": "sqlite",
  "database": "database.sqlite",
  "entities": ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  autoSchemaSync: true,
  "cli": {
    "migrationsDir": "migration"
  }
};
