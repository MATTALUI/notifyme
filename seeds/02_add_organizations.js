
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('organizations').del()
    .then(function () {
      // Inserts seed entries
      return knex('organizations').insert([
        {
          id: 1,
          title: 'Public Organization',
          description: 'An organization that anyone can join!'
        },
        {
          id: 2,
          title: 'Private Organization',
          public: false
        },
        {
          id: 3,
          title: 'Cool Kids Club',
          description: 'This is the place for you if you really like to participate in fun events. We\'re always up to something cool!'
        },
        {
          id: 4,
          title: 'Afterschool Chess Club',
          description: 'Announcements for chessclub.',
        },
        {
          id: 5,
          title: 'Secret Society',
          description: 'We\'re not a cult, I swear.',
          public: false
        },
        {
          id: 6,
          title: 'Secret Council',
          public: false,
          visible: false
        }
      ]);
    })
    .then(function(){
      return knex.raw("SELECT setval('organizations_id_seq', (SELECT MAX(id) FROM organizations));");
    });
};
