
exports.up = function(knex, Promise) {
  return knex.schema.createTable("messages", function (table) {
    table.increments('id').notNullable();
    table.text('body');
    table.integer('adminId').references('users.id').notNullable().onDelete('cascade');
    table.integer('organizationId').references('organizations.id').notNullable().onDelete('cascade');
    table.boolean('anonymous').defaultTo(false).notNullable();
    table.timestamps(false,true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("messages");
};
