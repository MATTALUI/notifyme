
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('requests').del()
    .then(function () {
      // Inserts seed entries
      return knex('requests').insert([
        {id: 1, requesterId: 2, organizationId: 2},
      ]);
    })
    .then(function(){
      return knex.raw("SELECT setval('requests_id_seq', (SELECT MAX(id) FROM requests));");
    });
};
