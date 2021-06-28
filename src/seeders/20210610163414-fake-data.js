const faker = require('faker');

const fakeRegionId = 404;

function generateFakeGrantee() {
  // Grantee has .name, belongs to many Goals and has many Grants
  return {
    name: faker.company.companyName,
  };
}

function generateFakeGrant({ granteeId, regionId = fakeRegionId }) {
  return {
    number: faker.datatype.uuid(),
    cdi: faker.datatype.boolean(),
    status: faker.arrayElement(['Active', 'Inactive']),
    startDate: faker.date.past(2),
    endDate: faker.date.future(2),
    name: faker.company.companyName(),
    granteeId,
    regionId,
  };
}

function generateFakeGoal() {
  return {
    name: faker.hacker.phrase(),
    status: faker.random.arrayElement(['Not started', 'In progress', 'Completed', 'Dropped']),
    timeframe: faker.hacker.verb(), // TODO: fake realistic values,
    isFromSmartsheetTtaPlan: faker.random.boolean(),
  };
}

function generateFakeObjective({ goalId = null }) {
  return {
    title: faker.hacker.phrase(),
    ttaProvided: faker.random.arrayElement(['Training', 'Technical Assistance', 'Test Data']),
    status: faker.random.arrayElement(['Not started', 'In progress', 'Completed', 'Dropped']),
    goalId,
  };
}

function generateFakeActivityReport({ regionId = fakeRegionId, status = 'Fake!' }) {
  return {
    legacyId: '',
    userId: null,
    lastUpdatedById: null,
    approvingManagerId: null,
    ECLKCResourcesUsed: [Array.from({ length: 10 }).map(() => faker.internet.url())],
    nonECLKCResourcesUsed: [Array.from({ length: 4 }).map(() => faker.internet.url())],
    additionalNotes: faker.lorem.lines(),
    numberOfParticipants: faker.datatypes.number(500),
    deliveryMethod: faker.helpers.randomize(['a', 'b']),
    duration: faker.datatypes.number({ min: 0.5, max: 40.0, precision: 0.01 }),
    endDate: faker.date.future(0.25), // date in near future
    startDate: faker.date.past(0.25), // date in recent past
    activityRecipientType: faker.randomize(['grantee', 'non-grantee']),
    requester: faker.random.arrayElement(['grantee', 'regionalOffice']),
    regionId,
    status,
  };
}

module.exports = {
  up: async (queryInterface) => {
    const fakeRegion = {
      id: fakeRegionId,
      name: 'Fake Region',
    };
    await queryInterface.bulkInsert('Regions', [fakeRegion]);

    // Generate fake grantees
    const fakeGrantees = Array.from({ length: 100 }).map(() => generateFakeGrantee);
    const savedGrantees = await queryInterface.bulkInsert('Grantees', fakeGrantees);
    // Generate 1 grant for each grantee
    const fakeGrants = savedGrantees.map((grantee) => generateFakeGrant({ granteeId: grantee.id }));
    await queryInterface.bulkInsert('Grants', fakeGrants);

    // Generate fake goals
    const fakeGoals = Array.from({ length: 300 }).map(() => generateFakeGoal);
    const savedGoals = await queryInterface.bulkInsert('Goals', fakeGoals);

    // For each Goal, generate some objectives
    const fakeObjectives = savedGoals.flatMap((goal) => {
      const num = faker.datatype.number({ min: 1, max: 10 });
      return Array.from({ length: num }).map(() => generateFakeObjective(goal.id));
    });
    const savedObjectives = await queryInterface.bulkInsert('Objectives', fakeObjectives);

    // Generate fake ARs
    const fakeActivityReports = Array.from({ length: 100 }).map(() => generateFakeActivityReport());
    const savedARs = await queryInterface.bulkInsert('ActivityReports', fakeActivityReports);

    // Attach some objectives to ARs
    const fakeARObjectives = savedARs.flatMap((ar) => {
      const numObjectives = faker.datatype.number({ min: 1, max: 10 });
      const randomObjectives = faker.random.arrayElements(savedObjectives, numObjectives);
      return randomObjectives.map((o) => ({ objectiveId: o.id, activityReportId: ar.id }));
    });
    await queryInterface.bulkInsert('ActivityReportObjectives', fakeARObjectives);
  },

  // down: async (queryInterface, Sequelize) => {
  //   /**
  //    * Add commands to revert seed here.
  //    *
  //    * Example:
  //    * await queryInterface.bulkDelete('People', null, {});
  //    */
  // }
};
