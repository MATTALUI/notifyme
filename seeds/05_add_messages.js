
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('messages').del()
    .then(function () {
      // Inserts seed entries
      return knex('messages').insert([
        {
          id: 1,
          body: 'Hello World!',
          adminId: 1,
          organizationId: 1,
          created_at: "2018-03-18T22:56:39.151Z",
          updated_at: "2018-03-18T22:56:39.151Z"
        },
        {
          id: 2,
          body: 'Hello, everyone! Public Organization is going to be having a meeting this Wednesday.',
          adminId: 1,
          organizationId: 1,
          created_at: "2018-03-18T23:16:16.805Z",
          updated_at: "2018-03-18T23:16:16.805Z"
        },
        {
          id: 3,
          body: "He always thought of the sea as 'la mar' which is what people call her in Spanish when they love her. Sometimes those who love her say bad things of her but they are always said as though she were a woman. Some of the younger fishermen, those who used buoys as floats for their lines and had motorboats, bought when the shark livers had brought much money, spoke of her as 'el mar' which is masculine.They spoke of her as a contestant or a place or even an enemy. But the old man always thought of her as feminine and as something that gave or withheld great favours, and if she did wild or wicked things it was because she could not help them. The moon affects her as it does a woman, he thought.",
          adminId: 1,
          organizationId: 1
        },
        {
          id: 4,
          body: 'Hey, everyone! Here\'s that link to the import documents that you need to look at for the meeting: http://catsinbowties.surge.sh/ ',
          adminId: 1,
          organizationId: 1,
        },
        {
          id: 5,
          body: 'Message from "The Guardians".',
          adminId: 1,
          organizationId: 1,
          anonymous: true
        },
      ]);
    })
    .then(function(){
      return knex.raw("SELECT setval('messages_id_seq', (SELECT MAX(id) FROM messages));");
    });
};
