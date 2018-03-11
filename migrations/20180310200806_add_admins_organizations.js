
exports.up = function(knex, Promise) {
  return knex.schema.createTable("admins_organizations", function (table) {
    table.increments('id').notNullable();
    table.integer('adminId').references('users.id').notNullable();
    table.integer('organizationId').references('organizations.id').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("admins_organizations");
};
