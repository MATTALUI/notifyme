
exports.up = function(knex, Promise) {
  return knex.schema.createTable("users_organizations", function (table) {
    table.increments('id').notNullable();
    table.integer('userId').references('users.id').notNullable();
    table.integer('organizationId').references('organizations.id').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users_organizations");
};
