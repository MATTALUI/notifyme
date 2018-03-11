
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          firstName: 'Matthew',
          lastName: 'Hummer',
          phoneNumer: '9708882794',
          phonePreference: true,
          email: 'matt@example.com',
          emailPreference: true,
          password: '$2a$10$.6TvIkXXwDcJGk5gksNVLuL9jzdEnIOln06fmcBu6VlTzIBJ.jxV2',
          admin: true
        }
      ]);
    });
};
