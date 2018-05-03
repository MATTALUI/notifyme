
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
          title: 'Bat Fan Club',
          description: 'This is a fan club for all of those people who enjoy the beauty of bats. We celebrate these wonderful creatures in strictly non-vigilante manner...'
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
