const faker = require('faker');

function generateFakeGoal() {
  return {
    name: faker.lorem.sentence(),
    status: faker.random.arrayElement(['Not started', 'In progress', 'Completed', 'Dropped']),
    timeframe: faker.lorem.words(), // TODO: fake realistic values,
    isFromSmartsheetTtaPlan: faker.datatype.boolean(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function generateFakeObjective({ goalId = null } = {}) {
  return {
    title: faker.lorem.sentence(),
    ttaProvided: faker.random.arrayElement(['Training', 'Technical Assistance', 'Test Data']),
    status: faker.random.arrayElement(['Not started', 'In progress', 'Completed', 'Dropped']),
    goalId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function generateFakeActivityReport({ regionId = 1, status = 'draft', isGrantee = true } = {}) {
  return {
    userId: 1,
    lastUpdatedById: null,
    approvingManagerId: null,
    ECLKCResourcesUsed: Array.from({ length: 10 }).map(() => faker.internet.url()),
    nonECLKCResourcesUsed: Array.from({ length: 4 }).map(() => faker.internet.url()),
    additionalNotes: faker.lorem.lines(),
    numberOfParticipants: faker.datatype.number(500),
    deliveryMethod: faker.helpers.randomize(['a', 'b']),
    duration: faker.datatype.number({ min: 0.5, max: 40.0, precision: 0.01 }),
    endDate: faker.date.future(0.25), // date in near future
    startDate: faker.date.past(0.25), // date in recent past
    activityRecipientType: isGrantee ? 'grantee' : 'non-grantee', // This affects and is affected by ActivityRecipient records
    requester: faker.random.arrayElement(['grantee', 'regionalOffice']),
    regionId,
    status,
    reason: Array.from({ length: 4 }).map(() => faker.company.bs()),
    participants: Array.from({ length: 3 }).map(() => faker.name.jobTitle()),
    topics: Array.from({ length: 8 }).map(() => faker.company.catchPhrase()),
    context: faker.lorem.paragraph(),
    pageState: JSON.stringify({ 1: 'Not started', 2: 'Not started', 3: 'Not started' }),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

module.exports = {
  up: async (queryInterface) => {
    // Generate fake goals
    const fakeGoals = Array.from({ length: 300 }).map(generateFakeGoal);
    const savedGoals = await queryInterface.bulkInsert('Goals', fakeGoals, { returning: true });

    // For each Goal, generate some objectives
    const fakeObjectives = savedGoals.flatMap((goal) => {
      const num = faker.datatype.number({ min: 1, max: 10 });
      return Array.from({ length: num }).map(() => generateFakeObjective({ goalId: goal.id }));
    });
    const savedObjectives = await queryInterface.bulkInsert('Objectives', fakeObjectives, { returning: true });

    // Generate fake ARs
    const fakeActivityReports = Array.from({ length: 100 }).map(generateFakeActivityReport);
    const savedARs = await queryInterface.bulkInsert('ActivityReports', fakeActivityReports, { returning: true });

    // Attach some objectives to ARs
    const fakeARObjectives = savedARs.flatMap((ar) => {
      const numObjectives = faker.datatype.number({ min: 1, max: 10 });
      const randomObjectives = faker.random.arrayElements(savedObjectives, numObjectives);
      return randomObjectives.map((o) => ({ objectiveId: o.id, activityReportId: ar.id }));
    });
    await queryInterface.bulkInsert('ActivityReportObjectives', fakeARObjectives);

    const grantIdResults = await queryInterface.sequelize.query('SELECT id FROM "Grants" LIMIT 1000;', { type: queryInterface.sequelize.QueryTypes.SELECT });
    const grantIds = grantIdResults.map((g) => g.id);
    const fakeARRecipients = savedARs.flatMap((ar) => {
      const numRecipients = faker.datatype.number({ min: 1, max: 500 });
      const randomGrantIds = faker.random.arrayElements(grantIds, numRecipients);
      return randomGrantIds.map((id) => ({ grantId: id, activityReportId: ar.id }));
    });
    await queryInterface.bulkInsert('ActivityRecipients', fakeARRecipients);
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
