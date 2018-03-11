
exports.up = function(knex, Promise) {
  return knex.schema.createTable("organizations", function (table) {
    table.increments('id').notNullable();
    table.string('title').notNullable();
    table.boolean('public').defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("organizations");
};
