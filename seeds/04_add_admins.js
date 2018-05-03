
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('admins_organizations').del()
    .then(function () {
      // Inserts seed entries
      return knex('admins_organizations').insert([
        {id: 1, adminId: 1, organizationId: 1},
        {id: 2, adminId: 1, organizationId: 2},
        {id: 3, adminId: 2, organizationId: 3},
      ]);
    })
    .then(function(){
      return knex.raw("SELECT setval('admins_organizations_id_seq', (SELECT MAX(id) FROM admins_organizations));");
    });
};
