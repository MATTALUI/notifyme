
exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", function (table) {
    table.increments('id').notNullable();
    table.string('firstName').notNullable();
    table.string('lastName').notNullable();
    table.string('phoneNumer').defaultTo(null);
    table.boolean('phonePreference').defaultTo(false).notNullable();
    table.string('email').notNullable();
    table.boolean('emailPreference').defaultTo(false).notNullable();
    table.string('password').notNullable();
    table.boolean('admin').defaultTo(false).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users");
};
