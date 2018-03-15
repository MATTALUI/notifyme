
exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", function (table) {
    table.increments('id').notNullable();
    table.string('firstName').notNullable();
    table.string('lastName').notNullable();
    table.string('phoneNumber').defaultTo(null);
    table.boolean('phonePreference').defaultTo(false).notNullable();
    table.string('email').unique().notNullable();
    table.boolean('emailPreference').defaultTo(false).notNullable();
    table.string('fbId').defaultTo(null);
    table.boolean('fbPreference').defaultTo(false);
    table.string('password').notNullable();
    table.boolean('admin').defaultTo(false).notNullable();
    table.boolean('acceptedTerms').defaultTo(false).notNullable();
    table.dateTime('acceptedTermsDate').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users");
};
