'use strict';
const faker = require('faker');
const bcrypt = require('bcryptjs');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          email: 'root@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          isAdmin: true,
          name: 'root',
          createdAt: new Date(),
          updatedAt: new Date(),
          image: faker.image.people(),
        },
        {
          email: 'user1@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          isAdmin: false,
          name: 'user1',
          createdAt: new Date(),
          updatedAt: new Date(),
          image: faker.image.people(),
        },
        {
          email: 'user2@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          isAdmin: false,
          name: 'user2',
          createdAt: new Date(),
          updatedAt: new Date(),
          image: faker.image.people(),
        },
      ],
      {}
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
