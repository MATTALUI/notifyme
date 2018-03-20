
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users_organizations').del()
    .then(function () {
      // Inserts seed entries
      return knex('users_organizations').insert([
        {
          id: 1,
          userId: 1,
          organizationId: 1
        },
        {
          id: 2,
          userId: 2,
          organizationId: 1
        },
        {
          id: 3,
          userId: 1,
          organizationId: 4
        }
      ]);
    })
    .then(function(){
      return knex.raw("SELECT setval('users_organizations_id_seq', (SELECT MAX(id) FROM users_organizations));");
    });
};
