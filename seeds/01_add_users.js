
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1,
          firstName: 'Matthew',
          lastName: 'Hummer',
          phoneNumber: '9708882794',
          phonePreference: true,
          email: 'matt@example.com',
          emailPreference: true,
          fbId: '1146475058',
          fbPreference: true,
          password: '$2a$10$.6TvIkXXwDcJGk5gksNVLuL9jzdEnIOln06fmcBu6VlTzIBJ.jxV2',
          admin: true,
          acceptedTerms: true
        },
        {
          id: 2,
          firstName: 'Bruce',
          lastName: 'Wayne',
          phoneNumber: null,
          phonePreference: false,
          email: 'bruce@example.com',
          emailPreference: false,
          fbId: null,
          fbPreference: false,
          password: '$2a$10$.6TvIkXXwDcJGk5gksNVLuL9jzdEnIOln06fmcBu6VlTzIBJ.jxV2',
          admin: false,
          acceptedTerms: true
        }
      ]);
    });
};
