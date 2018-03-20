
exports.up = function(knex, Promise) {
  return knex.schema.createTable("admins_organizations", function (table) {
    table.increments('id').notNullable();
    table.integer('adminId').references('users.id').notNullable().onDelete('cascade');
    table.integer('organizationId').references('organizations.id').notNullable().onDelete('cascade');
    table.timestamps(false,true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("admins_organizations");
};
