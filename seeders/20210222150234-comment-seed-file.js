'use strict';
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Comments',
      Array.from({ length: 10 }).map((d, i) => ({
        text: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date(),
        UserId: Math.floor(Math.random() * 3) + 1,
        RestaurantId: Math.floor(Math.random() * 5) + 1,
      })),
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {});
  },
};
