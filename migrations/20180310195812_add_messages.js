
exports.up = function(knex, Promise) {
  return knex.schema.createTable("messages", function (table) {
    table.increments('id').notNullable();
    table.text('body');
    table.integer('adminId').references('users.id').notNullable();
    table.integer('organizationId').references('organizations.id').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("messages");
};
