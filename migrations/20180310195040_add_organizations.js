
exports.up = function(knex, Promise) {
  return knex.schema.createTable("organizations", function (table) {
    table.increments('id').notNullable();
    table.string('title').notNullable();
    table.text('description').defaultTo(null);
    table.boolean('public').defaultTo(true);
    table.boolean('visible').defaultTo(true);
    table.timestamps(false,true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("organizations");
};
